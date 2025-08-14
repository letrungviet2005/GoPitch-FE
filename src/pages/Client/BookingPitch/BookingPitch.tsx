import React from "react";
import classNames from "classnames/bind";
import styles from "./BookingPitch.module.scss";

const cx = classNames.bind(styles);

const BookingPitch = () => {
  const startTime = "6:00";
  const endTime = "22:00";
  const stepMinutes = 30;

  const courts = [
    "C.Lông 1",
    "C.Lông 2",
    "C.Lông 3",
    "C.Lông 4",
    "C.Lông 5",
    "C.Lông 6",
  ];

  // Hàm tạo slot
  const generateSlots = (start, end, step) => {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      slots.push(`${h}:${m.toString().padStart(2, "0")}`);
      m += step;
      if (m >= 60) {
        h++;
        m = m % 60;
      }
    }
    return slots;
  };

  const slots = generateSlots(startTime, endTime, stepMinutes);

  // Các ô booked (sân + giờ)
  const booked = [
    { court: "C.Lông 1", time: "7:00" },
    { court: "C.Lông 2", time: "9:30" },
    { court: "C.Lông 3", time: "18:30" },
    { court: "C.Lông 4", time: "19:00" },
    { court: "C.Lông 5", time: "20:00" },
  ];

  // Các ô locked (sân + giờ)
  const locked = [
    { court: "C.Lông 1", time: "6:00" },
    { court: "C.Lông 1", time: "8:00" },
    { court: "C.Lông 1", time: "10:30" },
  ];

  // Các ô event (sân + giờ)
  const events = [{ court: "Sân 6", time: "15:00" }];

  const getStatus = (court, time) => {
    if (booked.some((b) => b.court === court && b.time === time))
      return "booked";
    if (locked.some((l) => l.court === court && l.time === time))
      return "locked";
    if (events.some((e) => e.court === court && e.time === time))
      return "event";
    return "available";
  };

  return (
    <div className={cx("booking-container")}>
      <header className={cx("header")}>
        <div className={cx("legend")}>
          <span className={cx("legend-item", "available")}>Trống</span>
          <span className={cx("legend-item", "booked")}>Đã đặt</span>
          <span className={cx("legend-item", "locked")}>Khoá</span>
          <span className={cx("legend-item", "event")}>Sự kiện</span>
          <a href="#">Xem sân & bảng giá</a>
        </div>
        <div className={cx("date-picker")}>
          <button>📅 11/08/2025</button>
        </div>
      </header>

      <div className={cx("table-wrapper")}>
        <table className={cx("booking-table")}>
          <thead>
            <tr>
              <th></th>
              {slots.map((time, idx) => (
                <th key={idx}>{time}</th>
              ))}
              <th>{endTime}</th> {/* Vạch cuối */}
            </tr>
          </thead>
          <tbody>
            {courts.map((court, rowIndex) => (
              <tr key={rowIndex}>
                <td className={cx("court-name")}>{court}</td>
                {slots.map((time, colIndex) => (
                  <td
                    key={colIndex}
                    className={cx("cell", getStatus(court, time))}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cx("note")}>
        <strong>Lưu ý:</strong> Nếu bạn cần đặt lịch cố định vui lòng liên hệ:{" "}
        <b>0374.857.068</b>
      </div>

      <div className={cx("footer")}>
        <button className={cx("next-btn")}>TIẾP THEO</button>
      </div>
    </div>
  );
};

export default BookingPitch;
