import classNames from "classnames/bind";
import style from "./Pitchs.module.scss";

const cx = classNames.bind(style);

const Pitchs = () => {
  return (
    <div className={cx("pitchCard")}>
      {/* Nửa trên: Hình ảnh sân */}
      <div className={cx("pitchImage")}>
        <img
          src="https://images2.thanhnien.vn/Uploaded/hoangquynh/2022_10_16/nguyen-thuy-linh-3009-doc-lap-2195.jpg"
          alt="Sân bóng"
        />
      </div>

      {/* Nửa dưới: Thông tin sân */}
      <div className={cx("pitchInfo")}>
        <div className={cx("pitchAvatar")}>
          <img
            src="https://images2.thanhnien.vn/Uploaded/hoangquynh/2022_10_16/nguyen-thuy-linh-3009-doc-lap-2195.jpg"
            alt="Avatar sân"
          />
        </div>
        <div className={cx("pitchDetails")}>
          <h3>Sân ABC</h3>
          <p>📍 Địa chỉ: 123 Đường XYZ, Quận 1</p>
          <p>🕒 Giờ mở cửa: 6:00 - 22:00</p>
          <p>⭐ 4.5/5</p>
        </div>
      </div>
    </div>
  );
};

export default Pitchs;
