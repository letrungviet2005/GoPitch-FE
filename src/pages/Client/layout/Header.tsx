import React from "react";
import style from "./Header.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(style);

const Header = () => {
  return <div className={cx("container")}>Header</div>;
};

export default Header;
