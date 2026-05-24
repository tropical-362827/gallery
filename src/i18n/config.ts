import type { ConvertTarget } from 'koikatu.js';
import type { Character } from '../types/gallery';

export type Locale = 'ja' | 'en';
export type LocalePreference = 'auto' | Locale;

export interface Messages {
  common: {
    loading: string;
    galleryLoadError: string;
  };
  header: {
    home: string;
    xAriaLabel: string;
    githubAriaLabel: string;
    toggleMenu: string;
    languageSelectAria: string;
    languageAuto: string;
    languageJa: string;
    languageEn: string;
  };
  home: {
    heroDescription1: string;
    heroDescription2: string;
    githubAriaLabel: string;
  };
  gamePage: {
    notFound: string;
    dataNotFound: string;
    back: string;
    scenes: string;
    characters: string;
  };
  sceneItem: {
    downloadSuccess: string;
    openXPost: (sceneTitle: string) => string;
    convertButton: (targetLabel: string) => string;
    loadingConvert: (targetLabel: string) => string;
    convertSuccess: (targetLabel: string) => string;
    convertError: (targetLabel: string) => string;
  };
  characterItem: {
    loadingOriginal: string;
    downloadOriginal: string;
    loadingConvert: string;
    checkingFormats: string;
    originalOnly: string;
    convertButton: (targetLabel: string) => string;
    convertSuccess: (targetLabel: string) => string;
    convertError: (targetLabel: string) => string;
    originalSuccess: string;
    originalError: string;
  };
  footer: {
    copyrightLead: string;
    copyrightTail: string;
    termsLead: string;
    termsLink: string;
    termsTail: string;
  };
}

const JA_MESSAGES: Messages = {
  common: {
    loading: '読み込み中...',
    galleryLoadError: 'ギャラリーデータの読み込みに失敗しました。',
  },
  header: {
    home: 'Home',
    xAriaLabel: 'X (Twitter)',
    githubAriaLabel: 'GitHub',
    toggleMenu: 'Toggle menu',
    languageSelectAria: '表示言語',
    languageAuto: '自動',
    languageJa: '日本語',
    languageEn: 'English',
  },
  home: {
    heroDescription1: 'Xにて公開しているゲームのSSを置いておく場所です！',
    heroDescription2: '画像をクリックしてシーン/キャラデータをダウンロードできます！',
    githubAriaLabel: 'GitHub Repository',
  },
  gamePage: {
    notFound: '指定されたゲームが見つかりませんでした。',
    dataNotFound: 'ゲームデータが見つかりませんでした。',
    back: '戻る',
    scenes: 'シーン',
    characters: 'キャラクター',
  },
  sceneItem: {
    downloadSuccess: 'シーンデータをダウンロードしました',
    openXPost: sceneTitle => `${sceneTitle} のX投稿を開く`,
    convertButton: targetLabel => `${targetLabel}へ変換`,
    loadingConvert: targetLabel => `${targetLabel}向けに変換中...`,
    convertSuccess: targetLabel => `${targetLabel}向けに変換してダウンロードしました`,
    convertError: targetLabel => `${targetLabel}への変換に失敗しました`,
  },
  characterItem: {
    loadingOriginal: 'ダウンロード中...',
    downloadOriginal: 'キャラクターをDL',
    loadingConvert: '変換中...',
    checkingFormats: '対応する変換形式を確認中です。',
    originalOnly: 'このカードで利用できるのはオリジナルDLのみです。',
    convertButton: targetLabel => `${targetLabel}向けに変換してDL`,
    convertSuccess: targetLabel => `${targetLabel}向けに変換してダウンロードしました`,
    convertError: targetLabel => `${targetLabel}への変換に失敗しました`,
    originalSuccess: 'オリジナルをダウンロードしました',
    originalError: 'オリジナルのダウンロードに失敗しました',
  },
  footer: {
    copyrightLead: 'ハニカム/サマすく/アイコミのデータの著作権は',
    copyrightTail: 'に帰属します。',
    termsLead: '各データの使用は',
    termsLink: 'ILLGAMESの利用規約',
    termsTail: '以外の制限はありません。ご自由に使用/改変/再配布してください！',
  },
};

