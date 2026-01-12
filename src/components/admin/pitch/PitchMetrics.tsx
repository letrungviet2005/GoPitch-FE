export default function PitchMetrics({ pitches }: { pitches: any[] }) {
  const metrics = [
    {
      label: "Doanh thu hôm nay",
      value: "3.200k",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Sân đang hoạt động",
      value: `${pitches.filter((p: any) => p.status === "occupied").length}/${
        pitches.length
      }`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Lịch đặt mới",
      value: "12",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Tỉ lệ lấp đầy",
      value: "85%",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/5"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {m.label}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {m.value}
            </h3>
            <div
              className={`rounded-lg ${m.bg} px-2 py-1 text-xs font-bold ${m.color}`}
            >
              +2.5%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
