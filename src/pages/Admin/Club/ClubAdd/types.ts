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
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface ClubImage {
  imageUrl: string;
}