import React from "react";
import { Button, Typography } from "antd";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { STATS } from "../../../constants/stats";

const { Title, Paragraph } = Typography;

const IntroSection = () => {
  return (
    <div className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 text-center space-y-10">
        <div className="space-y-4">
          <Title level={1} className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-0">
            S+ Studio
          </Title>
          <Paragraph className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Dịch vụ cho thuê studio chuyên nghiệp tại TP.HCM với đầy đủ thiết bị và set design sẵn sàng cho mọi nhu cầu quay/chụp.
          </Paragraph>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            type="primary"
            size="large"
            href="/studio"
            className="bg-amber-500 hover:bg-amber-600 border-none px-8 h-12 text-base font-semibold"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            Xem studio
          </Button>
          <Button
            size="large"
            href="/contact"
            className="border border-slate-200 text-gray-800 px-8 h-12 text-base font-semibold hover:border-amber-400 hover:text-amber-700"
            icon={<PlayCircleOutlined />}
          >
            Liên hệ
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="text-4xl font-extrabold text-amber-600 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
