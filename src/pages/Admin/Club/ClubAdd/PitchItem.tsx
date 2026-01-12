import { useEffect, useRef, useState } from "react";
import {
  Trash2,
  X,
  ChevronDown,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
// --- TYPES ---
const TimePickerDropdown = ({
  label,
  value,
  onChange,
  colorClass,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  colorClass: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chấp nhận cả định dạng HH:mm:ss từ JSON của bạn
  const parts = value?.split(":") || ["00", "00"];
  const currentHour = parts[0].padStart(2, "0");
  const currentMin = parts[1].padStart(2, "0");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

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

  // Hàm xử lý chọn giờ/phút không làm đóng dropdown ngay lập tức trừ khi chọn phút
  const handleSelect = (e: React.MouseEvent, type: "h" | "m", val: string) => {
    e.preventDefault();
    e.stopPropagation(); // NGĂN CHẶN sự kiện click lan ra ngoài gây đóng dropdown

    if (type === "h") {
      // Giữ nguyên giây :00 nếu data của bạn cần HH:mm:ss
      onChange(`${val}:${currentMin}:00`);
    } else {
      onChange(`${currentHour}:${val}:00`);
      // Chỉ đóng khi người dùng đã chọn xong cả Phút (hoặc có thể bỏ dòng này nếu muốn họ chọn thoải mái)
      // setIsOpen(false);
    }
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <label className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-bold text-gray-400 uppercase z-10">
        {label}
      </label>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-all shadow-sm ${
          isOpen ? "ring-2 ring-blue-100 border-blue-500" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock size={14} className={colorClass} />
          <span className="text-sm font-bold text-gray-700">
            {value ? `${currentHour}:${currentMin}` : "Chọn giờ"}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-3 animate-in fade-in zoom-in duration-150"
          onClick={(e) => e.stopPropagation()} // Click bên trong dropdown không làm nó đóng
        >
          <div className="flex gap-3 h-48">
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <p className="text-[10px] font-bold text-gray-400 mb-2 sticky top-0 bg-white">
                GIỜ
              </p>
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={(e) => handleSelect(e, "h", h)}
                  className={`w-full text-center py-1.5 rounded-lg text-xs mb-1 transition-colors ${
                    currentHour === h
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-[10px] font-bold text-gray-400 mb-2 sticky top-0 bg-white">
                PHÚT
              </p>
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={(e) => handleSelect(e, "m", m)}
                  className={`w-full text-center py-1.5 rounded-lg text-xs mb-1 transition-colors ${
                    currentMin === m
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH PITCHITEM ---
export const PitchItem = ({
  pitch,
  prices,
  onPitchNameChange,
  onRemovePitch,
  onAddPrice,
  onUpdatePrice,
  onRemovePrice,
}: PitchItemProps) => {
  const currentPitchPrices = prices.filter((pr) => pr.pitchId === pitch.id);

  const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const checkOverlap = (current: Price, allPrices: Price[]) => {
    if (!current.timeStart || !current.timeEnd) return null;
    const start = timeToMinutes(current.timeStart);
    const end = timeToMinutes(current.timeEnd);

    if (start >= end) return "Giờ kết thúc phải lớn hơn bắt đầu";

    const isOverlapped = allPrices.some((p) => {
      if (p.id === current.id) return false;
      const pStart = timeToMinutes(p.timeStart);
      const pEnd = timeToMinutes(p.timeEnd);
      return start < pEnd && end > pStart;
    });

    return isOverlapped ? "Khung giờ bị trùng lặp" : null;
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl mb-10 overflow-visible relative">
      {/* Nút Xóa sân ở góc */}
      <button
        onClick={onRemovePitch}
        className="absolute -top-3 -right-3 bg-white text-red-400 p-2.5 rounded-full shadow-lg hover:text-red-600 hover:scale-110 transition-all border border-red-50 z-20"
      >
        <Trash2 size={20} />
      </button>

      {/* Header: Tên sân */}
      <div className="flex items-center gap-4 mb-8 px-2">
        <div className="bg-blue-600 w-2.5 h-10 rounded-full shadow-lg shadow-blue-200"></div>
        <div className="flex-1">
          <input
            className="w-full text-3xl font-black text-gray-800 bg-transparent outline-none placeholder:text-gray-200"
            value={pitch.name}
            placeholder="Tên sân (VD: Sân A)..."
            onChange={(e) => onPitchNameChange(e.target.value)}
          />
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-1">
            Cấu hình khung giờ & giá
          </p>
        </div>
      </div>

      {/* Danh sách khung giờ */}
      <div className="space-y-5">
        {currentPitchPrices.map((pr) => {
          const error = checkOverlap(pr, currentPitchPrices);

          return (
            <div key={pr.id} className="group flex flex-col gap-2">
              <div
                className={`grid grid-cols-12 gap-4 p-4 rounded-[2rem] items-center transition-all ${
                  error
                    ? "bg-red-50 border-2 border-red-100 shadow-inner"
                    : "bg-gray-50 border-2 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-xl"
                }`}
              >
                {/* Tên khung giờ */}
                <div className="col-span-12 lg:col-span-2">
                  <input
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-600 shadow-sm outline-none focus:ring-2 ring-blue-100"
                    placeholder="Tên khung"
                    value={pr.name}
                    onChange={(e) =>
                      onUpdatePrice(pr.id, "name", e.target.value)
                    }
                  />
                </div>

                {/* BỘ CHỌN GIỜ LINH HOẠT (DROPDOWN) */}
                <div className="col-span-12 lg:col-span-6 flex items-center gap-3">
                  <TimePickerDropdown
                    label="Bắt đầu"
                    value={pr.timeStart}
                    colorClass="text-blue-500"
                    onChange={(val) => onUpdatePrice(pr.id, "timeStart", val)}
                  />
                  <div className="flex items-center justify-center p-2 bg-gray-200 rounded-full">
                    <ChevronRight size={14} className="text-gray-500" />
                  </div>
                  <TimePickerDropdown
                    label="Kết thúc"
                    value={pr.timeEnd}
                    colorClass="text-orange-500"
                    onChange={(val) => onUpdatePrice(pr.id, "timeEnd", val)}
                  />
                </div>

                {/* Giá tiền */}
                <div className="col-span-10 lg:col-span-3 relative flex items-center shadow-lg shadow-blue-50 rounded-2xl overflow-hidden">
                  <div className="absolute left-4 text-xs font-bold text-blue-300">
                    VNĐ
                  </div>
                  <input
                    type="number"
                    className="w-full pl-14 pr-4 py-3 bg-blue-600 text-white text-sm font-black outline-none placeholder:text-blue-300"
                    placeholder="0"
                    value={pr.price}
                    onChange={(e) =>
                      onUpdatePrice(pr.id, "price", +e.target.value)
                    }
                  />
                </div>

                {/* Xóa khung giờ */}
                <button
                  onClick={() => onRemovePrice(pr.id)}
                  className="col-span-2 lg:col-span-1 flex justify-center text-gray-300 hover:text-red-500 transition-all hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <div className="flex items-center gap-2 px-5 text-[11px] text-red-500 font-black italic uppercase tracking-tighter animate-pulse">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Nút Thêm khung giờ */}
        <button
          type="button"
          onClick={onAddPrice}
          className="w-full py-5 bg-blue-50 border-2 border-dashed border-blue-200 rounded-[2rem] text-xs text-blue-600 font-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex justify-center items-center gap-3 group shadow-sm"
        >
          <div className="bg-white text-blue-600 p-1.5 rounded-xl group-hover:rotate-90 transition-transform duration-300 shadow-md">
            <X size={18} className="rotate-45" />
          </div>
          THÊM KHUNG GIỜ GIÁ CHO SÂN NÀY
        </button>
      </div>
    </div>
  );
};
