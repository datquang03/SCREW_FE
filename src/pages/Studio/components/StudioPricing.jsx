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
    <div className="studio-pricing-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          ₫
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Giá thuê</h2>
      </div>
      <div className="mb-4">
        <div className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.45)] mb-2">
          {formatCurrency(displayPrice)} VND
        </div>
        <span className="text-lg md:text-xl font-semibold text-amber-200">/ giờ</span>
      </div>
      <div className="pt-4 border-t border-white/10">
        <p className="text-sm md:text-base text-sky-100 font-medium">
          Giá cơ bản, chưa bao gồm phụ phí (nếu có).
        </p>
      </div>
    </div>
  );
}
