import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Eye,
  Filter,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Interface giữ nguyên như của ông
interface Pitch {
  id: number;
  name: string;
  active: boolean;
}
interface Club {
  id: number;
  name: string;
  address: string;
  active: boolean;
  pitches?: Pitch[];
  phoneNumber?: string;
  imageAvatar?: string;
}
interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1, // Page hiển thị cho người dùng (1-based)
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  // Dùng useCallback để tránh re-render vô tận và có thể tái sử dụng
  const fetchClubs = useCallback(
    async (pageNumber: number = 1) => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        // FIX LỖI MALFORMED: Nếu không có token, không gọi API hoặc đẩy về Login
        if (!token || token === "undefined" || token === "null") {
          console.error("Token không hợp lệ!");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/v1/owner/clubs`,
          {
            params: {
              // Lưu ý: Nếu Backend Spring Boot dùng Pageable, nó nhận page bắt đầu từ 0
              page: pageNumber - 1,
              size: meta.pageSize,
              name: searchTerm, // Truyền thêm param search để filter từ DB
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        if (data) {
          setClubs(data.result || []);
          // Đảm bảo cập nhật lại meta từ backend trả về
          if (data.meta) {
            setMeta({
              ...data.meta,
              page: data.meta.page + 1, // Convert 0-based về 1-based để UI hiển thị
            });
          }
        }
      } catch (error: any) {
        console.error("Lỗi fetch API:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          // Xử lý khi token hết hạn
          // localStorage.removeItem("access_token");
          // window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    },
    [meta.pageSize, searchTerm]
  );

  useEffect(() => {
    fetchClubs(1);
  }, []); // Chỉ chạy 1 lần khi mount

  // Xử lý khi nhấn phím Enter ở ô tìm kiếm
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchClubs(1);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <PageMeta title="Quản lý Club | GoPitch" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase">
            Cụm sân của tôi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Bạn đang quản lý{" "}
            <span className="text-brand-500">{meta.total}</span> địa điểm kinh
            doanh
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchClubs(meta.page)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 transition shadow-sm text-slate-600"
            title="Làm mới"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/admin/clubs/add")}
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20"
          >
            <Plus size={20} />
            <span>Thêm Club mới</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Nhấn Enter để tìm kiếm theo tên, địa chỉ..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <button
          onClick={() => fetchClubs(1)}
          className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition text-sm font-bold"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
            <span className="text-slate-500 font-medium animate-pulse">
              Đang lấy dữ liệu từ máy chủ...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Thông tin sân
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">
                    Quy mô
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clubs.map((club) => (
                  <tr
                    onClick={() => navigate(`/admin/clubs/details/${club.id}`)}
                    key={club.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img
                            src={
                              club.imageAvatar ||
                              `https://ui-avatars.com/api/?name=${club.name}&background=random`
                            }
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 transition-colors">
                            {club.name}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                            <MapPin size={12} /> {club.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-500/20">
                        {club.pitches?.length || 0} sân con
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {club.active ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-100 dark:border-emerald-500/20 uppercase">
                          <CheckCircle2 size={14} /> Hoạt động
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full w-fit border border-slate-200 dark:border-slate-700 uppercase">
                          <XCircle size={14} /> Tạm nghỉ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition border border-slate-100 dark:border-slate-800 shadow-sm"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition border border-slate-100 dark:border-slate-800 shadow-sm"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && clubs.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search size={40} className="opacity-20" />
            </div>
            <p className="font-bold text-lg text-slate-600 dark:text-slate-400">
              Không tìm thấy dữ liệu
            </p>
            <p className="text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc làm mới trang
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && clubs.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
            <span className="text-xs font-bold text-slate-500">
              Trang {meta.page} / {meta.pages} — Tổng {meta.total} sân bóng
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchClubs(meta.page - 1)}
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-30 transition hover:bg-slate-50 text-slate-700"
              >
                Trước
              </button>
              <button
                disabled={meta.page >= meta.pages}
                onClick={() => fetchClubs(meta.page + 1)}
                className="px-4 py-2 text-xs font-bold bg-brand-500 text-white rounded-xl disabled:opacity-30 transition shadow-lg shadow-brand-500/20 hover:bg-brand-600"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
