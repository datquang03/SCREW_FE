import React from "react";
import { Card, Typography, Button, Rate, Tag } from "antd";
import { FiVideo } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const UserStudiosPage = () => {
  const favoriteStudios = [
    {
      id: 1,
      name: "Studio A",
      location: "Quận 4, TP.HCM",
      rating: 4.8,
      price: "600.000",
      image: null,
      features: ["Phòng xanh", "LED lights", "Máy ảnh Canon"],
    },
    {
      id: 2,
      name: "Studio B",
      location: "Quận 4, TP.HCM",
      rating: 4.9,
      price: "800.000",
      image: null,
      features: ["Phòng xanh", "LED lights", "Máy ảnh Sony"],
    },
    {
      id: 3,
      name: "Studio C",
      location: "Quận 4, TP.HCM",
      rating: 4.7,
      price: "700.000",
      image: null,
      features: ["Phòng xanh", "LED lights", "Máy ảnh Nikon"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Studio yêu thích</h1>
        <p className="opacity-90">
          Danh sách các studio bạn đã đánh dấu yêu thích
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteStudios.map((studio) => (
          <motion.div
            key={studio.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              hoverable
              className="overflow-hidden shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300"
              cover={
                <div className="h-48 bg-[#0F172A] flex items-center justify-center relative overflow-hidden">
                  <FiVideo className="text-6xl text-white/30 relative z-10" />
                </div>
              }
              actions={[
                <Button type="primary" key="book" className="font-semibold">
                  Đặt ngay
                </Button>,
                <BsHeartFill className="text-red-500 text-xl hover:text-red-600 transition-colors" key="favorite" />,
              ]}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Title level={4} className="mb-1">
                      {studio.name}
                    </Title>
                    <Text className="text-gray-500 text-sm">{studio.location}</Text>
                  </div>
                  <Rate disabled defaultValue={studio.rating} allowHalf className="text-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {studio.features.map((feature, idx) => (
                    <Tag key={idx} color="blue">
                      {feature}
                    </Tag>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <Text className="text-lg font-bold text-yellow-600">
                    {studio.price}đ/giờ
                  </Text>
                  <Button type="link">Xem chi tiết</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserStudiosPage;

