import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Booked.module.scss";

const cx = classNames.bind(styles);

const Booked = () => {
  // Dữ liệu mẫu
  const customer = {
    name: "Nguyễn Văn A",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: "https://i.pravatar.cc/100?img=5", // ảnh mẫu
    bookerName: "Nguyễn Văn A",
  };

  const bookings = [
    { court: "C.Lông 1", time: "7:00 - 7:30", price: 80000 },
    { court: "C.Lông 1", time: "7:30 - 8:00", price: 80000 },
    { court: "C.Lông 2", time: "9:00 - 9:30", price: 90000 },
  ];

  const totalPrice = bookings.reduce((sum, b) => sum + b.price, 0);

  const [transferImage, setTransferImage] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransferImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className={cx("booked-container")}>
      {/* Thông tin khách hàng */}
      <div className={cx("customer-info")}>
        <img src={customer.avatar} alt="avatar" className={cx("avatar")} />
        <div className={cx("details")}>
          <h2>{customer.name}</h2>
          <p>
            <strong>Địa chỉ:</strong> {customer.address}
          </p>
          <p>
            <strong>Người đặt:</strong> {customer.bookerName}
          </p>
        </div>
      </div>

      {/* Danh sách khung giờ */}
      <div className={cx("booking-list")}>
        <h3>Chi tiết đặt sân</h3>
        <table className={cx("booking-table")}>
          <thead>
            <tr>
              <th>Sân</th>
              <th>Khung giờ</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={idx}>
                <td>{b.court}</td>
                <td>{b.time}</td>
                <td>{b.price.toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={cx("total-price")}>
          <strong>Tổng cộng:</strong> {totalPrice.toLocaleString()}₫
        </div>
      </div>

      {/* Upload ảnh chuyển khoản */}
      <div className={cx("upload-section")}>
        <h3>Xác nhận chuyển khoản</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          id="upload"
          hidden
        />
        <label htmlFor="upload" className={cx("upload-btn")}>
          📤 Tải ảnh
        </label>
        {transferImage && (
          <div className={cx("preview")}>
            <img src={transferImage} alt="Xác nhận" />
          </div>
        )}
      </div>

      {/* Nút xác nhận */}
      <div className={cx("footer")}>
        <button className={cx("confirm-btn")}>Xác nhận đặt sân</button>
      </div>
    </div>
  );
};

export default Booked;
