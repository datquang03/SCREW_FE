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
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-4 border-amber-300 rounded-2xl p-6 md:p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(251,191,36,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-amber-500 border-2 border-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          ₫
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Giá thuê</h2>
      </div>
      <div className="mb-4">
        <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text mb-2">
          {formatCurrency(displayPrice)} VND
        </div>
        <span className="text-lg md:text-xl font-semibold text-amber-700">/ giờ</span>
      </div>
      <div className="pt-4 border-t border-amber-200">
        <p className="text-sm md:text-base text-amber-700 font-medium">
          Giá cơ bản, chưa bao gồm phụ phí (nếu có).
        </p>
      </div>
    </div>
  );
}
