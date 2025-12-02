import React from "react";
import { Typography } from "antd";
import { FiFacebook, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const { Title, Text, Link } = Typography;

const footerLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const social = [
  { icon: <FiFacebook />, href: "#" },
  { icon: <FiInstagram />, href: "#" },
  { icon: <FiYoutube />, href: "#" },
];

const Footer = () => (
  <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-16 pb-10 px-6 lg:px-12 overflow-hidden">
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute w-64 h-64 rounded-full bg-amber-400 blur-[120px] -top-10 -left-10" />
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500 blur-[140px] bottom-0 right-0" />
    </div>

    <div className="relative grid gap-10 lg:grid-cols-3 max-w-6xl mx-auto">
      <div>
        <Title
          level={3}
          className="text-blue-400 mb-3 font-bold"
          style={{ color: "#60a5fa" }}
        >
          S+ Studio
        </Title>
        <Text
          className="text-blue-300 text-sm leading-relaxed block font-medium"
          style={{ color: "#93c5fd" }}
        >
          Không gian sáng tạo chuyên nghiệp tại TP.HCM. Chúng tôi đồng hành cùng các nhãn hàng và nhà sáng tạo trong mọi dự án hình ảnh.
            </Text>
        <div className="mt-5 flex gap-3">
          {social.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="w-11 h-11 rounded-full bg-white/10 border border-blue-400/30 flex items-center justify-center text-lg text-blue-300 hover:text-blue-400 hover:border-blue-400 hover:bg-white/10 transition-all duration-300"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <Title
          level={5}
          className="text-blue-400 mb-4 font-semibold"
          style={{ color: "#60a5fa" }}
        >
          Liên kết nhanh
        </Title>
        <ul className="space-y-2">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-blue-300 hover:text-blue-400 transition-colors text-sm font-medium"
                style={{ color: "#93c5fd" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
            </ul>
            </div>

      <div>
        <Title
          level={5}
          className="text-blue-400 mb-4 font-semibold"
          style={{ color: "#60a5fa" }}
        >
          Liên hệ
        </Title>
        <div
          className="space-y-3 text-blue-300 text-sm font-medium"
          style={{ color: "#93c5fd" }}
        >
          <p className="flex items-center gap-2">
            <FiMapPin className="text-blue-400" /> 123 Nguyễn Trãi, Q.5, TP.HCM
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-blue-400" /> 0902 888 999
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-blue-400" /> booking@splusstudio.vn
          </p>
        </div>
      </div>
    </div>

    <div className="relative border-t border-blue-400/20 mt-12 pt-5 text-center">
      <Text
        className="text-blue-300 text-xs md:text-sm font-medium"
        style={{ color: "#93c5fd" }}
      >
        © {new Date().getFullYear()} S+ Studio. All rights reserved.
      </Text>
      </div>
    </footer>
  );

export default Footer;