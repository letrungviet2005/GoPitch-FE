import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import {
  getAdminRoles,
  type AdminRole,
  type PaginationMeta,
} from "../../../services/adminService";

export default function Role() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
  });

  const fetchRoles = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getAdminRoles({ page: page - 1, size: meta.pageSize });
      setRoles(data.result || []);
      setMeta(data.meta || meta);
    } catch (error) {
      console.error("Cannot load roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(1);
  }, []);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <PageMeta title="Roles | GoPitch" />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase">
          Roles
        </h1>
        <p className="text-sm text-slate-500">
          Quan ly nhom quyen va permission trong he thong.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Permissions</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  Dang tai roles...
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck size={16} className="text-brand-500" />
                      {role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {role.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {role.permissions?.length || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={role.active ? "text-emerald-600" : "text-slate-400"}>
                      {role.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
          <span>Trang {meta.page} / {meta.pages}</span>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => fetchRoles(meta.page - 1)}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              Truoc
            </button>
            <button
              disabled={meta.page >= meta.pages}
              onClick={() => fetchRoles(meta.page + 1)}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              Tiep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
