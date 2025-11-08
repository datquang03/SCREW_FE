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
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden min-h-[70vh] flex items-center -mt-16 md:-mt-20 isolate">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
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

      <motion.div
        style={{ y, opacity }}
        className="relative container mx-auto px-4 md:px-6 lg:px-16 py-12 md:py-16 lg:py-24 text-center z-10 pt-16 md:pt-20"
      >
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
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6"
              style={{
                textShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(234,179,8,0.3)",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.span
                whileHover={{ scale: 1.1, rotateY: 5 }}
                className="inline-block"
              >
                S
              </motion.span>{" "}
              <motion.span
                whileHover={{ scale: 1.1, rotateY: -5 }}
                className="inline-block text-yellow-400"
                style={{
                  textShadow: "0 0 30px rgba(234,179,8,0.8), 0 0 60px rgba(234,179,8,0.4)",
                }}
              >
                CỘNG
              </motion.span>{" "}
              <motion.span
                whileHover={{ scale: 1.1, rotateY: 5 }}
                className="inline-block"
              >
                STUDIO
              </motion.span>
          </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Paragraph className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed">
              Cho thuê studio chuyên nghiệp với đầy đủ thiết bị ánh sáng, máy ảnh và set design.
              <br />
              <span className="text-yellow-400 font-semibold">
                Phục vụ quay phim, chụp ảnh, livestream và sản xuất nội dung
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
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 font-semibold text-base px-8 py-6 h-auto rounded-xl"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
            >
              Khám phá Studio
            </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="large"
                href="/contact"
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold text-base px-8 py-6 h-auto rounded-xl"
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
                whileHover={{ scale: 1.1, rotateY: 5, z: 50 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
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
