import React from "react";
import {
  CameraOutlined,
  ShoppingOutlined,
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import IntroSection from "./components/IntroSection";
import StudioSection from "./components/StudioSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import GallerySection from "./components/GallerySection";
import SetDesignSection from "./components/SetDesignSection";
import PromotionSection from "./components/PromotionSection";

const Homepage = () => {
  return (
    <div className="relative min-h-screen text-gray-900 overflow-hidden bg-[#FCFBFA]">
      {/* Quick actions */}
      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-8 md:pt-10">
        <div className="hidden lg:flex items-center justify-between gap-6 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 px-8 py-6">
          <div className="flex items-center gap-3 text-base md:text-lg font-semibold text-[#C5A267] uppercase tracking-[0.2em]">
            <ArrowRightOutlined className="text-xl" /> Khám phá nhanh
          </div>
          <div className="flex items-center gap-4">
            {[
              { icon: <CameraOutlined />, label: "Đặt studio", href: "/studio" },
              { icon: <ShoppingOutlined />, label: "Set design", href: "/set-designs" },
              { icon: <MessageOutlined />, label: "Liên hệ tư vấn", href: "/contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-800 font-semibold text-sm md:text-base hover:border-[#C5A267] hover:text-[#C5A267] transition-all"
              >
                <span className="text-lg md:text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="relative container mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10 lg:py-12 space-y-10 lg:space-y-12">
        <IntroSection />
        <PromotionSection />
        <StudioSection />
        <SetDesignSection />
        <WhyChooseUsSection />
        <GallerySection />
      </main>
    </div>
  );
};

export default Homepage;