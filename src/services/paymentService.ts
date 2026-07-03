import apiClient from "./apiClient";
import type { BookingSlot, PaymentLinkResponse } from "../types/api";

export async function createPaymentLink(
  amount: number,
): Promise<PaymentLinkResponse> {
  const { data } = await apiClient.post<PaymentLinkResponse>(
    "/payment/create-payment-link",
    { amount },
  );
  return data;
}

export async function confirmPayment(payload: {
  orderCode: string;
  slots: BookingSlot[];
  clubId: string | number;
  totalAmount: string | number;
}) {
  const { data } = await apiClient.post("/payment/confirm-payment", {
    orderCode: payload.orderCode,
    slots: payload.slots.map(({ pitchId, date, time, price }) => ({
      pitchId,
      date,
      time,
      price,
    })),
    clubId: payload.clubId,
    totalAmount: Number(payload.totalAmount),
  });
  return data;
}

export function storePendingBooking(payload: {
  slots: BookingSlot[];
  clubId: string | number;
  totalAmount: number;
  orderCode?: string | number;
}) {
  localStorage.setItem("pending_slots", JSON.stringify(payload.slots));
  localStorage.setItem("pending_clubId", String(payload.clubId));
  localStorage.setItem("pending_totalAmount", String(payload.totalAmount));
  if (payload.orderCode != null) {
    localStorage.setItem("pending_orderCode", String(payload.orderCode));
  }
}

export function clearPendingBooking() {
  localStorage.removeItem("pending_slots");
  localStorage.removeItem("pending_clubId");
  localStorage.removeItem("pending_totalAmount");
  localStorage.removeItem("pending_orderCode");
}
