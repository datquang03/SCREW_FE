import React, { useRef, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Typography, Row, Col, Card, Button, Tag, Rate, Modal, Calendar, Badge } from "antd";
import { FiStar, FiMapPin, FiClock, FiUsers, FiCheckCircle } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { STUDIOS } from "../../constants/studios";
import Section from "../../components/common/Section";
import AnimatedCard from "../../components/common/AnimatedCard";
import { CalendarOutlined, DollarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const StudioPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookStudio = (studio) => {
    setSelectedStudio(studio);
    setBookingModalOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Section
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 px-4 md:px-6 lg:px-16 overflow-hidden"
        containerClass="container mx-auto relative z-10"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Title
              level={1}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
            >
              Cho thuê Studio chuyên nghiệp
            </Title>
            <Paragraph className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Không gian sáng tạo đầy đủ tiện nghi, thiết bị hiện đại và đội ngũ hỗ trợ chuyên nghiệp.
              Phục vụ quay phim, chụp ảnh, livestream và sản xuất nội dung.
            </Paragraph>
          </motion.div>
        </div>
      </Section>

      {/* Studios List */}
      <Section
        ref={ref}
        className="relative bg-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
        title="Danh sách Studio"
        subtitle="Chọn studio phù hợp với nhu cầu của bạn"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {STUDIOS.map((studio, index) => (
            <AnimatedCard
              key={studio.id}
              index={index}
              isInView={isInView}
              className="overflow-hidden bg-white"
              hoverable
            >
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                <motion.img
                  alt={studio.name}
                  src={studio.img}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
                    <Text strong className="text-sm">{studio.rating}</Text>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Title level={3} className="text-white mb-2 text-2xl font-bold">
                    {studio.name}
                  </Title>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <FiMapPin size={14} />
                      <span>TP. Hồ Chí Minh</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} />
                      <span>10-20 người</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <Text className="text-gray-600 text-sm">Tính năng:</Text>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {studio.features.map((feature, idx) => (
                      <Tag key={idx} color="yellow" className="text-xs">
                        {feature}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <Text className="text-gray-500 text-sm">Giá thuê</Text>
                    <div className="flex items-baseline gap-1">
                      <Text strong className="text-2xl text-yellow-600 font-bold">
                        {studio.price}
                      </Text>
                      <Text className="text-gray-500 text-sm">VNĐ/giờ</Text>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => handleBookStudio(studio)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none shadow-lg"
                    icon={<CalendarOutlined />}
                  >
                    Đặt lịch
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Booking Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-yellow-500" />
            <span>Đặt lịch thuê Studio</span>
          </div>
        }
        open={bookingModalOpen}
        onCancel={() => setBookingModalOpen(false)}
        footer={null}
        width={800}
        className="booking-modal"
      >
        {selectedStudio && (
          <div className="py-4">
            <div className="mb-6">
              <Title level={4} className="mb-2">
                {selectedStudio.name}
              </Title>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarOutlined />
                  <span>{selectedStudio.price} VNĐ/giờ</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  <span>{selectedStudio.rating}</span>
                </div>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">
                    Chọn ngày và giờ
                  </Text>
                  <Calendar
                    fullscreen={false}
                    className="w-full"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">
                    Thông tin đặt lịch
                  </Text>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-600">Thời gian thuê:</Text>
                      <Text strong className="block">2 giờ (tối thiểu)</Text>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-600">Tổng chi phí:</Text>
                      <Text strong className="block text-xl text-yellow-600">
                        {selectedStudio.price} VNĐ
                      </Text>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <InfoCircleOutlined className="text-blue-500 mt-1" />
                        <div>
                          <Text strong className="text-sm block mb-1">
                            Lưu ý:
                          </Text>
                          <Text className="text-xs text-gray-600">
                            • Thanh toán 50% trước khi sử dụng
                            <br />
                            • Hủy trước 24h được hoàn 100%
                            <br />
                            • Bao gồm thiết bị cơ bản
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mt-6 flex gap-3">
              <Button
                type="primary"
                block
                size="large"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none"
                onClick={() => {
                  setBookingModalOpen(false);
                  // Handle booking logic here
                }}
              >
                Xác nhận đặt lịch
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default StudioPage;
