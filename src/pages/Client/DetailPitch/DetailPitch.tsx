import React from "react";
import classNames from "classnames/bind";
import styles from "./DetailPitch.module.scss";

const cx = classNames.bind(styles);

const DetailPitch = () => {
  return (
    <div className={cx("detailPitch")}>
      {/* Ảnh chính */}
      <div className={cx("mainImage")}>
        <img
          src="https://sieuthicaulong.vn/userfiles/files/image3.jpg"
          alt="Sân cầu lông"
        />
      </div>

      {/* Thông tin cơ bản */}
      <div className={cx("infoSection")}>
        <h1>Sân ABC</h1>
        <p className={cx("address")}>📍 123 Đường XYZ, Quận 1</p>
        <p>🕒 Giờ mở cửa: 06:00 - 22:00</p>
        <p>📞 0123 456 789</p>
        <p>⭐ 4.5/5</p>
      </div>

      {/* Mô tả */}
      <div className={cx("description")}>
        <h2>Giới thiệu</h2>
        <p>
          Sân ABC là sân bóng chất lượng cao, mặt cỏ nhân tạo đạt chuẩn, hệ
          thống chiếu sáng hiện đại, phù hợp cho thi đấu và tập luyện cả ngày
          lẫn đêm. Có bãi đỗ xe rộng rãi và dịch vụ nước uống, thuê bóng, áo thi
          đấu.
        </p>
      </div>

      {/* Gallery */}
      <div className={cx("gallery")}>
        <h2>Hình ảnh sân</h2>
        <div className={cx("galleryImages")}>
          <img
            src="https://sieuthicaulong.vn/userfiles/files/image3.jpg"
            alt="Gallery 1"
          />
          <img
            src="https://sieuthicaulong.vn/userfiles/files/image3.jpg"
            alt="Gallery 2"
          />
          <img
            src="https://sieuthicaulong.vn/userfiles/files/image3.jpg"
            alt="Gallery 3"
          />
        </div>
      </div>

      {/* Bảng giá */}
      <div className={cx("priceList")}>
        <h2>Bảng giá</h2>
        <table>
          <thead>
            <tr>
              <th>Khung giờ</th>
              <th>Giá (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>06:00 - 12:00</td>
              <td>200.000</td>
            </tr>
            <tr>
              <td>12:00 - 17:00</td>
              <td>250.000</td>
            </tr>
            <tr>
              <td>17:00 - 22:00</td>
              <td>300.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailPitch;
