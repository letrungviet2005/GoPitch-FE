import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Map,
  LayoutGrid,
  PhoneCall,
  Home,
  ChevronDown,
  LogOut,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Hiệu ứng đổi màu khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Render Nav Item
  const NavItem = ({ path, icon: Icon, label }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
        isActive(path)
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-emerald-600"
      }`}
    >
      <Icon size={18} />
      <span className="hidden lg:block">{label}</span>
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-1 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="bg-emerald-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-xl leading-none">
                GO
              </span>
            </div>
            <span className="text-slate-800 font-black text-2xl tracking-tighter">
              PITCH
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <NavItem path="/" icon={Home} label="Trang chủ" />
            <NavItem path="/maps" icon={Map} label="Bản đồ" />
            <NavItem path="/pitch" icon={LayoutGrid} label="Đặt sân" />
            <NavItem path="/contact" icon={PhoneCall} label="Liên hệ" />
          </nav>

          {/* ACTIONS / PROFILE */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
              onClick={() => navigate("/profile")}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-emerald-500/20">
                <img
                  src="https://tse4.mm.bing.net/th/id/OIP.LkrCBJoljYJlA43RIOjTdwHaHa?pid=Api&P=0&h=180"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400 font-medium leading-none mb-1">
                  Chào bạn,
                </p>
                <p className="text-sm font-bold text-slate-700 leading-none">
                  Tài khoản
                </p>
              </div>
              <ChevronDown
                size={14}
                className="text-slate-400 hidden sm:block"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
