import React from "react";

export default function StudioAmenities({ amenities = [] }) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 md:p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl shadow-sm">
          ✦
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tiện ích</h2>
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
