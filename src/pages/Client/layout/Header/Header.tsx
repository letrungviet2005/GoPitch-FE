import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import { User, Map, LayoutGrid, PhoneCall, Home } from "lucide-react";
import style from "./Header.module.scss";

const cx = classNames.bind(style);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm kiểm tra trang hiện tại để active menu
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={cx("header")}>
      {" "}
      {/* Bỏ class { scrolled: isScrolled } */}
      <div className={cx("container")}>
        {/* LOGO */}
        <div className={cx("logo")} onClick={() => navigate("/")}>
          <span className={cx("logoText")}>GO</span>
          <span className={cx("logoHighlight")}>PITCH</span>
        </div>

        {/* NAVIGATION */}
        <nav className={cx("navigation")}>
          <button
            className={cx("navItem", { active: isActive("/") })}
            onClick={() => navigate("/")}
          >
            <Home size={18} /> Home
          </button>
          <button
            className={cx("navItem", { active: isActive("/maps") })}
            onClick={() => navigate("/maps")}
          >
            <Map size={18} /> Maps
          </button>
          <button
            className={cx("navItem", { active: isActive("/services") })}
            onClick={() => navigate("/pitch")}
          >
            <LayoutGrid size={18} /> Services
          </button>
          <button
            className={cx("navItem", { active: isActive("/contact") })}
            onClick={() => navigate("/contact")}
          >
            <PhoneCall size={18} /> Contact
          </button>
        </nav>

        {/* PROFILE & ACTIONS */}
        <div className={cx("actions")}>
          <div
            className={cx("userProfile")}
            onClick={() => navigate("/profile")}
          >
            <div className={cx("avatarWrapper")}>
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.LkrCBJoljYJlA43RIOjTdwHaHa?pid=Api&P=0&h=180"
                alt="User Avatar"
              />
            </div>
            <span className={cx("userName")}>Tài khoản</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
