// src/pages/Studio/StudioPage.jsx
import React, { useEffect } from "react";
import { Typography, Button, Spin, Carousel } from "antd";
import { FiStar, FiMapPin, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import Section from "../../components/common/Section";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveStudios } from "../../features/studio/studioSlice";

const { Title, Text, Paragraph } = Typography;

const StudioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studios, loading } = useSelector((state) => state.studio);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "—";
    if (typeof price === "number") return price.toLocaleString();
    const parsed = Number(price);
    return Number.isNaN(parsed) ? "—" : parsed.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {/* Studios List */}
      <Section
        className="bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
        containerClass="container mx-auto"
        title="Danh sách Studio cho thuê"
        subtitle="Chọn studio phù hợp với dự án của bạn - từ chụp ảnh sản phẩm đến quay phim chuyên nghiệp"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studios.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              Không có studio nào đang hoạt động
            </div>
          ) : (
            studios.map((studio, index) => (
              <motion.div
                key={studio._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 16px 32px rgba(15,23,42,0.12)",
                }}
                onClick={() => navigate(`/studio/${studio._id}`)}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col border border-amber-100 hover:border-amber-200 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)]"
              >
                {/* Hình ảnh + Carousel */}
                <div className="relative h-60 md:h-64 overflow-hidden">
                  {studio.images && studio.images.length > 0 ? (
                    <Carousel
                      autoplay
                      autoplaySpeed={4000}
                      dots
                      className="h-full"
                    >
                      {studio.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={studio.name}
                          className="h-60 md:h-64 w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ))}
                    </Carousel>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-700 text-white/60 text-5xl">
                      📷
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <FiStar className="text-yellow-500" />
                    <Text strong className="text-sm">
                      {(studio.avgRating || studio.rating || 0).toFixed
                        ? (studio.avgRating || studio.rating || 0).toFixed(1)
                        : studio.avgRating || studio.rating || 0 || "—"}
                    </Text>
                  </div>

                  {/* Info bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Title
                      level={3}
                      className="mb-2 text-xl md:text-2xl font-bold line-clamp-1"
                    >
                      <span className="bg-white/90 text-slate-900 px-2.5 py-1 rounded-lg shadow-sm">
                      {studio.name}
                      </span>
                    </Title>
                    <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} />
                        <span className="line-clamp-1">
                          {studio.location || "Không xác định"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers size={14} />
                        <span>{studio.capacity || "—"} người</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <Text className="text-gray-600 text-sm">Mô tả</Text>
                    <Paragraph className="text-gray-800 text-sm mt-1 line-clamp-3">
                      {studio.description || "Chưa có mô tả chi tiết."}
                    </Paragraph>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <Text className="text-gray-500 text-sm">Giá thuê</Text>
                      <div className="flex items-baseline gap-2 flex-wrap text-slate-900">
                        <span className="text-2xl font-bold whitespace-nowrap">
                          {formatPrice(studio.basePricePerHour)}
                        </span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          VNĐ /giờ
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {/* Nút đặt lịch */}
                      <Button
                        size="large"
                        className="bg-blue-500 text-white hover:bg-blue-600 border-none shadow-md px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking/${studio._id}`);
                        }}
                      >
                        Đặt lịch
                      </Button>

                      {/* Nút xem chi tiết */}
                      <Button
                        type="primary"
                        size="large"
                        className="bg-amber-500 hover:bg-amber-600 border-none shadow-md px-4 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/studio/${studio._id}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Section>
    </>
  );
};

export default StudioPage;