const EN_MESSAGES: Messages = {
  common: {
    loading: 'Loading...',
    galleryLoadError: 'Failed to load gallery data.',
  },
  header: {
    home: 'Home',
    xAriaLabel: 'X account',
    githubAriaLabel: 'GitHub repository',
    toggleMenu: 'Toggle menu',
    languageSelectAria: 'Display language',
    languageAuto: 'Auto',
    languageJa: '日本語',
    languageEn: 'English',
  },
  home: {
    heroDescription1: 'A place to keep the game screenshots I share on X.',
    heroDescription2: 'Click an image to download scene or character data.',
    githubAriaLabel: 'GitHub repository',
  },
  gamePage: {
    notFound: 'The requested game could not be found.',
    dataNotFound: 'Game data could not be found.',
    back: 'Back',
    scenes: 'Scenes',
    characters: 'Characters',
  },
  sceneItem: {
    downloadSuccess: 'Scene data downloaded.',
    openXPost: sceneTitle => `Open the X post for ${sceneTitle}`,
    convertButton: targetLabel => `Convert to ${targetLabel}`,
    loadingConvert: targetLabel => `Converting for ${targetLabel}...`,
    convertSuccess: targetLabel => `Converted for ${targetLabel} and downloaded.`,
    convertError: targetLabel => `Failed to convert for ${targetLabel}.`,
  },
  characterItem: {
    loadingOriginal: 'Downloading...',
    downloadOriginal: 'Download Character',
    loadingConvert: 'Converting...',
    checkingFormats: 'Checking available conversion formats.',
    originalOnly: 'Only the original download is available for this card.',
    convertButton: targetLabel => `Convert for ${targetLabel}`,
    convertSuccess: targetLabel => `Converted for ${targetLabel} and downloaded.`,
    convertError: targetLabel => `Failed to convert for ${targetLabel}.`,
    originalSuccess: 'Original file downloaded.',
    originalError: 'Failed to download the original file.',
  },
  footer: {
    copyrightLead: 'Data copyrights for Honeycome / Summer Vacation Scramble / Aicomi belong to ',
    copyrightTail: '.',
    termsLead: 'Each asset may be used, modified, and redistributed freely, subject only to the ',
    termsLink: 'ILLGAMES Terms of Use',
    termsTail: '.',
  },
};

export const MESSAGES: Record<Locale, Messages> = {
  ja: JA_MESSAGES,
  en: EN_MESSAGES,
};

const ENGLISH_GAME_COPY: Record<string, { title: string; shortTitle: string; description: string }> = {
  ac: {
    title: 'AiComi',
    shortTitle: 'AC',
    description: 'Scene and character data for AiComi',
  },
  svs: {
    title: 'Summer Vacation Scramble',
    shortTitle: 'SVS',
    description: 'Scene and character data for Summer Vacation Scramble',
  },
  hc: {
    title: 'Honeycome',
    shortTitle: 'HC',
    description: 'Scene and character data for Honeycome',
  },
  kks: {
    title: 'Koikatsu Sunshine',
    shortTitle: 'KKS',
    description: 'Scene and character data for Koikatsu Sunshine',
  },
  kk: {
    title: 'Koikatsu',
    shortTitle: 'KK',
    description: 'Scene and character data for Koikatsu',
  },
  'kk-kks-mod': {
    title: 'Koikatsu (MOD)',
    shortTitle: 'KK(mod)',
    description: 'Scene and character data using mods for Koikatsu or Koikatsu Sunshine',
  },
};

const TARGET_LABELS: Record<Locale, Record<ConvertTarget, string>> = {
  ja: {
    KK: 'コイカツ',
    KKS: 'コイカツサンシャイン',
    EC: 'エモクリ',
    HC: 'ハニカム',
    SV: 'サマすく',
    AC: 'アイコミ',
  },
  en: {
    KK: 'Koikatsu',
    KKS: 'Koikatsu Sunshine',
    EC: 'Emotion Creators',
    HC: 'Honeycome',
    SV: 'Summer Vacation Scramble',
    AC: 'AiComi',
  },
};

const TARGET_SHORT_LABELS: Record<Locale, Record<ConvertTarget, string>> = {
  ja: {
    KK: 'コイカツ',
    KKS: 'コイカツサンシャイン',
    EC: 'エモクリ',
    HC: 'ハニカム',
    SV: 'サマすく',
    AC: 'アイコミ',
  },
  en: {
    KK: 'KK',
    KKS: 'KKS',
    EC: 'EC',
    HC: 'HC',
    SV: 'SVS',
    AC: 'AC',
  },
};

function normalizeLocale(value: string): Locale | null {
  const language = value.toLowerCase().split(/[-_]/)[0];
  if (language === 'ja' || language === 'en') {
    return language;
  }

  return null;
}

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const primaryLanguage = navigator.languages[0] ?? navigator.language;
  return normalizeLocale(primaryLanguage) ?? 'en';
}

export function getLocalizedGameTitle(gameId: string, fallbackTitle: string, locale: Locale): string {
  if (locale === 'ja') {
    return fallbackTitle;
  }

  return ENGLISH_GAME_COPY[gameId]?.title ?? fallbackTitle;
}

export function getLocalizedGameShortTitle(gameId: string, fallbackTitle: string, locale: Locale): string {
  if (locale === 'ja') {
    return fallbackTitle;
  }

  return ENGLISH_GAME_COPY[gameId]?.shortTitle ?? fallbackTitle;
}

export function getLocalizedGameDescription(
  gameId: string,
  fallbackDescription: string,
  locale: Locale,
): string {
  if (locale === 'ja') {
    return fallbackDescription;
  }

  return ENGLISH_GAME_COPY[gameId]?.description ?? fallbackDescription;
}

export function getLocalizedTargetLabel(target: ConvertTarget, locale: Locale): string {
  return TARGET_LABELS[locale][target];
}

export function getLocalizedTargetShortLabel(target: ConvertTarget, locale: Locale): string {
  return TARGET_SHORT_LABELS[locale][target];
}

export function getLocalizedCharacterName(character: Character, locale: Locale): string {
  if (locale === 'en') {
    return character.nameEn || character.nameJa || character.name || '';
  }

  return character.nameJa || character.nameEn || character.name || '';
}
