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
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
        <span>John Doe</span>
      </div>
    </div>
  );
};

export default Header;
