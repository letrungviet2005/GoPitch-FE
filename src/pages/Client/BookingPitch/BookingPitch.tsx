import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { getClubById } from "../../../services/clubService";
import {
  getCalendarsByDate,
  isSlotBooked,
} from "../../../services/calendarService";
import type {
  BookingSlot,
  ClubDetail,
  Pitch,
} from "../../../types/api";
import styles from "./BookingPitch.module.scss";

const cx = classNames.bind(styles);

type PitchWithCalendars = Pitch & { calendars: Awaited<ReturnType<typeof getCalendarsByDate>> };

const getTodayLocal = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

const BookingPitch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pitches, setPitches] = useState<PitchWithCalendars[]>([]);
  const [clubInfo, setClubInfo] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([]);
  const [selectionMessage, setSelectionMessage] = useState("");

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

  const timeLabels = useMemo(() => [...new Set(pitches.flatMap(pitch =>
    pitch.calendars.filter(c => c.startTime.startsWith(`${selectedDate}T`))
      .map(c => c.startTime.split("T")[1].substring(0, 5))
  ))].sort(), [pitches, selectedDate]);

  const isPastSlot = (date: string, time: string) =>
    new Date(`${date}T${time}:00`).getTime() <= Date.now();

  const fetchBookingData = useCallback(async (isCurrent: () => boolean) => {
    if (!selectedDate || !id) return;
    try {
      setLoading(true);
      const club = await getClubById(id);
      if (!isCurrent()) return;
      setClubInfo(club);

      const pitchData = await Promise.all(
        (club.pitches || []).map(async (p) => {
          try {
            const calendars = await getCalendarsByDate(p.id, selectedDate);
            return { ...p, calendars };
          } catch {
            return { ...p, calendars: [] };
          }
        }),
      );
      if (isCurrent()) setPitches(pitchData);
    } catch (err) {
      if (isCurrent()) {
        setPitches([]);
        setSelectionMessage("Không tải được lịch. Vui lòng thử lại.");
      }
      console.error("Lỗi API:", err);
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    let current = true;
    setSelectedSlots([]);
    setSelectionMessage("");
    void fetchBookingData(() => current);
    return () => { current = false; };
  }, [fetchBookingData]);

  const handleCellClick = (pitch: PitchWithCalendars, time: string) => {
    if (loading || isPastSlot(selectedDate, time)) return;

    const calendar = pitch.calendars.find(c => c.startTime.split("T")[1]?.substring(0,5) === time);
    if (!calendar || !calendar.active) return;
    const price = calendar.price;
    if (price <= 0) return;

    if (isSlotBooked(pitch.calendars, time)) return;

    const slotKey = `${pitch.id}-${time}`;
    const exists = selectedSlots.some(s => s.slotKey === slotKey);
    if (!exists && selectedSlots.some(s => s.pitchId !== pitch.id)) {
      setSelectionMessage("Mỗi lần đặt chỉ chọn một sân con. Hãy xóa lựa chọn hiện tại để đổi sân.");
      return;
    }
    const next = exists ? selectedSlots.filter(s => s.slotKey !== slotKey) : [
      ...selectedSlots,
      { slotKey, calendarId: calendar.id, pitchId: pitch.id, pitchName: pitch.name,
        time, date: selectedDate, price },
    ];
    next.sort((a, b) => a.time.localeCompare(b.time));
    const calendars = next.map(s => pitch.calendars.find(c => c.id === s.calendarId));
    const valid = calendars.every((c, index) => c &&
      new Date(c.endTime).getTime() - new Date(c.startTime).getTime() === 60 * 60 * 1000 &&
      (index === 0 || new Date(calendars[index - 1]!.endTime).getTime() === new Date(c.startTime).getTime()));
    if (!valid) {
      setSelectionMessage(exists
        ? "Không thể bỏ ô giữa vì sẽ làm lịch bị ngắt quãng. Hãy bỏ ô đầu/cuối hoặc xóa tất cả."
        : "Hãy chọn khung giờ 60 phút liền kề trước hoặc sau các ô đang chọn.");
      return;
    }
    if (next.length > 12) {
      setSelectionMessage("Mỗi lần đặt tối đa 12 khung giờ liên tục.");
      return;
    }
    setSelectedSlots(next);
    setSelectionMessage("");
  };

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
                setSelectionMessage("");
              }}
            >
              <span className={cx("day-name")}>{opt.dayName}</span>
              <span className={cx("date-num")}>{opt.dateNum}</span>
            </div>
          ))}
        </div>
      </div>

      <p>Chọn tối đa 12 khung giờ liên tục trên cùng một sân con. Mỗi ô là 60 phút.</p>
      {selectionMessage && <p role="alert">{selectionMessage}</p>}
      {selectedSlots.length > 0 && <button type="button" onClick={() => {
        setSelectedSlots([]); setSelectionMessage("");
      }}>Xóa lựa chọn</button>}
      {loading && <p role="status">Đang tải lịch…</p>}
      {!loading && !timeLabels.length && <p>Chưa có lịch cho ngày đã chọn.</p>}
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
                  const booked = isSlotBooked(p.calendars, t);
                  const isSelected = selectedSlots.some(
                    (s) => s.slotKey === `${p.id}-${t}`,
                  );
                  const calendar = p.calendars.find(c => c.startTime.startsWith(`${selectedDate}T${t}:`));
                  const price = calendar?.price ?? 0;
                  const isPast = isPastSlot(selectedDate, t);
                  const hasNoPrice = price <= 0 || !calendar || !calendar.active;

                  return (
                    <td
                      key={t}
                      title={calendar ? `${t} – ${calendar.endTime.split("T")[1]?.substring(0, 5)}` : "Chưa có lịch"}
                      className={cx("cell", {
                        booked,
                        selected: isSelected,
                        past: isPast,
                        "no-price": (hasNoPrice || isPast) && !booked,
                      })}
                      onClick={() =>
                        !booked &&
                        !isPast &&
                        !hasNoPrice &&
                        handleCellClick(p, t)
                      }
                    >
                      {booked ? (
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
          disabled={loading || selectedSlots.length === 0}
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
