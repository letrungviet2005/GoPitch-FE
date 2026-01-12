import React from "react";
import {
  Trash2,
  CalendarDays,
  Plus,
  LayoutGrid,
  ChevronRight,
  Clock,
} from "lucide-react";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}:00`;
});

interface PitchPriceConfigProps {
  prices: any[];
  pitches: any[];
  onPricesChange: (newPrices: any[]) => void;
  onPitchesChange: (newPitches: any[]) => void;
  openTime: string;
  closeTime: string;
}

export default function PitchPriceConfig({
  prices = [],
  pitches = [],
  onPricesChange,
  onPitchesChange,
  openTime,
  closeTime,
}: PitchPriceConfigProps) {
  const updatePriceValue = (priceIndex: number, field: string, value: any) => {
    const newPrices = [...prices];
    newPrices[priceIndex] = { ...newPrices[priceIndex], [field]: value };
    onPricesChange(newPrices);
  };

  const addPriceForPitch = (pitchId: any) => {
    onPricesChange([
      ...prices,
      {
        id: null,
        pitchId: pitchId,
        name: `Khung giá ${
          prices.filter((p) => String(p.pitchId) === String(pitchId)).length + 1
        }`,
        price: 0,
        timeStart: openTime || "06:00:00",
        timeEnd: closeTime || "22:00:00",
      },
    ]);
  };

  const removePrice = (priceIndex: number) => {
    if (window.confirm("Xóa khung giá này?")) {
      onPricesChange(prices.filter((_, i) => i !== priceIndex));
    }
  };

  const updatePitchName = (pitchId: any, newName: string) => {
    onPitchesChange(
      pitches.map((p) =>
        String(p.id) === String(pitchId) ? { ...p, name: newName } : p
      )
    );
  };

  const TimePickerDropdown = ({ label, value, colorClass, onChange }: any) => {
    // CHUẨN HÓA: Ép value về HH:mm:00 để khớp với option value
    const safeValue = value?.length === 5 ? `${value}:00` : value;

    return (
      <div className="flex-1">
        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block px-1">
          {label}
        </label>
        <div className="relative">
          <select
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full appearance-none bg-white border border-slate-200 p-2.5 pr-8 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${colorClass}`}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t.substring(0, 5)}
              </option>
            ))}
          </select>
          <Clock
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <CalendarDays className="text-blue-600" size={24} />
        </div>
        <h2 className="font-black text-xl uppercase italic text-blue-900">
          Sân & Bảng giá
        </h2>
      </div>

      {pitches.map((pitch) => {
        const pitchPrices = prices
          .map((p, idx) => ({ ...p, originalIdx: idx }))
          .filter((p) => String(p.pitchId) === String(pitch.id));

        return (
          <div
            key={pitch.id}
            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden mb-8 shadow-sm"
          >
            <div className="bg-slate-50/80 px-8 py-5 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                  <LayoutGrid size={24} />
                </div>
                <input
                  className="bg-transparent font-black text-slate-800 uppercase text-lg border-b-2 border-transparent focus:border-emerald-400 outline-none"
                  value={pitch.name}
                  onChange={(e) => updatePitchName(pitch.id, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => addPriceForPitch(pitch.id)}
                className="bg-white text-blue-600 border-2 border-blue-100 px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus size={16} /> THÊM GIÁ
              </button>
            </div>

            <div className="p-8 space-y-6">
              {pitchPrices.map((pp) => (
                <div
                  key={pp.originalIdx}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100"
                >
                  <div className="lg:col-span-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                      Tên khung
                    </label>
                    <input
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold"
                      value={pp.name}
                      onChange={(e) =>
                        updatePriceValue(pp.originalIdx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-black text-emerald-600"
                      value={pp.price}
                      onChange={(e) =>
                        updatePriceValue(
                          pp.originalIdx,
                          "price",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="lg:col-span-5 flex items-center gap-4">
                    <TimePickerDropdown
                      label="Bắt đầu"
                      value={pp.timeStart}
                      colorClass="text-blue-600"
                      onChange={(v: any) =>
                        updatePriceValue(pp.originalIdx, "timeStart", v)
                      }
                    />
                    <ChevronRight className="mt-4 text-slate-300" size={16} />
                    <TimePickerDropdown
                      label="Kết thúc"
                      value={pp.timeEnd}
                      colorClass="text-orange-600"
                      onChange={(v: any) =>
                        updatePriceValue(pp.originalIdx, "timeEnd", v)
                      }
                    />
                  </div>
                  <div className="lg:col-span-1 flex justify-end">
                    <button
                      onClick={() => removePrice(pp.originalIdx)}
                      className="p-3 text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
