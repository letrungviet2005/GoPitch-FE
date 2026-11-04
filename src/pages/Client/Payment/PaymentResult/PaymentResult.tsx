import {useEffect,useState} from "react";
import {useSearchParams,Link} from "react-router-dom";
import {confirmPayment,clearPendingBooking} from "../../../../services/paymentService";
import {errorMessage} from "../../../../services/apiClient";
export default function PaymentResult(){
 const [params]=useSearchParams();const code=params.get("orderCode")||localStorage.getItem("pending_orderCode")||"";
 const [state,setState]=useState("VERIFYING"),[error,setError]=useState(""),[amount,setAmount]=useState(0);
 useEffect(()=>{let live=true;if(!code){setState("UNKNOWN");return;}
 confirmPayment({orderCode:code}).then(r=>{if(live){setState(r.state);setAmount(r.amount);if(r.state==="BOOKED")clearPendingBooking();}}).catch(e=>{if(live){setError(errorMessage(e));setState("UNKNOWN");}});return()=>{live=false;};},[code]);
 return <main className="max-w-xl mx-auto p-8 space-y-5"><h1 className="text-2xl font-bold">{state==="BOOKED"?"Đặt sân đã được xác nhận":state==="PAID_CONFLICT"?"Đã nhận tiền, lịch cần xử lý":state==="VERIFYING"?"Đang kiểm tra giao dịch":"Chưa xác nhận đặt sân"}</h1>
 <p>{error|| (state==="PAID_CONFLICT"?"Lịch không còn khả dụng. Hãy liên hệ chủ sân với mã đơn để được xử lý hoặc hoàn tiền.":state==="PENDING"?"Giao dịch chưa được xác nhận bởi PayOS. Bạn có thể kiểm tra lại trang này.":"")}</p><p>Mã đơn: {code}</p>{amount>0&&<p>{amount.toLocaleString()} VND</p>}<Link to="/booking-history">Xem lịch sử</Link> · <Link to="/">Trang chủ</Link></main>;
}
