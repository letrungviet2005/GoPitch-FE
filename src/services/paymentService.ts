import apiClient from "./apiClient";
import type {BookingSlot,PaymentLinkResponse} from "../types/api";
export async function createPaymentLink(clubId:number|string,slots:BookingSlot[],key:string):Promise<PaymentLinkResponse>{
 const {data}=await apiClient.post("/payment/create-payment-link",{clubId:Number(clubId),calendarIds:slots.map(s=>s.calendarId)},{headers:{"Idempotency-Key":key}});return data;
}
export async function confirmPayment(payload:{orderCode:string;slots?:BookingSlot[];clubId?:string|number;totalAmount?:string|number}){
 const {data}=await apiClient.post("/payment/confirm-payment",{orderCode:Number(payload.orderCode)});return data as {state:string;amount:number};
}
export function storePendingBooking(p:{slots:BookingSlot[];clubId:string|number;totalAmount:number;orderCode?:string|number}){if(p.orderCode!=null)localStorage.setItem("pending_orderCode",String(p.orderCode));}
export function clearPendingBooking(){for(const key of ["pending_orderCode","pending_slots","pending_clubId","pending_totalAmount"])localStorage.removeItem(key);}
