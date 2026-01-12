export interface Price {
  id: string;
  name: string;
  price: number;
  timeStart: string;
  timeEnd: string;
  pitchId: string;
}

export interface Pitch {
  id: string;
  name: string;
  active: boolean;
}

export interface ExtraService {
  name: string;
  price: number;
}

export interface ClubImage {
  imageUrl: string;
}