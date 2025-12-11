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
      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-6">
        <div className="hidden lg:flex items-center justify-between gap-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-white/70 px-6 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
            <ArrowRightOutlined /> Khám phá nhanh
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: <CameraOutlined />, label: "Đặt studio", href: "/studio" },
              { icon: <ShoppingOutlined />, label: "Set design", href: "/set-design" },
              { icon: <MessageOutlined />, label: "Liên hệ tư vấn", href: "/contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 font-semibold hover:bg-amber-100 hover:shadow-md transition"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="relative container mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14 space-y-16 lg:space-y-24">
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