// src/pages/Homepage/components/SetDesignSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { Card, Typography } from "antd";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

// Dữ liệu ảo
const designItems = [
  {
    id: 1,
    name: "Modern Studio",
    rating: 4.8,
    description:
      "Thiết kế hiện đại, ánh sáng tối ưu, phù hợp chụp ảnh sản phẩm và quảng cáo.",
    image:
      "https://images.unsplash.com/photo-1612831455541-ff0e86f52751?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Minimalist Space",
    rating: 4.5,
    description: "Không gian tối giản, thanh lịch, thích hợp cho studio video.",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c443f12?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Classic Set",
    rating: 4.7,
    description:
      "Không gian cổ điển, nhiều chi tiết trang trí, tạo cảm giác sang trọng.",
    image:
      "https://images.unsplash.com/photo-1622735343734-2d5517c026b0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Outdoor Inspired",
    rating: 4.6,
    description:
      "Phòng được thiết kế như ngoài trời, ánh sáng tự nhiên tuyệt vời.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
];

const SetDesignSection = () => {
  const [current, setCurrent] = useState(0);
  const total = designItems.length;
  const timeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto slide mỗi 5s, chỉ khi không hover
  useEffect(() => {
    if (!isHovering) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovering, total]);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const handleNext = () => setCurrent((prev) => (prev + 1) % total);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4">
      <Title level={2} className="text-center mb-12 font-bold">
        Set Design Highlights
      </Title>

      {/* Carousel wrapper */}
      <div className="relative w-full overflow-visible">
        {" "}
        {/* overflow-visible để button không bị cắt */}
        <AnimatePresence mode="wait">
          {designItems.map(
            (item, index) =>
              index === current && (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-2xl p-6 md:p-12"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Image */}
                  <motion.div
                    className="overflow-hidden rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-72 md:h-96 object-cover"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>

                  {/* Info */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Title level={3} className="text-2xl font-extrabold">
                        {item.name}
                      </Title>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <FiStar className="text-yellow-500" />
                        <Text strong>{item.rating}</Text>
                      </div>
                    </div>
                    <Paragraph className="text-gray-700 line-clamp-3">
                      {item.description}
                    </Paragraph>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition z-10 cursor-pointer"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition z-10 cursor-pointer"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {designItems.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === idx ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SetDesignSection;
