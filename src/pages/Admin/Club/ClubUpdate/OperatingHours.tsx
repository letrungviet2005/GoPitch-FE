import React from "react";
import { Clock } from "lucide-react";

interface OperatingHoursProps {
  timeStart: string;
  timeEnd: string;
  onChange: (name: string, value: string) => void;
}

export default function OperatingHours({
  timeStart,
  timeEnd,
  onChange,
}: OperatingHoursProps) {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm">
      <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
        <Clock className="text-orange-500" size={20} /> Giờ hoạt động
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Mở
          </span>
          <input
            type="time"
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-bold"
            value={timeStart}
            onChange={(e) => onChange("timeStart", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Đóng
          </span>
          <input
            type="time"
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-bold"
            value={timeEnd}
            onChange={(e) => onChange("timeEnd", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
