import React from "react";

export default function StudioAmenities({ amenities = [] }) {
  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
          ✦
        </div>
        <h2 className="text-2xl font-semibold text-black">Tiện ích</h2>
      </div>
      {amenities.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có tiện ích.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          {amenities.map((a, i) => (
            <li
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-100"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              {typeof a === "string" ? a : JSON.stringify(a)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
