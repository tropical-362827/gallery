// Google Analytics 統合用ユーティリティ

// GA4の測定ID
const MEASUREMENT_ID = 'G-QBL0D7WNW1';

// カスタムディメンションのキー
export const CUSTOM_DIMENSIONS = {
  GAME_ID: 'game_id',           // ゲームID
  SCENE_ID: 'scene_id',         // シーンID
  SCENE_TITLE: 'scene_title',   // シーンタイトル
  CHARACTER_ID: 'character_id', // キャラクターID
  CHARACTER_NAME: 'character_name', // キャラクター名
};

// Google Analyticsの初期化
export const initializeGA = () => {
  // Google Analytics スクリプトを動的に読み込み
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // gtag関数の初期化
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  // グローバルに利用できるようにする
  window.gtag = gtag;
};

// ページビューイベントを送信
export const trackPageView = (path: string, title: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
};

// シーンデータダウンロードイベントを送信
export const trackSceneDownload = (gameId: string, sceneId: string, sceneTitle: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'scene_download', {
    [CUSTOM_DIMENSIONS.GAME_ID]: gameId,
    [CUSTOM_DIMENSIONS.SCENE_ID]: sceneId,
    [CUSTOM_DIMENSIONS.SCENE_TITLE]: sceneTitle,
  });
};

// キャラクターデータダウンロードイベントを送信
export const trackCharacterDownload = (gameId: string, characterId: string, characterName: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'character_download', {
    [CUSTOM_DIMENSIONS.GAME_ID]: gameId,
    [CUSTOM_DIMENSIONS.CHARACTER_ID]: characterId,
    [CUSTOM_DIMENSIONS.CHARACTER_NAME]: characterName,
  });
};

// グローバルなwindowオブジェクトの型定義を拡張
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}