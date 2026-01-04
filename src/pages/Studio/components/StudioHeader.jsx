import React from "react";
import { motion } from "framer-motion";

export default function StudioHeader({ studio }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="studio-hero text-white py-12 md:py-16 px-4 md:px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        <div className="studio-hero__glass px-4 py-2 w-fit text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          Studio signature
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
              {studio.name || "Studio"}
            </h1>
            <p className="text-lg text-gray-100/90 max-w-3xl leading-relaxed">
              {studio.description || "Mô tả đang được cập nhật."}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {studio.location && (
                <span className="studio-badge">📍 {studio.location}</span>
              )}
              {studio.basePricePerHour && (
                <span className="studio-badge">💰 {Number(studio.basePricePerHour).toLocaleString("vi-VN")} VND/giờ</span>
              )}
              {studio.capacity && (
                <span className="studio-badge">👥 Tối đa {studio.capacity} người</span>
              )}
              {studio.area && <span className="studio-badge">📐 {studio.area} m²</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="studio-chip w-full">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-800/70">Không gian</div>
              <div className="text-lg font-bold text-amber-900">Clean, ready-to-shoot</div>
            </div>
            <div className="studio-chip w-full">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-800/70">Dịch vụ</div>
              <div className="text-lg font-bold text-amber-900">Onsite support</div>
            </div>
            <div className="studio-chip col-span-2 w-full">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-800/70">Ưu tiên</div>
              <div className="text-lg font-bold text-amber-900">Lịch linh hoạt & bảo trì thiết bị</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
