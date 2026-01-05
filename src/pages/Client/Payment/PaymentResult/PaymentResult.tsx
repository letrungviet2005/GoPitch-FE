import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Home,
  RefreshCcw,
  Receipt,
  Calendar as CalendarIcon,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./PaymentResult.module.scss";

const cx = classNames.bind(styles);

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  const hasCalledAPI = useRef(false);

  // Lấy dữ liệu từ cache để hiển thị giao diện
  const totalAmount = localStorage.getItem("pending_totalAmount");

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasCalledAPI.current) return;

      if (status === "PAID" && orderCode) {
        hasCalledAPI.current = true;
        try {
          const token =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");
          const slots = JSON.parse(
            localStorage.getItem("pending_slots") || "[]"
          );
          const clubId = localStorage.getItem("pending_clubId");
          const totalAmountCache = localStorage.getItem("pending_totalAmount");

          await axios.post(
            "http://localhost:8080/api/v1/payment/confirm-payment",
            {
              orderCode,
              slots,
              clubId,
              totalAmount: totalAmountCache,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Chỉ xóa cache khi đã gọi API thành công
          localStorage.removeItem("pending_slots");
          localStorage.removeItem("pending_clubId");
          localStorage.removeItem("pending_totalAmount");
        } catch (e) {
          console.error("Lỗi xác thực:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [status, orderCode]);

  if (loading) {
    return (
      <div className={cx("result-container")}>
        <div className={cx("loading-state")}>
          <Loader2 className={cx("spin")} size={48} />
          <p>Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === "PAID";

  return (
    <div className={cx("result-container")}>
      <div className={cx("result-card", isSuccess ? "success" : "failure")}>
        <div className={cx("icon-wrapper")}>
          {isSuccess ? <CheckCircle2 size={80} /> : <XCircle size={80} />}
        </div>

        <h1 className={cx("title")}>
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>
        <p className={cx("description")}>
          {isSuccess
            ? "Cảm ơn bạn đã tin tưởng GoPitch. Sân của bạn đã được hệ thống giữ chỗ thành công."
            : "Giao dịch đã bị hủy hoặc gặp lỗi trong quá trình xử lý. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
        </p>

        <div className={cx("order-details")}>
          <div className={cx("detail-row")}>
            <span className={cx("label")}>
              <Receipt size={16} /> Mã đơn hàng
            </span>
            <span className={cx("value")}>#{orderCode}</span>
          </div>
          <div className={cx("detail-row")}>
            <span className={cx("label")}>
              <CalendarIcon size={16} /> Trạng thái
            </span>
            <span className={cx("value")}>
              {isSuccess ? "Đã xác nhận" : "Chưa hoàn tất"}
            </span>
          </div>
          {isSuccess && totalAmount && (
            <div className={cx("detail-row", "total")}>
              <span className={cx("label")}>Tổng thanh toán</span>
              <span className={cx("value")}>
                {Number(totalAmount).toLocaleString()} VNĐ
              </span>
            </div>
          )}
        </div>

        <div className={cx("actions")}>
          {!isSuccess && (
            <button className={cx("btn-retry")} onClick={() => navigate(-1)}>
              <RefreshCcw size={18} /> Thử lại
            </button>
          )}
          <button className={cx("btn-home")} onClick={() => navigate("/")}>
            <Home size={18} /> Về trang chủ
          </button>
        </div>

        <p className={cx("footer-text")}>
          Mọi thắc mắc vui lòng liên hệ hotline: 1900 xxxx
        </p>
      </div>
    </div>
  );
};

export default PaymentResult;
