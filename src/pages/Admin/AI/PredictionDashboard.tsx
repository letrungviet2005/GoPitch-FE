import {useState} from "react";
import apiClient,{errorMessage} from "../../../services/apiClient";
export default function PredictionDashboard(){
 const [date,setDate]=useState(new Date().toLocaleDateString("en-CA")),[sport,setSport]=useState("Badminton"),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [rows,setRows]=useState<{hour:number;predicted_booking:number}[]>([]);
 async function run(){setBusy(true);setError("");setRows([]);try{const r=await apiClient.post("/ai/predict",{date,sport_type:sport});setRows(r.data.prediction_result);}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 return <section className="p-6 space-y-5"><h1 className="text-2xl font-bold">Dự báo lượt bắt đầu đặt sân</h1><p>Phạm vi toàn hệ thống theo môn. Không phải phần trăm công suất hay dự báo riêng CLB.</p><input aria-label="Ngày dự báo" type="date" value={date} onChange={e=>setDate(e.target.value)}/><select aria-label="Môn" value={sport} onChange={e=>setSport(e.target.value)}><option>Badminton</option><option>Pickleball</option><option>Football</option></select><button disabled={busy} onClick={run}>{busy?"Đang dự báo…":"Dự báo"}</button>{error&&<p role="alert">{error}</p>}<div className="grid grid-cols-2 md:grid-cols-6 gap-3">{rows.map(r=><div key={r.hour} className="border rounded-xl p-4">{r.hour}:00<br/>{r.predicted_booking} lượt</div>)}</div></section>;
}
