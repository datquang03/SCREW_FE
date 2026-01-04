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
import TestimonialsSection from "./components/TestimonialsSection";
import SetDesignSection from "./components/SetDesignSection";

const Homepage = () => {
  return (
    <div
      className="relative min-h-screen text-gray-900 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-blue-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255, 213, 128, 0.35) 0, transparent 30%), radial-gradient(circle at 80% 0%, rgba(96, 165, 250, 0.28) 0, transparent 35%), radial-gradient(circle at 40% 80%, rgba(251, 191, 36, 0.22) 0, transparent 30%)",
      }}
    >
      {/* Soft spotlight background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-200/35 blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-300/25 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,_#0f172a_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      {/* Floating quick actions */}
      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-8 md:pt-10">
        <div className="hidden lg:flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-2xl shadow-[0_25px_100px_rgba(0,0,0,0.1)] border border-white/80 px-8 py-6">
          <div className="flex items-center gap-3 text-base md:text-lg font-bold text-amber-600">
            <ArrowRightOutlined className="text-xl" /> Khám phá nhanh
          </div>
          <div className="flex items-center gap-4">
            {[
              { icon: <CameraOutlined />, label: "Đặt studio", href: "/studio" },
              { icon: <ShoppingOutlined />, label: "Set design", href: "/set-design" },
              { icon: <MessageOutlined />, label: "Liên hệ tư vấn", href: "/contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 font-bold text-sm md:text-base hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 hover:shadow-lg transition-all"
              >
                <span className="text-lg md:text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="relative container mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16 lg:py-20 space-y-16 lg:space-y-24">
        <IntroSection />
        <StudioSection />
        <SetDesignSection />
        <WhyChooseUsSection />
        <GallerySection />
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default Homepage;