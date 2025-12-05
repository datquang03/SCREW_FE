import React from "react";

export default function StudioPricing({ pricing }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Giá thuê</h2>
      <div className="text-2xl font-bold text-[#f4d27a]">
        {pricing} VND / giờ
      </div>
    </div>
  );
}
