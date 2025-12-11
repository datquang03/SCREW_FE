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
      className="fixed bottom-8 right-8 bg-black px-10 py-5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-gray-900 transition-all font-bold text-lg z-[9999] hover:scale-110 border-2 border-amber-400/50 backdrop-blur-sm"
      style={{
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(251, 191, 36, 0.3), 0 0 20px rgba(251, 191, 36, 0.2)",
        color: "#fbbf24", // amber-400
      }}
    >
      <span className="drop-shadow-lg font-extrabold">Đặt lịch ngay</span>
    </motion.button>
  );
}
