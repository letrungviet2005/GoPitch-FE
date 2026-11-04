import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import apiClient,{errorMessage} from "../../../services/apiClient";
export default function Home(){const [metrics,setMetrics]=useState<Record<string,number>|null>(null),[error,setError]=useState("");
 const admin=(localStorage.getItem("userRole")||sessionStorage.getItem("userRole"))?.toLowerCase()==="admin";
 useEffect(()=>{if(admin)apiClient.get("/admin/dashboard/metrics").then(r=>setMetrics(r.data)).catch(e=>setError(errorMessage(e)));},[admin]);
 return <section className="p-6 space-y-5"><h1 className="text-2xl font-bold">Tổng quan GoPitch</h1>{admin?<><p>Doanh thu là tổng hóa đơn đã thanh toán; số tài khoản và CLB bao gồm cả ngừng hoạt động.</p>{error?<p role="alert">{error}</p>:!metrics?<p>Đang tải…</p>:<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries({users:"Tài khoản",clubs:"CLB",bills:"Hóa đơn",revenue:"Doanh thu VND"}).map(([key,label])=><div className="bg-white rounded-xl border p-5" key={key}><p>{label}</p><strong>{metrics[key]?.toLocaleString()}</strong></div>)}</div>}</>:<p>Quản lý CLB của bạn và xem doanh thu theo khoảng ngày.</p>}<div className="flex gap-5"><Link to="/admin/clubs">Quản lý CLB</Link><Link to="/admin/revenue">Hóa đơn và doanh thu</Link><Link to="/admin/calendar">Lịch sân</Link></div></section>;}
