import React from "react";
import { motion } from "framer-motion";

export default function StudioServices({ services = [] }) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 md:p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
          ⚙️
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dịch vụ</h2>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 md:p-5 rounded-xl bg-gradient-to-br from-white to-blue-50/60 border border-blue-100 shadow-sm hover:shadow-md text-gray-700 font-medium transition-all"
            >
              {typeof s === "string" ? s : JSON.stringify(s)}
            </motion.div>
          ))}
        </div>
    </div>
  );
}
