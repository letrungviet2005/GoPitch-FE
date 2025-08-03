import React from "react";
import style from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

const Footer = () => {
  return <div className={cx("container")}>Footer</div>;
};

export default Footer;
