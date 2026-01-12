import React, { useState, useRef, useEffect } from "react";
import { Trash2, X, Plus, Tag, Package, ChevronDown } from "lucide-react";

// --- TYPES ---
export interface ExtraService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface ExtraServiceProps {
  services: ExtraService[];
  onAddService: () => void;
  onUpdateService: (id: string, field: keyof ExtraService, value: any) => void;
  onRemoveService: (id: string) => void;
}

// --- COMPONENT CHỌN ĐƠN VỊ TÍNH NHANH ---
const UnitPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const units = ["Chai", "Lon", "Bộ", "Trận", "Giờ", "Gói", "Thùng", "Người"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-32" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-all ${
          isOpen ? "ring-2 ring-blue-100 border-blue-500" : ""
        }`}
      >
        <span className="text-xs font-bold text-gray-600">
          {value || "Đơn vị"}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {units.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                onChange(u);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                value === u
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-50 text-gray-600"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export const ExtraServiceSection = ({
  services,
  onAddService,
  onUpdateService,
  onRemoveService,
}: ExtraServiceProps) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800">Dịch vụ đi kèm</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Nước uống, Thuê đồ, Dụng cụ...
            </p>
          </div>
        </div>

        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={16} />
          THÊM DỊCH VỤ
        </button>
      </div>

      {/* List Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="col-span-full py-10 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-gray-300">
            <Package size={48} className="mb-2 opacity-20" />
            <p className="text-sm font-bold">Chưa có dịch vụ nào được thêm</p>
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className="group flex flex-col gap-3 p-4 bg-gray-50 border-2 border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl rounded-[2rem] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                {/* Tên dịch vụ */}
                <div className="flex-1 relative">
                  <Tag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    size={14}
                  />
                  <input
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-blue-50 border border-transparent focus:border-blue-200 shadow-sm"
                    placeholder="Tên dịch vụ..."
                    value={svc.name}
                    onChange={(e) =>
                      onUpdateService(svc.id, "name", e.target.value)
                    }
                  />
                </div>

                {/* Nút xóa nhanh */}
                <button
                  onClick={() => onRemoveService(svc.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Giá tiền */}
                <div className="flex-1 relative group/price">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400">
                    VNĐ
                  </div>
                  <input
                    type="number"
                    className="w-full pl-12 pr-3 py-2 bg-white rounded-xl text-sm font-black text-blue-600 outline-none border border-transparent focus:border-blue-200 shadow-sm"
                    placeholder="0"
                    value={svc.price}
                    onChange={(e) =>
                      onUpdateService(svc.id, "price", +e.target.value)
                    }
                  />
                </div>

                {/* Chọn đơn vị tính linh hoạt */}
                <UnitPicker
                  value={svc.unit}
                  onChange={(val) => onUpdateService(svc.id, "unit", val)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
