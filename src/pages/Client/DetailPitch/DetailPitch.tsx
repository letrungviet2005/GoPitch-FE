import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./DetailPitch.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const DetailPitch = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const handleNavigateToBooking = () => {
    navigate(`/bookingpitch/${id}`);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // Sử dụng allSettled để nếu 1 trong 2 API lỗi thì trang vẫn không bị trắng
        const results = await Promise.allSettled([
          axios.get(`http://localhost:8080/api/v1/clubs/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/v1/extra-services/club/${id}`, {
            headers,
          }),
        ]);

        // Xử lý kết quả Club
        if (results[0].status === "fulfilled") {
          const clubData = results[0].value.data;
          setClub(clubData.result || clubData);
        } else {
          console.error("Lỗi API Club:", results[0].reason);
        }

        // Xử lý kết quả Extra Services
        if (results[1].status === "fulfilled") {
          setExtraServices(results[1].value.data || []);
        } else {
          console.warn(
            "Lỗi API Dịch vụ (có thể do chưa có dữ liệu):",
            results[1].reason
          );
        }
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]);

  if (loading)
    return <div className={cx("loading")}>Đang tải thông tin sân...</div>;
  if (!club)
    return (
      <div className={cx("error")}>
        Không tìm thấy thông tin sân này hoặc lỗi kết nối!
      </div>
    );

  return (
    <div className={cx("detailPitch")}>
      <div className={cx("contentWrapper")}>
        {/* CỘT TRÁI */}
        <div className={cx("leftColumn")}>
          <div className={cx("mainImage")}>
            <img src={club.imageAvatar} alt={club.name} />
          </div>

          <div className={cx("gallery")}>
            <h2>Hình ảnh sân</h2>
            <div className={cx("galleryImages")}>
              {club.imageClubs?.length > 0 ? (
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

          <div className={cx("priceList")}>
            <h2>Bảng giá sân</h2>
            <table>
              <thead>
                <tr>
                  <th>Loại sân</th>
                  <th>Khung giờ</th>
                  <th>Giá (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {club.pitchPrices?.length > 0 ? (
                  club.pitchPrices.map((price, index) => (
                    <tr key={index}>
                      <td>{price.name}</td>
                      <td>
                        {formatTime(price.timeStart)} -{" "}
                        {formatTime(price.timeEnd)}
                      </td>
                      <td>{price.price?.toLocaleString()}đ</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Sân chưa cập nhật bảng giá chính thức.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            className={cx("bookButton")}
            onClick={handleNavigateToBooking}
          >
            ĐẶT SÂN NGAY
          </button>

          <div className={cx("comments")}>
            <h2>Đánh giá & Bình luận</h2>
            {club.comments?.length > 0 ? (
              club.comments.map((comment, index) => (
                <div key={index} className={cx("commentItem")}>
                  <img
                    src={`https://i.pravatar.cc/40?u=${comment.id}`}
                    alt="User"
                    className={cx("avatar")}
                  />
                  <div className={cx("commentContent")}>
                    <strong>
                      {comment.user?.name || "Người dùng GoPitch"}
                    </strong>
                    <div className={cx("rating")}>⭐ {comment.rate}/5</div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào cho sân này.</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className={cx("rightColumn")}>
          <div className={cx("infoSection")}>
            <h1>{club.name}</h1>
            <p className={cx("address")}>📍 {club.address}</p>
            <p>
              🕒 Giờ mở cửa: {formatTime(club.timeStart)} -{" "}
              {formatTime(club.timeEnd)}
            </p>
            <p>📞 Liên hệ: {club.phoneNumber}</p>
            <p className={cx("status", club.active ? "open" : "closed")}>
              {club.active ? "● Đang hoạt động" : "● Tạm đóng cửa"}
            </p>
          </div>

          <div className={cx("mapSection")}>
            <h2>Vị trí trên bản đồ</h2>
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                club.address
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
            ></iframe>
          </div>

          <div className={cx("serviceSection")}>
            <h2>Dịch vụ & Tiện ích</h2>
            <div className={cx("serviceTableWrapper")}>
              {extraServices.length > 0 ? (
                <table className={cx("serviceTable")}>
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extraServices.map((service, index) => (
                      <tr key={index}>
                        <td>
                          {service.name} ({service.unit})
                        </td>
                        <td className={cx("servicePrice")}>
                          {service.price?.toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Chưa có thông tin dịch vụ đi kèm.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPitch;
