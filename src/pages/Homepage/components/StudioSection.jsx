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
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Carousel - chỉ thấy đúng 3 card */}
        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Padding để hover không bị cắt */}
          <div className="px-8 py-12">
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
                  {/* CARD NGANG ĐẸP – GỌN – ĐỦ THÔNG TIN */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="group cursor-pointer"
                    onClick={() => (window.location.href = `/studio/${studio._id}`)}
                  >
                    <Card
                      hoverable
                      className="overflow-hidden rounded-3xl border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500"
                      style={{padding: 0}}
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Ảnh bên trái */}
                        <div className="relative w-full md:w-5/12 overflow-hidden">
                          {studio.images?.[0] ? (
                            <img
                              src={studio.images[0]}
                              alt={studio.name}
                              className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                              {studio.name}
                            </div>
                          )}

                          {/* Rating badge */}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <FiStar className="text-yellow-500" size={20} />
                            <span className="font-bold text-lg">
                              {studio.rating?.toFixed(1) || "5.0"}
                            </span>
                          </div>
                        </div>

                        {/* Nội dung bên phải */}
                        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between bg-white">
                          <div>
                            <Title level={3} className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                              {studio.name}
                            </Title>
                            <p className="text-gray-600 text-base line-clamp-3 mb-6">
                              {studio.description || "Studio hiện đại, đầy đủ ánh sáng tự nhiên và thiết bị chuyên nghiệp."}
                            </p>

                            <div className="flex flex-wrap gap-4">
                              {studio.area && (
                                <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                  <FiMapPin size={16} />
                                  {studio.area} m²
                                </span>
                              )}
                              {studio.capacity && (
                                <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                                  <FiUsers size={16} />
                                  {studio.capacity} người
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-100">
                            <div>
                              <Text className="text-gray-500 text-sm">Giá từ</Text>
                              <div className="text-3xl font-bold text-orange-600">
                                {studio.basePricePerHour?.toLocaleString("vi-VN")}đ
                              </div>
                              <Text className="text-gray-500 text-sm">/ giờ</Text>
                            </div>
                            <FiArrowRight
                              size={36}
                              className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-3 transition-all duration-300"
                            />
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