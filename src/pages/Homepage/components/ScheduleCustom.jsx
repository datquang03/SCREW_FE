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
        className="w-full h-[56px] px-4 rounded-2xl bg-[#0e172a] border border-slate-700/60 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] flex items-center justify-between text-left hover:border-yellow-400/50 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 transition-all"
      >
        <span className={`text-slate-200 ${date === todayStr ? "bg-yellow-500/20 text-yellow-200 px-2.5 py-1 rounded-lg" : ""}`}>
          {formattedDisplay}
        </span>
        <FiCalendar className="text-yellow-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="absolute z-20 mt-2 w-full bg-[#0b1120]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-[0_18px_56px_rgba(0,0,0,0.45)] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-yellow-400 font-semibold">Chọn ngày</p>
              <FiX
                className="cursor-pointer text-gray-400 hover:text-yellow-400"
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
              className="w-full h-[44px] px-3 rounded-xl bg-[#0e172a] border border-slate-600 focus:ring-2 focus:ring-yellow-400/70 outline-none text-gray-200"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleCustom;
