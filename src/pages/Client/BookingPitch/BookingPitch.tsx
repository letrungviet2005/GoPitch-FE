import React from "react";
import classNames from "classnames/bind";
import styles from "./BookingPitch.module.scss";

const cx = classNames.bind(styles);

const BookingPitch = () => {
  const courts = ["Sân 1", "Sân 2", "Sân 3", "Sân 4", "Sân 5", "Sân 6"];
  const times = [
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  // Các ô booked (sân + giờ)
  const booked = [
    { court: "Sân 1", time: "7:00" },
    { court: "Sân 3", time: "9:30" },
    { court: "Sân 2", time: "18:30" },
    { court: "Sân 2", time: "19:00" },
    { court: "Sân 4", time: "20:00" },
  ];

  // Các ô locked (sân + giờ)
  const locked = [
    { court: "Sân 1", time: "6:00" },
    { court: "Sân 4", time: "8:00" },
    { court: "Sân 5", time: "10:30" },
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
              {times.map((time, index) => (
                <th key={index}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courts.map((court, rowIndex) => (
              <tr key={rowIndex}>
                <td className={cx("court-name")}>{court}</td>
                {times.map((time, colIndex) => (
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
