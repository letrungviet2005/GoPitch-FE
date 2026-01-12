import React from "react";
import { Info } from "lucide-react";

interface BasicInfoProps {
  data: {
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
  };
  onChange: (name: string, value: string) => void;
}

export default function BasicInfo({ data, onChange }: BasicInfoProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white border-b pb-4">
        <Info className="text-brand-500" size={20} /> Thông tin cơ bản
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Tên sân bóng
          </label>
          <input
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Mô tả chi tiết
          </label>
          <textarea
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500"
            name="description"
            rows={3}
            value={data.description}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Địa chỉ
          </label>
          <input
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
            name="address"
            value={data.address}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Hotline
          </label>
          <input
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}
