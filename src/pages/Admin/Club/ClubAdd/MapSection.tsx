import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- FIX LỖI ICON MARKER (QUAN TRỌNG) ---
// Leaflet mặc định không tìm thấy ảnh icon khi dùng với Webpack/Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- CẤU HÌNH PHẠM VI VIỆT NAM ---
const VN_BOUNDS: L.LatLngBoundsExpression = [
  [8.179, 102.144], // Điểm cực Nam
  [23.393, 109.464], // Điểm cực Bắc
];

const DEFAULT_CENTER: [number, number] = [16.047, 108.206]; // Tọa độ Đà Nẵng (Trung tâm VN)

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export const MapSection = ({ lat, lng }: { lat: number; lng: number }) => {
  // Kiểm tra nếu tọa độ truyền vào hợp lệ, không thì dùng mặc định
  const position: [number, number] = lat && lng ? [lat, lng] : DEFAULT_CENTER;

  return (
    <div className="relative group shadow-2xl rounded-[2rem] overflow-hidden border-4 border-white h-64 sm:h-80">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false} // Tránh bị cuộn nhầm khi lướt web
        maxBounds={VN_BOUNDS} // KHÓA MAP Ở VIỆT NAM
        maxBoundsViscosity={1.0} // Không cho phép kéo ra ngoài dù chỉ 1 chút
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <ChangeView center={position} />

        {/* Bản đồ nền sáng/đẹp hơn của CartoDB thay vì OpenStreetMap mặc định nếu bạn muốn chuyên nghiệp */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <Marker position={position}>
          <Popup>
            <span className="font-bold text-blue-600">Vị trí sân của bạn</span>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Overlay trang trí để đồng bộ UI */}
      <div className="absolute top-4 left-4 z-[10] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
            Khu vực
          </p>
          <p className="text-xs font-bold text-blue-600">Việt Nam</p>
        </div>
      </div>
    </div>
  );
};
