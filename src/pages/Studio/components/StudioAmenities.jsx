import React from "react";

export default function StudioAmenities({ amenities = [] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Tiện ích</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
        {amenities.map((a, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#f4d27a] rounded-full"></span>
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
