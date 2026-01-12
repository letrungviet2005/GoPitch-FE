export interface PitchPriceDTO {
  name: string;
  price: number;
  timeStart: string;
  timeEnd: string;
}

export interface PitchDTO {
  name: string;
  active: boolean;
  pitchPrices: PitchPriceDTO[];
}

export interface ImageClubDTO {
  imageUrl: string;
}

export interface ExtraServiceDTO {
  name: string;
  price: number;
  description: string;
}

export interface ClubRequestDTO {
  name: string;
  address: string;
  phoneNumber: string;
  description: string;
  imageAvatar: string;
  timeStart: string;
  timeEnd: string;
  active: boolean;
  latitude: number;
  longitude: number;
  pitches: PitchDTO[];
  imageClubs: ImageClubDTO[];
  extraServices: ExtraServiceDTO[];
}