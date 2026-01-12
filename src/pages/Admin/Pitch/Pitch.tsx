import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Filter,
  MoreHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";

// Kiểu dữ liệu
interface Pitch {
  id: string;
  name: string;
  clubName: string;
  type: "Sân 5" | "Sân 7" | "Sân 11";
  pricePerHour: number;
  status: "active" | "locked";
}

export default function Pitches() {
  // Data mẫu (Sau này ông gọi API và setPitches)
  const [pitches, setPitches] = useState<Pitch[]>([
    {
      id: "1",
      name: "Sân A1",
      clubName: "GoPitch Q7",
      type: "Sân 5",
      pricePerHour: 300000,
      status: "active",
    },
    {
      id: "2",
      name: "Sân A2",
      clubName: "GoPitch Q7",
      type: "Sân 5",
      pricePerHour: 300000,
      status: "locked",
    },
    {
      id: "3",
      name: "Sân B1",
      clubName: "Cầu lông 365",
      type: "Sân 7",
      pricePerHour: 500000,
      status: "active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm xử lý khóa/mở sân
  const toggleStatus = (id: string) => {
    setPitches(
      pitches.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "locked" : "active" }
          : p
      )
    );
  };

  // Hàm xóa sân
  const deletePitch = (id: string) => {
    if (window.confirm("Ông có chắc muốn xóa sân này không?")) {
      setPitches(pitches.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <PageMeta title="Quản lý chi tiết sân | GoPitch" />

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Quản lý danh sách sân
          </h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-emerald-600 font-medium">
              ● {pitches.filter((p) => p.status === "active").length} Đang hoạt
              động
            </span>
            <span className="text-rose-500 font-medium">
              ● {pitches.filter((p) => p.status === "locked").length} Đang khóa
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingPitch(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-500/25"
        >
          <Plus size={20} /> Thêm sân mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm tên sân, câu lạc bộ..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
            <Filter size={20} />
          </button>
          <button className="p-2.5 bg-slate-800 text-white rounded-xl">
            <List size={20} />
          </button>
          <button className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700">
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Thông tin sân
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Thuộc Club
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Loại
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                Giá/Giờ
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pitches
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pitch) => (
                <tr
                  key={pitch.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 dark:text-white">
                      {pitch.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {pitch.clubName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold">
                      {pitch.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-brand-600">
                    {pitch.pricePerHour.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    {pitch.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                        <CheckCircle2 size={14} /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full text-xs font-bold border border-rose-100 dark:border-rose-500/20">
                        <AlertCircle size={14} /> Đang khóa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(pitch.id)}
                        className={`p-2 rounded-lg transition ${
                          pitch.status === "active"
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-emerald-500 hover:bg-emerald-50"
                        }`}
                        title={
                          pitch.status === "active" ? "Khóa sân" : "Mở sân"
                        }
                      >
                        {pitch.status === "active" ? (
                          <Lock size={18} />
                        ) : (
                          <Unlock size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPitch(pitch);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deletePitch(pitch.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM / SỬA SÂN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingPitch ? "Chỉnh sửa thông tin sân" : "Thêm sân bóng mới"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên sân
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  defaultValue={editingPitch?.name}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Loại sân
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    defaultValue={editingPitch?.type}
                  >
                    <option>Sân 5</option>
                    <option>Sân 7</option>
                    <option>Sân 11</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Giá mỗi giờ
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    defaultValue={editingPitch?.pricePerHour}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button className="flex-1 px-4 py-2.5 bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition">
                {editingPitch ? "Cập nhật" : "Tạo sân"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
