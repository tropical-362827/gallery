import { parseHeader, type ConvertTarget } from 'koikatu.js';
import {
  getLocalizedTargetLabel,
  getLocalizedTargetShortLabel,
  type Locale,
} from '../i18n/config';

export type CardSource = ConvertTarget;

const HEADER_TO_SOURCE: Record<string, CardSource> = {
  '【KoiKatuChara】': 'KK',
  '【KoiKatuCharaSP】': 'KK',
  '【KoiKatuCharaSun】': 'KKS',
  '【EroMakeChara】': 'EC',
  '【HCChara】': 'HC',
  '【HCPChara】': 'HC',
  '【DCChara】': 'HC',
  '【SVChara】': 'SV',
  '【ACChara】': 'AC',
};

const GAME_ID_TO_SOURCE: Partial<Record<string, CardSource>> = {
  ac: 'AC',
  svs: 'SV',
  hc: 'HC',
  kks: 'KKS',
  kk: 'KK',
};

const AVAILABLE_TARGETS: Record<CardSource, ConvertTarget[]> = {
  KK: ['KKS', 'EC'],
  KKS: ['KK', 'EC'],
  EC: ['KK', 'KKS'],
  HC: ['SV', 'AC'],
  SV: ['HC', 'AC'],
  AC: ['SV', 'HC'],
};

export function getSourceFromGameId(gameId?: string): CardSource | null {
  if (!gameId) {
    return null;
  }

  return GAME_ID_TO_SOURCE[gameId] ?? null;
}

export function getSourceFromHeader(header: string): CardSource | null {
  return HEADER_TO_SOURCE[header] ?? null;
}

export function detectCardSource(input: ArrayBuffer | Uint8Array): CardSource | null {
  try {
    const header = parseHeader(input).header;
    return getSourceFromHeader(header);
  } catch {
    return null;
  }
}

export function getAvailableTargets(source: CardSource | null): ConvertTarget[] {
  if (!source) {
    return [];
  }

  return AVAILABLE_TARGETS[source];
}

export function getTargetLabel(target: ConvertTarget, locale: Locale = 'ja'): string {
  return getLocalizedTargetLabel(target, locale);
}

export function getTargetShortLabel(target: ConvertTarget, locale: Locale = 'ja'): string {
  return getLocalizedTargetShortLabel(target, locale);
}

export function buildConvertedFileName(fileName: string, target: ConvertTarget): string {
  const suffix = `-${target.toLowerCase()}`;
  const dotIndex = fileName.lastIndexOf('.');

  if (dotIndex === -1) {
    return `${fileName}${suffix}`;
  }

  return `${fileName.slice(0, dotIndex)}${suffix}${fileName.slice(dotIndex)}`;
}
