import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  Save,
  X,
} from "lucide-react";
import { getMyProfile, updateMyProfile } from "../../../services/userService";
import { clearAuthSession } from "../../../services/authService";
import type { UserProfile } from "../../../types/api";
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles);

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const data = await getMyProfile();
        setUser(data);
        setForm({
          fullName: data.userInformation?.fullName || data.name || "",
          phoneNumber: data.userInformation?.phoneNumber || "",
          address: data.userInformation?.address || "",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateMyProfile(form);
      setUser(updated);
      setEditing(false);
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/signin");
  };

  if (loading)
    return (
      <div className={cx("loadingWrapper")}>
        <div className={cx("spinner")}></div>
        <p>Đang tải hồ sơ của bạn...</p>
      </div>
    );

  if (!user) return null;

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
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=00b894&color=fff&size=128&bold=true`}
                alt="Avatar"
              />
              <div className={cx("onlineStatus")}></div>
            </div>

            <div className={cx("nameSection")}>
              <h1>{user.userInformation?.fullName || user.name}</h1>
              <div className={cx("tags")}>
                <span className={cx("tag")}>
                  <Calendar size={14} /> Thành viên GoPitch
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
              <button
                className={cx("editBtn")}
                onClick={() => setEditing((prev) => !prev)}
              >
                {editing ? <X size={18} /> : <Edit3 size={18} />}{" "}
                <span>{editing ? "Hủy" : "Chỉnh sửa"}</span>
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
                    <strong>{user.point?.toLocaleString() || 0}</strong>
                    <span>Điểm tích lũy</span>
                  </div>
                </div>
                <div className={cx("statBox")}>
                  <div className={cx("iconBox", "streak")}>
                    <Flame size={24} />
                  </div>
                  <div className={cx("statData")}>
                    <strong>{user.streakCount || 0}</strong>
                    <span>Ngày streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("rightCol")}>
            <div className={cx("card", "infoCard")}>
              <div className="flex items-center justify-between mb-4">
                <h3>Thông tin tài khoản</h3>
                {editing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold"
                  >
                    <Save size={16} /> {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-500">
                      Họ tên
                    </span>
                    <input
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-500">
                      Số điện thoại
                    </span>
                    <input
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-500">
                      Địa chỉ
                    </span>
                    <input
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </label>
                </div>
              ) : (
                <div className={cx("infoList")}>
                  {[
                    { icon: <Mail />, label: "Email", value: user.email },
                    {
                      icon: <Phone />,
                      label: "Số điện thoại",
                      value:
                        user.userInformation?.phoneNumber || "Chưa cập nhật",
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
