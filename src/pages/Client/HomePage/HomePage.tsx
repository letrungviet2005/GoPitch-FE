import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  BarChart3,
  Smartphone,
  ChevronRight,
  Trophy,
  Users,
  Star,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. HERO SECTION */}
      <header className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070"
            alt="Badminton Court"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-slate-900/90" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-semibold leading-6 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nền tảng đặt sân số 1 Việt Nam</span>
            </span>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              Nâng Tầm Quản Lý <br />
              <span className="text-emerald-400">Sân Thể Thao</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Giải pháp toàn diện giúp chủ sân tối ưu doanh thu và người chơi
              tìm được sân ưng ý chỉ trong{" "}
              <span className="text-white font-bold italic text-xl">
                30 giây
              </span>
              . Hiện đại - Nhanh chóng - Tin cậy.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/pitch")}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:-translate-y-1"
              >
                Khám phá sân ngay <ChevronRight size={18} />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-slate-800"
              >
                Hợp tác chủ sân
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. STATS SECTION */}
      <section className="relative z-20 -mt-12 container mx-auto px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Sân cầu lông",
              value: "500+",
              icon: <Trophy className="text-emerald-500" />,
            },
            {
              label: "Người dùng/tháng",
              value: "20.000+",
              icon: <Users className="text-blue-500" />,
            },
            {
              label: "Hài lòng",
              value: "99%",
              icon: <Star className="text-yellow-500" />,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 transition-transform hover:-translate-y-1"
            >
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className="rounded-full bg-slate-50 p-4">{stat.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-base font-bold text-emerald-600 uppercase tracking-widest">
            Tính năng
          </h2>
          <p className="mt-2 text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
            Ưu việt tại GoPitch
          </p>
          <p className="mt-4 text-lg text-slate-600">
            Chúng tôi cung cấp công cụ mạnh mẽ nhất cho cả chủ sân và lông thủ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Lịch Sân Trực Quan",
              desc: "Theo dõi trạng thái sân trống theo thời gian thực. Giao diện hiện đại, dễ thao tác.",
              icon: <Calendar className="w-8 h-8" />,
              color: "bg-emerald-500",
            },
            {
              title: "Thanh Toán Tự Động",
              desc: "Hỗ trợ QR Code, kiểm tra minh chứng thanh toán giúp quản lý dòng tiền minh bạch.",
              icon: <CreditCard className="w-8 h-8" />,
              color: "bg-blue-500",
            },
            {
              title: "Báo Cáo Doanh Thu",
              desc: "Thống kê chi tiết theo ngày/tháng giúp chủ sân nắm bắt tình hình kinh doanh.",
              icon: <BarChart3 className="w-8 h-8" />,
              color: "bg-purple-500",
            },
            {
              title: "Đặt Sân Linh Hoạt",
              desc: "Đặt sân mọi lúc mọi nơi, chọn đúng khung giờ và sân con yêu thích chỉ với vài chạm.",
              icon: <Smartphone className="w-8 h-8" />,
              color: "bg-orange-500",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group relative rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-2xl hover:ring-emerald-200"
            >
              <div
                className={`mb-6 inline-flex rounded-2xl ${f.color} p-4 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {f.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="px-6 py-20">
        <div className="container mx-auto relative overflow-hidden rounded-[2.5rem] bg-emerald-600 px-8 py-16 text-center shadow-2xl shadow-emerald-200 sm:px-16">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500 opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-400 opacity-50 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-black text-white sm:text-5xl">
              Sẵn sàng trải nghiệm GoPitch?
            </h2>
            <p className="mt-6 text-lg text-emerald-50 text-opacity-80">
              Tham gia cùng hàng nghìn chủ sân và người chơi ngay hôm nay để
              trải nghiệm dịch vụ đặt sân chuyên nghiệp nhất.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-10 rounded-2xl bg-white px-10 py-5 text-base font-black text-emerald-600 shadow-xl transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
            >
              Bắt đầu miễn phí
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 text-center text-slate-500">
        <p className="text-sm font-medium italic">
          © 2026 GoPitch Team. Kiến tạo cộng đồng cầu lông vững mạnh.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
