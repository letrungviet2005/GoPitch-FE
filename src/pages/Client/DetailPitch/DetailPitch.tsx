import React from "react";
import classNames from "classnames/bind";
import styles from "./DetailPitch.module.scss";

const cx = classNames.bind(styles);

const DetailPitch = () => {
  return (
    <div className={cx("detailPitch")}>
      <div className={cx("contentWrapper")}>
        {/* Cột trái */}
        <div className={cx("leftColumn")}>
          {/* Ảnh chính */}
          <div className={cx("mainImage")}>
            <img
              src="https://sieuthicaulong.vn/userfiles/files/image3.jpg"
              alt="Sân cầu lông"
            />
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

          {/* Bảng giá sân */}
          <div className={cx("priceList")}>
            <h2>Bảng giá sân</h2>
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

          <button className={cx("bookButton")}>Đặt sân ngay</button>

          {/* Dịch vụ khác */}

          {/* Bình luận */}
          <div className={cx("comments")}>
            <h2>Đánh giá & Bình luận</h2>

            {/* Comment 1 */}
            <div className={cx("commentItem")}>
              <img
                src="https://i.pravatar.cc/40?img=1"
                alt="Nguyễn Văn A"
                className={cx("avatar")}
              />
              <div className={cx("commentContent")}>
                <strong>Nguyễn Văn A</strong>
                <p>Sân đẹp, ánh sáng tốt, nhân viên thân thiện.</p>
              </div>
            </div>

            {/* Comment 2 */}
            <div className={cx("commentItem")}>
              <img
                src="https://i.pravatar.cc/40?img=2"
                alt="Trần Thị B"
                className={cx("avatar")}
              />
              <div className={cx("commentContent")}>
                <strong>Trần Thị B</strong>
                <p>Giá hợp lý, chỗ để xe rộng, sẽ quay lại.</p>
              </div>
            </div>

            {/* Form nhập bình luận */}
            <div className={cx("commentForm")}>
              <img
                src="https://i.pravatar.cc/40?img=3"
                alt="Bạn"
                className={cx("avatar")}
              />
              <textarea placeholder="Viết bình luận..." />
            </div>
            <button>Gửi</button>
          </div>
        </div>

        {/* Cột phải */}
        <div className={cx("rightColumn")}>
          {/* Thông tin cơ bản */}
          <div className={cx("infoSection")}>
            <h1>Sân Cầu lông Hiếu Con</h1>
            <p className={cx("address")}>
              📍 123 Đỗ Quỳ, Quận Cẩm Lệ, TP Đà Nẵng
            </p>
            <p>🕒 Giờ mở cửa: 06:00 - 22:00</p>
            <p>📞 0123 456 789</p>
            <p>⭐ 4.5/5</p>
          </div>

          {/* Google Maps */}
          <div className={cx("mapSection")}>
            <h2>Vị trí trên bản đồ</h2>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4507345895673!2d106.62644571532156!3d10.853821192270925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b3d5f71b9a1%3A0x2ddc28c8f8cba2df!2zU8OibiBj4bqndSBsb25n!5e0!3m2!1svi!2s!4v1691582950860!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
          <div className={cx("services")}>
            <h2>Dịch vụ kèm theo</h2>
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>💧 Nước suối</td>
                  <td>10.000 VNĐ/chai</td>
                </tr>
                <tr>
                  <td>🏸 Thuê vợt</td>
                  <td>50.000 VNĐ/giờ</td>
                </tr>
                <tr>
                  <td>👕 Thuê áo thi đấu</td>
                  <td>30.000 VNĐ/bộ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPitch;
