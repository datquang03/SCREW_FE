import React, { useRef } from "react";
import { Typography, Row, Col, Form, Input, Button, Card } from "antd";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiMessageCircle,
  FiFacebook,
} from "react-icons/fi";

import { motion, useInView } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FaSquareThreads } from "react-icons/fa6";

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
      content: "StudioScong.rental@gmail.com",
    },
    {
      icon: FiPhone,
      title: "Hotline",
      content: "(+84) 93 375 31 10 (Anh Hải)",
    },
    {
      icon: FiMapPin,
      title: "Địa chỉ",
      content:
        "1 Trương Đình Hợi, Phường 18, Quận 4 , TP.HCM, Ho Chi Minh City, Vietnam, 700000",
    },
    {
      icon: FiFacebook,
      title: "Facebook",
      content: "https://www.facebook.com/S.CongStudio",
    },
    {
      icon: FaTiktok,
      title: "Tiktok",
      content: "https://www.tiktok.com/@scongstudio1999",
    },
    {
      icon: FaInstagram,
      title: "Instagram",
      content: "https://www.instagram.com/studioscong.rental/",
    },
    {
      icon: FaSquareThreads,
      title: "Threads",
      content: "https://www.threads.com/@studioscong.rental",
    },
  ];

  return (
    <div className="bg-[#FCFBFA] min-h-screen selection:bg-[#C5A267]/20">
      {/* EXECUTIVE HEADER */}
      <div className="bg-[#0F172A] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A267]/5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A267]/5"></div>

        <div className="container mx-auto px-6 relative z-10" ref={ref}>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">
              Get In Touch
            </p>
            <Title
              level={1}
              className="!text-5xl md:!text-6xl !font-semibold !text-white !mb-0"
            >
              Liên hệ với chúng tôi
            </Title>
            <div className="h-px w-24 bg-[#C5A267] mx-auto opacity-40"></div>
            <Paragraph className="!text-white text-sm uppercase tracking-widest max-w-2xl mx-auto">
              Phản hồi trong vòng 2 giờ làm việc
            </Paragraph>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <Row gutter={[48, 48]}>
          {/* Contact Info Cards */}
          <Col xs={24} lg={10}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
                  Contact Information
                </p>
                <Title
                  level={3}
                  className="!text-3xl !font-semibold !text-[#0F172A] !mb-0"
                >
                  Thông tin liên hệ
                </Title>
              </div>
              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white border border-slate-100 p-8 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:border-[#C5A267]">
                        <div className="flex items-start gap-6">
                          <div className="w-14 h-14 bg-[#0F172A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A267] transition-colors duration-500">
                            <IconComponent
                              size={24}
                              className="text-[#C5A267] group-hover:text-[#0F172A] transition-colors duration-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                              {info.title}
                            </p>
                            <p className="text-[#0F172A] font-semibold text-lg">
                              {info.content.startsWith("http") ? (
                                <a
                                  href={info.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#C5A267] transition-all duration-300"
                                >
                                  {/* Tên hiển thị đẹp */}
                                  <span className="relative">
                                    {info.title}
                                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#C5A267] transition-all duration-300 group-hover:w-full"></span>
                                  </span>

                                  {/* Icon nhỏ */}
                                  <FiSend className="opacity-0 group-hover:opacity-100 transition duration-300 translate-x-[-5px] group-hover:translate-x-0" />
                                </a>
                              ) : info.title === "Email" ? (
                                <a
                                  href={`mailto:${info.content}`}
                                  className="hover:text-[#C5A267] transition"
                                >
                                  {info.content}
                                </a>
                              ) : info.title === "Hotline" ? (
                                <a
                                  href={`tel:${info.content.replace(
                                    /\s/g,
                                    ""
                                  )}`}
                                  className="hover:text-[#C5A267] transition"
                                >
                                  {info.content}
                                </a>
                              ) : (
                                info.content
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="overflow-hidden border border-slate-100 transition-all duration-700"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.705044095591!2d106.7170939254747!3d10.757200159547159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fd595215683%3A0x19b08f215fb65d01!2zUyBD4buZbmcgU3R1ZGlv!5e0!3m2!1svi!2s!4v1775633789641!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </motion.div>
            </motion.div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-white border border-slate-100 p-12 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
                <div className="mb-12">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4 flex items-center gap-2">
                    <FiMessageCircle className="text-[#C5A267]" />
                    Send Message
                  </p>
                  <Title
                    level={3}
                    className="!text-3xl !font-semibold !text-[#0F172A] !mb-0"
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
                          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
                            Họ và tên
                          </span>
                        }
                        rules={[
                          { required: true, message: "Vui lòng nhập tên!" },
                        ]}
                      >
                        <Input
                          placeholder="Nguyễn Văn A"
                          className="!h-14 !border-slate-200 hover:!border-[#C5A267] focus:!border-[#C5A267] !shadow-none"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label={
                          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
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
                          className="!h-14 !border-slate-200 hover:!border-[#C5A267] focus:!border-[#C5A267] !shadow-none"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label={
                          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
                            Số điện thoại
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            type: "number",
                            message: "Số điện thoại không hợp lệ!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="0123456789"
                          className="!h-14 !border-slate-200 hover:!border-[#C5A267] focus:!border-[#C5A267] !shadow-none"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="message"
                    label={
                      <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
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
                      className="!border-slate-200 hover:!border-[#C5A267] focus:!border-[#C5A267] !shadow-none"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="!h-16 !px-16 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
                      icon={<FiSend />}
                      iconPosition="end"
                    >
                      Gửi tin nhắn
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactPage;
