import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
} from "lucide-react";
import styles from "./SignUp.module.scss";
import config from "../../config/config";

const cx = classNames.bind(styles);

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${config}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng đăng nhập...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setError(result.message || "Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("signUpPage")}>
      <div className={cx("container")}>
        <button className={cx("backBtn")} onClick={() => navigate("/signin")}>
          <ChevronLeft size={20} /> Quay lại đăng nhập
        </button>

        <div className={cx("formCard")}>
          <div className={cx("header")}>
            <div className={cx("logo")}>
              <span className={cx("logoText")}>GO</span>
              <span className={cx("logoHighlight")}>PITCH</span>
            </div>
            <h1>Tạo tài khoản mới</h1>
            <p>Tham gia cộng đồng GoPitch ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit} className={cx("form")}>
            {/* Họ và tên */}
            <div className={cx("inputGroup")}>
              <label>Họ và tên</label>
              <div className={cx("inputWrapper")}>
                <User className={cx("icon")} size={18} />
                <input
                  name="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={cx("row")}>
              <div className={cx("inputGroup")}>
                <label>Email</label>
                <div className={cx("inputWrapper")}>
                  <Mail className={cx("icon")} size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={cx("inputGroup")}>
                <label>Số điện thoại</label>
                <div className={cx("inputWrapper")}>
                  <Phone className={cx("icon")} size={18} />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="09xxx"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={cx("inputGroup")}>
              <label>Mật khẩu</label>
              <div className={cx("inputWrapper")}>
                <Lock className={cx("icon")} size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={cx("inputGroup")}>
              <label>Xác nhận mật khẩu</label>
              <div className={cx("inputWrapper")}>
                <ShieldCheck className={cx("icon")} size={18} />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  onChange={handleChange}
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
              {isLoading ? (
                <div className={cx("spinner")}></div>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          <p className={cx("footerText")}>
            Đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
