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
  History, // Thêm icon lịch sử
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

  if (loading)
    return (
      <div className={cx("loadingWrapper")}>
        <div className={cx("spinner")}></div>
        <p>Đang tải hồ sơ của bạn...</p>
      </div>
    );

  if (!user)
    return (
      <div className={cx("errorContainer")}>
        <div className={cx("errorIcon")}>🔐</div>
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem và quản lý thông tin cá nhân.</p>
        <button className={cx("primaryBtn")} onClick={() => navigate("/login")}>
          Đăng nhập ngay
        </button>
      </div>
    );

  return (
    <div className={cx("profilePage")}>
      <div className={cx("container")}>
        {/* SECTION 1: HEADER & AVATAR */}
        <div className={cx("headerCard")}>
          <div className={cx("coverPhoto")}>
            <div className={cx("badge")}>
              <ShieldCheck size={16} /> Thành viên xác thực
            </div>
          </div>
          <div className={cx("profileInfo")}>
            <div className={cx("avatarWrapper")}>
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=00b894&color=fff&size=128&bold=true`}
                alt="Avatar"
              />
            </div>
            <div className={cx("nameSection")}>
              <h1>{user.userInformation?.fullName || user.name}</h1>
              <div className={cx("tags")}>
                <span className={cx("tag")}>
                  <Calendar size={14} /> Tham gia 2024
                </span>
                <span className={cx("tag")}>
                  <Award size={14} /> Hạng Vàng
                </span>
              </div>
            </div>

            {/* NHÓM NÚT HÀNH ĐỘNG */}
            <div className={cx("actionGroup")}>
              <button
                className={cx("historyBtn")}
                onClick={() => navigate("/booking-history")}
              >
                <History size={18} /> Lịch sử đặt sân
              </button>
              <button className={cx("editBtn")}>
                <Edit3 size={18} /> Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </div>

        <div className={cx("mainGrid")}>
          {/* CỘT TRÁI: THÀNH TÍCH */}
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
                    <span>Điểm GP</span>
                  </div>
                </div>
                <div className={cx("statBox")}>
                  <div className={cx("iconBox", "streak")}>
                    <Flame size={24} />
                  </div>
                  <div className={cx("statData")}>
                    <strong>{user.streakCount}</strong>
                    <span>Ngày Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT THÔNG TIN */}
          <div className={cx("rightCol")}>
            <div className={cx("card", "infoCard")}>
              <h3>Thông tin tài khoản</h3>
              <div className={cx("infoList")}>
                <div className={cx("infoItem")}>
                  <div className={cx("itemIcon")}>
                    <Mail />
                  </div>
                  <div className={cx("itemContent")}>
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className={cx("infoItem")}>
                  <div className={cx("itemIcon")}>
                    <Phone />
                  </div>
                  <div className={cx("itemContent")}>
                    <label>Số điện thoại</label>
                    <p>
                      {user.userInformation?.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className={cx("infoItem")}>
                  <div className={cx("itemIcon")}>
                    <MapPin />
                  </div>
                  <div className={cx("itemContent")}>
                    <label>Địa chỉ</label>
                    <p>{user.userInformation?.address || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className={cx("infoItem")}>
                  <div className={cx("itemIcon")}>
                    <MapIcon />
                  </div>
                  <div className={cx("itemContent")}>
                    <label>GPS</label>
                    <p>
                      {user.userInformation?.latitude
                        ? `${user.userInformation.latitude}, ${user.userInformation.longitude}`
                        : "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
