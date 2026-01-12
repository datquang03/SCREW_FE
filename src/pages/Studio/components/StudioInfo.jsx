import React from "react";

export default function StudioInfo({ studio }) {
  const {
    description,
    fullDescription,
    location,
    area,
    capacity,
    status,
    basePricePerHour,
  } = studio || {};

  const chips = [
    area ? `${area} m²` : null,
    capacity ? `Sức chứa ${capacity} người` : null,
    basePricePerHour ? `${Number(basePricePerHour).toLocaleString("vi-VN")} VND/giờ` : null,
    status ? `Trạng thái: ${status}` : null,
  ].filter(Boolean);

  return (
    <div className="studio-panel p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="studio-panel__title">
          <span className="h-8 w-8 rounded-lg bg-white/70 flex items-center justify-center text-2xl">ℹ️</span>
          <span className="text-xl md:text-2xl font-extrabold">Thông tin</span>
        </div>
      </div>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
        {fullDescription || description || "Thông tin đang được cập nhật."}
      </p>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-100/60">
          {chips.map((chip, idx) => (
            <span
              key={idx}
              className="studio-pill text-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
