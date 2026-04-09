import React, { useEffect, useState } from "react";
import { Button } from "antd";
import {
  FiArrowRight,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getActiveStudios } from "../../../features/studio/studioSlice";
import Section from "../../../components/common/Section";
import SkeletonStudioCard from "../../../components/skeletons/SkeletonStudioCard";

const StudioSection = () => {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.studio);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (!studios || studios.length <= itemsPerView) return;

    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prev) => (prev + 1) % studios.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering, studios, itemsPerView]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + studios.length) % studios.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % studios.length);
  };

  const translateX = -currentIndex * (100 / itemsPerView);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonStudioCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Section
      title="Studio Nổi Bật"
      subtitle="Không gian được khách hàng yêu thích nhất"
      className="py-24 bg-white"
    >
      <div className="relative max-w-7xl mx-auto px-4">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="px-8 py-8">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {studios.map((studio) => (
                <div
                  key={studio._id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: itemsPerView === 1 ? 320 : 340,
                  }}
                >
                  <div
                    className="group h-full border border-slate-100 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C5A267] flex flex-col cursor-pointer rounded-3xl overflow-hidden"
                    onClick={() =>
                      (window.location.href = `/studio/${studio._id}`)
                    }
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-40 overflow-hidden">
                      <img
                        src={studio.images?.[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 px-6 pt-6 pb-4">
                      {/* NAME */}
                      <h3 className="mb-2 leading-tight">
                        <span className="studio-name">{studio.name}</span>
                      </h3>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {studio.description?.slice(0, 85)}...
                      </p>

                      {/* 🔥 BADGE XỊN */}
                      <div className="flex flex-wrap gap-2">
                        {studio.capacity && (
                          <span className="pill pill-users">
                            <FiUsers />
                            {studio.capacity} người
                          </span>
                        )}

                        {studio.area && (
                          <span className="pill pill-area">
                            <FiMaximize />
                            {studio.area} m²
                          </span>
                        )}
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="px-6 pb-6">
                      <a
                        href={`/studio/${studio._id}`}
                        className="w-full h-12 bg-[#0F172A] text-[#C5A267] hover:bg-[#C5A267] hover:text-[#0F172A] flex items-center justify-center rounded-full font-semibold transition-all"
                      >
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NAV */}
          {studios.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 rounded-full"
              >
                <FiChevronLeft size={28} />
              </button>

              <button
                onClick={goNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 rounded-full"
              >
                <FiChevronRight size={28} />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-12">
          <Button
            type="primary"
            size="large"
            href="/studio"
            icon={<FiArrowRight size={22} />}
            style={{
              backgroundColor: "#A0826D",
              borderColor: "#A0826D",
              height: "52px",
            }}
          >
            Xem tất cả Studio
          </Button>
        </div>
      </div>

      {/* STYLE */}
      <style>
        {`
/* 💎 NAME 14 MÀU */
.studio-name {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(
    90deg,
    #ff0000,
    #ff7f00,
    #ffff00,
    #7fff00,
    #00ff00,
    #00ff7f,
    #00ffff,
    #007fff,
    #0000ff,
    #7f00ff,
    #ff00ff,
    #ff007f,
    #ff4d4d,
    #ffa500
  );
  background-size: 400% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: rainbowMove 6s linear infinite;
  transition: all 0.4s ease;
  display: inline-block;
}

/* ✨ HOVER = PHÓNG TO + GLOW */
.group:hover .studio-name {
  transform: scale(1.1);
  letter-spacing: 0.6px;
  filter: drop-shadow(0 0 6px rgba(255, 200, 100, 0.6));
}

/* 🌈 ANIMATION */
@keyframes rainbowMove {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 400% center;
  }
}

/* 📱 RESPONSIVE */
@media (max-width: 640px) {
  .studio-name {
    font-size: 18px;
  }

  .group:hover .studio-name {
    font-size: 20px;
  }
}
`}
      </style>
      <style>
        {`
/* 💎 NAME XỊN SÒ */
.studio-name {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(90deg, #0F172A, #1E293B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.4s ease;
  display: inline-block;
}

/* ✨ HOVER NAME */
.group:hover .studio-name {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(
    90deg,
    #ff0000,
    #ff7f00,
    #ffff00,
    #7fff00,
    #00ff00,
    #00ff7f,
    #00ffff,
    #007fff,
    #0000ff,
    #7f00ff,
    #ff00ff,
    #ff007f,
    #ff4d4d,
    #ffa500
  );
  background-size: 400% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: rainbowMove 6s linear infinite;
  transition: all 0.4s ease;
  display: inline-block;
}

/* 🌟 SHINE EFFECT */
@keyframes shine {
  to {
    background-position: 200% center;
  }
}

/* 🔥 PILL BASE */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(6px);
  transition: all 0.35s ease;
}

/* 👥 USERS */
.pill-users {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

/* 📐 AREA */
.pill-area {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

/* 🚀 HOVER CHUNG */
.group:hover .pill {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* 💙 USERS HOVER */
.group:hover .pill-users {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
}

/* 💜 AREA HOVER */
.group:hover .pill-area {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: white;
}

/* 📱 RESPONSIVE FIX */
@media (max-width: 640px) {
  .studio-name {
    font-size: 18px;
  }

  .group:hover .studio-name {
    font-size: 20px;
  }

  .pill {
    font-size: 11px;
    padding: 5px 10px;
  }
}
`}
      </style>
    </Section>
  );
};

export default StudioSection;
