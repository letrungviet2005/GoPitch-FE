import React, { useEffect, useState } from "react";
import { MapPin, Clock, Receipt, ShoppingBag } from "lucide-react";
import styles from "./BookingHistory.module.scss";
import classNames from "classnames/bind";
import { getMyBookingHistory } from "../../../services/billService";
import type { BillResponseDTO } from "../../../types/api";

const cx = classNames.bind(styles);

const BookingHistory: React.FC = () => {
  const [bills, setBills] = useState<BillResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setBills(await getMyBookingHistory());
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className={cx("loading")}>Đang tải lịch sử...</div>;

  return (
    <div className={cx("history-container")}>
      <div className={cx("header")}>
        <h1>
          <Receipt size={28} /> Lịch sử đặt sân
        </h1>
        <p>Xem lại các giao dịch và thông tin sân đã đặt</p>
      </div>

      <div className={cx("bill-list")}>
        {bills.length === 0 ? (
          <div className={cx("empty-state")}>
            <ShoppingBag size={48} />
            <p>Bạn chưa đặt sân nào cả!</p>
          </div>
        ) : (
          bills.map((bill) => (
            <div key={bill.id} className={cx("bill-card")}>
              <div className={cx("bill-header")}>
                <div className={cx("club-info")}>
                  <h2 className={cx("club-name")}>{bill.clubName}</h2>
                  <p className={cx("club-address")}>
                    <MapPin size={14} /> {bill.clubAddress}
                  </p>
                </div>
                <div className={cx("bill-status")}>Đã thanh toán</div>
              </div>

              <div className={cx("slots-section")}>
                {bill.slots?.map((slot) => (
                  <div key={slot.id} className={cx("slot-item")}>
                    <div className={cx("slot-main")}>
                      <div className={cx("pitch-name")}>{slot.pitchName}</div>
                      <div className={cx("slot-time")}>
                        <Clock size={14} />
                        {new Date(slot.startTime).toLocaleDateString("vi-VN")}{" "}
                        |
                        {new Date(slot.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -
                        {new Date(slot.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className={cx("slot-price")}>
                      {slot.price.toLocaleString()} VNĐ
                    </div>
                  </div>
                ))}
              </div>

              <div className={cx("bill-footer")}>
                <div className={cx("order-date")}>
                  Mã đơn: #{bill.id} |{" "}
                  {new Date(bill.createdAt).toLocaleString("vi-VN")}
                </div>
                <div className={cx("total-amount")}>
                  <span>Tổng tiền:</span>
                  <span className={cx("price")}>
                    {bill.price.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
