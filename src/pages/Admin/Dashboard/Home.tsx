import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  CheckCircle2,
  History,
  ShieldCheck,
  Activity,
} from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";

export default function AdminHome() {
  const navigate = useNavigate();
  const [user] = useState<any>(true); // Thay bằng logic auth thực tế của bạn
  const [loading, setLoading] = useState(true);

  // 1. Bảo vệ Route: Điều hướng ngay nếu chưa có user
  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Dữ liệu mẫu tập trung vào OSPAY
  const stats = {
    totalRevenue: "125,400,000",
    totalBookings: 456,
    activePitches: 8,
    ospayUptime: "99.9%",
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      <PageMeta title="Báo cáo vận hành | GoPitch" />

      {/* Header Chuyên Nghiệp */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              Báo cáo vận hành
            </h1>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE DATA
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Hệ thống ghi nhận giao dịch từ cổng{" "}
            <span className="font-bold text-blue-600">OSPAY</span>
          </p>
        </div>

        <div className="text-right hidden md:block">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Cập nhật lần cuối
          </p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Vừa xong
          </p>
        </div>
      </div>

      {/* Stats Grid - 4 Cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Doanh thu OSPAY"
          value={`${stats.totalRevenue}đ`}
          icon={<DollarSign size={20} className="text-blue-600" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Đơn thành công"
          value={stats.totalBookings}
          icon={<Calendar size={20} className="text-emerald-500" />}
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard
          title="Sân đang mở"
          value={stats.activePitches}
          icon={<Activity size={20} className="text-amber-500" />}
          trend="8/8"
          trendUp={true}
        />
        <StatCard
          title="Trạng thái OSPAY"
          value={stats.ospayUptime}
          icon={<ShieldCheck size={20} className="text-blue-500" />}
          trend="Ổn định"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Biểu đồ doanh thu OSPAY */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Dòng tiền qua OSPAY (7 ngày qua)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Đơn vị: Triệu đồng (VNĐ)
              </p>
            </div>
            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 outline-none">
              <option>Tuần này</option>
              <option>Tuần trước</option>
            </select>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 md:gap-6 px-2">
            {[4.5, 6.2, 3.8, 8.5, 5.5, 9.2, 7.8].map((val, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 group"
              >
                <div className="w-full relative flex flex-col justify-end items-center h-full">
                  {/* Tooltip số tiền */}
                  <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {val}tr
                  </div>
                  {/* Cột biểu đồ */}
                  <div
                    className="w-full bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-600 transition-all duration-500 rounded-t-lg"
                    style={{ height: `${(val / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Giao dịch OSPAY gần đây */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Giao dịch OSPAY mới
            </h3>
            <History size={16} className="text-slate-400" />
          </div>

          <div className="space-y-3">
            <OspayTransactionItem
              user="Nguyễn Anh Tuấn"
              ospayId="OSP-2201"
              time="18:30"
              amount="300.000"
            />
            <OspayTransactionItem
              user="Trần Minh Quang"
              ospayId="OSP-2202"
              time="19:15"
              amount="500.000"
            />
            <OspayTransactionItem
              user="Lê Hồng Sơn"
              ospayId="OSP-2203"
              time="20:00"
              amount="300.000"
            />
            <OspayTransactionItem
              user="Vũ Duy Mạnh"
              ospayId="OSP-2204"
              time="21:10"
              amount="450.000"
            />
            <OspayTransactionItem
              user="Hoàng Nam"
              ospayId="OSP-2205"
              time="22:00"
              amount="600.000"
            />
          </div>

          <button
            onClick={() => navigate("/admin/revenue")}
            className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 transition border border-blue-100 dark:border-blue-500/20 flex items-center justify-center gap-2"
          >
            Chi tiết doanh thu <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Card thống kê sạch sẽ
function StatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span
          className={`flex items-center text-[11px] font-bold px-2 py-1 rounded-lg ${
            trendUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend}{" "}
          {trendUp ? (
            <ArrowUpRight size={12} className="ml-1" />
          ) : (
            <ArrowDownRight size={12} className="ml-1" />
          )}
        </span>
      </div>
      <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
        {value}
      </h2>
    </div>
  );
}

// Item giao dịch tập trung vào OSPAY
function OspayTransactionItem({ user, ospayId, time, amount }: any) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-50 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-default">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 rounded-full text-blue-600">
          <ShieldCheck size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {user}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {ospayId} • {time}
          </span>
        </div>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-blue-400">
        +{amount}
      </span>
    </div>
  );
}
