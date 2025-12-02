// src/pages/Studio/StudioDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/studio/studioSlice";
import {
  createComment,
  replyComment,
  updateComment,
  updateReply,
  deleteReply,
  deleteComment,
} from "../../features/comment/commentSlice";
import { Typography, Button, Tag, Carousel, Spin, Input, Avatar } from "antd";
import {
  FiMapPin,
  FiUsers,
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiCornerDownRight,
  FiSend,
} from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

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
  const { loading: commentLoading } = useSelector(
    (state) => state.comment || { loading: false }
  );
  const { user } = useSelector((state) => state.auth || {});
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(sampleReviews);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // index comment
  const [replyText, setReplyText] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [editingReply, setEditingReply] = useState({ commentIndex: null, replyIndex: null });
  const [editingReplyText, setEditingReplyText] = useState("");

  useEffect(() => {
    dispatch(getStudioById(id));
  }, [dispatch, id]);

  // Handlers comment
  const handleCreateComment = async () => {
    const message = newComment.trim();
    if (!message) return;
    if (!user) {
      // Có thể toast ở đây nếu cần
      navigate("/login");
      return;
    }
    try {
      await dispatch(createComment({ setDesignId: id, message })).unwrap();
      setComments((prev) => [
        {
          id: Date.now(),
          user: user.fullName || user.username || "Bạn",
          avatar:
            user.avatar ||
            "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg",
          content: message,
          liked: false,
          replies: [],
        },
        ...prev,
      ]);
      setNewComment("");
    } catch (e) {
      // có thể show message.error ở đây nếu cần
    }
  };

  const handleStartEditComment = (index, currentContent) => {
    setEditingCommentIndex(index);
    setEditingCommentText(currentContent);
  };

  const handleUpdateComment = async (index) => {
    const message = editingCommentText.trim();
    if (!message) return;
    try {
      await dispatch(updateComment({ setDesignId: id, commentIndex: index, message })).unwrap();
      setComments((prev) =>
        prev.map((c, i) => (i === index ? { ...c, content: message } : c))
      );
      setEditingCommentIndex(null);
      setEditingCommentText("");
    } catch (e) {}
  };

  const handleDeleteComment = async (index) => {
    try {
      await dispatch(deleteComment({ setDesignId: id, commentIndex: index })).unwrap();
      setComments((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {}
  };

  const handleStartReply = (index) => {
    setReplyingTo(index);
    setReplyText("");
  };

  const handleCreateReply = async (index) => {
    const content = replyText.trim();
    if (!content) return;
    try {
      await dispatch(
        replyComment({ setDesignId: id, commentIndex: index, replyContent: content })
      ).unwrap();
      setComments((prev) =>
        prev.map((c, i) =>
          i === index
            ? {
                ...c,
                replies: [
                  ...(c.replies || []),
                  { id: Date.now(), user: "Bạn", content },
                ],
              }
            : c
        )
      );
      setReplyingTo(null);
      setReplyText("");
    } catch (e) {}
  };

  const handleStartEditReply = (commentIndex, replyIndex, currentContent) => {
    setEditingReply({ commentIndex, replyIndex });
    setEditingReplyText(currentContent);
  };

  const handleUpdateReply = async (commentIndex, replyIndex) => {
    const content = editingReplyText.trim();
    if (!content) return;
    try {
      await dispatch(
        updateReply({
          setDesignId: id,
          commentIndex,
          replyIndex,
          replyContent: content,
        })
      ).unwrap();
      setComments((prev) =>
        prev.map((c, ci) =>
          ci === commentIndex
            ? {
                ...c,
                replies: c.replies.map((r, ri) =>
                  ri === replyIndex ? { ...r, content } : r
                ),
              }
            : c
        )
      );
      setEditingReply({ commentIndex: null, replyIndex: null });
      setEditingReplyText("");
    } catch (e) {}
  };

  const handleDeleteReply = async (commentIndex, replyIndex) => {
    try {
      await dispatch(
        deleteReply({ setDesignId: id, commentIndex, replyIndex })
      ).unwrap();
      setComments((prev) =>
        prev.map((c, ci) =>
          ci === commentIndex
            ? {
                ...c,
                replies: c.replies.filter((_, ri) => ri !== replyIndex),
              }
            : c
        )
      );
    } catch (e) {}
  };

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
              Đánh giá ({comments.length})
            </Title>
          </div>

          {/* Form tạo bình luận mới */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 space-y-3">
            <div className="flex gap-4 items-start">
              <Avatar
                size={44}
                src={
                  user?.avatar ||
                  "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                }
                className="cursor-pointer shadow-md border border-gray-200"
                onClick={() => navigate("/dashboard/customer/profile")}
              >
                {!user?.avatar &&
                  (user?.fullName?.[0] ||
                    user?.username?.[0] ||
                    "U")}
              </Avatar>
              <div className="flex-1 space-y-3">
                <Text className="font-medium text-gray-800">
                  Bạn nghĩ gì về studio này?
                </Text>
                <TextArea
                  rows={3}
                  placeholder="Viết cảm nhận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="rounded-xl"
                />
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<FiSend />}
                    loading={commentLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 border-none font-semibold px-6 rounded-xl"
                    onClick={handleCreateComment}
                  >
                    Gửi bình luận
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
              {comments.map((review, index) => (
                <div
                  key={review.id || index}
                  className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all duration-300 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      size={40}
                      className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-semibold shadow-md"
                    >
                      {review.user?.charAt(0) || "U"}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {review.user || "Người dùng ẩn danh"}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {new Date().toLocaleDateString("vi-VN")}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <button
                            className="hover:text-yellow-600 transition-colors"
                            onClick={() =>
                              handleStartReply(index)
                            }
                          >
                            <FiCornerDownRight />
                          </button>
                          <button
                            className="hover:text-blue-500 transition-colors"
                            onClick={() =>
                              handleStartEditComment(index, review.content)
                            }
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteComment(index)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                    {review.liked && (
                      <AiFillHeart className="text-red-500 text-xl mt-1" />
                    )}
                  </div>

                  {/* Nội dung comment hoặc form edit */}
                  {editingCommentIndex === index ? (
                    <div className="ml-12 space-y-2">
                      <TextArea
                        rows={2}
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="rounded-lg"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="small"
                          onClick={() => {
                            setEditingCommentIndex(null);
                            setEditingCommentText("");
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          loading={commentLoading}
                          onClick={() => handleUpdateComment(index)}
                        >
                          Lưu
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Paragraph className="text-gray-700 text-sm leading-relaxed ml-12">
                      {review.content}
                    </Paragraph>
                  )}

                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="ml-12 pl-4 space-y-2 border-l-2 border-yellow-300 bg-yellow-50/50 rounded-r-lg p-3">
                      {review.replies.map((rep, rIndex) => (
                        <div
                          key={rep.id || rIndex}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Text className="font-semibold text-yellow-700 min-w-fit">
                            {rep.user}:
                          </Text>
                          {editingReply.commentIndex === index &&
                          editingReply.replyIndex === rIndex ? (
                            <div className="flex-1 space-y-2">
                              <TextArea
                                rows={2}
                                value={editingReplyText}
                                onChange={(e) =>
                                  setEditingReplyText(e.target.value)
                                }
                                className="rounded-lg"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setEditingReply({
                                      commentIndex: null,
                                      replyIndex: null,
                                    });
                                    setEditingReplyText("");
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  type="primary"
                                  size="small"
                                  loading={commentLoading}
                                  onClick={() =>
                                    handleUpdateReply(index, rIndex)
                                  }
                                >
                                  Lưu
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-start justify-between gap-3">
                              <Text className="text-gray-700 flex-1">
                                {rep.content}
                              </Text>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <button
                                  className="hover:text-blue-500 transition-colors"
                                  onClick={() =>
                                    handleStartEditReply(
                                      index,
                                      rIndex,
                                      rep.content
                                    )
                                  }
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  className="hover:text-red-500 transition-colors"
                                  onClick={() =>
                                    handleDeleteReply(index, rIndex)
                                  }
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form */}
                  {replyingTo === index && (
                    <div className="ml-12 mt-2 space-y-2">
                      <TextArea
                        rows={2}
                        placeholder="Trả lời bình luận..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="rounded-lg"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="small"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          loading={commentLoading}
                          onClick={() => handleCreateReply(index)}
                        >
                          Gửi trả lời
                        </Button>
                      </div>
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
