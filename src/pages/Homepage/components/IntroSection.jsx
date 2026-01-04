import React from "react";
import { Button, Typography } from "antd";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { STATS } from "../../../constants/stats";

const { Title, Paragraph } = Typography;

const IntroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-slate-900 to-black overflow-hidden min-h-[75vh] flex items-center -mt-16 md:-mt-20 lg:-mt-24 isolate">
      {/* Animated background elements - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle animated gradient orbs only */}
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-yellow-400/4 rounded-full blur-3xl opacity-50"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/4 rounded-full blur-3xl opacity-50"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Hero Image Section - Hidden on mobile to avoid ugly placeholders */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 lg:w-1/3 opacity-0 md:opacity-20 lg:opacity-30 pointer-events-none hidden lg:block">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-800/20 to-transparent rounded-l-3xl border-l border-yellow-400/20 flex items-center justify-center">
              {/* Subtle pattern instead of text */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative container mx-auto px-4 md:px-6 lg:px-16 py-16 md:py-20 lg:py-32 text-center z-10 pt-20 md:pt-28"
      >
        {/* Decorative corner elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-yellow-400/20 opacity-30" />
        <div className="hidden md:block absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-yellow-400/20 opacity-30" />
        <div className="hidden md:block absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-yellow-400/20 opacity-30" />
        <div className="hidden md:block absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-yellow-400/20 opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* 3D Title Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ perspective: 1000 }}
          >
            <Title
              level={1}
              className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8"
              style={{
                textShadow: "0 15px 50px rgba(0,0,0,0.6), 0 0 30px rgba(234,179,8,0.4)",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.span
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="inline-block"
              >
                S+
              </motion.span>{" "}
              <motion.span
                whileHover={{ scale: 1.05, rotateY: -5 }}
                className="inline-block text-yellow-400"
                style={{
                  textShadow: "0 0 20px rgba(234,179,8,0.6), 0 0 40px rgba(234,179,8,0.3)",
                }}
              >
                Studio
              </motion.span>
          </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Paragraph className="text-lg md:text-2xl lg:text-3xl mt-6 md:mt-8 max-w-4xl mx-auto leading-relaxed">
              <span className="text-yellow-300 font-black text-2xl md:text-3xl lg:text-4xl drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">S+ Studio</span>{" "}
              <span className="text-white/95 font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">- Dịch vụ cho thuê studio chuyên nghiệp hàng đầu tại TP.HCM</span>
              <br />
              <span className="text-white/85 font-semibold text-lg md:text-xl lg:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Cho thuê studio với đầy đủ thiết bị: <span className="text-yellow-300 font-bold">máy ảnh</span>, <span className="text-blue-300 font-bold">ánh sáng LED</span>, <span className="text-green-300 font-bold">phòng xanh</span>, <span className="text-purple-300 font-bold">hệ thống âm thanh</span>
              </span>
              <br />
              <span className="text-gray-300 font-semibold text-base md:text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                Phục vụ: <span className="text-yellow-300">Quay phim</span> • <span className="text-blue-300">Chụp ảnh sản phẩm</span> • <span className="text-green-300">Livestream</span> • <span className="text-purple-300">Sản xuất nội dung</span> • <span className="text-pink-300">Chụp ảnh cưới</span>
              </span>
          </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
            <Button
              type="primary"
              size="large"
              href="/studio"
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 border-none shadow-2xl shadow-yellow-500/60 hover:shadow-yellow-500/80 font-black text-lg md:text-xl px-10 py-7 h-auto rounded-xl transition-all"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
            >
              Xem Studio có sẵn
            </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="large"
                href="/contact"
                className="bg-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/25 hover:border-white/60 font-black text-lg md:text-xl px-10 py-7 h-auto rounded-xl transition-all"
                icon={<PlayCircleOutlined />}
              >
                Liên hệ ngay
            </Button>
            </motion.div>
          </motion.div>

          {/* Floating 3D Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                whileHover={{ scale: 1.1, rotateY: 5, z: 50, y: -10 }}
                className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-2 border-yellow-400/30 rounded-2xl p-6 shadow-[0_20px_60px_rgba(234,179,8,0.3)] hover:shadow-[0_30px_80px_rgba(234,179,8,0.5)] transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  {stat.number}
          </div>
                <div className="text-white font-semibold text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntroSection;
