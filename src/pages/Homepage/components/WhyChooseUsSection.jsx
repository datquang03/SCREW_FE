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
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
      badge="Tại sao chọn chúng tôi?"
      title="Tại sao chọn S Cộng?"
      subtitle="Chúng tôi mang đến một giải pháp toàn diện cho sản phẩm của bạn với cam kết chất lượng và dịch vụ xuất sắc."
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
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
                  <Title level={4} className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-600 leading-relaxed">
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