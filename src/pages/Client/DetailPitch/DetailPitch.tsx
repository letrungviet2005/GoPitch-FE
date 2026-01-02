import React, { useState, useEffect } from "react";
import { useParams } from "react-router"; // Để lấy ID từ URL
import axios from "axios"; // Hoặc instance axios bạn đã cấu hình
import classNames from "classnames/bind";
import styles from "./DetailPitch.module.scss";

const cx = classNames.bind(styles);

const DetailPitch = () => {
  const { id } = useParams(); // Lấy ID sân từ đường dẫn /detailpitch/:id
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  useEffect(() => {
    const fetchClubDetail = async () => {
      try {
        setLoading(true);
        // Lấy token từ localStorage (vì API cần Auth)
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        console.log("Token hiện tại:", token);

        const response = await axios.get(
          `http://localhost:8080/api/v1/clubs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Giả sử cấu trúc trả về là { result: { ... } } như Backend bạn viết
        setClub(response.data.result || response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sân:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClubDetail();
  }, [id]);

  if (loading)
    return <div className={cx("loading")}>Đang tải thông tin sân...</div>;
  if (!club)
    return <div className={cx("error")}>Không tìm thấy thông tin sân này!</div>;

  return (
    <div className={cx("detailPitch")}>
      <div className={cx("contentWrapper")}>
        {/* Cột trái */}
        <div className={cx("leftColumn")}>
          {/* Ảnh chính - Lấy từ imageAvatar API */}
          <div className={cx("mainImage")}>
            <img
              src={
                club.imageAvatar ||
                "https://sieuthicaulong.vn/userfiles/files/image3.jpg"
              }
              alt={club.name}
            />
          </div>

          {/* Gallery - Map từ imageClubs trong Domain */}
          <div className={cx("gallery")}>
            <h2>Hình ảnh sân</h2>
            <div className={cx("galleryImages")}>
              {club.imageClubs && club.imageClubs.length > 0 ? (
                club.imageClubs.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`Gallery ${index}`}
                  />
                ))
              ) : (
                <p>Chưa có hình ảnh bổ sung.</p>
              )}
            </div>
          </div>

          {/* Bảng giá sân - Map từ pitchPrices trong Domain */}
          <div className={cx("priceList")}>
            <h2>Bảng giá sân</h2>
            <table>
              <thead>
                <tr>
                  <th>Loại sân/Dịch vụ</th>
                  <th>Khung giờ</th>
                  <th>Giá (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {club.pitchPrices && club.pitchPrices.length > 0 ? (
                  club.pitchPrices.map((price, index) => (
                    <tr key={index}>
                      <td>{price.name}</td>
                      <td>
                        {formatTime(price.timeStart)} -{" "}
                        {formatTime(price.timeEnd)}
                      </td>
                      <td>{price.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Đang cập nhật bảng giá...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button className={cx("bookButton")}>Đặt sân ngay</button>

          {/* Bình luận - Map từ comments trong Domain */}
          <div className={cx("comments")}>
            <h2>Đánh giá & Bình luận</h2>
            {club.comments && club.comments.length > 0 ? (
              club.comments.map((comment, index) => (
                <div key={index} className={cx("commentItem")}>
                  <img
                    src={`https://i.pravatar.cc/40?u=${comment.id}`}
                    alt="User"
                    className={cx("avatar")}
                  />
                  <div className={cx("commentContent")}>
                    <strong>
                      Người dùng {comment.user?.name || "Ẩn danh"}
                    </strong>
                    <div className={cx("rating")}>⭐ {comment.rate}/5</div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}

            <div className={cx("commentForm")}>
              <textarea placeholder="Viết bình luận..." />
            </div>
            <button>Gửi</button>
          </div>
        </div>

        {/* Cột phải */}
        <div className={cx("rightColumn")}>
          <div className={cx("infoSection")}>
            <h1>{club.name}</h1>
            <p className={cx("address")}>📍 {club.address}</p>
            <p>
              🕒 Giờ mở cửa: {formatTime(club.timeStart)} -{" "}
              {formatTime(club.timeEnd)}
            </p>
            <p>📞 {club.phoneNumber}</p>
            <p>⭐ {club.active ? "Đang hoạt động" : "Tạm đóng cửa"}</p>
          </div>

          <div className={cx("mapSection")}>
            <h2>Vị trí trên bản đồ</h2>
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                club.address
              )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPitch;
