import React from "react";
import classNames from "classnames/bind";
import style from "./Pitchs.module.scss";

const cx = classNames.bind(style);

interface PitchsProps {
  image: string;
  name: string;
  address: string;
  hours: string;
  rating: number;
  distance?: string | null;
}

const Pitchs: React.FC<PitchsProps> = ({
  image,
  name,
  address,
  hours,
  rating,
  distance,
}) => {
  return (
    <div className={cx("pitchCard")}>
      <div className={cx("pitchImage")}>
        <img src={image} alt={name} />
        {/* Đã xóa distance-tag ở đây */}
      </div>

      <div className={cx("pitchInfo")}>
        {/* Nếu ông có avatar thì để đây, không thì bỏ qua */}
        <div className={cx("pitchDetails")}>
          <h3>{name}</h3>
          <p className={cx("address")}>📍 {address}</p>

          {/* HIỂN THỊ SỐ KM Ở ĐÂY */}
          {distance && (
            <p className={cx("distanceText")}>
              🏃 Cách đây: <strong>{distance}</strong>
            </p>
          )}

          <div className={cx("pitchBottom")}>
            <span>🕒 {hours}</span>
            <span>⭐ {rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pitchs;
