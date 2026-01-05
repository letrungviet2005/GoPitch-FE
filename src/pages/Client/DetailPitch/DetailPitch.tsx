import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./DetailPitch.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const DetailPitch = () => {
  const { id } = useParams();
  const [club, setClub] = useState<any>(null);
  const [extraServices, setExtraServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const results = await Promise.allSettled([
          axios.get(`http://localhost:8080/api/v1/clubs/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/v1/extra-services/club/${id}`, {
            headers,
          }),
        ]);

        if (results[0].status === "fulfilled") {
          const clubData = results[0].value.data;
          setClub(clubData.result || clubData);
        }
        if (results[1].status === "fulfilled") {
          setExtraServices(results[1].value.data || []);
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
    return (
      <div className={cx("loaderWrapper")}>
        <div className={cx("loader")}></div>
        <p>Đang tải thông tin sân...</p>
      </div>
    );

  if (!club)
    return <div className={cx("error")}>Không tìm thấy thông tin sân!</div>;

  // Xử lý ảnh: Ưu tiên Avatar đầu tiên, sau đó là các ảnh trong list imageClubs
  const allImages = [
    club.imageAvatar,
    ...(club.imageClubs?.map((img: any) => img.imageUrl) || []),
  ].filter(Boolean);

  return (
    <div className={cx("container")}>
      {/* --- HEADER --- */}
      <header className={cx("header")}>
        <div className={cx("headerInfo")}>
          <h1>{club.name}</h1>
          <div className={cx("subHeader")}>
            <span className={cx("rating")}>
              ⭐ {club.rating || "5.0"} (100+ đánh giá)
            </span>
            <span className={cx("address")}>📍 {club.address}</span>
          </div>
        </div>
        <div className={cx("headerActions")}>
          <button className={cx("btnOutline")}>📤 Chia sẻ</button>
          <button className={cx("btnOutline")}>❤️ Lưu lại</button>
        </div>
      </header>

      {/* --- GALLERY GRID --- */}
      <section
        className={cx(
          "gallerySection",
          `grid-${Math.min(allImages.length, 5)}`
        )}
      >
        {allImages.slice(0, 5).map((url, idx) => (
          <div key={idx} className={cx("imageItem", `img-${idx}`)}>
            <img src={url} alt={`Pitch ${idx}`} />
            {idx === 4 && allImages.length > 5 && (
              <div className={cx("overlay")}>+{allImages.length - 5} ảnh</div>
            )}
          </div>
        ))}
      </section>

      <div className={cx("mainContent")}>
        {/* --- CỘT TRÁI --- */}
        <div className={cx("leftCol")}>
          <div className={cx("card")}>
            <h2>Giới thiệu sân</h2>
            <p className={cx("description")}>
              Chào mừng bạn đến với <strong>{club.name}</strong>. Sân được đầu
              tư cơ sở vật chất hiện đại, mặt sàn chống trơn trượt, hệ thống
              chiếu sáng đạt chuẩn thi đấu. Môi trường thể thao văn minh, sạch
              sẽ và đầy đủ tiện nghi.
            </p>
            <div className={cx("quickInfo")}>
              <div className={cx("infoItem")}>
                <span className={cx("icon")}>🕒</span>
                <div>
                  <p className={cx("label")}>Giờ hoạt động</p>
                  <p className={cx("val")}>
                    {formatTime(club.timeStart)} - {formatTime(club.timeEnd)}
                  </p>
                </div>
              </div>
              <div className={cx("infoItem")}>
                <span className={cx("icon")}>📞</span>
                <div>
                  <p className={cx("label")}>Liên hệ</p>
                  <p className={cx("val")}>{club.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BẢNG GIÁ SÂN */}
          <div className={cx("card")}>
            <h2>Bảng giá thuê sân</h2>
            <div className={cx("tableWrapper")}>
              <table>
                <thead>
                  <tr>
                    <th>Loại sân</th>
                    <th>Khung giờ</th>
                    <th>Đơn giá / Giờ</th>
                  </tr>
                </thead>
                <tbody>
                  {club.pitchPrices?.map((price: any, idx: number) => (
                    <tr key={idx}>
                      <td>
                        <strong>{price.name}</strong>
                      </td>
                      <td>
                        {formatTime(price.timeStart)} -{" "}
                        {formatTime(price.timeEnd)}
                      </td>
                      <td className={cx("priceHighlight")}>
                        {price.price?.toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BẢNG DỊCH VỤ ĐI KÈM */}
          <div className={cx("card")}>
            <h2>Dịch vụ & Tiện ích</h2>
            <div className={cx("tableWrapper")}>
              {extraServices.length > 0 ? (
                <table className={cx("serviceTable")}>
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th>Đơn vị</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extraServices.map((service, idx) => (
                      <tr key={idx}>
                        <td className={cx("serviceName")}>🔹 {service.name}</td>
                        <td>{service.unit}</td>
                        <td className={cx("priceHighlight")}>
                          {service.price?.toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={cx("emptyText")}>
                  Sân hiện chưa cập nhật các dịch vụ bổ sung.
                </p>
              )}
            </div>
          </div>

          <div className={cx("card")}>
            <h2>Đánh giá</h2>
            <div className={cx("commentList")}>
              {club.comments?.length > 0 ? (
                club.comments.map((comment: any, idx: number) => (
                  <div key={idx} className={cx("commentItem")}>
                    <img
                      src={`https://i.pravatar.cc/150?u=${idx}`}
                      alt="user"
                    />
                    <div className={cx("commentBody")}>
                      <div className={cx("commentHeader")}>
                        <strong>
                          {comment.user?.name || "Hội viên GoPitch"}
                        </strong>
                        <span>⭐ {comment.rate}/5</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={cx("emptyText")}>Chưa có bình luận nào.</p>
              )}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI (STICKY) --- */}
        <aside className={cx("rightCol")}>
          <div className={cx("bookingSticky")}>
            <div className={cx("bookingCard")}>
              <div className={cx("pricePreview")}>
                <span>Giá thuê chỉ từ</span>
                <h3>
                  {club.pitchPrices?.[0]?.price?.toLocaleString() || "0"}đ{" "}
                  <span>/ giờ</span>
                </h3>
              </div>

              <button
                className={cx("primaryBtn")}
                onClick={() => navigate(`/bookingpitch/${id}`)}
              >
                ĐẶT SÂN NGAY
              </button>

              <div className={cx("features")}>
                <div className={cx("featureItem")}>
                  ✔️ Hoàn tiền nếu hủy trước 24h
                </div>
                <div className={cx("featureItem")}>✔️ Thanh toán linh hoạt</div>
              </div>

              <hr />

              <div className={cx("miniMap")}>
                <h4>Vị trí sân</h4>
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    club.address
                  )}&output=embed`}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: "12px" }}
                ></iframe>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DetailPitch;
