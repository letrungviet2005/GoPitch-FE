import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  CheckCircle2,
  Search,
  ImageIcon,
  Save,
  Loader2,
  UploadCloud,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import axios from "axios";

// Import Components & Types
import PageMeta from "../../../../components/common/PageMeta";
import { AvatarUpload } from "./AvatarUpload";
import { MapSection } from "./MapSection";
import { PitchItem } from "./PitchItem";
import { ExtraServiceSection } from "./ExtraService"; // Đổi tên để tránh trùng với Type
import {
  Pitch,
  Price,
  ExtraService as ExtraServiceType,
  ClubImage,
} from "./types";

const generateId = () => Math.random().toString(36).substr(2, 9);
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dc5dzscp5/image/upload";

export default function ClubAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    description: "",
    imageAvatar: "",
    timeStart: "05:00",
    timeEnd: "22:00",
    latitude: 10.762622,
    longitude: 106.660172,
    active: true,
  });

  const [pitches, setPitches] = useState<Pitch[]>([
    { id: generateId(), name: "Sân 1", active: true },
  ]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [extraServices, setExtraServices] = useState<ExtraServiceType[]>([]);
  const [imageClubs, setImageClubs] = useState<ClubImage[]>([]);

  // --- LOGIC UPLOAD ---
  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await axios.post(CLOUDINARY_URL, data);
      return res.data.secure_url;
    } catch (err) {
      return null;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "album"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    if (type === "avatar") {
      const url = await uploadToCloudinary(files[0]);
      if (url) setFormData((p) => ({ ...p, imageAvatar: url }));
    } else {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadToCloudinary(f))
      );
      const valid = urls
        .filter((u) => u !== null)
        .map((u) => ({ imageUrl: u }));
      setImageClubs((p) => [...p, ...valid]);
    }
    setIsUploading(false);
  };

  const handleSearchAddress = async () => {
    if (!formData.address) return;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.address
        )}`
      );
      if (res.data.length > 0) {
        setFormData((p) => ({
          ...p,
          latitude: parseFloat(res.data[0].lat),
          longitude: parseFloat(res.data[0].lon),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return alert("Vui lòng đợi ảnh upload xong!");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        pitches: pitches.map((p) => ({
          ...p,
          pitchPrices: prices
            .filter((pr) => pr.pitchId === p.id)
            .map((pr) => ({
              ...pr,
              timeStart:
                pr.timeStart.length === 5 ? `${pr.timeStart}:00` : pr.timeStart,
              timeEnd:
                pr.timeEnd.length === 5 ? `${pr.timeEnd}:00` : pr.timeEnd,
            })),
        })),
        imageClubs,
        extraServices,
      };
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      await axios.post("http://localhost:8080/api/v1/owner/clubs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/clubs");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Lỗi lưu dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <PageMeta title="Đăng ký Cụm Sân" />
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-50 border border-white sticky top-4 z-40 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight italic">
              Thiết lập hệ thống sân
            </h1>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">
              Quản lý chuyên nghiệp 4.0
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {loading ? "ĐANG LƯU..." : "LƯU TẤT CẢ DỮ LIỆU"}
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-3 bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-2xl animate-bounce">
            <AlertCircle size={20} />
            <span className="font-bold text-sm">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 space-y-6 border border-gray-50">
              <h2 className="font-black flex items-center gap-2 text-gray-800 uppercase text-sm tracking-tighter">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Building size={20} />
                </div>
                Thông tin cụm sân
              </h2>

              <AvatarUpload
                url={formData.imageAvatar}
                isUploading={isUploading}
                onUpload={(e) => handleFileChange(e, "avatar")}
                onRemove={() => setFormData({ ...formData, imageAvatar: "" })}
              />

              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                    Tên cụm sân
                  </label>
                  <input
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold text-gray-700"
                    placeholder="Nhập tên sân..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold text-gray-700"
                    placeholder="Số điện thoại..."
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-[10px] font-black text-blue-500 uppercase ml-2">
                      Mở cửa
                    </label>
                    <input
                      type="time"
                      className="w-full bg-blue-50 p-4 rounded-2xl font-bold text-blue-700 outline-none"
                      value={formData.timeStart}
                      onChange={(e) =>
                        setFormData({ ...formData, timeStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-orange-500 uppercase ml-2">
                      Đóng cửa
                    </label>
                    <input
                      type="time"
                      className="w-full bg-orange-50 p-4 rounded-2xl font-bold text-orange-700 outline-none"
                      value={formData.timeEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, timeEnd: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                    Mô tả ngắn
                  </label>
                  <textarea
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-medium text-gray-600 h-24"
                    placeholder="Giới thiệu về sân của bạn..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2 group">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                      Địa chỉ Google Maps
                    </label>
                    <input
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="Địa chỉ chi tiết..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    className="mt-6 bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>

              <MapSection lat={formData.latitude} lng={formData.longitude} />
            </div>

            {/* ALBUM ẢNH */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 space-y-4 border border-gray-50">
              <h2 className="font-black flex items-center gap-2 text-gray-800 uppercase text-sm tracking-tighter">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ImageIcon size={20} />
                </div>
                Album ảnh thực tế
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {imageClubs.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-[1.5rem] overflow-hidden group shadow-md border-2 border-white"
                  >
                    <img
                      src={img.imageUrl}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImageClubs(imageClubs.filter((_, i) => i !== idx))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={12} strokeWidth={4} />
                    </button>
                  </div>
                ))}
                <label className="border-3 border-dashed border-gray-100 rounded-[1.5rem] aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-blue-500" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 mt-2 uppercase">
                    Thêm ảnh
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "album")}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CẤU HÌNH SÂN & DỊCH VỤ */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black flex items-center gap-2 text-gray-800 uppercase text-sm tracking-tighter">
                  <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle2 size={20} />
                  </div>
                  Danh sách sân con
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setPitches([
                      ...pitches,
                      {
                        id: generateId(),
                        name: `Sân ${pitches.length + 1}`,
                        active: true,
                      },
                    ])
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus size={16} /> THÊM SÂN MỚI
                </button>
              </div>

              <div className="space-y-8">
                {pitches.map((p) => (
                  <PitchItem
                    key={p.id}
                    pitch={p}
                    prices={prices}
                    onPitchNameChange={(val) => {
                      const newP = [...pitches];
                      const target = newP.find((item) => item.id === p.id);
                      if (target) target.name = val;
                      setPitches(newP);
                    }}
                    onRemovePitch={() =>
                      setPitches(pitches.filter((i) => i.id !== p.id))
                    }
                    onAddPrice={() =>
                      setPrices([
                        ...prices,
                        {
                          id: generateId(),
                          name: "Cố định",
                          price: 150000,
                          timeStart: "17:00",
                          timeEnd: "22:00",
                          pitchId: p.id,
                        },
                      ])
                    }
                    onUpdatePrice={(id, field, val) =>
                      setPrices(
                        prices.map((item) =>
                          item.id === id ? { ...item, [field]: val } : item
                        )
                      )
                    }
                    onRemovePrice={(id) =>
                      setPrices(prices.filter((item) => item.id !== id))
                    }
                  />
                ))}
              </div>
            </div>

            {/* DỊCH VỤ ĐI KÈM */}
            <ExtraServiceSection
              services={extraServices}
              onAddService={() =>
                setExtraServices([
                  ...extraServices,
                  { id: generateId(), name: "", price: 0, unit: "Chai" },
                ])
              }
              onUpdateService={(id, field, val) =>
                setExtraServices(
                  extraServices.map((s) =>
                    s.id === id ? { ...s, [field]: val } : s
                  )
                )
              }
              onRemoveService={(id) =>
                setExtraServices(extraServices.filter((s) => s.id !== id))
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}
