import React, { useState, useEffect } from "react";
import guestImage from "../../../assets/Danh sách đối tác S Cộng (2).png";
import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { MdOutlineZoomOutMap } from "react-icons/md";

const GuestSection = () => {
  const [open, setOpen] = useState(false);

  // 🔒 Lock scroll + ESC
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <section className="relative py-10 md:py-20 flex justify-center items-center overflow-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center animate-slide-up px-0 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-2 text-center">
          Khách hàng nổi bật
        </h2>

        <p className="text-lg text-slate-600 text-center max-w-2xl mb-6">
          Cảm ơn các khách hàng đã tin tưởng và lựa chọn S+ Studio.
        </p>

        {/* IMAGE + HOVER */}
        <div className="relative group cursor-pointer w-full">
          <img
            src={guestImage}
            alt="Khách hàng nổi bật"
            className="
              w-full max-h-[520px] sm:max-h-[420px] md:max-h-[520px]
              object-contain
              transition-all duration-500
              group-hover:brightness-50
            "
            draggable={false}
          />

          {/* ICON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => setOpen(true)}
              className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition cursor-pointer"
            >
              <MdOutlineZoomOutMap className="text-2xl text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 LIGHTBOX */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center animate-fadeIn"
            onClick={() => setOpen(false)}
          >
            {/* CLOSE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="
                absolute top-4 right-4 md:top-6 md:right-6
                bg-white
                text-black
                p-3 rounded-full
                transition-all
                shadow-lg
                cursor-pointer
              "
            >
              <FiX className="text-2xl md:text-3xl" />
            </button>

            {/* IMAGE */}
            <div
              className="max-w-[95vw] max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={guestImage}
                alt="Zoom Guest"
                className="object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>,
          document.body
        )}

      {/* Animation */}
      <style>
        {`
          .animate-slide-up {
            opacity: 0;
            transform: translateY(60px);
            animation: slideUp 1s cubic-bezier(.4,2,.3,1) 0.2s forwards;
          }

          @keyframes slideUp {
            to {
              opacity: 1;
              transform: none;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};

export default GuestSection;
