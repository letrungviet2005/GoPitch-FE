import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./css/Pitch.module.scss";
import Pitchs from "../../../components/pitch/Pitchs";
import Pagination from "../../../components/pagination/Pagination";

const cx = classNames.bind(style);

const Pitch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pitchesPerPage = 6;
  const totalPages = 3;

  const [pitches, setPitches] = useState([]);

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/v1/clubs", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pitches");
        }

        const data = await response.json();
        setPitches(data.result || []);
        console.log("Pitches fetched successfully:", data.result);
      } catch (error) {
        console.error("Error fetching pitches:", error);
      }
    };

    fetchPitches();
  }, []);

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
          pitches.map((pitch) => (
            <Pitchs
              key={pitch.id}
              image={pitch.imageUrl}
              avatar={pitch.imageAvatar}
              name={pitch.name}
              address={pitch.address}
              hours={`${pitch.timeStart} - ${pitch.timeEnd}`}
              rating={4.5}
            />
          ))
        ) : (
          <p>Không có dữ liệu sân</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Pitch;
