import classNames from "classnames/bind";
import style from "./Pitchs.module.scss";

const cx = classNames.bind(style);

const Pitchs = ({
  image = "https://via.placeholder.com/600x300?text=No+Image",
  avatar = "https://via.placeholder.com/150?text=No+Avatar",
  name = "Chưa có tên sân",
  address = "Chưa có địa chỉ",
  hours = "Chưa cập nhật",
  rating = "N/A",
}) => {
  return (
    <div className={cx("pitchCard")}>
      {/* Nửa trên: Hình ảnh sân */}
      <div className={cx("pitchImage")}>
        <img src={image} alt={`Sân ${name}`} />
      </div>

      {/* Nửa dưới: Thông tin sân */}
      <div className={cx("pitchInfo")}>
        <div className={cx("pitchAvatar")}>
          <img src={avatar || image} alt={`Avatar của ${name}`} />
        </div>
        <div className={cx("pitchDetails")}>
          <h3>{name}</h3>
          <p>📍 Địa chỉ: {address}</p>
          <p>🕒 Giờ mở cửa: {hours}</p>
          <p>⭐ {rating}/5</p>
        </div>
      </div>
    </div>
  );
};

export default Pitchs;
