import React from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiHome,
  FiCalendar,
} from "react-icons/fi";
import roomImage from "../../../assets/room100m2(360).jpg";
import ScheduleCustom from "./ScheduleCustom";

const IntroSection = () => {
  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center flex items-center justify-center px-6 md:px-16"
      style={{
        backgroundImage: `url("${roomImage}")`,
      }}
    >
      {/* Overlay tối nhẹ */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Container chính */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
        {/* Bên trái */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center md:text-left text-white max-w-xl"
        >
          <div
            className="bg-yellow-400/20 border border-yellow-500/40 px-6 md:px-10 py-4 rounded-xl shadow-xl mb-6 min-w-[280px] min-h-[50px] flex items-center justify-center"
          >
            <span className="text-yellow-400 font-semibold tracking-wide text-md text-center">
              • Studio chuyên nghiệp cùng đội ngũ Set Design giàu kinh nghiệm
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight drop-shadow-lg">
            S <br />
            <span className="text-yellow-400">CỘNG</span> <br /> STUDIO
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Đặt phòng tiện nghi hiện đại với giá cả hợp lý và chỉ với vài chạm!
          </p>

          <div className="flex items-center justify-center md:justify-start gap-10 mt-10 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <FiClock className="text-yellow-400 text-lg" />
              <p>Đặt tối thiểu 8 tiếng</p>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-yellow-400 text-lg" />
              <p>Ngay tại Quận 4, TP.HCM</p>
            </div>
          </div>
        </motion.div>

        {/* Bên phải (Form) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[380px] md:w-[520px] text-white"
        >
          {/* Modern glass card with soft gradient border */}
          <div className="p-[2px] rounded-[28px] bg-[linear-gradient(140deg,rgba(148,163,184,0.45),rgba(148,163,184,0.15)_35%,rgba(251,191,36,0.35)_100%)] shadow-[0_16px_60px_rgba(0,0,0,0.45)]">
            <div className="rounded-[26px] bg-[#0b1120]/80 backdrop-blur-xl border border-slate-700/50">
              <div className="px-7 md:px-9 pt-8">
                <h2 className="text-[30px] md:text-[32px] font-bold tracking-tight">
                  <span className="text-yellow-400">Tìm Phòng</span> <span className="text-white">Studio</span>
                </h2>
                <p className="text-[13px] text-slate-300/80 mt-1">Không gian sáng tạo chuyên nghiệp với giá hợp lý</p>
              </div>

              <form className="px-7 md:px-9 pb-9 pt-6 flex flex-col gap-6">
            {/* Loại phòng */}
                <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-wide text-slate-300/80 flex items-center gap-2">
                <FiHome className="text-yellow-400" />
                Loại phòng
              </label>
              <div className="relative group">
                <select className="peer w-full h-[56px] pr-12 pl-4 rounded-2xl bg-[#0e172a] border border-slate-700/60 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-400/60 outline-none transition-all appearance-none text-slate-200">
                <option>Chọn loại phòng</option>
                <option>Phòng 100m²</option>
                <option>Phòng 180m²</option>
                <option>Phòng 300m²</option>
                <option>Phòng 350m²</option>
              </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent peer-focus:ring-yellow-400/40 transition"></div>
              </div>
              <p className="mt-1 text-[12px] text-slate-400">Chọn không gian phù hợp nhu cầu của bạn.</p>
            </div>

            {/* Thời gian */}
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-wide text-slate-300/80 flex items-center gap-2">
                <FiCalendar className="text-yellow-400" />
                Thời gian
              </label>
              <ScheduleCustom />
            </div>

            {/* Số giờ */}
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-wide text-slate-300/80 flex items-center gap-2">
                <FiClock className="text-yellow-400" />
                Thời lượng thuê
              </label>
              <div className="relative">
              <select className="w-full h-[56px] pr-12 pl-4 rounded-2xl bg-[#0e172a] border border-slate-700/60 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-400/60 outline-none transition-all appearance-none text-slate-200">
                <option>Chọn thời lượng</option>
                <option>8 tiếng</option>
                <option>16 tiếng</option>
                <option>24 tiếng</option>
                <option>Thương lượng</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
            </div>

            {/* Quy mô nhóm */}
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-wide text-slate-300/80 flex items-center gap-2">
                <FiUsers className="text-yellow-400" />
                Quy mô nhóm
              </label>
              <div className="relative">
              <select className="w-full h-[56px] pr-12 pl-4 rounded-2xl bg-[#0e172a] border border-slate-700/60 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-400/60 outline-none transition-all appearance-none text-slate-200">
                <option>Chọn quy mô</option>
                <option>1–3 người</option>
                <option>4–6 người</option>
                <option>7+ người</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
            </div>

            {/* Nút gửi */}
            <button
              type="submit"
              className="mt-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold h-[56px] rounded-2xl transition-all shadow-[0_20px_44px_rgba(251,191,36,0.32)] hover:brightness-105 border border-yellow-300/30"
            >
              Tìm phòng ngay
            </button>
          </form>

          <p className="text-[11px] text-gray-400/90 text-center pb-8 -mt-2">
            Đặt tối thiểu 8 tiếng • Bao gồm thiết bị & hỗ trợ Set Design
          </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroSection;
