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
      className="py-12 md:py-20 bg-white"
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
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {extendedStudios.map((studio, index) => (
                <div
                  key={`${studio._id}-${index}`}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {/* CARD ĐƠN GIẢN GIỐNG DETAIL PAGE */}
                  <div className="h-full">
                    <Card
                      hoverable
                      className="overflow-hidden rounded-2xl border border-amber-100 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] h-full bg-white cursor-pointer"
                      onClick={() => window.location.href = `/studio/${studio._id}`}
                    >
                      {/* Ảnh */}
                      <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden">
                          {studio.images?.[0] ? (
                            <img
                              src={studio.images[0]}
                              alt={studio.name}
                            className="w-full h-full object-cover"
                            />
                          ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-2xl font-bold text-amber-600">
                              {studio.name}
                            </div>
                          )}

                        {/* Badge rating */}
                        <div className="absolute top-3 left-3 bg-white/95 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <FiStar className="text-amber-500" size={16} />
                          <span className="font-bold text-sm text-amber-700">
                              {studio.rating?.toFixed(1) || "5.0"}
                            </span>
                        </div>
                        </div>

                      {/* Nội dung */}
                      <div className="space-y-3">
                        {/* Header với badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-semibold text-amber-700 mb-2">
                              Studio nổi bật
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                              {studio.name}
                              </h3>
                          </div>
                        </div>

                        {/* Mô tả */}
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {studio.description ||
                                  "Studio hiện đại, ánh sáng đẹp, phù hợp chụp lookbook, cưới, profile cá nhân."}
                            </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                              {studio.area && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium">
                              <FiMapPin size={12} />
                                  {studio.area} m²
                                </span>
                              )}
                              {studio.capacity && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium">
                              <FiUsers size={12} />
                                  {studio.capacity} người
                                </span>
                              )}
                          </div>

                        {/* Giá */}
                        <div className="pt-2 border-t border-amber-100">
                          <p className="text-xs text-gray-500 mb-1">Giá từ</p>
                          <p className="text-2xl font-extrabold text-amber-600">
                            {studio.basePricePerHour?.toLocaleString("vi-VN")}₫
                            <span className="text-sm font-semibold text-gray-500 ml-1">/ giờ</span>
                              </p>
                              </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-2">
                              <Button
                            size="small"
                            className="flex-1 border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 rounded-full font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/studio/${studio._id}`;
                                }}
                              >
                                Xem chi tiết
                              </Button>
                              <Button
                                type="primary"
                            size="small"
                            className="flex-1 bg-amber-500 hover:bg-amber-600 border-none rounded-full font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/booking/${studio._id}`;
                                }}
                            icon={<FiShoppingCart size={14} />}
                              >
                                Đặt ngay
                              </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nút prev/next */}
          {studios.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-amber-100 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] rounded-full p-4 z-10 hover:scale-110 hover:bg-white transition-all hover:border-amber-200"
              >
                <FiChevronLeft size={36} className="text-amber-700" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-amber-100 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] rounded-full p-4 z-10 hover:scale-110 hover:bg-white transition-all hover:border-amber-200"
              >
                <FiChevronRight size={36} className="text-amber-700" />
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
                    ? "w-12 h-3 bg-amber-500 rounded-full shadow-[0_4px_12px_-4px_rgba(251,191,36,0.5)]"
                    : "w-3 h-3 bg-amber-200 rounded-full hover:bg-amber-300 border border-amber-100"
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
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg px-14 py-7 rounded-2xl shadow-[0_12px_35px_-18px_rgba(251,191,36,0.4)] hover:shadow-[0_20px_50px_-15px_rgba(251,191,36,0.5)] hover:scale-105 transition-all border border-amber-400"
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