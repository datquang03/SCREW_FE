// src/pages/AboutUs/AboutUsPage.jsx
import React from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Typography, theme } from "antd";

import studioImage from "../../assets/SCONGSTUDIO.jpg";

// portfolio images
import img1 from "../../assets/room100m2(360).jpg";
import img2 from "../../assets/room100m2(360).jpg";
import img3 from "../../assets/room100m2(360).jpg";

import GallerySlider from "./components/GalarySlider";

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
  const { token } = theme.useToken();

  // Scroll-based parallax
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 40;
    const y = (e.clientY - window.innerHeight / 2) / 40;

    mouseX.set(x);
    mouseY.set(y);
  };

  const images = [img1, img2, img3];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
      style={{ color: token.colorText }}
    >
      {/* Premium Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      {/* Film Grain Noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.09] bg-[url('/noise.png')] mix-blend-soft-light"></div>

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        
        {/* Parallax background */}
        <motion.img
          src={studioImage}
          className="absolute w-full h-full object-cover opacity-60"
          style={{ y: yParallax }}
        />

        {/* Mouse parallax floating image */}
        <motion.img
          src={studioImage}
          className="absolute w-[400px] opacity-20 blur-sm"
          style={{
            x: smoothX,
            y: smoothY,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black" />

        {/* HERO text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-green-400 drop-shadow-xl tracking-wide">
            Về Chúng Tôi
          </h1>

          <p className="mt-5 text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Studio sáng tạo, hiện đại và đầy cảm hứng dành cho mọi ý tưởng của bạn.
          </p>
        </motion.div>
      </section>

      {/* SECTION GIỚI THIỆU */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="px-6 py-20 max-w-5xl mx-auto"
      >
        <Title level={2} style={{ color: token.colorPrimary }}>
          Giới thiệu
        </Title>

        <Paragraph className="text-gray-300 text-lg leading-relaxed mt-3">
          Chúng tôi là đội ngũ sáng tạo chuyên về thiết kế studio, chụp ảnh,
          dựng video và phát triển nội dung chuyên nghiệp. Chúng tôi luôn theo
          đuổi tiêu chuẩn cao nhất để mang lại trải nghiệm nghệ thuật hiện đại
          và cảm xúc nhất.
        </Paragraph>
      </motion.section>

      {/* PARALLAX SECTION */}
      <section className="relative h-[50vh] overflow-hidden my-20 rounded-xl">
        <motion.img
          src={studioImage}
          className="absolute w-full h-full object-cover"
          style={{ y: yParallax }}
        />

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-green-300"
          >
            Tầm Nhìn & Giá Trị
          </motion.h2>
        </div>
      </section>

      {/* GALLERY */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="px-6 max-w-6xl mx-auto pb-32"
      >
        <Title level={2} style={{ color: token.colorPrimary }}>
          Bộ Sưu Tập
        </Title>

        <p className="text-gray-300 mb-6">
          Một vài hình ảnh nổi bật trong những dự án gần đây.
        </p>

        <GallerySlider images={images} />
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
