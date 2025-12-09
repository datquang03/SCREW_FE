import React from "react";

const formatCurrency = (value) => {
  if (Number.isNaN(Number(value))) return value;
  return new Intl.NumberFormat("vi-VN").format(Number(value));
};

export default function StudioPricing({ pricing }) {
  if (pricing === null || pricing === undefined) {
    return null;
  }
  const displayPrice =
    typeof pricing === "object" ? pricing?.basePricePerHour || 0 : pricing;

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
          ₫
        </div>
        <h2 className="text-2xl font-semibold text-black">Giá thuê</h2>
      </div>
      <div className="text-3xl font-extrabold text-amber-600">
        {formatCurrency(displayPrice)} VND
        <span className="text-base font-semibold text-gray-500 ml-1">/ giờ</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Giá cơ bản, chưa bao gồm phụ phí (nếu có).
      </p>
    </div>
  );
}
