import React from "react";
import classNames from "classnames";
import style from "./css/Pitch.module.scss";

const cx = classNames.bind(style);

const Pitch = () => {
  console.log(style);
  return <div className={cx("container")}>Pitch</div>;
};

export default Pitch;
