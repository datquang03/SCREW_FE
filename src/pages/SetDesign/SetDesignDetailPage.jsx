// src/pages/SetDesignDetail/SetDesignDetail.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Spin,
  Tag,
  Empty,
  message,
  Avatar,
  Input,
} from "antd";
import {
  FiArrowLeft,
  FiCalendar,
  FiMessageCircle,
  FiStar,
  FiSmile,
  FiImage,
  FiSend,
} from "react-icons/fi";
import { motion } from "framer-motion";

import {
  getSetDesignById,
} from "../../features/setDesign/setDesignSlice";
import {
  createComment,
  replyCommentForStaff,
} from "../../features/comment/commentSlice";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const SetDesignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSetDesign, loading } = useSelector((state) => state.setDesign);
  const { user: currentUser } = useSelector((state) => state.auth || {});
  const isStaff = currentUser?.role === "staff" || currentUser?.role === "admin";

  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!currentSetDesign || currentSetDesign._id !== id) {
      dispatch(getSetDesignById(id));
    }
  }, [dispatch, id, currentSetDesign]);

  // === GỬI BÌNH LUẬN ===
  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    setCommentLoading(true);
    try {
      await dispatch(
        createComment({
          setDesignId: id,
          message: newComment.trim(), 
        })
      ).unwrap();

      setNewComment("");
      message.success("Gửi bình luận thành công!");
      dispatch(getSetDesignById(id)); // refresh lại để thấy comment mới
    } catch (err) {
      message.error(err?.message || "Gửi bình luận thất bại");
    } finally {
      setCommentLoading(false);
    }
  };

  // === TRẢ LỜI BÌNH LUẬN (STAFF) ===
  const handleReply = async (commentIndex) => {
    const reply = window.prompt("Nhập câu trả lời của studio:");
    if (!reply?.trim()) return;

    try {
      await dispatch(
        replyCommentForStaff({
          setDesignId: id,
          commentIndex,
          replyContent: reply.trim(),
        })
      ).unwrap();

      message.success("Đã trả lời bình luận");
      dispatch(getSetDesignById(id));
    } catch (err) {
      message.error("Trả lời thất bại");
    }
  };

  // Loading & Not Found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải chi tiết set design..." />
      </div>
    );
  }

  if (!currentSetDesign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Empty description="Không tìm thấy Set Design này" />
        <Button type="primary" size="large" className="mt-6" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const item = currentSetDesign;
  const mainImage =
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1200&q=80";

  const categoryLabel = {
    wedding: "Tiệc cưới",
    corporate: "Doanh nghiệp & Sự kiện",
    birthday: "Sinh nhật",
    product: "Chụp sản phẩm",
    portrait: "Chân dung",
    other: "Khác",
  }[item.category] || "Không xác định";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            type="text"
            icon={<FiArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lg font-medium hover:text-indigo-600"
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <motion.img
                src={mainImage}
                alt={item.name}
                className="w-full h-96 lg:h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <Tag color="white" className="text-lg px-5 py-2 backdrop-blur-sm bg-white/20 border-white">
                  {categoryLabel}
                </Tag>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div>
                <Title level={1} className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                  {item.name}
                </Title>
                <div className="flex items-center gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    <Text strong>
                      {item.averageRating > 0 ? item.averageRating.toFixed(1) : "Chưa có"}
                    </Text>
                    <Text type="secondary">({item.totalReviews} đánh giá)</Text>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="text-indigo-600" />
                    <Text strong>{item.totalComments} bình luận</Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <FiCalendar />
                <Text>Đã tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}</Text>
              </div>

              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none font-bold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Đặt lịch chụp ngay
              </Button>
            </div>
          </div>

          {/* Mô tả */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
            <Title level={2} className="text-3xl font-bold mb-6">Giới thiệu về Set Design</Title>
            <Paragraph className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {item.description || "Chưa có mô tả chi tiết. Set design này đang được hoàn thiện và sẽ sớm có thông tin đầy đủ."}
            </Paragraph>
          </div>

          {/* ==================== PHẦN BÌNH LUẬN ĐẸP NHƯ FACEBOOK ==================== */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <Title level={2} className="text-3xl font-bold mb-8 flex items-center gap-3">
              <FiMessageCircle className="text-indigo-600" />
              Bình luận ({item.totalComments})
            </Title>

            {/* Form gửi bình luận */}
            <div className="mb-12">
              <div className="flex gap-4">
                <Avatar
                  size={48}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                >
                  {currentUser?.name?.[0]?.toUpperCase() || "K"}
                </Avatar>
                <div className="flex-1">
                  <TextArea
                    rows={3}
                    placeholder={
                      currentUser
                        ? "Chia sẻ cảm nhận của bạn về set design này..."
                        : "Đăng nhập để bình luận..."
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!currentUser}
                    className="rounded-2xl text-base resize-none focus:border-indigo-500"
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex gap-4 text-gray-500">
                      <button className="hover:text-indigo-600 transition">
                        <FiSmile size={24} />
                      </button>
                      <button className="hover:text-indigo-600 transition">
                        <FiImage size={24} />
                      </button>
                    </div>
                    <Button
                      type="primary"
                      icon={<FiSend />}
                      loading={commentLoading}
                      disabled={!newComment.trim() || !currentUser}
                      onClick={handleSendComment}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none font-bold rounded-full px-8"
                    >
                      Gửi
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-8">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                  >
                    <Avatar
                      size={44}
                      className="bg-gradient-to-br from-pink-400 to-red-500 flex-shrink-0"
                    >
                      {comment.user?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-3xl px-6 py-4">
                        <div className="flex items-center gap-3 mb-1">
                          <Text strong className="text-gray-900">
                            {comment.user?.name || "Khách"}
                          </Text>
                          {comment.isStaff && (
                            <Tag color="gold" className="text-xs">Nhân viên</Tag>
                          )}
                          <Text type="secondary" className="text-xs">
                            {new Date(comment.createdAt).toLocaleString("vi-VN")}
                          </Text>
                        </div>
                        <Paragraph className="text-gray-800 mb-0">
                          {comment.message}
                        </Paragraph>
                      </div>

                      {/* Nút trả lời (chỉ staff thấy) */}
                      {isStaff && !comment.reply && (
                        <Button
                          type="text"
                          size="small"
                          className="mt-2 text-indigo-600 font-medium"
                          onClick={() => handleReply(index)}
                        >
                          Trả lời
                        </Button>
                      )}

                      {/* Reply từ studio */}
                      {comment.reply && (
                        <div className="mt-5 ml-10 flex gap-3">
                          <Avatar
                            size={40}
                            className="bg-gradient-to-br from-cyan-500 to-blue-600"
                          >
                            S
                          </Avatar>
                          <div className="bg-indigo-50 rounded-3xl px-5 py-3 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Text strong className="text-indigo-700">
                                Studio trả lời
                              </Text>
                              <Tag color="blue" className="text-xs">Chính thức</Tag>
                            </div>
                            <Text className="text-indigo-900">{comment.reply}</Text>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <FiMessageCircle size={80} className="mx-auto text-gray-300 mb-4" />
                  <Text type="secondary" className="text-xl">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!
                  </Text>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SetDesignDetail;