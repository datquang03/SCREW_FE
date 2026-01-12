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
  const stars = [...Array(70)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-sans">

      {/* Stars Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          />
        ))}
      </div>

      {/* Glow behind content */}
      <div className="absolute w-[500px] h-[500px] bg-green-500 opacity-20 blur-[180px] rounded-full"></div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center text-white px-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 70 }}
      >

        {/* Big 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-9xl md:text-[180px] font-extrabold text-white drop-shadow-[0_0_25px_rgba(0,255,150,0.7)]">
            404
          </h1>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div
            level={2}
            className="text-white !text-3xl md:!text-4xl font-bold tracking-wide"
          >
            Trang bạn tìm kiếm không tồn tại
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-gray-300 text-lg md:text-xl mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Oops! Có vẻ như trang này đã bị xóa hoặc chưa được tạo.
        </motion.p>

        {/* Button */}
        <motion.div
          className="mt-10 flex justify-center"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="primary"
            size="large"
            className="bg-green-500 border-green-500 hover:bg-green-600
                      shadow-[0_0_15px_rgba(0,255,150,0.6)] hover:shadow-[0_0_25px_rgba(0,255,150,1)]
                      flex items-center gap-2 px-6 py-6 text-lg"
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
