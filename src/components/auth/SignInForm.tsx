import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import styles from "./SignIn.module.scss";

const cx = classNames.bind(styles);

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = "http://localhost:8080/api/v1";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.accessToken) {
        // --- CHỈ DÙNG LOCAL STORAGE ---

        // 1. Xóa dữ liệu cũ cho chắc ăn
        localStorage.clear();
        sessionStorage.clear();

        // 2. Lưu vào Local Storage
        localStorage.setItem("accessToken", result.accessToken);

        if (result.user) {
          localStorage.setItem("userRole", result.user.role?.name || "User");
          localStorage.setItem("userName", result.user.name || "");
          localStorage.setItem("userId", result.user.id.toString());
        }

        setSuccess(`Chào mừng ${result.user?.name || "bạn"} trở lại!`);

        // --- PHÂN QUYỀN ĐIỀU HƯỚNG ---
        const userRole = result.user?.role?.name;

        setTimeout(() => {
          if (userRole === "Owner" || userRole === "Admin") {
            navigate("/admin/");
          } else {
            navigate("/");
          }
          // Reload để các component khác (Header, Sidebar) nhận dữ liệu mới từ Storage
          window.location.reload();
        }, 800);
      } else {
        setError(result.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("signInPage")}>
      <div className={cx("container")}>
        <button className={cx("backBtn")} onClick={() => navigate("/")}>
          <ChevronLeft size={20} /> Quay lại trang chủ
        </button>

        <div className={cx("formCard")}>
          <div className={cx("header")}>
            <div className={cx("logo")}>
              <span className={cx("logoText")}>GO</span>
              <span className={cx("logoHighlight")}>PITCH</span>
            </div>
            <h1>Chào mừng trở lại!</h1>
            <p>Vui lòng đăng nhập để tiếp tục.</p>
          </div>

          <form onSubmit={handleSubmit} className={cx("form")}>
            <div className={cx("inputGroup")}>
              <label>Email</label>
              <div className={cx("inputWrapper")}>
                <Mail className={cx("icon")} size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={cx("inputGroup")}>
              <div className={cx("labelRow")}>
                <label>Mật khẩu</label>
                <Link to="/reset-password" className={cx("forgotLink")}>
                  Quên?
                </Link>
              </div>
              <div className={cx("inputWrapper")}>
                <Lock className={cx("icon")} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={cx("eyeBtn")}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className={cx("alert", "error")}>{error}</div>}
            {success && <div className={cx("alert", "success")}>{success}</div>}

            <button
              type="submit"
              className={cx("submitBtn")}
              disabled={isLoading}
            >
              {isLoading ? <div className={cx("spinner")}></div> : "Đăng nhập"}
            </button>
          </form>

          <p className={cx("footerText")}>
            Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
