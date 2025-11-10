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
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-yellow-400/30 rotate-45" />
            <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-yellow-400/20 rotate-12" />
          </div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Hero Image placeholder */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 lg:w-1/3 opacity-20 md:opacity-30 pointer-events-none hidden md:block">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-800/50 rounded-l-3xl border-l-2 border-yellow-400/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-white/50 text-sm">Thêm hình ảnh studio</p>
                  <p className="text-white/30 text-xs mt-2">Kích thước: 1200x800px</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Title
              level={1}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
            >
              Cho thuê Studio S+ Studio
            </Title>
            <Paragraph className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              <strong>4 studio đa dạng</strong> từ 100m² đến 300m² với đầy đủ thiết bị: máy ảnh, ánh sáng LED, 
              phòng xanh, hệ thống âm thanh. Phục vụ quay phim, chụp ảnh sản phẩm, livestream và sản xuất nội dung.
            </Paragraph>
          </motion.div>
        </div>
      </Section>

      {/* Studios List */}
      <Section
        ref={ref}
        className="relative bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
        title="Danh sách Studio cho thuê"
        subtitle="Chọn studio phù hợp với dự án của bạn - từ chụp ảnh sản phẩm đến quay phim chuyên nghiệp"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          
          {/* Dotted pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STUDIOS.map((studio, index) => (
            <AnimatedCard
              key={studio.id}
              index={index}
              isInView={isInView}
              className="overflow-hidden bg-white"
              hoverable
            >
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group">
                {/* Image with fallback placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-gray-800 to-gray-900">
                  <motion.img
                    alt={studio.name}
                    src={studio.img}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Placeholder when image fails */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <div className="text-center text-white/60">
                      <div className="text-5xl mb-3">📷</div>
                      <p className="text-sm font-medium">{studio.name}</p>
                      <p className="text-xs text-white/40 mt-1">Thêm hình ảnh studio</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-400/30" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
