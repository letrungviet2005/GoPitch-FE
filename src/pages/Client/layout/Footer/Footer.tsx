import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import classNames from "classnames/bind";
import style from "./Footer.module.scss";

const cx = classNames.bind(style);

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className={cx("footer")}>
      <div className={cx("container")}>
        <div className={cx("grid")}>
          {/* CỘT 1: BRANDING */}
          <div className={cx("column", "brandCol")}>
            <div className={cx("logo")} onClick={() => navigate("/")}>
              <span className={cx("logoText")}>GO</span>
              <span className={cx("logoHighlight")}>PITCH</span>
            </div>
            <p className={cx("description")}>
              Hệ thống đặt sân cầu lông trực tuyến hàng đầu Việt Nam. Kết nối
              đam mê, nâng tầm trải nghiệm thể thao của bạn.
            </p>
            <div className={cx("socials")}>
              <a href="#">
                <Facebook size={20} />
              </a>
              <a href="#">
                <Instagram size={20} />
              </a>
              <a href="#">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* CỘT 2: QUICK LINKS */}
          <div className={cx("column")}>
            <h3>Khám phá</h3>
            <ul>
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/maps">Bản đồ sân</a>
              </li>
              <li>
                <a href="/services">Dịch vụ</a>
              </li>
              <li>
                <a href="/contact">Liên hệ</a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: HỖ TRỢ */}
          <div className={cx("column")}>
            <h3>Hỗ trợ</h3>
            <ul>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#">Quy định đặt sân</a>
              </li>
              <li>
                <a href="#">Câu hỏi thường gặp</a>
              </li>
            </ul>
          </div>

          {/* CỘT 4: LIÊN HỆ */}
          <div className={cx("column")}>
            <h3>Thông tin liên hệ</h3>
            <ul className={cx("contactList")}>
              <li>
                <MapPin size={18} />
                <span>103 Lê Kim Lăng</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@gopitch.vn</span>
              </li>
            </ul>
            <div className={cx("newsletter")}>
              <input type="email" placeholder="Nhận tin khuyến mãi..." />
              <button>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={cx("bottom")}>
          <p>© {new Date().getFullYear()} GoPitch. All rights reserved.</p>
          <p className={cx("designBy")}>Designed with ❤️ by GoPitch Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
