// src/pages/Homepage/sections/StudioSection.jsx
import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Spin } from "antd";
import {
  FiStar,
  FiArrowRight,
  FiMapPin,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getActiveStudios } from "../../../features/studio/studioSlice";
import Section from "../../../components/common/Section";

const { Text } = Typography;

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
  const totalSlides = Math.ceil(studios.length / itemsPerView);

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (studios.length <= itemsPerView) return;
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, studios.length, itemsPerView, totalSlides]);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const extendedStudios =
    studios.length > 0
      ? [
          ...studios.slice(-itemsPerView),
          ...studios,
          ...studios.slice(0, itemsPerView),
        ]
      : [];

  const offset = itemsPerView;
  const translateX = -(currentIndex + offset) * (100 / itemsPerView);

  if (loading) {
    return (
      <Section title="Studio Nổi Bật">
        <div className="flex justify-center items-center py-32">
          <Spin size="large" />
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="Studio Nổi Bật"
      subtitle="Không gian được khách hàng yêu thích nhất"
      className="py-24 bg-white"
    >
      <div className="relative max-w-7xl mx-auto px-4">
        <p className="text-xs font-semibold text-[#C5A267] uppercase tracking-[0.3em] text-center mb-6">STUDIO NỔI BẬT</p>
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="px-6 py-6">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {extendedStudios.map((studio, index) => (
                <div
                  key={`${studio._id}-${index}`}
                  className="flex-shrink-0 flex flex-col"
                  style={{ width: `${100 / itemsPerView}%`, minWidth: 340, maxWidth: 340, marginRight: 24 }}
                >
                  <div
                    className="h-full border border-slate-100 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C5A267] group flex flex-col cursor-pointer"
                    onClick={() => (window.location.href = `/studio/${studio._id}`)}
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-40 overflow-hidden mb-4 flex-shrink-0">
                      {studio.images?.[0] ? (
                        <img
                          src={studio.images[0]}
                          alt={studio.name}
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FCFBFA] flex items-center justify-center font-semibold text-[#C5A267]">
                          {studio.name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3 bg-[#0F172A] px-3 py-1 flex items-center gap-1.5 shadow">
                        <FiStar className="text-[#C5A267]" size={14} />
                        <span className="text-sm font-semibold text-white">
                          {studio.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>
                    {/* BODY */}
                    <div className="flex-1 flex flex-col justify-between px-6 py-2">
                      <span className="inline-flex w-fit px-3 py-1 bg-white border border-[#C5A267] text-xs font-semibold text-[#C5A267] uppercase tracking-[0.2em] mb-2">
                        Studio nổi bật
                      </span>
                      <h3 className="text-lg font-semibold text-[#0F172A] line-clamp-2 mb-2 min-h-[48px] flex items-center">
                        {studio.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2 min-h-[40px] flex items-center">
                        {studio.description?.length > 80 ? studio.description.slice(0, 80) + '...' : studio.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-2 min-h-[24px]">
                        {studio.capacity && (
                          <span className="inline-block bg-[#FCFBFA] text-slate-700 px-2 py-0.5 border border-slate-200 font-semibold">
                            <FiUsers className="inline-block mr-1" size={14} />
                            {studio.capacity} người
                          </span>
                        )}
                        <span className="inline-block bg-[#FCFBFA] text-[#C5A267] px-2 py-0.5 border border-[#C5A267] font-semibold">
                          {studio.basePricePerHour?.toLocaleString()}đ/giờ
                        </span>
                      </div>
                    </div>
                    {/* PRICE + CTA */}
                    <div className="px-6 pb-6 flex flex-col gap-2">
                      <div className="text-xs text-slate-500 uppercase tracking-[0.2em]">Giá từ</div>
                      <div className="text-2xl font-semibold text-[#C5A267] mb-1">
                        {studio.basePricePerHour?.toLocaleString("vi-VN")}₫
                        <span className="text-sm text-slate-500 ml-1">/ giờ</span>
                      </div>
                      <a
                        href={`/studio/${studio._id}`}
                        className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] text-[#C5A267] hover:text-[#0F172A] border-none font-semibold text-base flex items-center justify-center gap-2 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all py-2 px-4 uppercase tracking-[0.2em]"
                        style={{ marginTop: 'auto' }}
                      >
                        <FiShoppingCart size={16} /> Đặt ngay
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {studios.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#0F172A] p-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]"
              >
                <FiChevronLeft size={30} className="text-[#C5A267]" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#0F172A] p-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]"
              >
                <FiChevronRight size={30} className="text-[#C5A267]" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-10">
          <Button
            type="primary"
            size="large"
            href="/studio"
            icon={<FiArrowRight size={22} />}
            style={{ backgroundColor: '#A0826D', borderColor: '#A0826D', color: 'white' }}
            className="px-14 py-7 font-semibold text-lg uppercase tracking-[0.2em] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8B7355'; e.currentTarget.style.borderColor = '#8B7355'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#A0826D'; e.currentTarget.style.borderColor = '#A0826D'; }}
          >
            Xem tất cả Studio
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default StudioSection;
