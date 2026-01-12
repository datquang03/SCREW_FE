// src/pages/Booking/components/BookingStudioInfo.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Typography, Button, Tag, Carousel, Card, Skeleton } from "antd";
import { FiMapPin, FiUsers, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

const BookingStudioInfo = ({ onNext }) => {
  const { currentStudio, loading } = useSelector((state) => state.studio);

  if (loading || !currentStudio) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton.Input active size="large" style={{ width: 300, height: 40 }} />
          <Skeleton.Input active size="default" style={{ width: 500, height: 24 }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel Skeleton */}
          <div className="space-y-4">
            <Skeleton.Image 
              active 
              style={{ width: '100%', height: 500, borderRadius: '16px' }} 
            />
            <div className="flex gap-2 justify-center">
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button active size="small" shape="circle" />
              <Skeleton.Button active size="small" shape="circle" />
            </div>
          </div>

          {/* Info Card Skeleton */}
          <div className="space-y-6">
            <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Skeleton active paragraph={{ rows: 2 }} />
              <div className="mt-4 space-y-3">
                <Skeleton.Input active size="default" style={{ width: '60%' }} />
                <Skeleton.Input active size="default" style={{ width: '40%' }} />
                <Skeleton.Input active size="default" style={{ width: '50%' }} />
              </div>
              <div className="mt-6 space-y-4">
                <Skeleton.Input active size="large" style={{ width: '100%', height: 60 }} />
                <Skeleton.Input active size="large" style={{ width: '80%', height: 40 }} />
              </div>
            </Card>
            <Skeleton.Button active size="large" block style={{ height: 56 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Title level={2} className="text-gray-900 mb-0">
          Thông tin Studio
        </Title>
        <Text className="text-gray-600 text-lg">
          Vui lòng xem lại thông tin studio trước khi đặt phòng
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStudio.images && currentStudio.images.length > 0 ? (
            <Carousel
              autoplay
              dots
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
            >
              {currentStudio.images.map((img, idx) => (
                <div key={idx} className="h-96 lg:h-[500px] w-full">
                  <img
                    src={img}
                    alt={currentStudio.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="h-96 lg:h-[500px] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-6xl text-gray-400 shadow-lg border border-gray-200">
              📷
            </div>
          )}
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <Title className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {currentStudio.name}
            </Title>

            <Paragraph className="text-gray-600 text-base leading-relaxed mb-6">
              {currentStudio.description || "Không có mô tả"}
            </Paragraph>

            <div className="flex flex-wrap gap-3 mb-6">
              <Tag
                color="blue"
                className="flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm"
              >
                <FiMapPin />
                {currentStudio.location || "Không xác định"}
              </Tag>
              <Tag
                color="purple"
                className="flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm"
              >
                <FiUsers />
                {currentStudio.capacity} người
              </Tag>
              <Tag
                color={
                  currentStudio.status === "active"
                    ? "green"
                    : currentStudio.status === "maintenance"
                    ? "orange"
                    : "red"
                }
                className="font-medium px-4 py-2 rounded-full text-sm"
              >
                {currentStudio.status === "active"
                  ? "Đang hoạt động"
                  : currentStudio.status === "maintenance"
                  ? "Bảo trì"
                  : "Ngừng hoạt động"}
              </Tag>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <Text className="text-gray-600 font-medium">Diện tích</Text>
                <Text className="font-bold text-gray-900 text-lg">
                  {currentStudio.area} m²
                </Text>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <Text className="text-gray-600 font-medium block mb-2">
                  Giá thuê
                </Text>
                <Text className="font-extrabold text-yellow-600 text-3xl md:text-4xl">
                  {currentStudio.basePricePerHour?.toLocaleString() || 0}₫
                </Text>
                <Text className="text-gray-500 text-sm">/ giờ</Text>
              </div>
            </div>

            {currentStudio.avgRating > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">Đánh giá:</span>
                <span className="text-yellow-500 font-bold">
                  {currentStudio.avgRating.toFixed(1)} ⭐
                </span>
                <span className="text-gray-500">
                  ({currentStudio.reviewCount} đánh giá)
                </span>
              </div>
            )}
          </Card>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center"
          >
            <Button
              type="primary"
              size="large"
              icon={<FiCheckCircle />}
              className="w-full md:w-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-none text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition text-lg"
              onClick={onNext}
            >
              Xác nhận và tiếp tục
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingStudioInfo;


