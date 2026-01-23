import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import styles from "./SignIn.module.scss";

const cx = classNames.bind(styles);

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State cho Remember Me

  // Quản lý lỗi riêng biệt
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({ email: "", password: "" });
    setSuccess("");

    // Validate riêng từng trường
    let hasError = false;
    if (!email) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter your email.",
      }));
      hasError = true;
    }
    if (!password) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Please enter your password.",
      }));
      hasError = true;
    }
    if (hasError) return;

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

      let result: any = {};
      try {
        result = await response.json();
      } catch {}

      if (response.ok && result.accessToken) {
        // Xóa data cũ
        localStorage.clear();
        sessionStorage.clear();

        // Xử lý Ghi nhớ đăng nhập
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("accessToken", result.accessToken);
        if (result.user) {
          storage.setItem("userId", result.user.id?.toString() || "");
          storage.setItem("userName", result.user.name || "");
          storage.setItem("userRole", result.user.role?.name || "User");
        }

        setSuccess(`Welcome back, ${result.user?.name || "user"}!`);

        setTimeout(() => {
          const role = result.user?.role?.name;
          navigate(role === "Admin" || role === "Owner" ? "/admin/" : "/");
          window.location.reload();
        }, 800);
        return;
      }

      if (response.status === 401) {
        setGeneralError("Invalid email or password.");
      } else {
        setGeneralError(
          result.message || "An error occurred, please try again.",
        );
      }
    } catch (err) {
      setGeneralError("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("signInPage")}>
      <div className={cx("container")}>
        <button className={cx("backBtn")} onClick={() => navigate("/")}>
          <ChevronLeft size={20} /> Back to home
        </button>

        <div className={cx("formCard")}>
          <div className={cx("header")}>
            <div className={cx("logo")}>
              <span className={cx("logoText")}>GO</span>
              <span className={cx("logoHighlight")}>PITCH</span>
            </div>
            <h1>Welcome Back!</h1>
            <p>Please sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className={cx("form")}>
            {/* Email Input */}
            <div className={cx("inputGroup")}>
              <label>Email</label>
              <div className={cx("inputWrapper", { error: fieldErrors.email })}>
                <Mail className={cx("icon")} size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {fieldErrors.email && (
                <span className={cx("fieldError")}>{fieldErrors.email}</span>
              )}
            </div>

            {/* Password Input */}
            <div className={cx("inputGroup")}>
              <div className={cx("labelRow")}>
                <label>Password</label>
                <Link to="/reset-password" className={cx("forgotLink")}>
                  Forgot?
                </Link>
              </div>
              <div
                className={cx("inputWrapper", { error: fieldErrors.password })}
              >
                <Lock className={cx("icon")} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={cx("eyeBtn")}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className={cx("fieldError")}>{fieldErrors.password}</span>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className={cx("optionsRow")}>
              <label className={cx("rememberMe")}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            {generalError && (
              <div className={cx("alert", "error")}>{generalError}</div>
            )}
            {success && <div className={cx("alert", "success")}>{success}</div>}

            <button
              type="submit"
              className={cx("submitBtn")}
              disabled={isLoading}
            >
              {isLoading ? <div className={cx("spinner")} /> : "Đăng nhập"}
            </button>
          </form>

          <p className={cx("footerText")}>
            Don't have an account? <Link to="/signup">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
