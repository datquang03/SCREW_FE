import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiX } from "react-icons/fi";

const ScheduleCustom = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");

  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const formattedDisplay = useMemo(() => {
    if (!date) return "Chọn thời gian...";
    if (date === todayStr) return "Hôm nay";
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }, [date, todayStr]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-[56px] px-4 bg-[#0F172A] border border-[#C5A267] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] flex items-center justify-between text-left hover:border-[#C5A267] hover:bg-[#C5A267]/10 focus:outline-none focus:ring-4 focus:ring-[#C5A267]/20 transition-all uppercase tracking-[0.2em]"
      >
        <span className={`text-white ${date === todayStr ? "bg-[#C5A267]/20 text-[#C5A267] px-2.5 py-1" : ""}`}>
          {formattedDisplay}
        </span>
        <FiCalendar className="text-[#C5A267]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#C5A267] font-semibold uppercase tracking-[0.2em] text-xs">Chọn ngày</p>
              <FiX
                className="cursor-pointer text-slate-400 hover:text-[#C5A267]"
                onClick={() => setOpen(false)}
              />
            </div>

            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setOpen(false);
              }}
              className="w-full h-[44px] px-3 bg-white border border-slate-200 focus:ring-2 focus:ring-[#C5A267]/70 outline-none text-[#0F172A]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleCustom;
