export default function UpcomingBookings() {
  const bookings = [
    {
      id: 1,
      customer: "Anh Tuấn",
      time: "18:00 - 19:00",
      pitch: "Sân 5A",
      status: "Đã cọc",
    },
    {
      id: 2,
      customer: "Chị Lan",
      time: "19:30 - 21:00",
      pitch: "Sân 7",
      status: "Chưa cọc",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
        Lịch đặt sắp tới
      </h3>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 dark:border-gray-800"
          >
            <div>
              <p className="font-bold text-gray-800 dark:text-white">
                {b.customer}
              </p>
              <p className="text-xs text-gray-500">
                {b.time} • <span className="text-brand-500">{b.pitch}</span>
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                b.status === "Đã cọc"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
