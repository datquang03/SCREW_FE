import React from "react";
import { Typography } from "antd";
import { FiFacebook, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const { Title, Text, Link } = Typography;

const footerLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Thiết bị", href: "/equipment" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const social = [
  { icon: <FiFacebook />, href: "#" },
  { icon: <FiInstagram />, href: "#" },
  { icon: <FiYoutube />, href: "#" },
];

const Footer = () => (
  <footer className="footer-professional">
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="footer-grid">
        {/* Brand Section */}
        <div>
          <h3 className="footer-section-title">S Cộng Studio</h3>
          <p className="footer-section-text">
            Không gian sáng tạo chuyên nghiệp tại TP.HCM. Chúng tôi đồng hành cùng các nhãn hàng và nhà sáng tạo trong mọi dự án hình ảnh chất lượng cao.
          </p>
          <div className="footer-social">
            {social.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="footer-social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-section-title">Liên kết nhanh</h3>
          <ul className="footer-links">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="footer-section-title">Liên hệ</h3>
          <div className="space-y-4">
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <FiMapPin />
              </div>
              <span>Số 1 Trương Đình Hợi, Phường 18, Quận 4, Thành phố Hồ Chí Minh, Việt Nam</span>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <FiPhone />
              </div>
              <span>093 375 31 10</span>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <FiMail />
              </div>
              <span>binhson1982@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;