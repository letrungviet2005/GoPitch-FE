import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getOwnerClubs } from "../../../services/adminService";

interface Club {
  id: number;
  name: string;
  address: string;
  active: boolean;
  imageAvatar?: string;
}

interface PredictionItem {
  hour: number;
  predicted_booking: number;
  status: string;
  action: string;
}

interface PredictData {
  badminton: PredictionItem[];
  pickleball: PredictionItem[];
}

export default function PredictionDashboard() {
  const today = new Date().toISOString().split("T")[0];

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClub, setLoadingClub] = useState(true);

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const [selectedDate, setSelectedDate] = useState(today);

  const [loadingPredict, setLoadingPredict] = useState(false);

  const [data, setData] = useState<PredictData | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoadingClub(true);

      const response = await getOwnerClubs({ size: 100 });
      setClubs(response.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClub(false);
    }
  };

  const handlePredict = async () => {
    if (!selectedClub) {
      alert("Vui lòng chọn Club");
      return;
    }

    try {
      setLoadingPredict(true);

      const date = new Date(selectedDate);

      const day = date.getDate();

      const month = date.getMonth() + 1;

      const weekday = date.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const isWeekend = weekday === "Saturday" || weekday === "Sunday" ? 1 : 0;

      const [badmintonRes, pickleballRes] = await Promise.all([
        axios.post("http://localhost:8000/predict", {
          sport_type: "Badminton",
          day,
          month,
          weekday,
          is_weekend: isWeekend,
        }),

        axios.post("http://localhost:8000/predict", {
          sport_type: "Pickleball",
          day,
          month,
          weekday,
          is_weekend: isWeekend,
        }),
      ]);

      setData({
        badminton: badmintonRes.data.prediction_result,
        pickleball: pickleballRes.data.prediction_result,
      });
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối AI Service");
    } finally {
      setLoadingPredict(false);
    }
  };

  const getClassName = (value: number) => {
    if (value <= 0.5) {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }

    if (value >= 3) {
      return "bg-sky-100 text-sky-700 border-sky-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const renderTable = (title: string, items: PredictionItem[]) => {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-[#0b5133]">{title}</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="text-left p-3 min-w-[180px]">Chỉ số</th>

                {items.map((item) => (
                  <th key={item.hour}>{item.hour}:00</th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="font-semibold bg-slate-100 rounded-xl p-3">
                  Mật độ dự kiến
                </td>

                {items.map((item) => (
                  <td
                    key={item.hour}
                    className={`border rounded-xl p-3 text-center font-semibold ${getClassName(
                      item.predicted_booking,
                    )}`}
                  >
                    {item.predicted_booking}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="font-semibold bg-slate-100 rounded-xl p-3">
                  Trạng thái
                </td>

                {items.map((item) => (
                  <td
                    key={item.hour}
                    className={`border rounded-xl p-3 text-center text-xs ${getClassName(
                      item.predicted_booking,
                    )}`}
                  >
                    {item.status}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="font-semibold bg-slate-100 rounded-xl p-3">
                  Khuyến nghị
                </td>

                {items.map((item) => (
                  <td
                    key={item.hour}
                    className={`border rounded-xl p-3 text-center text-xs ${getClassName(
                      item.predicted_booking,
                    )}`}
                  >
                    {item.action}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-[#0b5133] rounded-3xl p-10 text-center shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-white">
            DỰ ĐOÁN MẬT ĐỘ SÂN AI
          </h1>

          <p className="text-slate-200 mt-3">Chọn cụm sân để phân tích</p>
        </div>

        {loadingClub ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#0b5133]" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className={`
          cursor-pointer
          rounded-[28px]
          overflow-hidden
          bg-white
          border-2
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-2xl

          ${
            selectedClub?.id === club.id
              ? "border-green-500 shadow-green-100 shadow-xl"
              : "border-slate-200"
          }
        `}
              >
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={
                      club.imageAvatar ||
                      `https://ui-avatars.com/api/?name=${club.name}&background=random`
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />

                  {club.active ? (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      Hoạt động
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      Tạm nghỉ
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-black text-xl text-slate-800">
                    {club.name}
                  </h3>

                  <div className="flex items-start gap-2 mt-3 text-slate-500 text-sm">
                    <MapPin size={15} />
                    <span>{club.address}</span>
                  </div>

                  <button
                    className={`
              mt-5
              w-full
              py-3
              rounded-2xl
              font-bold
              transition

              ${
                selectedClub?.id === club.id
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }
            `}
                  >
                    {selectedClub?.id === club.id ? "✓ Đã chọn" : "Chọn Club"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedClub && (
          <div className="bg-white mt-8 p-6 rounded-3xl shadow">
            <h2 className="font-bold text-xl mb-4">
              Club đã chọn: {selectedClub.name}
            </h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded-xl p-3"
            />

            <button
              onClick={handlePredict}
              disabled={loadingPredict}
              className="w-full mt-4 bg-[#0b5133] text-white rounded-xl py-3 font-bold"
            >
              {loadingPredict ? "Đang phân tích..." : "PHÂN TÍCH AI"}
            </button>
          </div>
        )}

        {data && (
          <>
            {renderTable("Dự báo sân Cầu lông", data.badminton)}

            {renderTable("Dự báo sân Pickleball", data.pickleball)}
          </>
        )}
      </div>
    </div>
  );
}
