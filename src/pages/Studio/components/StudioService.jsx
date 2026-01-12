import React from "react";
import { motion } from "framer-motion";

export default function StudioServices({ services = [] }) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="studio-panel p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="studio-panel__title">
          <span className="h-8 w-8 rounded-lg bg-white/70 flex items-center justify-center text-2xl">⚙️</span>
          <span className="text-xl md:text-2xl font-extrabold">Dịch vụ</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 md:p-5 rounded-xl bg-gradient-to-br from-white to-indigo-50/70 border border-indigo-100 shadow-sm hover:shadow-md text-gray-700 font-medium transition-all"
          >
            {typeof s === "string" ? s : JSON.stringify(s)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
