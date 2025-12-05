import React from "react";
import { motion } from "framer-motion";

export default function StudioGallery({ images = [] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden rounded-2xl shadow-md group"
          >
            <img
              src={img}
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
