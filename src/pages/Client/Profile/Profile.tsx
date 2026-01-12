import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Flame,
  Edit3,
  Map as MapIcon,
  ShieldCheck,
  Calendar,
  History,
  LogOut, // Import icon Đăng xuất
} from "lucide-react";
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles);

interface UserProfile {
  id: number;
  name: string;
  email: string;
  point: number;
  streakCount: number;
  userInformation?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
  };
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/v1/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.result || response.data;
        setUser(data);
      } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // HÀM ĐĂNG XUẤT CHUẨN
  const handleLogout = () => {
    // 1. Xóa storage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");

    // 2. Xóa Cookie (Xóa tất cả cookie để đảm bảo sạch sẽ)
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 3. Quay lại trang đăng nhập
    navigate("/signin");
  };

  if (loading)
    return (
      <div className={cx("loadingWrapper")}>
        <div className={cx("spinner")}></div>
        <p>Đang tải hồ sơ của bạn...</p>
      </div>
    );

  return (
    <div className={cx("profilePage")}>
      <div className={cx("container")}>
        <div className={cx("headerCard")}>
          <div className={cx("coverPhoto")}>
            <div className={cx("overlay")}></div>
            <div className={cx("badge")}>
              <ShieldCheck size={14} strokeWidth={3} />
              <span>Thành viên xác thực</span>
            </div>
          </div>

          <div className={cx("profileInfo")}>
            <div className={cx("avatarWrapper")}>
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=00b894&color=fff&size=128&bold=true`}
                alt="Avatar"
              />
              <div className={cx("onlineStatus")}></div>
            </div>

            <div className={cx("nameSection")}>
              <h1>{user.userInformation?.fullName || user.name}</h1>
              <div className={cx("tags")}>
                <span className={cx("tag")}>
                  <Calendar size={14} /> Gia nhập 2024
                </span>
                <span className={cx("tag", "gold")}>
                  <Award size={14} /> Hạng Vàng
                </span>
              </div>
            </div>

            <div className={cx("actionGroup")}>
              <button
                className={cx("historyBtn")}
                onClick={() => navigate("/booking-history")}
              >
                <History size={18} /> <span>Lịch sử</span>
              </button>
              <button className={cx("editBtn")}>
                <Edit3 size={18} /> <span>Chỉnh sửa</span>
              </button>
              <button className={cx("logoutBtn")} onClick={handleLogout}>
                <LogOut size={18} /> <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        <div className={cx("mainGrid")}>
          <div className={cx("leftCol")}>
            <div className={cx("card", "statCard")}>
              <h3>Thống kê hoạt động</h3>
              <div className={cx("statGrid")}>
                <div className={cx("statBox")}>
                  <div className={cx("iconBox", "point")}>
                    <Award size={24} />
                  </div>
                  <div className={cx("statData")}>
                    <strong>{user.point.toLocaleString()}</strong>
                    <span>Điểm tích lũy</span>
                  </div>
                </div>
                <div className={cx("statBox")}>
                  <div className={cx("iconBox", "streak")}>
                    <Flame size={24} />
                  </div>
                  <div className={cx("statData")}>
                    <strong>{user.streakCount}</strong>
                    <span>Ngày streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("rightCol")}>
            <div className={cx("card", "infoCard")}>
              <h3>Thông tin tài khoản</h3>
              <div className={cx("infoList")}>
                {[
                  { icon: <Mail />, label: "Email", value: user.email },
                  {
                    icon: <Phone />,
                    label: "Số điện thoại",
                    value: user.userInformation?.phoneNumber || "Chưa cập nhật",
                  },
                  {
                    icon: <MapPin />,
                    label: "Địa chỉ",
                    value: user.userInformation?.address || "Chưa cập nhật",
                  },
                  {
                    icon: <MapIcon />,
                    label: "Tọa độ GPS",
                    value: user.userInformation?.latitude
                      ? `${user.userInformation.latitude}, ${user.userInformation.longitude}`
                      : "Chưa xác định",
                  },
                ].map((item, index) => (
                  <div className={cx("infoItem")} key={index}>
                    <div className={cx("itemIcon")}>{item.icon}</div>
                    <div className={cx("itemContent")}>
                      <label>{item.label}</label>
                      <p>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
