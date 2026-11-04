import apiClient,{errorMessage} from "../../../services/apiClient";
import type {ClubDetail} from "../../../types/api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./css/Pitch.module.scss";
import Pitchs from "../../../components/pitch/Pitchs";
import Pagination from "../../../components/pagination/Pagination";
import { getStoredLocation } from "../../../hooks/locationHandler";
import { calculateDistance } from "../../../utils/distanceCalculator";

const cx = classNames.bind(style);

const Pitch: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [error,setError]=useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pitches, setPitches] = useState<ClubDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const pitchesPerPage = 12;

  const userCoords = getStoredLocation();

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPitches = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) return;

      try {
        setLoading(true);setError("");

        const {data} = await apiClient.get(debouncedSearchTerm?"/clubs/search":"/clubs",{params:{page:currentPage,size:pitchesPerPage,keyword:debouncedSearchTerm||undefined,active:true}});
        const actualData = data.result ? data : data.data || data;
        let rawPitches = actualData.result || [];

        if (userCoords && userCoords.lat && userCoords.lng) {
          rawPitches = rawPitches.map((pitch: ClubDetail) => {
            // Kiểm tra nếu sân có đủ tọa độ từ BE
            if (pitch.latitude && pitch.longitude) {
              const dist = calculateDistance(
                userCoords.lat,
                userCoords.lng,
                Number(pitch.latitude),
                Number(pitch.longitude)
              );
              console.log(`Khoảng cách đến sân ${pitch.name}: ${dist} km`);
              return { ...pitch, distance: dist };
            }
            return pitch;
          });

          rawPitches.sort(
            (a: ClubDetail, b: ClubDetail) => (a.distance || 999) - (b.distance || 999)
          );
        }

        setPitches(rawPitches);
        if (actualData.meta) {
          setTotalPages(actualData.meta.pages || 1);
        }
      } catch (error) {
        setError(errorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, debouncedSearchTerm, userCoords?.lat, userCoords?.lng]);

  const handlePitchClick = (id: number) => {
    navigate(`/detailpitch/${id}`);
  };

  return (
    <div className={cx("container")}>
      {error && <p role="alert">{error}</p>}
      {/* Search Bar */}
      <div className={cx("searchBar")}>
        <input
          type="text"
          placeholder="Tìm kiếm tên sân hoặc địa chỉ..."
          className={cx("input")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Loading State */}
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
                  name={pitch.name}
                  address={pitch.address}
                  hours={`${formatTime(pitch.timeStart)} - ${formatTime(
                    pitch.timeEnd
                  )}`}
                  rating={4.5}
                  distance={
                    pitch.distance !== undefined
                      ? `${pitch.distance.toFixed(1)} km`
                      : null
                  }
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

      {/* Pagination */}
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
