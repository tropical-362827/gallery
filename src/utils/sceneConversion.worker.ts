/// <reference lib="webworker" />

import {
  parseHcScene,
  parseKkScene,
  serializeHcScene,
  serializeKkScene,
  transformCard,
  walkSceneObjects,
  type HcScene,
  type KkScene,
} from 'koikatu.js';

import {
  HC_SCENE_TARGETS,
  KK_SCENE_TARGETS,
  type HcSceneTarget,
  type KkSceneTarget,
  type SceneFamily,
  type SceneTarget,
} from './sceneConversionTypes';

const HC_HEADER_TO_TARGET: Record<string, HcSceneTarget> = {
  '【HCChara】': 'HC',
  '【HCPChara】': 'HC',
  '【DCChara】': 'HC',
  '【SVChara】': 'SV',
  '【ACChara】': 'AC',
};

const KK_HEADER_TO_TARGET: Record<string, KkSceneTarget> = {
  '【KoiKatuChara】': 'KK',
  '【KoiKatuCharaSP】': 'KK',
  '【KoiKatuCharaSun】': 'KKS',
};

type CharacterCounts = Record<SceneTarget, number>;

function emptyCounts(family: SceneFamily): CharacterCounts {
  const targets = family === 'hc' ? HC_SCENE_TARGETS : KK_SCENE_TARGETS;
  return (targets as readonly SceneTarget[]).reduce<Partial<CharacterCounts>>(
    (acc, target) => {
      acc[target] = 0;
      return acc;
    },
    {},
  ) as CharacterCounts;
}

function sourceFromHeader(
  family: SceneFamily,
  header: string | undefined,
): SceneTarget | null {
  if (!header) return null;
  if (family === 'hc') return HC_HEADER_TO_TARGET[header] ?? null;
  return KK_HEADER_TO_TARGET[header] ?? null;
}

interface ParseResultPayload {
  title: string;
  version: string;
  characterCounts: CharacterCounts;
  characterTotal: number;
}

function sceneTitle(scene: HcScene | KkScene): string {
  return (scene as { title?: string }).title ?? '';
}

function parseScene(family: SceneFamily, bytes: Uint8Array): HcScene | KkScene {
  const options = { containsPng: true, decodeEmbeddedCards: true };
  return family === 'hc' ? parseHcScene(bytes, options) : parseKkScene(bytes, options);
}

function serializeScene(family: SceneFamily, scene: HcScene | KkScene): Uint8Array {
  return family === 'hc'
    ? serializeHcScene(scene as HcScene)
    : serializeKkScene(scene as KkScene);
}

function analyzeScene(
  family: SceneFamily,
  scene: HcScene | KkScene,
): ParseResultPayload {
  const counts = emptyCounts(family);
  let total = 0;

  for (const entry of walkSceneObjects(scene, { objectType: 0 })) {
    const character = (entry.object.data as { character?: { header?: { header?: string } } }).character;
    const target = sourceFromHeader(family, character?.header?.header);
    if (!target) continue;
    counts[target] += 1;
    total += 1;
  }

  return {
    title: sceneTitle(scene),
    version: scene.version,
    characterCounts: counts,
    characterTotal: total,
  };
}

type IncomingMessage =
  | { reqId: number; type: 'parse'; family: SceneFamily; bytes: Uint8Array }
  | {
      reqId: number;
      type: 'convert';
      family: SceneFamily;
      bytes: Uint8Array;
      target: SceneTarget;
    };

type OutgoingMessage =
  | { reqId: number; type: 'parse-result'; result: ParseResultPayload }
  | {
      reqId: number;
      type: 'convert-progress';
      processed: number;
      total: number;
      converted: number;
    }
  | {
      reqId: number;
      type: 'convert-result';
      bytes: Uint8Array;
      converted: number;
    }
  | { reqId: number; type: 'error'; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

function post(message: OutgoingMessage, transfer?: Transferable[]) {
  if (transfer && transfer.length > 0) {
    ctx.postMessage(message, transfer);
  } else {
    ctx.postMessage(message);
  }
}

ctx.onmessage = (event: MessageEvent<IncomingMessage>) => {
  const msg = event.data;
  try {
    if (msg.type === 'parse') {
      const scene = parseScene(msg.family, msg.bytes);
      post({
        reqId: msg.reqId,
        type: 'parse-result',
        result: analyzeScene(msg.family, scene),
      });
      return;
    }

    if (msg.type === 'convert') {
      const scene = parseScene(msg.family, msg.bytes);
      const entries = Array.from(walkSceneObjects(scene, { objectType: 0 }));
      const total = entries.length;
      let converted = 0;

      post({ reqId: msg.reqId, type: 'convert-progress', processed: 0, total, converted });

      for (let i = 0; i < entries.length; i += 1) {
        const data = entries[i].object.data as {
          character?: { header?: { header?: string } };
          characterPng?: Uint8Array;
        };
        const card = data.character;
        const source = sourceFromHeader(msg.family, card?.header?.header);

        if (!card || !source) {
          throw new Error('対応していないキャラクターが含まれています');
        }

        if (source !== msg.target) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.character = transformCard(card as any, msg.target, {
            pngBytes: data.characterPng,
          }) as any;
          converted += 1;
        }

        post({
          reqId: msg.reqId,
          type: 'convert-progress',
          processed: i + 1,
          total,
          converted,
        });
      }

      const out = serializeScene(msg.family, scene);
      post(
        { reqId: msg.reqId, type: 'convert-result', bytes: out, converted },
        [out.buffer],
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    post({ reqId: msg.reqId, type: 'error', message });
  }
};
