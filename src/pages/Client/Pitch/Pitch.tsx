import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./css/Pitch.module.scss";
import Pitchs from "../../../components/pitch/Pitchs";
import Pagination from "../../../components/pagination/Pagination";

const cx = classNames.bind(style);

const Pitch: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pitchesPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [pitches, setPitches] = useState<any[]>([]);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  // 1. Xử lý Debounce: Đợi người dùng ngừng gõ 500ms mới cập nhật debouncedSearchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm từ khóa mới
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Fetch dữ liệu (Dùng chung cho cả lấy tất cả và tìm kiếm)
  useEffect(() => {
    const fetchPitches = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) return;

      try {
        setLoading(true);

        // Quyết định URL: Nếu có từ khóa thì gọi /search, không thì gọi lấy tất cả
        // Lưu ý: Backend Spring Pageable bắt đầu từ 0 nên lấy currentPage - 1
        let url = `http://localhost:8080/api/v1/clubs?page=${
          currentPage - 1
        }&size=${pitchesPerPage}`;

        if (debouncedSearchTerm) {
          url = `http://localhost:8080/api/v1/clubs/search?keyword=${encodeURIComponent(
            debouncedSearchTerm
          )}&page=${currentPage - 1}&size=${pitchesPerPage}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const actualData = data.result ? data : data.data || data;

        setPitches(actualData.result || []);

        if (actualData.meta) {
          setTotalPages(actualData.meta.pages || 1);
        }
      } catch (error) {
        console.error("Error fetching pitches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, debouncedSearchTerm]); // Chạy lại khi đổi trang HOẶC khi từ khóa debounce thay đổi

  const handlePitchClick = (id: number) => {
    navigate(`/detailpitch/${id}`);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("searchBar")}>
        <input
          type="text"
          placeholder="Tìm kiếm tên sân hoặc địa chỉ..."
          className={cx("input")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật ngay lập tức để input mượt
        />
        <div className={cx("filterGroup")}>
          <button
            className={cx("button")}
            onClick={() => setSearchTerm("Cầu lông")}
          >
            🏸 Cầu lông
          </button>
          <button
            className={cx("button")}
            onClick={() => setSearchTerm("Pickleball")}
          >
            🏓 Pickleball
          </button>
          <button
            className={cx("button")}
            onClick={() => setSearchTerm("Bóng rổ")}
          >
            🏀 Bóng rổ
          </button>
        </div>
      </div>

      {loading ? (
        <div className={cx("loading")}>Đang tìm kiếm sân phù hợp...</div>
      ) : (
        <div className={cx("pitchList")}>
          {pitches.length > 0 ? (
            pitches.map((pitch) => (
              <div
                key={pitch.id}
                onClick={() => handlePitchClick(pitch.id)}
                className={cx("pitchItemWrapper")}
              >
                <Pitchs
                  image={pitch.imageAvatar || "https://via.placeholder.com/300"}
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
            <div className={cx("noData")}>
              <p>
                Rất tiếc, không tìm thấy sân nào khớp với "{debouncedSearchTerm}
                "
              </p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className={cx("paginationWrapper")}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default Pitch;
