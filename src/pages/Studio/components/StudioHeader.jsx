import React from "react";
import { motion } from "framer-motion";

export default function StudioHeader({ studio }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-6 bg-gradient-to-br from-amber-50 via-white to-blue-50 text-gray-900 border-b border-amber-100"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 border border-amber-100 rounded-full text-sm font-semibold text-amber-700 w-fit shadow-sm">
          Studio nổi bật
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 drop-shadow-sm">
          {studio.name || "Studio"}
        </h1>
        <p className="text-lg text-gray-600 mt-1 max-w-3xl leading-relaxed">
          {studio.description || "Mô tả đang được cập nhật."}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {studio.location && (
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-100 text-gray-700 shadow-sm">
              📍 {studio.location}
            </span>
          )}
          {studio.basePricePerHour && (
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-100 text-amber-700 font-semibold shadow-sm">
              💰 {studio.basePricePerHour} VND/giờ
            </span>
          )}
          {studio.capacity && (
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-100 text-gray-700 shadow-sm">
              👥 Tối đa {studio.capacity} người
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
