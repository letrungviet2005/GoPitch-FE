import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import PageMeta from "../../../../components/common/PageMeta";

// Import các component con
import ClubHeader from "./ClubHeader";
import BasicInfo from "./BasicInfo";
import PitchPriceConfig from "./PitchPriceConfig";
import OperatingHours from "./OperatingHours";
import MediaSection from "./MediaSection";

const API_BASE = "http://localhost:8080/api/v1";

export default function ClubUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Khởi tạo state chuẩn cho Form
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    address: "",
    phoneNumber: "",
    imageAvatar: "",
    active: true,
    timeStart: "05:00",
    timeEnd: "23:59",
    latitude: 0,
    longitude: 0,
    pitches: [],
    pitchPrices: [],
    imageClubs: [],
    extraServices: [],
  });

  const getAuthToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    );
  };

  // Helper để format HH:mm:ss -> HH:mm cho input time
  const formatTimeForInput = (t: string) => {
    if (!t) return "00:00";
    return t.split(":").slice(0, 2).join(":");
  };

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await axios.get(`${API_BASE}/owner/clubs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.result || res.data;

        // Cập nhật state và format lại toàn bộ thời gian
        setFormData({
          ...data,
          timeStart: formatTimeForInput(data.timeStart),
          timeEnd: formatTimeForInput(data.timeEnd),
          pitches: data.pitches || [],
          pitchPrices: (data.pitchPrices || []).map((p: any) => ({
            ...p,
            timeStart: formatTimeForInput(p.timeStart),
            timeEnd: formatTimeForInput(p.timeEnd),
          })),
          imageClubs: data.imageClubs || [],
          extraServices: data.extraServices || [],
        });
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
        alert("Không thể tải thông tin câu lạc bộ.");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);
  console.log("Dữ liệu form hiện tại:", formData);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // --- LOGIC LƯU CẬP NHẬT ---
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = getAuthToken();
      // Loại bỏ các trường không cần thiết trước khi gửi payload
      const { comments, ...payload } = formData;

      await axios.put(`${API_BASE}/owner/clubs/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật thành công!");
      navigate("/admin/clubs");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  // --- LOGIC XÓA CLUB ---
  const handleDeleteClub = async () => {
    const isConfirmed = window.confirm(
      "CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn xóa hoàn toàn câu lạc bộ này? Hành động này sẽ xóa sạch tất cả sân con và khung giá liên quan. Không thể hoàn tác!"
    );

    if (!isConfirmed) return;

    setSaving(true);
    try {
      const token = getAuthToken();
      await axios.delete(`${API_BASE}/owner/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đã xóa câu lạc bộ thành công.");
      navigate("/admin/clubs");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa thất bại. Có thể do câu lạc bộ đang có lịch đặt sân.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-500 font-medium">
            Đang tải dữ liệu câu lạc bộ...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen pb-32">
      <PageMeta title={`Chỉnh sửa: ${formData.name}`} />

      {/* 1. Header cố định trên cùng */}
      <ClubHeader
        title={formData.name}
        saving={saving}
        onSave={handleSubmit}
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* CỘT TRÁI: CHIẾM 2 PHẦN - THÔNG TIN CHÍNH */}
        <div className="lg:col-span-2 space-y-8">
          <BasicInfo
            data={formData}
            onChange={(name, value) => handleChange(name, value)}
          />

          <PitchPriceConfig
            pitches={formData.pitches}
            prices={formData.pitchPrices}
            onPitchesChange={(newPitches) =>
              handleChange("pitches", newPitches)
            }
            onPricesChange={(newPrices) =>
              handleChange("pitchPrices", newPrices)
            }
            openTime={
              formData.timeStart?.length === 5
                ? `${formData.timeStart}:00`
                : formData.timeStart
            }
            closeTime={
              formData.timeEnd?.length === 5
                ? `${formData.timeEnd}:00`
                : formData.timeEnd
            }
          />
        </div>

        {/* CỘT PHẢI: CHIẾM 1 PHẦN - VẬN HÀNH & MEDIA */}
        <div className="space-y-8">
          <OperatingHours
            timeStart={formData.timeStart}
            timeEnd={formData.timeEnd}
            onChange={(name, value) => handleChange(name, value)}
          />

          <MediaSection
            avatar={formData.imageAvatar}
            images={formData.imageClubs}
            onAvatarChange={(val) => handleChange("imageAvatar", val)}
            onImagesChange={(newImages) =>
              handleChange("imageClubs", newImages)
            }
          />

          {/* 6. DANGER ZONE (NÚT XÓA) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-red-100 dark:border-red-900/20 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="font-bold text-red-600 uppercase text-xs tracking-wider">
                Vùng nguy hiểm
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
              Một khi đã xóa, bạn sẽ không thể khôi phục lại dữ liệu sân bóng
              này. Mọi lịch sử và thông tin sẽ bị xóa bỏ.
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={handleDeleteClub}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-100 hover:border-red-600 py-3 rounded-2xl text-xs font-black transition-all disabled:opacity-50"
            >
              <Trash2 size={16} /> XÓA CÂU LẠC BỘ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
