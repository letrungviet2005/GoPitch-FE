import apiClient from "./apiClient";
import type { CalendarSlot } from "../types/api";

export async function getCalendarsByDate(
  pitchId: number,
  date: string,
): Promise<CalendarSlot[]> {
  const { data } = await apiClient.get<CalendarSlot[]>("/calendars", {
    params: { pitchId, date },
  });
  return data;
}

export function isSlotBooked(calendars: CalendarSlot[], time: string): boolean {
  return calendars.some((calendar) => {
    const slotTime = calendar.startTime?.split("T")[1]?.substring(0, 5);
    return slotTime === time && calendar.active === false;
  });
}
