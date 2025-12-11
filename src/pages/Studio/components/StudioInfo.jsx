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
    <div className="bg-white border border-amber-100 rounded-2xl p-6 md:p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl shadow-sm">
          i
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Thông tin</h2>
      </div>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
        {fullDescription || description || "Thông tin đang được cập nhật."}
      </p>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-100">
          {chips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 border border-amber-200 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
