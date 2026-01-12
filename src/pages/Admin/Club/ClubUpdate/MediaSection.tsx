import React, { useState } from "react";
import {
  ImageIcon,
  Plus,
  Trash2,
  RefreshCcw,
  Upload,
  Loader2,
} from "lucide-react";

const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dc5dzscp5/image/upload";

interface MediaSectionProps {
  avatar: string;
  images: any[];
  onAvatarChange: (url: string) => void;
  onImagesChange: (newImages: any[]) => void;
}

export default function MediaSection({
  avatar,
  images,
  onAvatarChange,
  onImagesChange,
}: MediaSectionProps) {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // --- HÀM UPLOAD CHUNG ---
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; // Trả về link ảnh sau khi upload thành công
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Không thể tải ảnh lên, vui lòng thử lại!");
      return null;
    }
  };

  // --- XỬ LÝ AVATAR ---
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const url = await uploadImage(file);
    if (url) onAvatarChange(url);
    setIsUploadingAvatar(false);
  };

  // --- XỬ LÝ GALLERY ---
  const handleGallerySelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    const uploadPromises = files.map((file) => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    const newImages = uploadedUrls
      .filter((url) => url !== null)
      .map((url) => ({ imageUrl: url }));

    onImagesChange([...images, ...newImages]);
    setIsUploadingGallery(false);
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 1. Avatar Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <ImageIcon className="text-blue-500" size={20} /> Ảnh đại diện chính
        </h2>

        <div className="relative group aspect-video mb-4 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
          {isUploadingAvatar ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className="text-[10px] font-bold text-slate-400">
                ĐANG TẢI LÊN...
              </span>
            </div>
          ) : avatar ? (
            <>
              <img
                src={avatar}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarSelect}
                  accept="image/*"
                />
                <span className="text-white text-xs font-medium flex items-center gap-2">
                  <RefreshCcw size={14} /> Thay đổi ảnh
                </span>
              </label>
            </>
          ) : (
            <label className="text-center cursor-pointer hover:bg-slate-200/50 w-full h-full flex flex-col items-center justify-center transition-colors">
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarSelect}
                accept="image/*"
              />
              <Upload className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-[10px] text-slate-400 uppercase font-bold">
                Bấm để tải ảnh lên
              </p>
            </label>
          )}
        </div>
      </section>

      {/* 2. Image Gallery Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Thư viện ảnh
              <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                {images.length}
              </span>
            </h2>
          </div>

          <label
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isUploadingGallery
                ? "bg-slate-200 text-slate-500"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleGallerySelect}
              accept="image/*"
              disabled={isUploadingGallery}
            />
            {isUploadingGallery ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Đang tải...
              </>
            ) : (
              <>
                <Plus size={16} /> Thêm ảnh
              </>
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100"
            >
              <img
                src={img.imageUrl}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt="Gallery"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {images.length === 0 && !isUploadingGallery && (
            <div className="col-span-full py-12 border-2 border-dashed border-slate-100 rounded-3xl text-center">
              <ImageIcon className="mx-auto text-slate-200 mb-2" size={40} />
              <p className="text-slate-400 text-sm italic">
                Chưa có ảnh nào trong thư viện
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
