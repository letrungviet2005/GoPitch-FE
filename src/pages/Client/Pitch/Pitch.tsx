import React from "react";
import classNames from "classnames/bind";
import style from "./css/Pitch.module.scss";

const cx = classNames.bind(style);

const Pitch = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("searchBar")}>
        <input
          type="text"
          placeholder="Nhập tên sân thể thao hoặc vị trí..."
          className={cx("input")}
        />
        <button className={cx("button")}>🏸 Cầu lông gần tôi</button>
        <button className={cx("button")}>🏓 Pickleball gần tôi</button>
        <button className={cx("button")}>🏀 Bóng rổ gần tôi</button>
      </div>
    </div>
  );
};

export default Pitch;
