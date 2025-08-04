import classNames from "classnames/bind";
import style from "./Pitchs.module.scss";

const cx = classNames.bind(style);

const Pitchs = () => {
  return (
    <div className={cx("pitchCard")}>
      <div>Ảnh sân Ảnh câu lạc bộ Thông tin sân như chi tiết</div>
    </div>
  );
};
export default Pitchs;
