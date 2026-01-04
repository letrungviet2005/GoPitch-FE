import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import axios from "axios";
import styles from "./BookingPitch.module.scss";

const cx = classNames.bind(styles);

const BookingPitch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubInfo, setClubInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlots, setSelectedSlots] = useState([]);

  const timeLabels = useMemo(() => {
    const labels = [];
    for (let h = 5; h <= 22; h++) {
      labels.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return labels;
  }, []);

  const getPriceForTime = (timeLabel) => {
    if (!clubInfo?.pitchPrices) return 0;
    const match = clubInfo.pitchPrices.find((p) => {
      const start = p.timeStart.substring(0, 5);
      const end = p.timeEnd.substring(0, 5);
      return timeLabel >= start && timeLabel < end;
    });
    return match ? match.price : 0;
  };

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const clubRes = await axios.get(
        `http://localhost:8080/api/v1/clubs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = clubRes.data.result || clubRes.data;
      setClubInfo(result);

      const pitchesWithCals = await Promise.all(
        (result.pitches || []).map(async (p) => {
          const calRes = await axios.get(
            `http://localhost:8080/api/v1/calendars?pitchId=${p.id}&date=${selectedDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return { ...p, calendars: calRes.data || [] };
        })
      );
      setPitches(pitchesWithCals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookingData();
  }, [id, selectedDate]);

  const handleCellClick = (pitch, time) => {
    const isBooked = pitch.calendars.some(
      (c) => c.startTime.split("T")[1].substring(0, 5) === time
    );
    if (isBooked) return;

    const slotKey = `${pitch.id}-${time}`;
    const isSelected = selectedSlots.some((s) => s.slotKey === slotKey);

    if (isSelected) {
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
          price: getPriceForTime(time),
        },
      ]);
    }
  };

  const totalAmount = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  if (loading)
    return <div className={cx("loading")}>Đang tải dữ liệu sân...</div>;

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

      <div className={cx("controls-bar")}>
        <div className={cx("date-picker-wrapper")}>
          <label>Chọn ngày đặt:</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className={cx("legend")}>
          <div className={cx("legend-item", "available")}>
            <div className={cx("box")}></div> Trống
          </div>
          <div className={cx("legend-item", "booked")}>
            <div className={cx("box")}></div> Đã đặt
          </div>
          <div className={cx("legend-item", "selected")}>
            <div className={cx("box")}></div> Đang chọn
          </div>
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
                    (c) => c.startTime.split("T")[1].substring(0, 5) === t
                  );
                  const isSelected = selectedSlots.some(
                    (s) => s.slotKey === `${p.id}-${t}`
                  );
                  const price = getPriceForTime(t);

                  return (
                    <td
                      key={t}
                      className={cx("cell", {
                        booked: isBooked,
                        selected: isSelected,
                      })}
                      onClick={() => handleCellClick(p, t)}
                    >
                      {isBooked ? (
                        "✕"
                      ) : (
                        <>
                          {isSelected && (
                            <div style={{ fontSize: "18px" }}>✓</div>
                          )}
                          <span className={cx("price-tag")}>
                            {price > 0 ? `${price / 1000}k` : "--"}
                          </span>
                        </>
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
          <p>{totalAmount.toLocaleString()} VNĐ</p>
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
