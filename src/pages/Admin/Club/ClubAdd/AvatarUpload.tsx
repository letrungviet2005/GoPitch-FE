import React from "react";
import { Camera, Loader2, X } from "lucide-react";

interface AvatarUploadProps {
  url: string;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const AvatarUpload = ({
  url,
  isUploading,
  onUpload,
  onRemove,
}: AvatarUploadProps) => (
  <div className="relative group w-32 h-32 mx-auto">
    <div className="w-full h-full rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50">
      {url ? (
        <img src={url} className="w-full h-full object-cover" alt="avatar" />
      ) : (
        <div className="text-center p-2">
          {isUploading ? (
            <Loader2 className="animate-spin text-blue-500 mx-auto" />
          ) : (
            <Camera className="text-gray-400 mx-auto" />
          )}
          <p className="text-[10px] text-gray-400 mt-1 font-bold">
            ẢNH ĐẠI DIỆN
          </p>
        </div>
      )}
    </div>
    <label className="absolute inset-0 cursor-pointer">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onUpload}
      />
    </label>
    {url && (
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
      >
        <X size={14} />
      </button>
    )}
  </div>
);
