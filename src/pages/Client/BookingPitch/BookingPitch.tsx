import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import axios from "axios";
import styles from "./BookingPitch.module.scss";

const cx = classNames.bind(styles);

const getTodayLocal = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

const BookingPitch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pitches, setPitches] = useState([]);
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [selectedSlots, setSelectedSlots] = useState([]);

  // --- 1. TẠO DANH SÁCH 7 NGÀY ĐỂ CHỌN NHANH ---
  const dateOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

      options.push({
        fullDate: isoDate,
        dayName:
          i === 0
            ? "Hôm nay"
            : d.toLocaleDateString("vi-VN", { weekday: "short" }),
        dateNum: d.getDate(),
      });
    }
    return options;
  }, []);

  const timeLabels = useMemo(() => {
    const arr = [];
    for (let h = 5; h <= 22; h++) {
      arr.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return arr;
  }, []);

  // --- 2. LOGIC KIỂM TRA GIỜ ĐÃ QUA ---
  const isPastSlot = (date, time) => {
    const today = getTodayLocal();
    if (date < today) return true;
    if (date > today) return false;

    const now = new Date();
    const [slotHour] = time.split(":").map(Number);
    // Khóa các giờ nhỏ hơn hoặc bằng giờ hiện tại
    return slotHour <= now.getHours();
  };

  const getPriceForTime = (pitchId, time) => {
    if (!clubInfo?.pitchPrices) return 0;
    const match = clubInfo.pitchPrices.find((p) => {
      const isSamePitch = String(p.pitchId) === String(pitchId);
      const start = p.timeStart.substring(0, 5);
      const end = p.timeEnd.substring(0, 5);
      return isSamePitch && time >= start && time < end;
    });
    return match ? match.price : 0;
  };

  const fetchBookingData = useCallback(async () => {
    if (!selectedDate || !id) return;
    try {
      setLoading(true);
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const clubRes = await axios.get(
        `http://localhost:8080/api/v1/clubs/${id}`,
        { headers }
      );
      const club = clubRes.data.result || clubRes.data;
      setClubInfo(club);

      const pitchData = await Promise.all(
        (club.pitches || []).map(async (p) => {
          try {
            const calRes = await axios.get(
              `http://localhost:8080/api/v1/calendars`,
              {
                headers,
                params: { pitchId: p.id, date: selectedDate },
              }
            );
            return { ...p, calendars: calRes.data || [] };
          } catch (e) {
            return { ...p, calendars: [] };
          }
        })
      );
      setPitches(pitchData);
    } catch (err) {
      console.error("Lỗi API:", err);
    } finally {
      setLoading(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  const handleCellClick = (pitch, time) => {
    if (isPastSlot(selectedDate, time)) return;

    const price = getPriceForTime(pitch.id, time);
    if (price <= 0) return;

    const isBooked = pitch.calendars.some(
      (c) => c.startTime?.split("T")[1]?.substring(0, 5) === time
    );
    if (isBooked) return;

    const slotKey = `${pitch.id}-${time}`;
    const exists = selectedSlots.some((s) => s.slotKey === slotKey);

    if (exists) {
      setSelectedSlots(selectedSlots.filter((s) => s.slotKey !== slotKey));
    } else {
      setSelectedSlots([
        ...selectedSlots,
        {
          slotKey,
          pitchId: pitch.id,
          pitchName: pitch.name,
          time,
          date: selectedDate,
          price,
        },
      ]);
    }
  };

  // --- FIX LỖI: TÍNH TỔNG TIỀN ---
  const totalAmount = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  if (loading && !clubInfo)
    return <div className={cx("loading")}>Đang tải...</div>;

  return (
    <div className={cx("booking-container")}>
      <header className={cx("header-top")}>
        <div className={cx("club-info")}>
          <h1>{clubInfo?.name}</h1>
          <p>📍 {clubInfo?.address}</p>
        </div>
        <button className={cx("back-btn")} onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </header>

      {/* BỘ CHỌN NGÀY DẠNG TAB */}
      <div className={cx("date-selector-container")}>
        <div className={cx("date-tabs")}>
          {dateOptions.map((opt) => (
            <div
              key={opt.fullDate}
              className={cx("date-tab", {
                active: selectedDate === opt.fullDate,
              })}
              onClick={() => {
                setSelectedDate(opt.fullDate);
                setSelectedSlots([]);
              }}
            >
              <span className={cx("day-name")}>{opt.dayName}</span>
              <span className={cx("date-num")}>{opt.dateNum}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={cx("table-container")}>
        <table className={cx("booking-table")}>
          <thead>
            <tr>
              <th className={cx("sticky-col")}>SÂN CON</th>
              {timeLabels.map((t) => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pitches.map((p) => (
              <tr key={p.id}>
                <td className={cx("sticky-col")}>{p.name}</td>
                {timeLabels.map((t) => {
                  const isBooked = p.calendars.some(
                    (c) => c.startTime?.split("T")[1]?.substring(0, 5) === t
                  );
                  const isSelected = selectedSlots.some(
                    (s) => s.slotKey === `${p.id}-${t}`
                  );
                  const price = getPriceForTime(p.id, t);
                  const isPast = isPastSlot(selectedDate, t);
                  const hasNoPrice = price <= 0;

                  return (
                    <td
                      key={t}
                      className={cx("cell", {
                        booked: isBooked,
                        selected: isSelected,
                        past: isPast,
                        "no-price": (hasNoPrice || isPast) && !isBooked,
                      })}
                      onClick={() =>
                        !isBooked &&
                        !isPast &&
                        !hasNoPrice &&
                        handleCellClick(p, t)
                      }
                    >
                      {isBooked ? (
                        <span className={cx("icon")}>✕</span>
                      ) : isPast ? (
                        <span className={cx("disabled-text")}>--</span>
                      ) : hasNoPrice ? (
                        <span className={cx("disabled-text")}>--</span>
                      ) : (
                        <div className={cx("slot-content")}>
                          {isSelected && (
                            <div className={cx("check-mark")}>✓</div>
                          )}
                          <span className={cx("price-tag")}>
                            {price / 1000}k
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={cx("footer")}>
        <div className={cx("price-info")}>
          <h4>TỔNG THANH TOÁN ({selectedSlots.length} ô)</h4>
          <p className={cx("total-price")}>
            {totalAmount.toLocaleString()} VNĐ
          </p>
        </div>
        <button
          className={cx("next-btn")}
          disabled={selectedSlots.length === 0}
          onClick={() =>
            navigate("/payment", {
              state: {
                selectedSlots,
                totalAmount,
                clubId: id,
                clubName: clubInfo?.name,
              },
            })
          }
        >
          TIẾP TỤC ĐẶT SÂN
        </button>
      </footer>
    </div>
  );
};

export default BookingPitch;
