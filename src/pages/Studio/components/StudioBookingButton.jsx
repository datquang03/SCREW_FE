import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function StudioBookingButton({ studio }) {
  const navigate = useNavigate();

  if (!studio?._id) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      onClick={() => navigate(`/booking/${studio._id}`)}
      className="fixed bottom-8 right-8 px-10 py-5 rounded-full transition-all font-bold text-lg z-[9999] hover:scale-110 backdrop-blur-sm studio-floating-button"
    >
      <span className="drop-shadow-lg font-extrabold">Đặt lịch ngay</span>
    </motion.button>
  );
}
