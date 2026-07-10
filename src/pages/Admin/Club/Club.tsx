import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Edit,
  Eye,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import {
  getOwnerClubs,
  type OwnerClub,
  type PaginationMeta,
} from "../../../services/adminService";

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<OwnerClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
  });

  const fetchClubs = useCallback(
    async (pageNumber: number = 1) => {
      setLoading(true);
      try {
        const data = await getOwnerClubs({
          page: pageNumber - 1,
          size: meta.pageSize,
          name: searchTerm || undefined,
        });
        setClubs(data.result || []);
        setMeta(data.meta || meta);
      } catch (error: any) {
        console.error("Cannot load owner clubs:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    },
    [meta.pageSize, searchTerm],
  );

  useEffect(() => {
    fetchClubs(1);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchClubs(1);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <PageMeta title="Quan ly Club | GoPitch" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase">
            Cum san cua toi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Ban dang quan ly <span className="text-brand-500">{meta.total}</span> dia diem kinh doanh
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchClubs(meta.page)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 transition shadow-sm text-slate-600"
            title="Lam moi"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/admin/clubs/add")}
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20"
          >
            <Plus size={20} />
            <span>Them Club moi</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Nhan Enter de tim theo ten club..."
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
          Tim kiem
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
            <span className="text-slate-500 font-medium animate-pulse">Dang lay du lieu...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Thong tin san
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">
                    Quy mo
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Trang thai
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">
                    Thao tac
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
                            src={club.imageAvatar || `https://ui-avatars.com/api/?name=${club.name}&background=random`}
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
                        {club.pitches?.length || 0} san con
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {club.active ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-100 dark:border-emerald-500/20 uppercase">
                          <CheckCircle2 size={14} /> Hoat dong
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full w-fit border border-slate-200 dark:border-slate-700 uppercase">
                          <XCircle size={14} /> Tam nghi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition border border-slate-100 dark:border-slate-800 shadow-sm">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition border border-slate-100 dark:border-slate-800 shadow-sm">
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

        {!loading && clubs.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Search size={40} className="opacity-20 mb-4" />
            <p className="font-bold text-lg text-slate-600 dark:text-slate-400">Khong tim thay du lieu</p>
          </div>
        )}

        {!loading && clubs.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
            <span className="text-xs font-bold text-slate-500">
              Trang {meta.page} / {meta.pages} - Tong {meta.total} club
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchClubs(meta.page - 1)}
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-30 transition hover:bg-slate-50 text-slate-700"
              >
                Truoc
              </button>
              <button
                disabled={meta.page >= meta.pages}
                onClick={() => fetchClubs(meta.page + 1)}
                className="px-4 py-2 text-xs font-bold bg-brand-500 text-white rounded-xl disabled:opacity-30 transition shadow-lg shadow-brand-500/20 hover:bg-brand-600"
              >
                Tiep
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
