import React, { useRef } from "react";
import Layout from "../../components/layout/Layout";
import { Typography, Row, Col, Form, Input, Button, Card } from "antd";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiMessageCircle,
} from "react-icons/fi";
import { motion, useInView } from "framer-motion";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      content: "contact@scongstudio.com",
      color: "from-yellow-400 to-yellow-500",
    },
    {
      icon: FiPhone,
      title: "Điện thoại",
      content: "(+84) 123 456 789",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: FiMapPin,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 4, TP. Hồ Chí Minh",
      color: "from-purple-400 to-purple-500",
    },
  ];

  return (
    <Layout>
      <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
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
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
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

        <div
          className="container mx-auto py-20 md:py-32 px-6 relative z-10"
          ref={ref}
        >
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
              Liên hệ với chúng tôi
            </motion.span>
            <Title
              level={1}
              className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              Hãy bắt đầu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                cuộc trò chuyện
              </span>
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gửi tin nhắn cho chúng tôi và chúng tôi sẽ liên hệ lại sớm nhất có
              thể. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
            </Paragraph>
          </motion.div>

          <Row gutter={[48, 48]} justify="center">
            {/* Contact Info Cards */}
            <Col xs={24} md={10}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Title
                  level={3}
                  className="text-2xl font-bold mb-8 text-gray-900"
                >
                  Thông tin liên hệ
                </Title>
                <div className="space-y-6 mb-8">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                      >
                        <Card
                          className="rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <div className="flex items-start gap-4">
                            <motion.div
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                            >
                              <IconComponent size={24} className="text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <Title
                                level={5}
                                className="mb-2 text-gray-900 font-semibold"
                              >
                                {info.title}
                              </Title>
                              <Paragraph className="text-gray-600 mb-0">
                                {info.content}
                              </Paragraph>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Map */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.63179!2d106.6926!3d10.7626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b8a0e0b0f%3A0x5809332b0b5c8b5a!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1620049219123!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="rounded-2xl"
                  ></iframe>
                </motion.div>
              </motion.div>
            </Col>

            {/* Contact Form */}
            <Col xs={24} md={14}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  className="rounded-2xl border-0 shadow-2xl bg-white/80 backdrop-blur-lg"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg"
                    >
                      <FiMessageCircle size={24} className="text-white" />
                    </motion.div>
                    <Title
                      level={3}
                      className="text-2xl font-bold mb-0 text-gray-900"
                    >
                      Gửi tin nhắn
                    </Title>
                  </div>

                  <Form
                    name="contact"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label={
                            <span className="font-semibold text-gray-700">
                              Họ và tên
                            </span>
                          }
                          rules={[
                            { required: true, message: "Vui lòng nhập tên!" },
                          ]}
                        >
                          <Input
                            placeholder="Nguyễn Văn A"
                            className="rounded-lg border-gray-300 hover:border-yellow-400 focus:border-yellow-400"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label={
                            <span className="font-semibold text-gray-700">
                              Email
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              type: "email",
                              message: "Email không hợp lệ!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="example@email.com"
                            className="rounded-lg border-gray-300 hover:border-yellow-400 focus:border-yellow-400"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="message"
                      label={
                        <span className="font-semibold text-gray-700">
                          Nội dung
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập nội dung!" },
                      ]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Nội dung tin nhắn của bạn..."
                        className="rounded-lg border-gray-300 hover:border-yellow-400 focus:border-yellow-400"
                      />
                    </Form.Item>
                    <Form.Item>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 font-semibold rounded-xl px-8 py-6 h-auto"
                          icon={<FiSend />}
                          iconPosition="end"
                        >
                          Gửi tin nhắn
                        </Button>
                      </motion.div>
                    </Form.Item>
                  </Form>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
