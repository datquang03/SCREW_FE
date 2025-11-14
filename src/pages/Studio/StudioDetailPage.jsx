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
      <div className="container mx-auto px-4 md:px-8 py-12 space-y-12">
        {/* Back button */}
        <Button
          type="default"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
          icon={<FiArrowLeft />}
        >
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                {currentStudio.images.map((img, idx) => (
                  <div key={idx} className="h-96 lg:h-[500px] w-full">
                    <img
                      src={img}
                      alt={currentStudio.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="h-96 lg:h-[500px] w-full bg-gray-200 rounded-2xl flex items-center justify-center text-6xl text-gray-400">
                📷
              </div>
            )}

            {/* Quảng cáo */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-lg text-center space-y-2">
              <Text className="text-lg font-semibold text-yellow-700">
                Khuyến mãi tháng này!
              </Text>
              <Paragraph className="text-gray-700 text-sm">
                Giảm giá 20% cho mọi đơn đặt từ 500,000 VNĐ. Chỉ áp dụng đến
                31/12!
              </Paragraph>
              <Button
                type="primary"
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-none text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition"
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
            <div className="flex items-center justify-between">
              <Title className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-0">
                {currentStudio.name}
              </Title>
              <Button
                type="text"
                icon={
                  liked ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-400 text-2xl" />
                  )
                }
                onClick={() => setLiked(!liked)}
              />
            </div>

            <Paragraph className="text-gray-700 text-md md:text-lg">
              {currentStudio.description}
            </Paragraph>

            <div className="flex flex-wrap gap-4 mb-4">
              <Tag
                color="blue"
                className="flex items-center gap-1 font-medium px-3 py-2"
              >
                <FiMapPin />
                {currentStudio.location || "Không xác định"}
              </Tag>
              <Tag
                color="purple"
                className="flex items-center gap-1 font-medium px-3 py-2"
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
                className="font-medium px-3 py-2"
              >
                {currentStudio.status.charAt(0).toUpperCase() +
                  currentStudio.status.slice(1)}
              </Tag>
            </div>

            <div className="flex flex-col gap-2 text-gray-700 mb-6">
              <Text>
                <span className="font-medium text-gray-500">Diện tích:</span>{" "}
                <span className="font-semibold text-gray-900">
                  {currentStudio.area} m²
                </span>
              </Text>
              <Text>
                <span className="font-medium text-gray-500">Giá thuê:</span>{" "}
                <span className="font-semibold text-yellow-600 text-xl md:text-2xl">
                  {currentStudio.basePricePerHour.toLocaleString()} VNĐ / giờ
                </span>
              </Text>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                size="large"
                className="w-full md:w-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-none text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                Thuê ngay
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <Title level={3} className="text-gray-900">
            Đánh giá
          </Title>
          <div className="space-y-4">
            {sampleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="small">{review.user.charAt(0)}</Avatar>
                  <Text className="font-medium">{review.user}</Text>
                  {review.liked && (
                    <AiFillHeart className="text-red-500 ml-auto" />
                  )}
                </div>
                <Paragraph className="text-gray-700 text-sm">
                  {review.content}
                </Paragraph>
                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="pl-8 space-y-1 border-l-2 border-gray-200">
                    {review.replies.map((rep) => (
                      <div key={rep.id} className="flex items-center gap-2">
                        <Text className="font-medium text-gray-800">
                          {rep.user}:
                        </Text>
                        <Text className="text-gray-700 text-sm">
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
    </Layout>
  );
};

export default StudioDetailPage;
