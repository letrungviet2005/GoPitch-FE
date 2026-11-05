import { useEffect, useState } from "react";
import apiClient, { errorMessage } from "../../services/apiClient";

type Club = {
  id: number;
  name: string;
  pitches: { id: number; name: string }[];
};
type Slot = {
  id: number;
  startTime: string;
  endTime: string;
  active: boolean;
  price: number;
};

export default function CalendarManager() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [pitch, setPitch] = useState(0);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("/owner/clubs", { params: { size: 100 } })
      .then(res => setClubs(res.data.result))
      .catch(err => setError(errorMessage(err)));
  }, []);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await apiClient.get<Slot[] | { result?: Slot[] }>(
        "/calendars", { params: { pitchId: pitch, date } },
      );
      const data = Array.isArray(res.data) ? res.data : res.data?.result;
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function generate() {
    setBusy(true);
    try {
      await apiClient.post("/calendars/generate", null, {
        params: { pitchId: pitch, date },
      });
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggle(slot: Slot) {
    setBusy(true);
    try {
      await apiClient.patch(`/owner/operations/calendars/${slot.id}/active`, null, {
        params: { active: !slot.active },
      });
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Lịch và khoảng không khả dụng</h1>
      <p>Slot dài 60 phút. Không thể mở hoặc khóa lịch đã có booking. Ngừng hoạt động slot dùng cho bảo trì.</p>
      <select aria-label="Sân" value={pitch} onChange={e => setPitch(Number(e.target.value))}>
        <option value={0}>Chọn sân</option>
        {clubs.flatMap(club => (club.pitches || []).map(p => (
          <option key={p.id} value={p.id}>{club.name} — {p.name}</option>
        )))}
      </select>
      <input aria-label="Ngày" type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button disabled={!pitch || busy} onClick={load}>Xem lịch</button>
      <button disabled={!pitch || busy} onClick={generate}>Tạo lịch từ bảng giá</button>
      {error && <p role="alert">{error}</p>}
      {busy ? (
        <p>Đang xử lý…</p>
      ) : !slots.length ? (
        <p>Chưa có lịch hiển thị. Chọn sân và ngày để tải.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {slots.map(slot => (
            <article className="border rounded p-3" key={slot.id}>
              <p>{slot.startTime.slice(11, 16)} – {slot.endTime.slice(11, 16)}</p>
              <p>{slot.price.toLocaleString()} VND</p>
              <button disabled={busy} onClick={() => toggle(slot)}>
                {slot.active ? "Khóa slot" : "Mở lại slot"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
