import { GalleryData, Game } from '../types/gallery';

// 全ギャラリーデータを取得
export async function fetchGalleryData(): Promise<GalleryData> {
  try {
    const response = await fetch('./data/gallery-data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch gallery data');
    }
    return await response.json() as GalleryData;
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    throw error;
  }
}

// ID指定でゲームを取得
export function getGameById(data: GalleryData, gameId: string): Game | undefined {
  return data.games.find(game => game.id === gameId);
}

// ナビゲーション用のゲーム一覧を取得（Headerコンポーネント用）
export function getGamesForNavigation(data: GalleryData | null): Array<{id: string; title: string}> {
  if (!data) return [];
  return data.games.map(game => ({
    id: game.id,
    title: game.title
  }));
}