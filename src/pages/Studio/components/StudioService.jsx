import React from "react";
import { motion } from "framer-motion";

export default function StudioServices({ services = [] }) {
  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
          S
        </div>
        <h2 className="text-2xl font-semibold text-black">Dịch vụ</h2>
      </div>
      {services.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có dịch vụ.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-white to-amber-50/60 border border-amber-100 shadow-sm text-gray-700"
            >
              {typeof s === "string" ? s : JSON.stringify(s)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
