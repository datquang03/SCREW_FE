import React, { useRef } from "react";
import Layout from "../../components/layout/Layout";
import { Typography, Row, Col, Avatar, Card } from "antd";
import { UserOutlined, TrophyOutlined, TeamOutlined, RocketOutlined } from "@ant-design/icons";
import { motion, useInView } from "framer-motion";
import studioImage from "../../assets/SCONGSTUDIO.jpg";

const { Title, Paragraph } = Typography;

const teamMembers = [
  {
    name: "Trần Văn A",
    role: "Founder & CEO",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026701d",
    color: "from-yellow-400 to-yellow-500",
  },
  {
    name: "Nguyễn Thị B",
    role: "Head of Photography",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d",
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Lê Văn C",
    role: "Set Designer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    color: "from-purple-400 to-purple-500",
  },
];

const values = [
  {
    icon: <TrophyOutlined />,
    title: "Chất lượng",
    description: "Cam kết mang đến dịch vụ và thiết bị tốt nhất",
    color: "from-yellow-400 to-yellow-500",
  },
  {
    icon: <TeamOutlined />,
    title: "Đồng hành",
    description: "Luôn đồng hành và hỗ trợ khách hàng trong mọi dự án",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: <RocketOutlined />,
    title: "Đổi mới",
    description: "Không ngừng cập nhật công nghệ và xu hướng mới",
    color: "from-purple-400 to-purple-500",
  },
];

const AboutUsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Layout>
      <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
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
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
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
        </div>

        <div className="container mx-auto py-20 md:py-32 px-6 relative z-10" ref={ref}>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-600 rounded-full text-sm font-semibold mb-4"
            >
              Về chúng tôi
            </motion.span>
            <Title
              level={1}
              className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              Về{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                S Cộng Studio
              </span>
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              S Cộng Studio được thành lập với sứ mệnh cung cấp một không gian sáng tạo chuyên
              nghiệp, nơi các nhiếp ảnh gia, nhà làm phim và các nhà sáng tạo nội dung có thể biến
              những ý tưởng táo bạo nhất của mình thành hiện thực.
            </Paragraph>
          </motion.div>

          {/* Mission Section */}
          <Row gutter={[48, 48]} align="middle" className="mb-24">
            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Title level={2} className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Sứ mệnh của chúng tôi
                </Title>
                <Paragraph className="text-lg text-gray-600 leading-relaxed mb-6">
                  Chúng tôi tin rằng không gian làm việc chuyên nghiệp là nền tảng cho sự sáng tạo
                  không giới hạn. Vì vậy, chúng tôi cam kết mang đến những studio được trang bị
                  tốt nhất, cùng với sự hỗ trợ tận tâm từ đội ngũ chuyên gia.
                </Paragraph>
                <Paragraph className="text-lg text-gray-600 leading-relaxed">
                  Mỗi dự án của bạn đều được chúng tôi coi trọng và đầu tư tâm huyết, từ khâu tư
                  vấn đến thực hiện, đảm bảo mang lại kết quả vượt ngoài mong đợi.
                </Paragraph>
              </motion.div>
            </Col>
            <Col xs={24} md={12} className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                className="rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={studioImage}
                  alt="S Cong Studio"
                  className="w-full max-w-md rounded-2xl"
                />
              </motion.div>
            </Col>
          </Row>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những giá trị mà chúng tôi luôn hướng tới và cam kết thực hiện
              </Paragraph>
            </div>
            <Row gutter={[24, 24]}>
              {values.map((value, index) => (
                <Col key={index} xs={24} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
                    style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                  >
                    <Card
                      className="rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full text-center"
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg mx-auto mb-4`}
                      >
                        <div className="text-2xl text-white">{value.icon}</div>
                      </motion.div>
                      <Title level={4} className="text-xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </Title>
                      <Paragraph className="text-gray-600">{value.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-center mb-12">
              <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Gặp gỡ đội ngũ
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những con người tài năng và tận tâm đứng sau S Cộng Studio
              </Paragraph>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {teamMembers.map((member, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 1.2 + index * 0.15,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.1, rotateY: 5, z: 50 }}
                    style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                    className="text-center"
                  >
                    <Card className="rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex justify-center mb-4"
                      >
                        <div
                          className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${member.color} p-1 shadow-lg`}
                        >
                          <Avatar
                            size={92}
                            src={member.avatar}
                            icon={<UserOutlined />}
                            className="border-2 border-white"
                          />
                        </div>
                      </motion.div>
                      <Title level={4} className="mt-4 text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </Title>
                      <Paragraph className="text-gray-600 font-medium">{member.role}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUsPage;