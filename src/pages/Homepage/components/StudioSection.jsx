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
  FiInfo,
  FiShoppingCart,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getActiveStudios } from "../../../features/studio/studioSlice";
import Section from "../../../components/common/Section";

const { Title, Text } = Typography;

const StudioSection = () => {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.studio);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Responsive: 1 - 2 - 3 cards
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

  // Autoplay
  useEffect(() => {
    if (studios.length <= itemsPerView) return;
    const interval = setInterval(() => {
      if (!isHovering) setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, studios.length, itemsPerView, totalSlides]);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const extendedStudios = studios.length > 0
    ? [...studios.slice(-itemsPerView), ...studios, ...studios.slice(0, itemsPerView)]
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
      className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Carousel - chỉ thấy đúng 3 card */}
        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Padding để hover không bị cắt */}
          <div className="px-6 py-10">
            <motion.div
              className="flex"
              animate={{ x: `${translateX}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {extendedStudios.map((studio, index) => (
                <div
                  key={`${studio._id}-${index}`}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {/* CARD ẢNH + OVERLAY DETAIL KHI HOVER */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="group cursor-pointer h-full"
                  >
                    <Card
                      hoverable
                      className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200/70 group-hover:border-gray-300 shadow-md group-hover:shadow-xl transition-all duration-500 h-full bg-transparent"
                      bodyStyle={{ padding: 0 }}
                    >
                      <div className="relative w-full h-72 md:h-80">
                        {/* Ảnh nền */}
                        {studio.images?.[0] ? (
                          <img
                            src={studio.images[0]}
                            alt={studio.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-400">
                            {studio.name}
                          </div>
                        )}

                        {/* Badge rating */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                          <FiStar className="text-yellow-400" size={18} />
                          <span className="font-semibold text-sm md:text-base">
                            {studio.rating?.toFixed(1) || "5.0"}
                          </span>
                        </div>

                        {/* Icon info dẫn tới trang chi tiết */}
                        <button
                          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/studio/${studio._id}`;
                          }}
                        >
                          <FiInfo size={18} />
                        </button>

                        {/* OVERLAY DETAIL KHI HOVER - NỀN ĐEN ĐẬM, CHE FULL ẢNH */}
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Nội dung chỉ hiện khi hover */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7 text-white pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <div className="space-y-2.5 md:space-y-3.5">
                            <div className="inline-flex items-center gap-2 bg-black/60 border border-white/25 backdrop-blur px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-md">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Studio nổi bật
                            </div>

                            <div className="border-l-4 border-orange-400 pl-3 md:pl-4">
                              <h3 className="text-lg md:text-2xl font-bold line-clamp-2 drop-shadow">
                                {studio.name}
                              </h3>
                              <p className="mt-1.5 text-xs md:text-sm text-gray-100/95 line-clamp-2 drop-shadow-sm">
                                {studio.description ||
                                  "Studio hiện đại, ánh sáng đẹp, phù hợp chụp lookbook, cưới, profile cá nhân."}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:gap-3">
                              {studio.area && (
                                <span className="inline-flex items-center gap-1.5 bg-black/55 border border-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] md:text-xs font-medium shadow-sm">
                                  <FiMapPin size={14} />
                                  {studio.area} m²
                                </span>
                              )}
                              {studio.capacity && (
                                <span className="inline-flex items-center gap-1.5 bg-black/55 border border-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] md:text-xs font-medium shadow-sm">
                                  <FiUsers size={14} />
                                  {studio.capacity} người
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Giá + nút hành động */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-200">Giá từ</p>
                              <p className="text-xl md:text-3xl font-extrabold text-orange-300 drop-shadow">
                                {studio.basePricePerHour?.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-[11px] md:text-xs text-gray-200">
                                / giờ • đã bao gồm setup cơ bản
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3 md:gap-4 justify-end">
                              <Button
                                size="middle"
                                className="pointer-events-auto border-none bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-full px-4 shadow-md flex items-center gap-1.5 text-xs md:text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/studio/${studio._id}`;
                                }}
                              >
                                Xem chi tiết
                              </Button>
                              <Button
                                type="primary"
                                size="middle"
                                className="pointer-events-auto bg-orange-500 hover:bg-orange-600 border-none font-semibold rounded-full px-4 shadow-md flex items-center gap-1.5 text-xs md:text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/booking/${studio._id}`;
                                }}
                                icon={<FiShoppingCart size={16} />}
                              >
                                Đặt ngay
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Nút prev/next */}
          {studios.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-full p-4 z-10 hover:scale-110 transition-all"
              >
                <FiChevronLeft size={36} className="text-gray-800" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-full p-4 z-10 hover:scale-110 transition-all"
              >
                <FiChevronRight size={36} className="text-gray-800" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {studios.length > itemsPerView && (
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 ${
                  i === currentIndex
                    ? "w-12 h-3 bg-black rounded-full"
                    : "w-3 h-3 bg-gray-400 rounded-full hover:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}

        {/* Nút xem tất cả */}
        <div className="text-center mt-16">
          <Button
            type="primary"
            size="large"
            href="/studio"
            className="bg-black hover:bg-gray-900 text-white font-bold text-lg px-14 py-7 rounded-2xl shadow-2xl hover:scale-105 transition-all"
            icon={<FiArrowRight size={24} className="ml-3" />}
          >
            Xem tất cả Studio
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default StudioSection;