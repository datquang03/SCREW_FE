import React from "react";
import { Row, Col, Typography } from "antd";
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from "@ant-design/icons";

const { Title, Link, Text } = Typography;

const Footer = () => {
  return (
    <footer className="relative bg-gray-800 text-white py-8 md:py-12 px-4 md:px-6 z-10">
      <div className="container mx-auto">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} className="text-white mb-2">S+ Studio</Title>
            <Text className="text-gray-400 text-sm">
              Không gian sáng tạo chuyên nghiệp tại TP.HCM.
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={5} className="text-white mb-2">Liên kết</Title>
            <ul className="space-y-1">
              <li><Link href="/" className="text-gray-400 hover:text-white text-sm">Trang chủ</Link></li>
              <li><Link href="/studio" className="text-gray-400 hover:text-white text-sm">Studio</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm">Liên hệ</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Title level={5} className="text-white mb-2">Theo dõi chúng tôi</Title>
            <div className="flex space-x-3">
              <Link href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><FacebookOutlined /></Link>
              <Link href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><InstagramOutlined /></Link>
              <Link href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><YoutubeOutlined /></Link>
            </div>
          </Col>
        </Row>
        <div className="border-t border-gray-700/50 mt-6 pt-4 text-center">
          <Text className="text-gray-500 text-xs md:text-sm">© {new Date().getFullYear()} S+ Studio. All Rights Reserved.</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;