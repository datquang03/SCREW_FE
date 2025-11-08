import React, { useRef } from "react";
import Layout from "../../components/layout/Layout";
import { Typography, Row, Col, Card, Tag } from "antd";
import {
  CameraOutlined,
  BulbOutlined,
  SoundOutlined,
  AppstoreOutlined,
  ToolOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { FiCheckCircle } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { EQUIPMENT_CATEGORIES } from "../../constants/equipment";
import Section from "../../components/common/Section";
import IconBox from "../../components/common/IconBox";
import AnimatedCard from "../../components/common/AnimatedCard";

const { Title, Text, Paragraph } = Typography;

const iconMap = {
  CameraOutlined: CameraOutlined,
  BulbOutlined: BulbOutlined,
  SoundOutlined: SoundOutlined,
  AppstoreOutlined: AppstoreOutlined,
  ToolOutlined: ToolOutlined,
  DesktopOutlined: DesktopOutlined,
};

const EquipmentPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Layout>
      {/* Hero Section */}
      <Section
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 px-4 md:px-6 lg:px-16 overflow-hidden"
        containerClass="container mx-auto relative z-10"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
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
              Thiết bị chuyên nghiệp
            </Title>
            <Paragraph className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Hệ thống thiết bị đầy đủ và hiện đại, sẵn sàng phục vụ mọi nhu cầu sản xuất nội dung
              của bạn. Từ máy ảnh, ánh sáng đến âm thanh và hậu kỳ.
            </Paragraph>
          </motion.div>
        </div>
      </Section>

      {/* Equipment Categories */}
      <Section
        ref={ref}
        className="relative bg-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
        title="Danh mục thiết bị"
        subtitle="Thiết bị được cập nhật thường xuyên và bảo trì định kỳ"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EQUIPMENT_CATEGORIES.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <AnimatedCard
                key={category.id}
                index={index}
                isInView={isInView}
                className="h-full"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-4">
                    <IconBox
                      Icon={IconComponent}
                      color="from-blue-400 to-blue-500"
                      size="w-16 h-16"
                      iconSize={28}
                    />
                  </div>
                  <Title level={4} className="text-xl font-bold text-gray-900 mb-4">
                    {category.name}
                  </Title>
                </div>

                <ul className="space-y-2 text-left">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                      <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            );
          })}
        </div>
      </Section>

      {/* Equipment Details */}
      <Section
        className="relative bg-gray-50 py-12 md:py-16 px-4 md:px-6 lg:px-16"
        title="Thông tin chi tiết"
        subtitle="Tất cả thiết bị đều được kiểm tra và bảo trì định kỳ"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card className="h-full">
              <Title level={4} className="mb-4">
                Chính sách sử dụng thiết bị
              </Title>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" size={16} />
                  <span>Thiết bị được bao gồm trong giá thuê studio</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" size={16} />
                  <span>Hướng dẫn sử dụng miễn phí từ đội ngũ kỹ thuật</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" size={16} />
                  <span>Bảo hiểm thiết bị trong quá trình sử dụng</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" size={16} />
                  <span>Hỗ trợ kỹ thuật 24/7 trong giờ làm việc</span>
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="h-full">
              <Title level={4} className="mb-4">
                Yêu cầu đặc biệt
              </Title>
              <Paragraph className="text-gray-600 mb-4">
                Nếu bạn cần thiết bị đặc biệt không có trong danh sách, vui lòng liên hệ trước
                để chúng tôi có thể chuẩn bị.
              </Paragraph>
              <div className="space-y-2">
                <Tag color="blue">Thiết bị cao cấp</Tag>
                <Tag color="blue">Thiết bị chuyên dụng</Tag>
                <Tag color="blue">Thiết bị theo yêu cầu</Tag>
              </div>
            </Card>
          </Col>
        </Row>
      </Section>
    </Layout>
  );
};

export default EquipmentPage;
