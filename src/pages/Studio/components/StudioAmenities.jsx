import React from "react";

export default function StudioAmenities({ amenities = [] }) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="studio-panel p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="studio-panel__title">
          <span className="h-8 w-8 rounded-lg bg-white/70 flex items-center justify-center text-2xl">✦</span>
          <span className="text-xl md:text-2xl font-extrabold">Tiện ích</span>
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenities.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border border-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all"
          >
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></span>
            <span className="text-gray-700 font-medium">{typeof a === "string" ? a : JSON.stringify(a)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
