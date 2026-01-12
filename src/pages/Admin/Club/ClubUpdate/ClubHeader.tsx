import React from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface ClubHeaderProps {
  title: string;
  saving: boolean;
  onSave: () => void;
  onBack: () => void;
}

export default function ClubHeader({
  title,
  saving,
  onSave,
  onBack,
}: ClubHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 bg-white dark:bg-slate-900 border rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-800 dark:text-white">
            Cập nhật Club
          </h1>
          <p className="text-xs text-slate-400">
            Quản lý thông tin sân và bảng giá
          </p>
        </div>
      </div>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Save size={20} />
        )}
        Lưu thay đổi
      </button>
    </div>
  );
}
