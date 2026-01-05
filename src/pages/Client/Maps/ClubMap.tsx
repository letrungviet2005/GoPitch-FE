import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import classNames from "classnames/bind";
import style from "./ClubMap.module.scss";

import { getStoredLocation } from "../../../hooks/locationHandler";
import { calculateDistance } from "../../../utils/distanceCalculator";

const cx = classNames.bind(style);

// Fix lỗi hiển thị Marker Icon mặc định
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component tự động di chuyển tâm bản đồ tới vị trí người dùng
const MapCenterUpdater = ({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 14);
    }
  }, [coords, map]);
  return null;
};

const ClubMap: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<any[]>([]);
  const userCoords = getStoredLocation();

  useEffect(() => {
    const fetchClubs = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      try {
        const res = await fetch("http://localhost:8080/api/v1/clubs?size=100", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const list = data.result || [];
        setClubs(list.filter((c: any) => c.latitude && c.longitude));
      } catch (err) {
        console.error("Lỗi fetch Map:", err);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div className={cx("mapContainer")}>
      <MapContainer center={[16.047, 108.206]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterUpdater coords={userCoords} />

        {/* Marker vị trí người dùng */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]}>
            <Tooltip permanent direction="top">
              Bạn đang ở đây
            </Tooltip>
          </Marker>
        )}

        {/* Marker các Câu lạc bộ */}
        {clubs.map((club) => {
          const dist = userCoords
            ? calculateDistance(
                userCoords.lat,
                userCoords.lng,
                Number(club.latitude),
                Number(club.longitude)
              )
            : null;

          return (
            <Marker
              key={club.id}
              position={[Number(club.latitude), Number(club.longitude)]}
              icon={DefaultIcon}
            >
              {/* NHÃN THÔNG TIN HIỂN THỊ VĨNH VIỄN */}
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 10]}
                className={cx("clubLabel")}
              >
                <div className={cx("labelContent")}>
                  <div className={cx("labelName")}>{club.name}</div>
                  <div className={cx("labelAddr")}>{club.address}</div>
                </div>
              </Tooltip>

              {/* POPUP CHI TIẾT KHI CLICK */}
              <Popup className={cx("customPopup")}>
                <div className={cx("popupContent")}>
                  <img
                    src={club.imageAvatar || "https://via.placeholder.com/200"}
                    alt=""
                  />
                  <div className={cx("info")}>
                    <h4>{club.name}</h4>
                    {dist && (
                      <p className={cx("distance")}>
                        🏃 Cách bạn: {dist.toFixed(1)} km
                      </p>
                    )}
                    <button
                      className={cx("btnDetail")}
                      onClick={() => navigate(`/detailpitch/${club.id}`)}
                    >
                      Xem chi tiết sân
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ClubMap;
