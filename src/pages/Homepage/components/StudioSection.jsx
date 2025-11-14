// src/pages/Homepage/sections/StudioSection.jsx
import React, { useRef, useEffect } from "react";
import { Card, Typography, Button, Spin } from "antd";
import { FiStar, FiArrowRight, FiMapPin, FiUsers } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getActiveStudios } from "../../../features/studio/studioSlice";
import Section from "../../../components/common/Section";

const { Title, Text, Paragraph } = Typography;

const StudioSection = () => {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.studio);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <Section
      ref={ref}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
      title="Studio cho thuê"
      subtitle="Các studio đa dạng từ 100m² đến 300m², phù hợp quay phim, chụp ảnh và sản xuất nội dung."
      containerClass="container mx-auto relative z-10"
    >
      {/* Background subtle decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/3 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <Spin size="large" />
            </div>
          ) : (
            studios.map((studio, index) => (
              <motion.div
                key={studio._id}
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
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
                onClick={() => (window.location.href = `/studio/${studio._id}`)}
              >
                <Card
                  hoverable
                  className="rounded-2xl overflow-hidden border-0 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(234,179,8,0.3)] transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  style={{ transformStyle: "preserve-3d" }}
                  cover={
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group">
                      {studio.images?.[0] ? (
                        <motion.img
                          alt={studio.name}
                          src={studio.images[0]}
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white/50 text-4xl">
                          📷
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <FiStar
                            className="text-yellow-500 fill-yellow-500"
                            size={16}
                          />
                          <Text strong className="text-sm">
                            {studio.rating || 0}
                          </Text>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-4">
                    <Title
                      level={4}
                      className="mb-2 text-lg font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
                    >
                      {studio.name}
                    </Title>
                    {studio.description && (
                      <Paragraph className="text-sm text-gray-700 mb-3 line-clamp-2 font-medium">
                        {studio.description}
                      </Paragraph>
                    )}
                    <div className="flex items-center gap-3 mb-3 text-xs font-semibold">
                      {studio.area && (
                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <FiMapPin size={12} className="text-blue-500" />
                          <span>{studio.area} m²</span>
                        </div>
                      )}
                      {studio.capacity && (
                        <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          <FiUsers size={12} className="text-purple-500" />
                          <span>{studio.capacity}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {studio.amenities?.slice(0, 3).map((feature, idx) => {
                        const colors = [
                          "from-yellow-400 to-yellow-500",
                          "from-blue-400 to-blue-500",
                          "from-green-400 to-green-500",
                        ];
                        return (
                          <div
                            key={idx}
                            className="text-xs text-gray-700 font-medium flex items-center gap-2"
                          >
                            <div
                              className={`w-2 h-2 bg-gradient-to-r ${colors[idx]} rounded-full flex-shrink-0 shadow-lg`}
                            />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                      <div>
                        <Text className="text-xs text-gray-500 block font-medium">
                          Từ
                        </Text>
                        <Text
                          strong
                          className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 font-extrabold"
                        >
                          {studio.basePricePerHour?.toLocaleString("vi-VN")} VNĐ
                        </Text>
                        <Text className="text-xs text-gray-500 font-medium">
                          /giờ
                        </Text>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          href={`/studio/${studio._id}`}
                          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-none rounded-lg shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 font-semibold"
                        >
                          Xem chi tiết
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
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
