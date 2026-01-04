import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Flame,
  Edit3,
  Map as MapIcon,
} from "lucide-react";
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles);

interface UserProfile {
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        // Giả sử API /me trả về thông tin user hiện tại kèm userInformation
        const response = await axios.get(
          "http://localhost:8080/api/v1/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.result || response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className={cx("loading")}>Đang tải hồ sơ...</div>;
  if (!user)
    return <div className={cx("error")}>Vui lòng đăng nhập để xem hồ sơ!</div>;

  return (
    <div className={cx("profilePage")}>
      <div className={cx("container")}>
        {/* Phần Header & Avatar */}
        <div className={cx("headerCard")}>
          <div className={cx("coverPhoto")}></div>
          <div className={cx("profileInfo")}>
            <div className={cx("avatarWrapper")}>
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`}
                alt="Avatar"
              />
            </div>
            <div className={cx("nameSection")}>
              <h1>{user.userInformation?.fullName || user.name}</h1>
              <p>Thành viên của GoPitch</p>
            </div>
            <button className={cx("editBtn")}>
              <Edit3 size={18} /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        <div className={cx("mainGrid")}>
          {/* Cột Trái: Thành tích */}
          <div className={cx("leftCol")}>
            <div className={cx("statCard")}>
              <h3>Thành tích sân cỏ</h3>
              <div className={cx("statItem")}>
                <div className={cx("icon", "point")}>
                  <Award />
                </div>
                <div className={cx("details")}>
                  <span>Điểm tích lũy</span>
                  <strong>{user.point} GP</strong>
                </div>
              </div>
              <div className={cx("statItem")}>
                <div className={cx("icon", "streak")}>
                  <Flame />
                </div>
                <div className={cx("details")}>
                  <span>Chuỗi hoạt động</span>
                  <strong>{user.streakCount} ngày</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div className={cx("rightCol")}>
            <div className={cx("infoCard")}>
              <h3>Thông tin cá nhân</h3>
              <div className={cx("infoList")}>
                <div className={cx("infoItem")}>
                  <Mail size={20} />
                  <div>
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className={cx("infoItem")}>
                  <Phone size={20} />
                  <div>
                    <label>Số điện thoại</label>
                    <p>
                      {user.userInformation?.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className={cx("infoItem")}>
                  <MapPin size={20} />
                  <div>
                    <label>Địa chỉ</label>
                    <p>{user.userInformation?.address || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className={cx("infoItem")}>
                  <MapIcon size={20} />
                  <div>
                    <label>Vị trí tọa độ (GPS)</label>
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
