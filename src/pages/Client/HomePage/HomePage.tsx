import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={cx("homepage")}>
      {/* 1. HERO SECTION */}
      <header className={cx("hero")}>
        <div className={cx("hero-overlay")}></div>
        <div className={cx("hero-content")}>
          <span className={cx("badge")}>Nền tảng đặt sân số 1 Việt Nam</span>
          <h1>
            Nâng Tầm Quản Lý <br />
            <span>Sân Cầu Lông</span> Của Bạn
          </h1>
          <p>
            Giải pháp toàn diện giúp chủ sân tối ưu doanh thu và người chơi tìm
            được sân ưng ý chỉ trong 30 giây.
          </p>
          <div className={cx("hero-btns")}>
            <button
              className={cx("btn-primary")}
              onClick={() => navigate("/pitch")}
            >
              Khám phá sân ngay
            </button>
            <button className={cx("btn-outline")}>Hợp tác chủ sân</button>
          </div>
        </div>
      </header>

      {/* 2. STATS SECTION */}
      <section className={cx("stats")}>
        <div className={cx("stat-item")}>
          <h3>500+</h3>
          <p>Sân cầu lông</p>
        </div>
        <div className={cx("stat-item")}>
          <h3>20.000+</h3>
          <p>Người dùng hàng tháng</p>
        </div>
        <div className={cx("stat-item")}>
          <h3>99%</h3>
          <p>Hài lòng</p>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className={cx("features")}>
        <div className={cx("section-header")}>
          <h2>Tính năng ưu việt tại GoPitch</h2>
          <p>
            Chúng tôi cung cấp công cụ mạnh mẽ nhất cho cả chủ sân và lông thủ.
          </p>
        </div>

        <div className={cx("feature-grid")}>
          <div className={cx("feature-card")}>
            <div className={cx("icon")}>🏸</div>
            <h3>Lịch Sân Trực Quan</h3>
            <p>
              Theo dõi trạng thái sân trống theo thời gian thực. Giao diện kéo
              thả dễ dàng sử dụng.
            </p>
          </div>

          <div className={cx("feature-card")}>
            <div className={cx("icon")}>💰</div>
            <h3>Thanh Toán Tự Động</h3>
            <p>
              Hỗ trợ QR Code, kiểm tra minh chứng thanh toán giúp quản lý dòng
              tiền minh bạch.
            </p>
          </div>

          <div className={cx("feature-card")}>
            <div className={cx("icon")}>📈</div>
            <h3>Báo Cáo Doanh Thu</h3>
            <p>
              Thống kê chi tiết theo ngày/tháng giúp chủ sân nắm bắt tình hình
              kinh doanh.
            </p>
          </div>

          <div className={cx("feature-card")}>
            <div className={cx("icon")}>📱</div>
            <h3>Đặt Sân Linh Hoạt</h3>
            <p>
              Người chơi có thể đặt sân mọi lúc mọi nơi, chọn đúng khung giờ và
              sân con yêu thích.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className={cx("cta")}>
        <h2>Sẵn sàng trải nghiệm GoPitch?</h2>
        <p>Tham gia cùng hàng nghìn chủ sân và người chơi ngay hôm nay.</p>
        <button className={cx("btn-cta")} onClick={() => navigate("/register")}>
          Bắt đầu miễn phí
        </button>
      </section>

      <footer className={cx("footer")}>
        <p>© 2026 GoPitch Team. Kiến tạo cộng đồng cầu lông vững mạnh.</p>
      </footer>
    </div>
  );
};

export default HomePage;
