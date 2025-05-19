export interface Scene {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  dataImage: string;
}

export interface Character {
  id: string;
  name: string;
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