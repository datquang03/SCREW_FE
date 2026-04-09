import React, { useState, useEffect, useRef } from "react";
import map from "../../../assets/S Cộng Studio Map(Bản cuối).png";
import {  FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { MdOutlineZoomOutMap } from "react-icons/md";


const MapSection = () => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const touchStartY = useRef(null);

  // 🔒 Lock scroll + ESC
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // 📱 Swipe down để đóng
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartY.current) return;
    const currentY = e.touches[0].clientY;

    if (currentY - touchStartY.current > 100) {
      setOpen(false);
    }
  };

  return (
    <section className="relative py-10 md:py-20 flex flex-col items-center overflow-hidden bg-white">
      <div className="w-full mx-auto flex flex-col items-center animate-slide-up px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-2 text-center">
          Bản đồ S+ Studio
        </h2>

        <p className="text-lg text-slate-600 text-center max-w-2xl mb-6">
          Vị trí các studio của chúng tôi trên toàn thành phố.
        </p>

        {/* MAP */}
        <div className="w-full overflow-x-hidden relative">
          <div
            style={{
              width: "150%",
              minWidth: 1200,
              marginLeft: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="relative group cursor-pointer">
              <img
                src={map}
                alt="Bản đồ"
                className="
                  w-full h-auto object-contain mb-8 bg-white
                  transition-all duration-500
                  group-hover:brightness-50
                "
                draggable={false}
              />

              {/* ICON */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setOpen(true)}
                  className="bg-white/90 p-4 rounded-full shadow-xl hover:scale-110 transition"
                >
                  <MdOutlineZoomOutMap className="text-2xl text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 LIGHTBOX */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center animate-fadeIn"
            onClick={() => setOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 FIX BUG
                setOpen(false);
              }}
              className="
                absolute top-4 right-4 md:top-6 md:right-6
                z-[10000]
                bg-white backdrop-blur-md
                text-black
                p-3 rounded-full
                transition-all duration-300
                shadow-lg
                hover:scale-110
                cursor-pointer
              "
            >
              <FiX className="text-2xl md:text-3xl" />
            </button>

            {/* 🖼 IMAGE WRAPPER (scroll khi zoom) */}
            <div
              className="max-w-[95vw] max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={map}
                alt="Zoom Map"
                onDoubleClick={() => setZoom(!zoom)}
                className={`
                  object-contain
                  rounded-lg
                  shadow-2xl
                  transition-all duration-300
                  ${
                    zoom
                      ? "scale-150 cursor-zoom-out"
                      : "scale-100 cursor-zoom-in"
                  }
                `}
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

export default MapSection;
