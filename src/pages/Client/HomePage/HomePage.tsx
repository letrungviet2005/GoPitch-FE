import React from "react";
import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const HomePage = () => {
  return (
    <div className={cx("homepage")}>
      <header className={cx("hero")}>
        <h1>Chào mừng đến với GoPitch</h1>
        <p>Đặt sân thể thao nhanh chóng – Tiện lợi – Chính xác</p>
        <div className={cx("buttons")}>
          <button className={cx("btn", "login")}>Đăng nhập</button>
          <button className={cx("btn", "register")}>Đăng ký</button>
        </div>
      </header>

      <section className={cx("featured")}>
        <h2>Nội dung nổi bật</h2>
        <p>
          Tìm kiếm và đặt sân cầu lông, bóng đá, bóng rổ... chỉ với vài bước đơn
          giản.
        </p>
      </section>

      <footer className={cx("footer")}>
        <p>© 2025 GoPitch. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
