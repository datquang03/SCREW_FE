import React from "react";
import { motion } from "framer-motion";

const KPIStat = ({ title, value, diffText, icon, gradient = "from-yellow-400 to-amber-500" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br ${gradient} text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]`}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/15 blur-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm md:text-[13px] uppercase tracking-wider/relaxed opacity-90 font-semibold">
            {title}
          </p>
          <p className="mt-2 text-2xl md:text-3xl font-extrabold drop-shadow-sm">
            {value}
          </p>
          {diffText && (
            <p className="mt-2 text-xs md:text-sm opacity-90">{diffText}</p>
          )}
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-inner">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KPIStat;


