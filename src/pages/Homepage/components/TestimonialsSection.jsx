import React, { useRef, useEffect } from "react";
import { Typography, Avatar, Rate } from "antd";
import { motion, useInView } from "framer-motion";
import { TESTIMONIALS } from "../../../constants/testimonials";
import Section from "../../../components/common/Section";

const { Title, Paragraph } = Typography;

const TestimonialsSection = () => {
  const ref = useRef(null);
  const sliderRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Auto-scroll every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({
          left: 320,
          behavior: "smooth",
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Click button scroll left/right
  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <Section
      ref={ref}
      className="relative bg-[#0F172A] py-24 px-4 md:px-6 lg:px-16 overflow-hidden"
      badge="Phản hồi từ khách hàng"
      title="Khách hàng nói gì về S+ Studio"
      subtitle="Những chia sẻ từ các khách hàng đã thuê studio tại S+ Studio"
      containerClass="container mx-auto relative z-10"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl"
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

      {/* Slider */}
      <div className="relative z-10 mt-10">

        {/* Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] hover:bg-[#C5A267] p-3 backdrop-blur-md transition border border-[#C5A267]"
        >
          <span className="text-[#C5A267] hover:text-[#0F172A]">◀</span>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] hover:bg-[#C5A267] p-3 backdrop-blur-md transition border border-[#C5A267]"
        >
          <span className="text-[#C5A267] hover:text-[#0F172A]">▶</span>
        </button>

        {/* Horizontal slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="snap-center min-w-[85%] sm:min-w-[45%] lg:min-w-[32%]"
            >
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
                  transition: { duration: 0.3 },
                }}
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                className="h-full"
              >
                <div className="bg-white border border-slate-100 p-8 text-center h-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:border-[#C5A267] transition-all duration-300">

                  {/* Quote icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-16 h-16 bg-[#C5A267]/20 flex items-center justify-center">
                      <span className="text-5xl text-[#C5A267] font-serif leading-none">"</span>
                    </div>
                  </motion.div>

                  <Paragraph className="italic text-slate-700 text-base leading-relaxed mb-6 min-h-[100px]">
                    "{testimonial.quote}"
                  </Paragraph>

                  <div className="flex justify-center mb-4">
                    <Rate
                      disabled
                      defaultValue={testimonial.rating}
                      className="text-[#C5A267]"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex justify-center mb-4"
                  >
                    <Avatar
                      size={64}
                      src={testimonial.avatar}
                      className="border-2 border-[#C5A267] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]"
                    />
                  </motion.div>

                  <Title level={5} className="mt-4 mb-1 font-semibold text-[#0F172A] text-lg">
                    {testimonial.name}
                  </Title>

                  <Paragraph className="text-slate-600 text-sm">
                    {testimonial.title}
                  </Paragraph>

                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TestimonialsSection;
