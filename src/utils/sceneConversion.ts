import SceneWorker from './sceneConversion.worker?worker';
import type { SceneFamily, SceneTarget } from './sceneConversionTypes';

export interface SceneParseResult {
  title: string;
  version: string;
  characterCounts: Record<SceneTarget, number>;
  characterTotal: number;
}

export interface SceneConvertProgress {
  processed: number;
  total: number;
  converted: number;
}

export interface SceneConvertResult {
  bytes: Uint8Array;
  converted: number;
}

type PendingRequest =
  | {
      type: 'parse';
      resolve: (result: SceneParseResult) => void;
      reject: (error: Error) => void;
    }
  | {
      type: 'convert';
      resolve: (result: SceneConvertResult) => void;
      reject: (error: Error) => void;
      onProgress?: (progress: SceneConvertProgress) => void;
    };

type WorkerOutgoingMessage =
  | { reqId: number; type: 'parse-result'; result: SceneParseResult }
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

let worker: Worker | null = null;
let nextReqId = 1;
const pending = new Map<number, PendingRequest>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new SceneWorker();

  worker.onmessage = (event: MessageEvent<WorkerOutgoingMessage>) => {
    const data = event.data;
    const req = pending.get(data.reqId);
    if (!req) return;

    if (data.type === 'convert-progress' && req.type === 'convert') {
      req.onProgress?.({
        processed: data.processed,
        total: data.total,
        converted: data.converted,
      });
      return;
    }

    if (data.type === 'parse-result' && req.type === 'parse') {
      pending.delete(data.reqId);
      req.resolve(data.result);
      return;
    }

    if (data.type === 'convert-result' && req.type === 'convert') {
      pending.delete(data.reqId);
      req.resolve({ bytes: data.bytes, converted: data.converted });
      return;
    }

    if (data.type === 'error') {
      pending.delete(data.reqId);
      req.reject(new Error(data.message));
    }
  };

  worker.onerror = (event) => {
    const error = new Error(event.message || 'Scene worker error');
    for (const req of pending.values()) req.reject(error);
    pending.clear();
    worker?.terminate();
    worker = null;
  };

  return worker;
}

export async function parseSceneInWorker(
  family: SceneFamily,
  bytes: Uint8Array,
): Promise<SceneParseResult> {
  return new Promise<SceneParseResult>((resolve, reject) => {
    const reqId = nextReqId++;
    pending.set(reqId, { type: 'parse', resolve, reject });
    const copy = bytes.slice();
    getWorker().postMessage(
      { reqId, type: 'parse', family, bytes: copy },
      [copy.buffer],
    );
  });
}

export async function convertSceneInWorker(
  family: SceneFamily,
  bytes: Uint8Array,
  target: SceneTarget,
  onProgress?: (progress: SceneConvertProgress) => void,
): Promise<SceneConvertResult> {
  return new Promise<SceneConvertResult>((resolve, reject) => {
    const reqId = nextReqId++;
    pending.set(reqId, { type: 'convert', resolve, reject, onProgress });
    const copy = bytes.slice();
    getWorker().postMessage(
      { reqId, type: 'convert', family, bytes: copy, target },
      [copy.buffer],
    );
  });
}
