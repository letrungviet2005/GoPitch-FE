import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import axios from "axios";
import styles from "./Payment.module.scss";

const cx = classNames.bind(styles);

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ trang Booking chuyển sang
  const { selectedSlots, totalAmount, clubId, clubName } = location.state || {};

  const [userInfo, setUserInfo] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Nếu không có dữ liệu booking, đá về trang chủ
    if (!selectedSlots) {
      navigate("/");
      return;
    }

    // 2. Lấy thông tin User hiện tại (từ LocalStorage hoặc API)
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, [selectedSlots, navigate]);

  // Xử lý chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Tạo link xem trước
    }
  };

  const handleConfirmPayment = async () => {
    if (!file) {
      alert("Vui lòng tải ảnh minh chứng chuyển khoản!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // Sử dụng FormData để upload file
      const formData = new FormData();
      formData.append("paymentProof", file);
      formData.append("clubId", clubId);
      formData.append("totalAmount", totalAmount.toString());
      formData.append("slots", JSON.stringify(selectedSlots));

      // Gọi API gửi đơn đặt sân (giả sử endpoint là /bookings)
      await axios.post("http://localhost:8080/api/v1/bookings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Đặt sân thành công! Chờ chủ sân xác nhận.");
      navigate("/profile/bookings"); // Chuyển về trang lịch sử đặt sân
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi thông tin thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("payment-page")}>
      <div className={cx("container")}>
        <header className={cx("header")}>
          <h1>Thanh toán đặt sân</h1>
        </header>

        <div className={cx("content-grid")}>
          {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG */}
          <div className={cx("info-section")}>
            <section className={cx("card")}>
              <h3>
                <i className="fa-solid fa-location-dot"></i> Thông tin sân
              </h3>
              <div className={cx("detail-row")}>
                <span>Câu lạc bộ:</span>
                <strong>{clubName}</strong>
              </div>
              <div className={cx("slots-list")}>
                {selectedSlots?.map((slot: any, idx: number) => (
                  <div key={idx} className={cx("slot-item")}>
                    <span>
                      {slot.date} | {slot.time}
                    </span>
                    <span>{slot.pitchName}</span>
                    <strong>{slot.price.toLocaleString()}đ</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className={cx("card")}>
              <h3>
                <i className="fa-solid fa-user"></i> Người đặt sân
              </h3>
              <div className={cx("detail-row")}>
                <span>Họ tên:</span>
                <strong>{userInfo?.fullName || "Khách hàng"}</strong>
              </div>
              <div className={cx("detail-row")}>
                <span>Số điện thoại:</span>
                <strong>{userInfo?.phone || "Chưa cập nhật"}</strong>
              </div>
            </section>
          </div>

          {/* CỘT PHẢI: THANH TOÁN & UPLOAD */}
          <div className={cx("action-section")}>
            <section className={cx("card", "payment-card")}>
              <div className={cx("total-box")}>
                <span>Tổng số tiền:</span>
                <h2 className={cx("amount")}>
                  {totalAmount?.toLocaleString()} VNĐ
                </h2>
              </div>

              <div className={cx("bank-info")}>
                <p>Vui lòng chuyển khoản theo thông tin:</p>
                <div className={cx("bank-details")}>
                  <p>
                    Ngân hàng: <strong>MB Bank</strong>
                  </p>
                  <p>
                    Số TK: <strong>1234567890</strong>
                  </p>
                  <p>
                    Chủ TK: <strong>NGUYEN VAN A</strong>
                  </p>
                  <p>
                    Nội dung:{" "}
                    <strong>
                      {userInfo?.phone} - {clubName}
                    </strong>
                  </p>
                </div>
              </div>

              <div className={cx("upload-box")}>
                <label>Tải lên ảnh xác nhận (Bill chuyển khoản):</label>
                <div
                  className={cx("upload-area", { hasFile: !!previewUrl })}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Proof"
                      className={cx("preview-img")}
                    />
                  ) : (
                    <div className={cx("placeholder")}>
                      <span className={cx("icon")}>📷</span>
                      <p>Bấm để tải ảnh lên</p>
                    </div>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </div>

              <button
                className={cx("confirm-btn")}
                disabled={loading || !file}
                onClick={handleConfirmPayment}
              >
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐÃ THANH TOÁN"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
