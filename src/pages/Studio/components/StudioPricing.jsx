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
    <div className="studio-pricing-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          ₫
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Giá thuê</h2>
      </div>
      <div className="mb-3">
        <div className="text-3xl md:text-3xl font-extrabold text-white drop-shadow-sm mb-1">
          {formatCurrency(displayPrice)} VND
          <span className="ml-2 text-base md:text-lg font-medium text-amber-200">/ giờ</span>
        </div>
      </div>
      <div className="pt-3 border-t border-white/10">
        <p className="text-xs md:text-sm text-sky-100 font-medium">
          Giá cơ bản, chưa bao gồm phụ phí (nếu có).
        </p>
      </div>
    </div>
  );
}
