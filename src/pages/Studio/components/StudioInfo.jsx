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
    basePricePerHour ? `${basePricePerHour} VND/giờ` : null,
    status ? `Trạng thái: ${status}` : null,
    location ? `Địa điểm: ${location}` : null,
  ].filter(Boolean);

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
          i
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Thông tin</h2>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {fullDescription || description || "Thông tin đang được cập nhật."}
      </p>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 text-sm bg-amber-50 text-amber-700 border border-amber-100 rounded-full"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
