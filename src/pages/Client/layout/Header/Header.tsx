import React from "react";
import style from "./Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

const Header = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("logo")}>Logo</div>

      <div className={cx("navigation")}>
        <a href="#home">Home</a>
        <a href="#about">Maps</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </div>

      <div className={cx("userProfile")}>
        <img
          src="https://tse4.mm.bing.net/th/id/OIP.LkrCBJoljYJlA43RIOjTdwHaHa?pid=Api&P=0&h=180"
          alt="User Avatar"
        />
      </div>
    </div>
  );
};

export default Header;
