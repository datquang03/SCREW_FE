// src/pages/Studio/StudioPage.jsx
import React, { useEffect } from "react";
import Layout from "../../components/layout/Layout";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      {/* Studios List */}
      <Section
        className="bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
        containerClass="container mx-auto"
        title="Danh sách Studio cho thuê"
        subtitle="Chọn studio phù hợp với dự án của bạn - từ chụp ảnh sản phẩm đến quay phim chuyên nghiệp"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  scale: 1.03,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300"
              >
                {/* Hình ảnh + Carousel */}
                <div className="relative h-64 overflow-hidden">
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
                          className="h-64 w-full object-cover transition-transform duration-500 hover:scale-110"
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
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <FiStar className="text-yellow-500" />
                    <Text strong className="text-sm">
                      {studio.rating || 5}
                    </Text>
                  </div>

                  {/* Info bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Title
                      level={3}
                      className="text-white mb-2 text-2xl font-bold"
                    >
                      {studio.name}
                    </Title>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} />
                        <span>{studio.location || "Không xác định"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers size={14} />
                        <span>{studio.capacity} người</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <Text className="text-gray-600 text-xl">Mô tả:</Text>
                    <Paragraph className="text-gray-700 text-sm mt-1 line-clamp-3">
                      {studio.description}
                    </Paragraph>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <Text className="text-gray-500 text-sm">Giá thuê</Text>
                      <div className="flex items-baseline gap-1">
                        <Text
                          strong
                          className="text-2xl text-yellow-600 font-bold"
                        >
                          {studio.basePricePerHour.toLocaleString()} VNĐ
                        </Text>
                        <Text className="text-gray-500 text-sm">/giờ</Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Nút đặt lịch */}
                      <Button
                        size="large"
                        className="bg-blue-500 text-white hover:bg-blue-600 border-none shadow-md"
                        onClick={() => navigate(`/booking/${studio._id}`)}
                      >
                        Đặt lịch
                      </Button>

                      {/* Nút xem chi tiết */}
                      <Button
                        type="primary"
                        size="large"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none shadow-lg"
                        onClick={() => navigate(`/studio/${studio._id}`)}
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
    </Layout>
  );
};

export default StudioPage;
