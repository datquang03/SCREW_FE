// src/pages/Homepage/components/SetDesignSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ← THÊM DÒNG NÀY
import { Typography, Skeleton, Empty } from "antd";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSetDesigns, getSetDesignById } from "../../../features/setDesign/setDesignSlice";

const { Title, Paragraph, Text } = Typography;

const SetDesignSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← Dùng để chuyển trang

  const setDesigns = useSelector((state) => state.setDesign.setDesigns);
  const loading = useSelector((state) => state.setDesign.loading);

  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Chỉ gọi API một lần khi component được mount
  useEffect(() => {
    dispatch(getAllSetDesigns({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (!isHovering && setDesigns.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % setDesigns.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovering, setDesigns.length]);

  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + setDesigns.length) % setDesigns.length);
  const handleNext = () =>
    setCurrent((prev) => (prev + 1) % setDesigns.length);

  // Hàm chung: chuyển sang trang chi tiết + gọi API
  const goToDetail = (id) => {
    dispatch(getSetDesignById(id));        // Gọi API lấy chi tiết trước
    navigate(`/set-design/${id}`);         // Chuyển trang luôn
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-16 px-4">
        <Title level={2} className="text-center mb-12 font-bold">
          Set Design Nổi Bật
        </Title>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (setDesigns.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto py-16 px-4 text-center">
        <Title level={2} className="mb-8">Set Design Nổi Bật</Title>
        <Empty description="Chưa có Set Design nào" />
      </div>
    );
  }

  const item = setDesigns[current];
  const imageUrl = item.images?.[0] || "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4">
      <Title level={2} className="text-center mb-12 font-bold text-4xl">
        Set Design Nổi Bật
      </Title>

      <div className="relative overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            // BẤM VÀO TOÀN BỘ CARD → CHUYỂN TRANG
            onClick={() => goToDetail(item._id)}
          >
            {/* Ảnh */}
            <motion.div
              className="relative overflow-hidden h-96 md:h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>

            {/* Nội dung */}
            <div className="p-8 md:p-12 space-y-6">
              <div className="flex justify-between items-start">
                <Title level={3} className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {item.name}
                </Title>
                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                  <FiStar className="text-yellow-600 text-lg" />
                  <Text strong className="text-lg">
                    {item.averageRating > 0 ? item.averageRating.toFixed(1) : "Chưa có"}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    ({item.totalReviews} đánh giá)
                  </Text>
                </div>
              </div>

              {item.category && (
                <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {item.category === "wedding" ? "Tiệc cưới" :
                   item.category === "corporate" ? "Doanh nghiệp" :
                   item.category === "birthday" ? "Sinh nhật" :
                   item.category === "other" ? "Khác" : item.category}
                </div>
              )}

              <Paragraph className="text-gray-700 text-lg leading-relaxed">
                {item.description || "Bộ thiết kế đẹp, chuyên nghiệp và sẵn sàng phục vụ mọi nhu cầu chụp ảnh của bạn."}
              </Paragraph>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>{item.totalComments} bình luận</span>
                <span>•</span>
                <span>Đã tạo {new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>

              {/* NÚT XEM CHI TIẾT – CŨNG CHUYỂN TRANG */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ← Quan trọng: tránh trigger click của card
                  goToDetail(item._id);
                }}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:shadow-xl transform hover:scale-105 transition"
              >
                Xem chi tiết
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nút trái phải */}
        <button onClick={handlePrev} className="absolute top-1/2 -left-6 md:-left-12 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl p-4 hover:bg-white transition z-10">
          <FiChevronLeft size={32} className="text-gray-800" />
        </button>
        <button onClick={handleNext} className="absolute top-1/2 -right-6 md:-right-12 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl p-4 hover:bg-white transition z-10">
          <FiChevronRight size={32} className="text-gray-800" />
        </button>
      </div>

      {/* Chấm tròn */}
      <div className="flex justify-center mt-10 gap-3">
        {setDesigns.map((_, idx) => (
          <motion.div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === idx ? "bg-indigo-600 w-10" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default SetDesignSection;