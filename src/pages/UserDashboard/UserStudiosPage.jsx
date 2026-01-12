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
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-pink-100 via-rose-50 to-white shadow-lg border border-pink-200/50">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-pink-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
          Studio yêu thích
        </Title>
          <Text className="text-base text-gray-700 font-medium">
          Danh sách các studio bạn đã đánh dấu yêu thích
        </Text>
        </div>
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
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              cover={
                <div className="h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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

