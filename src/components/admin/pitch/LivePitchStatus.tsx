export default function LivePitchStatus({ pitches }: { pitches: any[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-white">
        Trạng thái sân trực tiếp
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
              pitch.status === "occupied"
                ? "border-orange-200 bg-orange-50 dark:bg-orange-500/10"
                : "border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10"
            }`}
          >
            <span
              className={`mb-1 text-xs font-bold uppercase ${
                pitch.status === "occupied"
                  ? "text-orange-600"
                  : "text-emerald-600"
              }`}
            >
              {pitch.status === "occupied" ? "Đang đá" : "Trống"}
            </span>
            <span className="text-lg font-extrabold text-gray-800 dark:text-white">
              {pitch.name}
            </span>
            {pitch.remainingMinutes > 0 && (
              <span className="mt-2 text-[10px] font-medium text-orange-500">
                Còn {pitch.remainingMinutes} phút
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
