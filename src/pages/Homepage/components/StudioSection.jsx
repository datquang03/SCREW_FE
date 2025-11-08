import React, { useRef } from "react";
import { Card, Typography, Button } from "antd";
import { FiStar, FiArrowRight, FiMapPin, FiUsers } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { STUDIOS } from "../../../constants/studios";
import Section from "../../../components/common/Section";
import AnimatedCard from "../../../components/common/AnimatedCard";

const { Title, Text, Paragraph } = Typography;

const StudioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section
      ref={ref}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
      title="Khám phá không gian"
      subtitle="Studio được trang bị để đáp ứng mọi nhu cầu sáng tạo."
      containerClass="container mx-auto relative z-10"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STUDIOS.map((studio, index) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : { opacity: 0, y: 100, rotateX: -15 }
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
            >
              <Card
                hoverable
                className="rounded-2xl overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
                style={{
                  transformStyle: "preserve-3d",
                }}
                cover={
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <motion.img
                      alt={studio.name}
                      src={studio.img}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
                        <Text strong className="text-sm">{studio.rating}</Text>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="p-4">
                  <Title level={4} className="mb-2 text-lg font-bold text-gray-900">
                    {studio.name}
                  </Title>
                  {studio.description && (
                    <Paragraph className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {studio.description}
                    </Paragraph>
                  )}
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                    {studio.area && (
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        <span>{studio.area}</span>
                      </div>
                    )}
                    {studio.capacity && (
                      <div className="flex items-center gap-1">
                        <FiUsers size={12} />
                        <span>{studio.capacity}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {studio.features.slice(0, 3).map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <Text className="text-xs text-gray-500 block">Từ</Text>
                      <Text strong className="text-lg text-yellow-600 font-bold">
                        {studio.pricePerHour || studio.price} VNĐ
                      </Text>
                      <Text className="text-xs text-gray-500">/giờ</Text>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        href="/studio"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none rounded-lg"
                      >
                        Xem chi tiết
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="default"
              size="large"
              href="/studio"
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-none shadow-xl hover:shadow-2xl font-semibold px-8 py-6 h-auto rounded-xl"
              icon={<FiArrowRight className="inline-block" />}
              iconPosition="end"
            >
              Xem tất cả Studio
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default StudioSection;