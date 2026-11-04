export interface EditorPitch { id: number | string; name: string; active: boolean }
export interface EditorPrice { id?: number | null; pitchId: number | string; name: string; price: number; timeStart: string; timeEnd: string }
export interface EditorClub {
 id?: number; name: string; description: string; address: string; phoneNumber: string;
 imageAvatar: string; active: boolean; timeStart: string; timeEnd: string; latitude: number; longitude: number;
 pitches: EditorPitch[]; pitchPrices: EditorPrice[]; imageClubs: {imageUrl:string}[];
 extraServices: {name:string;price:number;description?:string}[]; comments?: unknown[];
}
