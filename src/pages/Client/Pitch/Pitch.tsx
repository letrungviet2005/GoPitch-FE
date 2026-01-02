import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import classNames from "classnames/bind";
import style from "./css/Pitch.module.scss";
import Pitchs from "../../../components/pitch/Pitchs";
import Pagination from "../../../components/pagination/Pagination";

const cx = classNames.bind(style);

const Pitch = () => {
  const navigate = useNavigate(); // 2. Khởi tạo navigate
  const [currentPage, setCurrentPage] = useState(1);
  const pitchesPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [pitches, setPitches] = useState([]);

  // Hàm format giờ HH:mm:ss -> HH:mm
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  useEffect(() => {
    const fetchPitches = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) return;

      try {
        // Gọi API với phân trang (page - 1 vì Backend thường bắt đầu từ 0)
        const response = await fetch(
          `http://localhost:8080/api/v1/clubs?page=${
            currentPage - 1
          }&size=${pitchesPerPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          sessionStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        // Giả sử Backend trả về ResultPaginationDTO có result (list) và meta (pagination)
        setPitches(data.result || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages);
        }
      } catch (error) {
        console.error("Error fetching pitches:", error);
      }
    };

    fetchPitches();
  }, [currentPage]); // Theo dõi currentPage để gọi lại API khi chuyển trang

  // 3. Hàm xử lý khi click vào sân
  const handlePitchClick = (id: number) => {
    navigate(`/detailpitch/${id}`);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("searchBar")}>
        <input
          type="text"
          placeholder="Nhập tên sân thể thao hoặc vị trí..."
          className={cx("input")}
        />
        <button className={cx("button")}>🏸 Cầu lông gần tôi</button>
        <button className={cx("button")}>🏓 Pickleball gần tôi</button>
        <button className={cx("button")}>🏀 Bóng rổ gần tôi</button>
      </div>

      <div className={cx("pitchList")}>
        {pitches.length > 0 ? (
          pitches.map((pitch: any) => (
            <div
              key={pitch.id}
              onClick={() => handlePitchClick(pitch.id)} // 4. Thêm sự kiện click
              className={cx("pitchItemWrapper")} // Bạn có thể thêm style cursor: pointer vào đây
              style={{ cursor: "pointer" }}
            >
              <Pitchs
                image={pitch.imageUrl || pitch.imageAvatar}
                avatar={pitch.imageAvatar}
                name={pitch.name}
                address={pitch.address}
                hours={`${formatTime(pitch.timeStart)} - ${formatTime(
                  pitch.timeEnd
                )}`}
                rating={4.5}
              />
            </div>
          ))
        ) : (
          <p>Không có dữ liệu sân</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Pitch;
