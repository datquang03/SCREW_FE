// src/pages/AboutUs/AboutUsPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Card, Typography, Row, Col, Statistic } from "antd";
import {
  FiAward,
  FiUsers,
  FiCamera,
  FiVideo,
  FiTarget,
  FiHeart,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import Section from "../../components/common/Section";
import GallerySlider from "./components/GalarySlider";

import studioImage from "../../assets/SCONGSTUDIO.jpg";
import img1 from "../../assets/room100m2(360).jpg";
import img2 from "../../assets/room100m2(360).jpg";
import img3 from "../../assets/room100m2(360).jpg";

const { Title, Paragraph, Text } = Typography;

const AboutUsPage = () => {
  const images = [img1, img2, img3];

  const stats = [
    { icon: <FiAward />, value: "500+", label: "Dự án hoàn thành" },
    { icon: <FiUsers />, value: "200+", label: "Khách hàng hài lòng" },
    { icon: <FiCamera />, value: "50+", label: "Studio chuyên nghiệp" },
    { icon: <FiVideo />, value: "1000+", label: "Video sản xuất" },
  ];

  const values = [
    {
      icon: <FiTarget />,
      title: "Tầm nhìn",
      description:
        "Trở thành studio hàng đầu tại Việt Nam, mang đến không gian sáng tạo và công nghệ hiện đại nhất cho mọi dự án hình ảnh.",
    },
    {
      icon: <FiHeart />,
      title: "Sứ mệnh",
      description:
        "Đồng hành cùng các nhãn hàng và nhà sáng tạo trong mọi dự án, từ concept đến execution, đảm bảo chất lượng và sự hài lòng tuyệt đối.",
    },
    {
      icon: <FiZap />,
      title: "Giá trị cốt lõi",
      description:
        "Chuyên nghiệp, sáng tạo, đổi mới và cam kết mang lại trải nghiệm tốt nhất cho khách hàng trong mọi dự án.",
    },
  ];

  const services = [
    "Chụp ảnh sản phẩm chuyên nghiệp",
    "Quay video quảng cáo & lookbook",
    "Studio cho thuê với đầy đủ thiết bị",
    "Thiết kế Set Design tùy chỉnh",
    "Hỗ trợ concept & creative direction",
    "Post-production & editing",
  ];

  const features = [
    "Không gian rộng rãi, hiện đại",
    "Thiết bị chuyên nghiệp hàng đầu",
    "Đội ngũ kỹ thuật giàu kinh nghiệm",
    "Hỗ trợ 24/7 cho mọi dự án",
    "Giá cả cạnh tranh, minh bạch",
    "Cam kết chất lượng 100%",
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-amber-50 via-white to-blue-50 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-amber-100 rounded-full text-sm font-semibold text-amber-700 mb-6 shadow-sm">
              <FiAward className="text-amber-600" />
              Studio chuyên nghiệp
            </div>
            <Title
              level={1}
              className="!text-4xl md:!text-6xl !font-extrabold !mb-6 bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text"
            >
              Về Chúng Tôi
            </Title>
            <Paragraph className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Không gian sáng tạo chuyên nghiệp tại TP.HCM. Chúng tôi đồng hành cùng các nhãn hàng và nhà sáng tạo trong mọi dự án hình ảnh.
            </Paragraph>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center border border-amber-100 rounded-2xl shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all h-full">
                    <div className="text-4xl text-amber-600 mb-3 flex justify-center">
                      {stat.icon}
                    </div>
                    <Title level={2} className="!mb-1 !text-3xl !font-bold text-gray-900">
                      {stat.value}
                    </Title>
                    <Text className="text-gray-600 font-medium">{stat.label}</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </Section>

      {/* Giới thiệu Section */}
      <Section className="bg-gradient-to-br from-amber-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border border-amber-100 rounded-2xl p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl">
                  i
                </div>
                <Title level={2} className="!mb-0 !text-3xl !font-bold text-gray-900">
                  Giới thiệu
                </Title>
              </div>
              <Paragraph className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                Chúng tôi là đội ngũ sáng tạo chuyên về thiết kế studio, chụp ảnh, dựng video và phát triển nội dung chuyên nghiệp. Với nhiều năm kinh nghiệm trong ngành, chúng tôi luôn theo đuổi tiêu chuẩn cao nhất để mang lại trải nghiệm nghệ thuật hiện đại và cảm xúc nhất cho mọi khách hàng.
              </Paragraph>
              <Paragraph className="text-base md:text-lg text-gray-700 leading-relaxed">
                Tại S+ Studio, chúng tôi không chỉ cung cấp không gian và thiết bị, mà còn là đối tác sáng tạo đáng tin cậy, giúp bạn biến mọi ý tưởng thành hiện thực với chất lượng chuyên nghiệp.
              </Paragraph>
            </Card>
          </motion.div>

          {/* Tầm nhìn & Giá trị */}
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] h-full hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all">
                    <div className="text-4xl text-amber-600 mb-4">
                      {value.icon}
                    </div>
                    <Title level={3} className="!mb-3 !text-xl !font-bold text-gray-900">
                      {value.title}
                    </Title>
                    <Paragraph className="text-gray-600 leading-relaxed !mb-0">
                      {value.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </Section>

      {/* Dịch vụ Section */}
      <Section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border border-amber-100 rounded-2xl p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  ⚙️
                </div>
                <Title level={2} className="!mb-0 !text-3xl !font-bold text-gray-900">
                  Dịch vụ của chúng tôi
                </Title>
              </div>
              <Row gutter={[16, 16]}>
                {services.map((service, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-white to-amber-50/60 border border-amber-100 rounded-xl">
                      <FiCheckCircle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
                      <Text className="text-gray-700 font-medium">{service}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Đặc điểm nổi bật */}
      <Section className="bg-gradient-to-br from-amber-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border border-amber-100 rounded-2xl p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  ✦
                </div>
                <Title level={2} className="!mb-0 !text-3xl !font-bold text-gray-900">
                  Đặc điểm nổi bật
                </Title>
              </div>
              <Row gutter={[16, 16]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-white to-emerald-50/60 border border-emerald-100 rounded-xl">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                      <Text className="text-gray-700 font-medium">{feature}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Gallery Section */}
      <Section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <Title level={2} className="!mb-3 !text-3xl !font-bold text-gray-900">
                Bộ Sưu Tập
              </Title>
              <Paragraph className="text-gray-600 text-base">
                Một vài hình ảnh nổi bật trong những dự án gần đây của chúng tôi.
              </Paragraph>
            </div>
            <div className="border border-amber-100 rounded-2xl p-6 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] bg-gradient-to-br from-amber-50/30 to-white">
              <GallerySlider images={images} />
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default AboutUsPage;
