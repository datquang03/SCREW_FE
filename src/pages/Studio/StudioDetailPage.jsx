// src/pages/Studio/StudioDetailPage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/studio/studioSlice";
import { Typography, Button, Tag, Carousel, Spin } from "antd";
import { FiMapPin, FiUsers, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";

const { Title, Paragraph, Text } = Typography;

const StudioDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentStudio, loading } = useSelector((state) => state.studio);

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
      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Back button */}
        <Button
          type="default"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
          icon={<FiArrowLeft />}
        >
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
              {currentStudio.name}
            </Title>

            <Paragraph className="text-gray-700 text-md md:text-lg mb-4">
              {currentStudio.description}
            </Paragraph>

            <div className="flex flex-wrap gap-4 mb-6">
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

            <div className="mb-8">
              <Text className="text-gray-500 font-medium">Diện tích:</Text>{" "}
              <Text strong className="text-gray-900">
                {currentStudio.area} m²
              </Text>
              <br />
              <Text className="text-gray-500 font-medium">Giá thuê:</Text>{" "}
              <Text strong className="text-yellow-600 text-xl md:text-2xl">
                {currentStudio.basePricePerHour.toLocaleString()} VNĐ / giờ
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
      </div>
    </Layout>
  );
};

export default StudioDetailPage;
