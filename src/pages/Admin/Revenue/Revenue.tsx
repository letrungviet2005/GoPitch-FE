import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, DollarSign, Download, Search } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import {
  getRevenueSummary,
  getRevenueTransactions,
} from "../../../services/adminService";

interface Transaction {
  id: string;
  ospayId: string;
  customerName: string;
  pitchName: string;
  amount: number;
  createdAt: string;
}

export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    count: 0,
    paidCount: 0,
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const [summaryData, transactionPage] = await Promise.all([
          getRevenueSummary(),
          getRevenueTransactions({ page: 0, size: 50, sort: "id,desc" }),
        ]);

        setSummary(summaryData);
        setTransactions(
          (transactionPage.result || []).map((bill) => ({
            id: `GP-${bill.id}`,
            ospayId: bill.orderCode ? `PAYOS-${bill.orderCode}` : `BILL-${bill.id}`,
            customerName: bill.customerName || "Khach hang",
            pitchName: bill.slots?.[0]?.pitchName || bill.clubName,
            amount: bill.price,
            createdAt: bill.createdAt,
          })),
        );
      } catch (error) {
        console.error("Cannot load revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const stats = useMemo(
    () => ({
      total: summary.total,
      count: summary.count,
      paidCount: summary.paidCount,
    }),
    [summary],
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      <PageMeta title="Doanh thu | GoPitch" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Doanh thu PayOS
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Theo doi giao dich dat san da ghi nhan trong he thong.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg">
          <Download size={16} /> Xuat bao cao
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Tong doanh thu"
          value={`${stats.total.toLocaleString()}d`}
          icon={<DollarSign className="text-blue-600" />}
          sub="Tong tien tu bill"
        />
        <StatCard
          label="Tong giao dich"
          value={stats.count}
          icon={<Calendar className="text-slate-600" />}
          sub="Tat ca hoa don"
        />
        <StatCard
          label="Da thanh toan"
          value={stats.paidCount}
          icon={<CheckCircle2 className="text-emerald-500" />}
          sub="Bill status thanh cong"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">
            Lich su giao dich
          </h3>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tim kiem..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Ma giao dich</th>
                <th className="px-6 py-4">Khach hang / San</th>
                <th className="px-6 py-4 text-right">So tien</th>
                <th className="px-6 py-4 text-right">Thoi gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-20 text-slate-400 animate-pulse">
                    Dang tai du lieu doanh thu...
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-blue-600 font-bold">
                        {tx.ospayId}
                      </div>
                      <div className="text-[10px] text-slate-400">Don: #{tx.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        {tx.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500">{tx.pitchName}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white text-base">
                      {tx.amount.toLocaleString()}d
                    </td>
                    <td className="px-6 py-4 text-right text-[11px] text-slate-500 font-medium">
                      {tx.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, sub }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
        {value}
      </h3>
      <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
    </div>
  );
}
