import { GalleryData, Game } from '../types/gallery';

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

export function getGameById(data: GalleryData, gameId: string): Game | undefined {
  return data.games.find(game => game.id === gameId);
}