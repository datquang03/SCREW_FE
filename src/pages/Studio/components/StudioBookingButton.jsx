import React from "react";
import { motion } from "framer-motion";

export default function StudioBookingButton({ studio }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed bottom-8 right-8 bg-black text-white px-6 py-3 rounded-full shadow-xl hover:bg-[#f4d27a] hover:text-black transition font-semibold"
    >
      Đặt lịch ngay
    </motion.button>
  );
}
