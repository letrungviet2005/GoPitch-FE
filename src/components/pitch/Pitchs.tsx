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
      </div>

      <div className={cx("pitchInfo")}>
        <div className={cx("pitchDetails")}>
          <h3>{name}</h3>
          <p className={cx("address")}>📍 {address}</p>

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
