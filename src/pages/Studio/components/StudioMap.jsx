import React from "react";

export default function StudioMap({ location }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Bản đồ</h2>
      <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Google Map Placeholder</span>
      </div>
    </div>
  );
}
