import React, { useRef } from "react";
import { Card, Typography } from "antd";
import { motion, useInView } from "framer-motion";
import { FEATURES } from "../../../constants/features";
import Section from "../../../components/common/Section";
import IconBox from "../../../components/common/IconBox";
import AnimatedCard from "../../../components/common/AnimatedCard";

const { Title, Paragraph } = Typography;

const WhyChooseUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section
      ref={ref}
      className="relative bg-white py-24 px-4 md:px-6 lg:px-16 overflow-hidden"
      badge="Tại sao chọn S+ Studio?"
      title="Lý do khách hàng tin tưởng"
      subtitle="Dịch vụ cho thuê studio chuyên nghiệp với thiết bị hiện đại, không gian đa dạng và hỗ trợ tận tâm."
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-0 w-96 h-96 bg-[#C5A267]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0F172A]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#C5A267]/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
        
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 border-2 border-[#C5A267]/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-12 h-12 border-2 border-slate-400/20 rotate-45"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Center decorative image placeholder - Hidden */}
      <div className="hidden">
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <AnimatedCard
                key={index}
                index={index}
                isInView={isInView}
                className={`${feature.bgColor} h-full`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <IconBox
                      Icon={IconComponent}
                      color={feature.color}
                      size="w-20 h-20"
                      iconSize={32}
                    />
                  </div>
                  <Title level={4} className="text-xl font-semibold text-[#0F172A] mb-3">
                    {feature.title}
          </Title>
                  <Paragraph className="text-slate-600 leading-relaxed">
                    {feature.description}
          </Paragraph>
        </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default WhyChooseUsSection;