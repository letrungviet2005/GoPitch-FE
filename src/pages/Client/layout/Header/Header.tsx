import React from "react";
import style from "./Header.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(style);

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className={cx("container")}>
      <div className={cx("logo")} onClick={() => navigate("/")}>
        Logo
      </div>

      <div className={cx("navigation")}>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/maps")}>Maps</button>
        <button onClick={() => navigate("/services")}>Services</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
      </div>

      <div className={cx("userProfile")} onClick={() => navigate("/profile")}>
        <img
          src="https://tse4.mm.bing.net/th/id/OIP.LkrCBJoljYJlA43RIOjTdwHaHa?pid=Api&P=0&h=180"
          alt="User Avatar"
        />
      </div>
    </div>
  );
};

export default Header;
