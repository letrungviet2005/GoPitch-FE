import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { getMyProfile } from "../../../services/userService";
import {
  createPaymentLink,
  storePendingBooking,
} from "../../../services/paymentService";
import type { BookingSlot, UserProfile } from "../../../types/api";
import styles from "./Payment.module.scss";

const cx = classNames.bind(styles);

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedSlots, totalAmount, clubId, clubName } =
    (location.state as {
      selectedSlots?: BookingSlot[];
      totalAmount?: number;
      clubId?: number;
      clubName?: string;
    }) || {};

  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!selectedSlots) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        if (!token) {
          navigate("/signin");
          return;
        }

        setUserInfo(await getMyProfile());
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, [selectedSlots, navigate]);

  const handlePayOSPayment = async () => {
    try {
      setLoading(true);

      const paymentData = await createPaymentLink(totalAmount!);

      storePendingBooking({
        slots: selectedSlots!,
        clubId: clubId!,
        totalAmount: totalAmount!,
        orderCode: paymentData.orderCode,
      });

      if (paymentData.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        alert("Không nhận được link thanh toán từ PayOS.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi khởi tạo thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className={cx("loading-screen")}>
        <Loader2 className={cx("spin")} /> Đang chuẩn bị đơn hàng...
      </div>
    );

  return (
    <div className={cx("payment-page")}>
      <div className={cx("container")}>
        <button className={cx("back-btn")} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Quay lại
        </button>

        <header className={cx("header")}>
          <h1>Xác nhận & Thanh toán</h1>
          <p>Sử dụng cổng thanh toán an toàn PayOS</p>
        </header>

        <div className={cx("content-grid")}>
          <div className={cx("info-section")}>
            <section className={cx("card")}>
              <div className={cx("card-header")}>
                <MapPin size={20} className={cx("icon")} />
                <h3>Thông tin sân đặt</h3>
              </div>
              <div className={cx("club-name")}>{clubName}</div>
              <div className={cx("slots-list")}>
                {selectedSlots?.map((slot, idx) => (
                  <div key={idx} className={cx("slot-item")}>
                    <div className={cx("slot-info")}>
                      <span className={cx("date")}>{slot.date}</span>
                      <span className={cx("time")}>
                        {slot.time} • {slot.pitchName}
                      </span>
                    </div>
                    <span className={cx("price")}>
                      {slot.price.toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={cx("card")}>
              <div className={cx("card-header")}>
                <User size={20} className={cx("icon")} />
                <h3>Thông tin người đặt</h3>
              </div>
              <div className={cx("user-details")}>
                <div className={cx("detail-item")}>
                  <User size={16} />{" "}
                  <span>
                    {userInfo?.userInformation?.fullName || userInfo?.name}
                  </span>
                </div>
                <div className={cx("detail-item")}>
                  <Phone size={16} />{" "}
                  <span>
                    {userInfo?.userInformation?.phoneNumber || "Chưa có SĐT"}
                  </span>
                </div>
                <div className={cx("detail-item")}>
                  <Mail size={16} /> <span>{userInfo?.email}</span>
                </div>
              </div>
            </section>
          </div>

          <div className={cx("action-section")}>
            <section className={cx("card", "payment-card")}>
              <div className={cx("total-section")}>
                <span>Tổng thanh toán</span>
                <div className={cx("amount")}>
                  {totalAmount?.toLocaleString()} VNĐ
                </div>
              </div>

              <div className={cx("payos-info-box")}>
                <div className={cx("payos-header")}>
                  <CreditCard size={20} color="#00b894" />
                  <span>Cổng thanh toán PayOS</span>
                </div>
                <ul className={cx("benefit-list")}>
                  <li>
                    <ShieldCheck size={14} /> Thanh toán an toàn qua QR Code
                  </li>
                  <li>
                    <ShieldCheck size={14} /> Xác nhận tức thì
                  </li>
                  <li>
                    <ShieldCheck size={14} /> Hỗ trợ tất cả ngân hàng Việt Nam
                  </li>
                </ul>
              </div>

              <button
                className={cx("confirm-btn", "payos-btn")}
                disabled={loading}
                onClick={handlePayOSPayment}
              >
                {loading ? (
                  <Loader2 className={cx("spin")} />
                ) : (
                  <>
                    <CheckCircle2 size={20} /> THANH TOÁN NGAY
                  </>
                )}
              </button>

              <p className={cx("secure-text")}>
                Bằng cách nhấn thanh toán, bạn đồng ý với điều khoản sử dụng của
                GoPitch.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
