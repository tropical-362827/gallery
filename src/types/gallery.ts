export interface Scene {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  dataImage: string;
  xPostUrl?: string;
}

export interface Character {
  id: string;
  nameJa: string;
  nameEn: string;
  name?: string;
  description: string;
  image: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  characters: Character[];
}

export interface GalleryData {
  games: Game[];
}
