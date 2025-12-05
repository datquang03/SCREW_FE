import React from "react";

export default function StudioInfo({ studio }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Thông tin</h2>
      <p className="text-gray-600 leading-relaxed">{studio.fullDescription}</p>
    </div>
  );
}
