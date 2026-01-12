import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  Share2,
  Heart,
  Clock,
  Phone,
  ChevronRight,
  X,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";

const DetailPitch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState<any>(null);
  const [extraServices, setExtraServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [clubRes, serviceRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/clubs/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/v1/extra-services/club/${id}`, {
            headers,
          }),
        ]);

        setClub(clubRes.data.result || clubRes.data);
        setExtraServices(serviceRes.data || []);
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAllData();
  }, [id]);

  // Khóa cuộn trang khi mở modal ảnh
  useEffect(() => {
    document.body.style.overflow = showAllPhotos ? "hidden" : "unset";
  }, [showAllPhotos]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium italic">
          Đang tải thông tin sân...
        </p>
      </div>
    );

  if (!club)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        Không tìm thấy thông tin sân!
      </div>
    );

  const allImages = [
    club.imageAvatar,
    ...(club.imageClubs?.map((img: any) => img.imageUrl) || []),
  ].filter(Boolean);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-2">
              {club.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" /> {club.rating || "5.0"}{" "}
                (100+ đánh giá)
              </span>
              <span className="flex items-center gap-1 text-slate-500 underline decoration-slate-300">
                <MapPin size={16} /> {club.address}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg font-bold text-sm transition-all">
              <Share2 size={18} /> Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg font-bold text-sm transition-all">
              <Heart size={18} /> Lưu
            </button>
          </div>
        </div>

        {/* --- GALLERY GRID (Airbnb Style) --- */}
        <section className="relative h-[300px] md:h-[450px] grid grid-cols-4 grid-rows-2 gap-3 rounded-[2rem] overflow-hidden mb-10 shadow-xl group">
          {/* Ảnh chính lớn */}
          <div className="col-span-4 md:col-span-2 row-span-2 relative overflow-hidden">
            <img
              src={allImages[0]}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Main"
            />
          </div>
          {/* 4 ảnh nhỏ bên phải (ẩn trên mobile để tối ưu) */}
          {allImages.slice(1, 5).map((url, idx) => (
            <div key={idx} className="hidden md:block relative overflow-hidden">
              <img
                src={url}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                alt="Sub"
              />
            </div>
          ))}
          {/* Nút Xem tất cả ảnh */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl text-sm font-black shadow-lg flex items-center gap-2 hover:bg-white transition-all active:scale-95"
          >
            <LayoutGrid size={18} /> XEM TẤT CẢ {allImages.length} ẢNH
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- CỘT TRÁI (THÔNG TIN CHÍNH) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Giới thiệu */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-4 uppercase italic">
                Giới thiệu sân
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Chào mừng bạn đến với{" "}
                <strong className="text-blue-600">{club.name}</strong>. Sân được
                đầu tư cơ sở vật chất hiện đại, mặt sàn đạt chuẩn quốc tế, hệ
                thống chiếu sáng LED chống lóa đạt chuẩn thi đấu.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Clock />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400">
                      Giờ hoạt động
                    </p>
                    <p className="font-bold text-blue-900">
                      {formatTime(club.timeStart)} - {formatTime(club.timeEnd)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Phone />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400">
                      Liên hệ đặt sân
                    </p>
                    <p className="font-bold text-emerald-900">
                      {club.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bảng giá */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 uppercase italic">
                  Bảng giá thuê sân
                </h2>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">
                  Giá theo giờ
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-8 py-4">Tên khung giờ</th>
                      <th className="px-8 py-4 text-center">Thời gian</th>
                      <th className="px-8 py-4 text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {club.pitchPrices?.map((price: any, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 font-bold text-slate-700">
                          {price.name}
                        </td>
                        <td className="px-8 py-5 text-center font-semibold text-slate-500">
                          {formatTime(price.timeStart)} -{" "}
                          {formatTime(price.timeEnd)}
                        </td>
                        <td className="px-8 py-5 text-right font-black text-blue-600 text-lg">
                          {price.price?.toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dịch vụ phụ */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-6 uppercase italic">
                Dịch vụ & Tiện ích
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraServices.length > 0 ? (
                  extraServices.map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-bold text-slate-700">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {s.price?.toLocaleString()}đ/{s.unit}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-slate-400 py-4 italic">
                    Chưa có dịch vụ bổ sung
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI (SIDEBAR STICKY) --- */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-50 overflow-hidden relative">
                {/* Trang trí góc */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8"></div>

                <div className="mb-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Giá chỉ từ
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-600">
                      {club.pitchPrices?.[0]?.price?.toLocaleString() || "0"}đ
                    </span>
                    <span className="text-slate-400 font-bold text-sm">
                      / giờ
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/bookingpitch/${id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] mb-6 flex items-center justify-center gap-2 uppercase italic tracking-wider"
                >
                  Đặt sân ngay <ChevronRight size={20} />
                </button>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="text-emerald-500" size={18} /> Hoàn
                    tiền nếu hủy trước 24h
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="text-emerald-500" size={18} /> Hỗ
                    trợ thanh toán VNPay/MoMo
                  </li>
                </ul>

                <div className="rounded-2xl overflow-hidden h-[200px] border border-slate-100">
                  <iframe
                    title="map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      club.address
                    )}&output=embed`}
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  ></iframe>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* --- MODAL XEM TẤT CẢ ẢNH --- */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[999] bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b z-10">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <h3 className="font-black text-slate-800 uppercase italic">
              Thư viện ảnh ({allImages.length})
            </h3>
            <div className="w-10"></div> {/* Spacer */}
          </div>
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allImages.map((url, idx) => (
                <div
                  key={idx}
                  className="w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100"
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`Full ${idx}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPitch;
