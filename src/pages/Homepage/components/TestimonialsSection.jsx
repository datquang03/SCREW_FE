import React, { useRef } from "react";
import { Typography, Avatar, Rate } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, useInView } from "framer-motion";
import { TESTIMONIALS } from "../../../constants/testimonials";
import Section from "../../../components/common/Section";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const { Title, Paragraph } = Typography;

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section
      ref={ref}
      className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
      badge="Phản hồi từ khách hàng"
      title="Khách hàng nói gì về S+ Studio"
      subtitle="Những chia sẻ từ các khách hàng đã thuê studio tại S+ Studio"
      containerClass="container mx-auto relative z-10"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        </div>

      <div className="relative z-10">

        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="testimonials-swiper"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotateY: 0 }
                    : { opacity: 0, y: 50, rotateY: -15 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                  transition: { duration: 0.3 },
                }}
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                className="h-full"
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center h-full shadow-2xl hover:bg-white/15 transition-all duration-300">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <span className="text-5xl text-yellow-400 font-serif leading-none">"</span>
                    </div>
                  </motion.div>
                  <Paragraph className="italic text-gray-200 text-base leading-relaxed mb-6 min-h-[100px]">
                    "{testimonial.quote}"
                  </Paragraph>
                  <div className="flex justify-center mb-4">
                    <Rate disabled defaultValue={testimonial.rating} className="text-yellow-400" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex justify-center mb-4"
                  >
                    <Avatar
                      size={64}
                      src={testimonial.avatar}
                      className="border-2 border-yellow-400/50 shadow-lg"
                    />
                  </motion.div>
                  <Title level={5} className="mt-4 mb-1 font-bold text-white text-lg">
                    {testimonial.name}
                  </Title>
                  <Paragraph className="text-gray-400 text-sm">
                    {testimonial.title}
                  </Paragraph>
              </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #fbbf24;
        }
      `}</style>
    </Section>
  );
};

export default TestimonialsSection;