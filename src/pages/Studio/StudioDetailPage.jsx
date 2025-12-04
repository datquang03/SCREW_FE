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
  likeComment,
  unlikeComment,
} from "../../features/comment/commentSlice";
import { Typography, Button, Tag, Carousel, Spin, Input, Avatar, Rate, Divider, Modal } from "antd";
import {
  FiMapPin,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiCornerDownRight,
  FiSend,
  FiShoppingCart,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiX,
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  useEffect(() => {
    dispatch(getStudioById(id));
  }, [dispatch, id]);

  // Handle ESC key to close fullscreen
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && fullscreenImageIndex !== null) {
        closeFullscreen();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [fullscreenImageIndex]);

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

  const handleToggleLikeComment = async (index) => {
    const review = comments[index];
    if (!user) {
      navigate("/login");
      return;
    }

    const commentId = review._id || review.id;
    if (!commentId) {
      // Không có id từ backend → chỉ toggle local
      setComments((prev) =>
        prev.map((c, i) => (i === index ? { ...c, liked: !c.liked } : c))
      );
      return;
    }

    try {
      if (review.liked) {
        await dispatch(unlikeComment(commentId)).unwrap();
      } else {
        await dispatch(likeComment(commentId)).unwrap();
      }

      // Optimistic update UI
      setComments((prev) =>
        prev.map((c, i) => (i === index ? { ...c, liked: !c.liked } : c))
      );
    } catch (e) {
      // có thể show message.error nếu cần
    }
  };

  if (loading || !currentStudio) {
    return (
      <Layout>
      <div className="flex justify-center items-center h-screen">
          <Spin size="large" tip="Đang tải thông tin studio..." />
      </div>
      </Layout>
    );
  }

  const images = currentStudio.images || [];
  const mainImage = images[selectedImageIndex] || images[0];
  const avgRating = currentStudio.avgRating || 0;
  const reviewCount = currentStudio.reviewCount || 0;

  // Thumbnail logic - chỉ hiển thị tối đa 6 ảnh
  const MAX_THUMBNAILS = 6;
  const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + MAX_THUMBNAILS);
  const canScrollLeft = thumbnailStartIndex > 0;
  const canScrollRight = thumbnailStartIndex + MAX_THUMBNAILS < images.length;

  const handleThumbnailScroll = (direction) => {
    if (direction === "left" && canScrollLeft) {
      setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
    } else if (direction === "right" && canScrollRight) {
      setThumbnailStartIndex(Math.min(images.length - MAX_THUMBNAILS, thumbnailStartIndex + 1));
    }
  };

  const openFullscreen = (index) => {
    setFullscreenImageIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenImageIndex(null);
  };

  const navigateFullscreen = (direction) => {
    if (direction === "prev") {
      setFullscreenImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setFullscreenImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image Gallery */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
          >
              {/* Main Image */}
              <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                onClick={() => {
                  if (mainImage) {
                    openFullscreen(selectedImageIndex);
                  }
                }}
              >
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                
                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center gap-2 shadow-lg pointer-events-none">
                  <Text className="text-xs font-semibold text-gray-700">Click để xem</Text>
                  <span className="text-yellow-500">
                    🔍
                  </span>
                </div>
                
                {mainImage ? (
                  <img
                    src={mainImage}
                      alt={currentStudio.name}
                    className="w-full h-[500px] md:h-[600px] object-cover pointer-events-none"
                    draggable={false}
                    />
                ) : (
                  <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center text-6xl text-gray-400 pointer-events-none">
                    📷
                  </div>
                )}
              </div>

              {/* Thumbnails - tối đa 6 ảnh */}
              {images.length > 0 && (
                <div className="relative">
                  <div className="flex gap-3 items-center">
                    {/* Nút scroll trái */}
                    {images.length > MAX_THUMBNAILS && canScrollLeft && (
                      <motion.button
                        onClick={() => handleThumbnailScroll("left")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-white to-gray-50 border-2 border-gray-300 shadow-lg hover:shadow-xl hover:border-yellow-400 flex items-center justify-center transition-all z-10 group"
                      >
                        <FiChevronLeft className="text-gray-600 group-hover:text-yellow-600 text-lg transition-colors" />
                      </motion.button>
                    )}

                    {/* Thumbnails */}
                    <div className="flex gap-3 flex-1 overflow-hidden">
                      {visibleThumbnails.map((img, idx) => {
                        const actualIndex = thumbnailStartIndex + idx;
                        return (
                          <button
                            key={actualIndex}
                            onClick={() => {
                              setSelectedImageIndex(actualIndex);
                              openFullscreen(actualIndex);
                            }}
                            className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all group ${
                              selectedImageIndex === actualIndex
                                ? "border-yellow-500 shadow-2xl scale-105 ring-4 ring-yellow-300/50"
                                : "border-gray-200 hover:border-yellow-400 shadow-md hover:shadow-xl"
                            }`}
                          >
                            {/* Glow effect when selected */}
                            {selectedImageIndex === actualIndex && (
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-400/30 blur-sm -z-10" />
                            )}
                            
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                            
                            <img
                              src={img}
                              alt={`${currentStudio.name} ${actualIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Selected indicator */}
                            {selectedImageIndex === actualIndex && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-20">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Nút scroll phải */}
                    {images.length > MAX_THUMBNAILS && canScrollRight && (
                      <motion.button
                        onClick={() => handleThumbnailScroll("right")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-white to-gray-50 border-2 border-gray-300 shadow-lg hover:shadow-xl hover:border-yellow-400 flex items-center justify-center transition-all z-10 group"
                      >
                        <FiChevronRight className="text-gray-600 group-hover:text-yellow-600 text-lg transition-colors" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              <motion.div
                className="relative bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 overflow-hidden"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-100/30 to-amber-100/30 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -z-0" />
                
                <div className="relative z-10">
                  {/* SKU */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full border border-gray-200 mb-3">
                      <span className="text-xs font-mono text-gray-400">ID:</span>
                      <Text className="text-gray-600 text-xs font-semibold">
                        {currentStudio._id?.slice(-8).toUpperCase()}
                      </Text>
            </div>
          </motion.div>

                  {/* Title */}
          <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
          >
                    <Title level={2} className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent relative">
                      <span className="relative z-10">{currentStudio.name}</span>
                      <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
              </Title>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    className="mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Text className="text-gray-700 text-base leading-relaxed">
                      {currentStudio.description || "Studio chuyên nghiệp với không gian rộng rãi, ánh sáng tự nhiên và trang thiết bị hiện đại."}
                    </Text>
                  </motion.div>
                </div>
              </motion.div>

                {/* Rating */}
                <motion.div
                  className="relative flex items-center gap-3 mb-6 p-4 rounded-xl bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-2 border-yellow-200 shadow-md overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-2xl -z-0" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-lg">
                      <Rate
                        disabled
                        value={avgRating}
                        allowHalf
                        className="text-yellow-500"
              />
            </div>
                    <div className="flex items-center gap-2">
                      <Text className="text-gray-700 font-bold text-lg">
                        {avgRating > 0 ? avgRating.toFixed(1) : "Chưa có đánh giá"}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        ({reviewCount} {reviewCount === 1 ? "đánh giá" : "đánh giá"})
                      </Text>
                    </div>
                  </div>
                </motion.div>

                {/* Price */}
                <motion.div
                  className="relative mb-6 pb-6 border-b-2 border-gradient-to-r from-gray-200 to-transparent overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full" />
                      <Text className="text-gray-500 text-sm font-medium uppercase tracking-wider">Giá thuê</Text>
                    </div>
                    <div className="flex items-baseline gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-30" />
                        <Text className="relative font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
                          {currentStudio.basePricePerHour?.toLocaleString()}₫
                        </Text>
                      </motion.div>
                      <Text className="text-gray-500 text-lg font-medium">/ giờ</Text>
                    </div>
                  </div>
                </motion.div>

                {/* Tags - Responsive trên một hàng, không xuống dòng với hiệu ứng đẹp */}
                <div className="mb-6 overflow-x-auto pb-2 tags-scroll-container">
                  <div className="flex items-center gap-3 md:gap-4 min-w-max">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="tag-3d"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Tag
                color="blue"
                          className="relative flex items-center justify-center gap-2 font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
              >
                          <FiMapPin className="text-base md:text-lg flex-shrink-0" style={{ lineHeight: 1 }} />
                          <span className="whitespace-nowrap leading-none">{currentStudio.location || "Không xác định"}</span>
              </Tag>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="tag-3d"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.45 }}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Tag
                color="purple"
                          className="relative flex items-center justify-center gap-2 font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100"
              >
                          <FiUsers className="text-base md:text-lg flex-shrink-0" style={{ lineHeight: 1 }} />
                          <span className="whitespace-nowrap leading-none">{currentStudio.capacity || 0} người</span>
                        </Tag>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="tag-3d"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                        <Tag
                          color="green"
                          className="relative flex items-center justify-center font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100"
                        >
                          <span className="whitespace-nowrap leading-none">{currentStudio.area || 0} m²</span>
              </Tag>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="tag-3d"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.55 }}
                    >
                      <div className="relative group">
                        <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                          currentStudio.status === "active"
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : currentStudio.status === "maintenance"
                            ? "bg-gradient-to-r from-orange-400 to-orange-600"
                            : "bg-gradient-to-r from-red-400 to-red-600"
                        }`} />
              <Tag
                color={
                  currentStudio.status === "active"
                    ? "green"
                    : currentStudio.status === "maintenance"
                    ? "orange"
                    : "red"
                }
                          className={`relative flex items-center justify-center font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 bg-gradient-to-br ${
                            currentStudio.status === "active"
                              ? "border-green-300 from-green-50 to-green-100"
                              : currentStudio.status === "maintenance"
                              ? "border-orange-300 from-orange-50 to-orange-100"
                              : "border-red-300 from-red-50 to-red-100"
                          }`}
                        >
                          <span className="whitespace-nowrap leading-none">
                            {currentStudio.status === "active"
                              ? "Đang hoạt động"
                              : currentStudio.status === "maintenance"
                              ? "Bảo trì"
                              : "Không khả dụng"}
                          </span>
              </Tag>
            </div>
                    </motion.div>
                  </div>
            </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    className="flex-1 relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Button
                type="primary"
                size="large"
                      icon={<FiShoppingCart className="text-lg" />}
                      className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 border-none text-white font-bold py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-yellow-300"
                      onClick={() => navigate(`/booking/${id}`)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>Thuê ngay</span>
                        <span>→</span>
                      </span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                  >
                    <div className={`relative overflow-hidden rounded-xl border-2 transition-all shadow-lg hover:shadow-xl ${
                      liked
                        ? "border-red-400 bg-gradient-to-br from-red-50 to-pink-50"
                        : "border-gray-300 bg-white hover:border-red-300"
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-10 transition-opacity ${
                        liked ? "from-red-400 to-pink-400" : "from-gray-200 to-gray-300"
                      }`} />
                      <Button
                        size="large"
                        icon={liked ? <AiFillHeart className="text-lg" /> : <FiHeart className="text-lg" />}
                        className={`relative px-6 py-6 rounded-xl border-0 ${
                          liked
                            ? "text-red-500 bg-transparent"
                            : "text-gray-600 hover:text-red-500 bg-transparent"
                        } transition-all font-semibold`}
                        onClick={() => setLiked(!liked)}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Yêu thích
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                </div>

              {/* Additional Info Card */}
              <motion.div
                className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 overflow-hidden"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100/30 to-cyan-100/30 rounded-full blur-2xl -z-0" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <Title level={4} className="mb-0 text-gray-900 font-bold text-lg">
                      Thông tin chi tiết
                    </Title>
                  </div>
                  
                  <div className="space-y-2">
                    <motion.div
                      className="group relative flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-200 transition-all cursor-pointer overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <Text className="text-indigo-600 font-bold text-sm">㎡</Text>
                        </div>
                        <Text className="text-gray-600 font-medium">Diện tích</Text>
                      </div>
                      <Text className="font-bold text-gray-900 text-lg">
                        {currentStudio.area || 0} m²
                      </Text>
                    </motion.div>
                    
                    <motion.div
                      className="group relative flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-purple-200 transition-all cursor-pointer overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.45 }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <FiUsers className="text-purple-600 text-lg" />
                        </div>
                        <Text className="text-gray-600 font-medium">Sức chứa</Text>
                      </div>
                      <Text className="font-bold text-gray-900 text-lg">
                        {currentStudio.capacity || 0} người
                      </Text>
                    </motion.div>
                    
                    <motion.div
                      className="group relative flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-200 transition-all cursor-pointer overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <Text className="text-blue-600 font-bold text-xs">📅</Text>
                        </div>
                        <Text className="text-gray-600 font-medium">Ngày tạo</Text>
                      </div>
                      <Text className="font-bold text-gray-900 text-lg">
                        {currentStudio.createdAt
                          ? new Date(currentStudio.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </Text>
                    </motion.div>
                  </div>
                </div>
            </motion.div>
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
                    <button
                      className="ml-2 text-xl mt-1 focus:outline-none"
                      onClick={() => handleToggleLikeComment(index)}
                    >
                      {review.liked ? (
                        <AiFillHeart className="text-red-500" />
                      ) : (
                        <AiOutlineHeart className="text-gray-300 hover:text-red-400 transition-colors" />
                      )}
                    </button>
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

      {/* Fullscreen Image Modal */}
      <Modal
        open={fullscreenImageIndex !== null}
        onCancel={closeFullscreen}
        footer={null}
        width="100%"
        style={{
          top: 0,
          paddingBottom: 0,
          maxWidth: "100vw",
          height: "100vh",
        }}
        className="fullscreen-image-modal"
        closeIcon={<FiX className="text-white text-2xl" />}
        maskClosable={true}
        centered={false}
        zIndex={9999}
        destroyOnClose={false}
      >
        <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
          {fullscreenImageIndex !== null && images[fullscreenImageIndex] && (
            <>
              <img
                src={images[fullscreenImageIndex]}
                alt={`${currentStudio.name} ${fullscreenImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: "100vh" }}
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateFullscreen("prev");
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all z-20 border border-white/30"
                  >
                    <FiChevronLeft className="text-white text-2xl" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateFullscreen("next");
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all z-20 border border-white/30"
                  >
                    <FiChevronRight className="text-white text-2xl" />
                  </motion.button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold z-20 border border-white/20">
                  {fullscreenImageIndex + 1} / {images.length}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default StudioDetailPage;
