// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

const { Title, Text } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");

  // Stars data
  const stars = [...Array(50)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-sans">
      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      >
        {/* Big 404 */}
        <Title level={1} className="text-8xl md:text-9xl font-extrabold mb-4">404</Title>

        {/* Custom text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Text className="block text-xl md:text-3xl font-bold text-green-400 mb-6 tracking-wide">
            Trang bạn đang tìm không tồn tại
          </Text>
        </motion.div>

        {/* Subtitle */}
        <Text className="text-lg md:text-xl block mb-8 text-gray-300">
          Ooops! Trang này có thể đã bị xóa hoặc chưa được tạo.
        </Text>

        {/* Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            size="large"
            className="bg-green-500 border-green-500 hover:bg-green-600 flex items-center gap-2"
            onClick={handleGoHome}
          >
            <FiArrowLeft /> Quay về trang chủ
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
