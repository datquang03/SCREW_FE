import React from "react";
import { motion } from "framer-motion";

export default function StudioServices({ services = [] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Dịch vụ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-gray-50 border border-gray-100"
          >
            {s}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
