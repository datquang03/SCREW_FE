// src/pages/Studio/StudioDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/studio/studioSlice";
import { Typography, Button, Tag, Carousel, Spin, Input, Avatar } from "antd";
import { FiMapPin, FiUsers, FiArrowLeft } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";

const { Title, Paragraph, Text } = Typography;

const sampleReviews = [
  {
    id: 1,
    user: "Nguyen Van A",
    avatar: "",
    content: "Studio rộng rãi, ánh sáng đẹp, nhân viên hỗ trợ nhiệt tình.",
    liked: true,
    replies: [{ id: 11, user: "Admin", content: "Cảm ơn bạn đã đánh giá!" }],
  },
  {
    id: 2,
    user: "Tran Thi B",
    avatar: "",
    content: "Chất lượng âm thanh tốt, không gian ổn, sẽ quay lại.",
    liked: false,
    replies: [],
  },
  {
    id: 3,
    user: "Le Van C",
    avatar: "",
    content: "Phòng nhỏ hơn mong đợi nhưng vẫn ổn.",
    liked: true,
    replies: [
      {
        id: 31,
        user: "Admin",
        content: "Cảm ơn phản hồi, chúng tôi sẽ cải thiện.",
      },
      { id: 32, user: "Le Van C", content: "Cảm ơn bạn!" },
    ],
  },
  {
    id: 4,
    user: "Pham Thi D",
    avatar: "",
    content: "Giá thuê hơi cao nhưng dịch vụ tốt.",
    liked: false,
    replies: [],
  },
  {
    id: 5,
    user: "Hoang Van E",
    avatar: "",
    content: "Rất thích studio này, không gian sáng sủa và tiện nghi.",
    liked: true,
    replies: [],
  },
];

const StudioDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStudio, loading } = useSelector((state) => state.studio);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    dispatch(getStudioById(id));
  }, [dispatch, id]);

  if (loading || !currentStudio) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Back button */}
          <Button
            type="default"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
            icon={<FiArrowLeft />}
          >
            Quay lại
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images + Ads */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {currentStudio.images && currentStudio.images.length > 0 ? (
              <Carousel
                autoplay
                dots
                className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
              >
                {currentStudio.images.map((img, idx) => (
                  <div key={idx} className="h-96 lg:h-[500px] w-full">
                    <img
                      src={img}
                      alt={currentStudio.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="h-96 lg:h-[500px] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-6xl text-gray-400 shadow-lg border border-gray-200">
                📷
              </div>
            )}

            {/* Quảng cáo */}
            <div className="bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50 p-6 rounded-2xl shadow-lg border border-yellow-200 text-center space-y-3">
              <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Khuyến mãi
              </div>
              <Text className="text-xl font-bold text-yellow-900 block">
                Giảm giá 20% cho mọi đơn đặt
              </Text>
              <Paragraph className="text-gray-700 text-sm">
                Áp dụng cho đơn từ 500,000 VNĐ. Chỉ đến 31/12!
              </Paragraph>
              <Button
                type="primary"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 border-none text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-xl hover:from-yellow-600 hover:to-amber-600 transition-all"
              >
                Xem khuyến mãi
              </Button>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <Title className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-0 leading-tight">
                  {currentStudio.name}
                </Title>
                <Button
                  type="text"
                  className="flex-shrink-0"
                  icon={
                    liked ? (
                      <AiFillHeart className="text-red-500 text-2xl" />
                    ) : (
                      <AiOutlineHeart className="text-gray-400 text-2xl hover:text-red-400 transition-colors" />
                    )
                  }
                  onClick={() => setLiked(!liked)}
                />
              </div>

              <Paragraph className="text-gray-600 text-base leading-relaxed mb-6">
                {currentStudio.description}
              </Paragraph>

              <div className="flex flex-wrap gap-3 mb-6">
                <Tag
                  color="blue"
                  className="flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm"
                >
                  <FiMapPin />
                  {currentStudio.location || "Không xác định"}
                </Tag>
                <Tag
                  color="purple"
                  className="flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm"
                >
                  <FiUsers />
                  {currentStudio.capacity} người
                </Tag>
                <Tag
                  color={
                    currentStudio.status === "active"
                      ? "green"
                      : currentStudio.status === "maintenance"
                      ? "orange"
                      : "red"
                  }
                  className="font-medium px-4 py-2 rounded-full text-sm"
                >
                  {currentStudio.status.charAt(0).toUpperCase() +
                    currentStudio.status.slice(1)}
                </Tag>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Text className="text-gray-600 font-medium">Diện tích</Text>
                  <Text className="font-bold text-gray-900 text-lg">
                    {currentStudio.area} m²
                  </Text>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <Text className="text-gray-600 font-medium block mb-2">
                    Giá thuê
                  </Text>
                  <Text className="font-extrabold text-yellow-600 text-3xl md:text-4xl">
                    {currentStudio.basePricePerHour.toLocaleString()}₫
                  </Text>
                  <Text className="text-gray-500 text-sm">/ giờ</Text>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="primary"
                  size="large"
                  className="w-full md:w-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-none text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition"
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Thuê ngay
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Title level={3} className="text-gray-900 mb-0">
              Đánh giá ({sampleReviews.length})
            </Title>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
              {sampleReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={40}
                      className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-semibold shadow-md"
                    >
                      {review.user.charAt(0)}
                    </Avatar>
                    <div className="flex-1">
                      <Text className="font-semibold text-gray-900 block">
                        {review.user}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {new Date().toLocaleDateString("vi-VN")}
                      </Text>
                    </div>
                    {review.liked && (
                      <AiFillHeart className="text-red-500 text-xl" />
                    )}
                  </div>
                  <Paragraph className="text-gray-700 text-sm leading-relaxed ml-12">
                    {review.content}
                  </Paragraph>
                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="ml-12 pl-4 space-y-2 border-l-2 border-yellow-300 bg-yellow-50/50 rounded-r-lg p-3">
                      {review.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Text className="font-semibold text-yellow-700 min-w-fit">
                            {rep.user}:
                          </Text>
                          <Text className="text-gray-700 flex-1">
                            {rep.content}
                          </Text>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default StudioDetailPage;
