import React from "react";

export default function StudioContact({ studio }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Liên hệ</h2>
      <p className="text-gray-600">📞 {studio.phone}</p>
      <p className="text-gray-600">📍 {studio.address}</p>
    </div>
  );
}
