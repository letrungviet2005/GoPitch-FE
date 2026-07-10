export interface UserInformation {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  point?: number;
  streakCount?: number;
  userInformation?: UserInformation;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface PlacedDTO {
  id: number;
  pitchName: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface BillResponseDTO {
  id: number;
  price: number;
  createdAt: string;
  orderCode?: number;
  status?: boolean;
  customerName?: string;
  clubName: string;
  clubAddress: string;
  slots: PlacedDTO[];
}

export interface CommentResponseDTO {
  id: number;
  content: string;
  rate: number;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  rate: number;
  clubId: number;
}

export interface CalendarSlot {
  id: number;
  active: boolean;
  price: number;
  startTime: string;
  endTime: string;
}

export interface PitchPrice {
  id?: number;
  name: string;
  price: number;
  timeStart: string;
  timeEnd: string;
  pitchId: number | string;
}

export interface Pitch {
  id: number;
  name: string;
  active?: boolean;
  calendars?: CalendarSlot[];
}

export interface ClubDetail {
  id: number;
  name: string;
  address: string;
  phoneNumber?: string;
  timeStart?: string;
  timeEnd?: string;
  imageAvatar?: string;
  rating?: number;
  pitchPrices?: PitchPrice[];
  pitches?: Pitch[];
  imageClubs?: { imageUrl: string }[];
}

export interface BookingSlot {
  slotKey: string;
  pitchId: number;
  pitchName: string;
  time: string;
  date: string;
  price: number;
}

export interface PaymentLinkResponse {
  checkoutUrl?: string;
  orderCode?: number | string;
  paymentLinkId?: string;
}

export interface LoginResponse {
  accessToken: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: { name: string };
  };
}
