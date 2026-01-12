import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";

// Cấu trúc dữ liệu chuẩn hóa cho OSPAY
interface Transaction {
  id: string; // Mã đơn hàng GoPitch
  ospayId: string; // Mã giao dịch trên hệ thống OSPAY
  customerName: string;
  pitchName: string;
  amount: number;
  type: "Đặt cọc" | "Thanh toán đủ";
  createdAt: string;
}

export default function Revenue() {
  const navigate = useNavigate();
  const [user] = useState<any>(true); // Giả định check user, bạn hãy thay bằng context/redux của bạn
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterDate, setFilterDate] = useState("today");

  // 1. Bảo vệ Route: Điều hướng thẳng nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  // 2. Fetch dữ liệu thực tế
  useEffect(() => {
    const fetchOspayData = async () => {
      setLoading(true);
      try {
        // Mock data thực tế với cổng OSPAY
        const mockData: Transaction[] = [
          {
            id: "GP-8821",
            ospayId: "OSP-99021442",
            customerName: "Nguyễn Văn An",
            pitchName: "Sân 5 - A1",
            amount: 150000,
            type: "Thanh toán đủ",
            createdAt: "2024-03-21 08:30",
          },
          {
            id: "GP-8822",
            ospayId: "OSP-99021550",
            customerName: "Trần Minh Tâm",
            pitchName: "Sân 7 - B1",
            amount: 600000,
            type: "Thanh toán đủ",
            createdAt: "2024-03-21 09:15",
          },
        ];
        setTransactions(mockData);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOspayData();
  }, [filterDate, user]);

  // 3. Tính toán số liệu
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, item) => sum + item.amount, 0);
    return {
      total,
      count: transactions.length,
      depositTotal: transactions
        .filter((t) => t.type === "Đặt cọc")
        .reduce((s, i) => s + i.amount, 0),
    };
  }, [transactions]);

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      <PageMeta title="Doanh thu OSPAY | GoPitch" />

      {/* Header tập trung vào OSPAY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              Doanh thu OSPAY
            </h1>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck size={12} /> CỔNG THANH TOÁN CHÍNH THỨC
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Quản lý dòng tiền thực tế được xử lý qua OSPAY Gateway
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none shadow-sm"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg">
            <Download size={16} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Chỉ số thực tế */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Tổng doanh thu (OSPAY)"
          value={`${stats.total.toLocaleString()}đ`}
          icon={<DollarSign className="text-blue-600" />}
          sub="Tiền thực nhận vào ví"
        />
        <StatCard
          label="Tổng đơn giao dịch"
          value={stats.count}
          icon={<Calendar className="text-slate-600" />}
          sub="Giao dịch qua cổng"
        />
        <StatCard
          label="Tiền cọc giữ chỗ"
          value={`${stats.depositTotal.toLocaleString()}đ`}
          icon={<CheckCircle2 className="text-emerald-500" />}
          sub="Đã xác thực từ OSPAY"
        />
      </div>

      {/* Bảng giao dịch sạch sẽ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Lịch sử giao dịch OSPAY
          </h3>
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Mã OSPAY hoặc tên..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Mã OSPAY</th>
                <th className="px-6 py-4">Khách hàng / Sân</th>
                <th className="px-6 py-4">Loại giao dịch</th>
                <th className="px-6 py-4 text-right">Số tiền</th>
                <th className="px-6 py-4 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-slate-400 animate-pulse"
                  >
                    Đang đồng bộ từ OSPAY...
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-blue-600 font-bold">
                        {tx.ospayId}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Đơn: #{tx.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        {tx.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {tx.pitchName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          tx.type === "Đặt cọc"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white text-base">
                      {tx.amount.toLocaleString()}đ
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
