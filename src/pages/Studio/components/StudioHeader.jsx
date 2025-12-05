import React from "react";
import { motion } from "framer-motion";

export default function StudioHeader({ studio }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black text-white py-16 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">{studio.name}</h1>
        <p className="text-lg text-gray-300 mt-3 max-w-2xl">
          {studio.description}
        </p>
      </div>
    </motion.div>
  );
}
