import React from "react";
import { motion } from "framer-motion";

export default function StudioGallery({ images = [] }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="overflow-hidden rounded-2xl shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] group border border-amber-100 hover:border-amber-200 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all"
          >
            <img
              src={img}
              alt={`Studio image ${i + 1}`}
              className="w-full h-64 md:h-72 object-cover group-hover:scale-110 transition duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
