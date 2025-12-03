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
  Modal,
} from "antd";
import {
  FiArrowLeft,
  FiCalendar,
  FiMessageCircle,
  FiStar,
  FiSmile,
  FiImage,
  FiSend,
  FiCornerDownRight,
} from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";

import {
  getSetDesignById,
  createSetDesignComment,
  replySetDesignComment,
} from "../../features/setDesign/setDesignSlice";
import {
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
} from "../../features/comment/commentSlice";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const SetDesignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSetDesign, loading } = useSelector((state) => state.setDesign);
  const { user: currentUser } = useSelector((state) => state.auth || {});
  const isStaff =
    currentUser?.role === "staff" || currentUser?.role === "admin";
  const currentUserId = currentUser?._id || currentUser?.id;

  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyModal, setReplyModal] = useState({
    open: false,
    commentIndex: null,
    targetName: "",
  });
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const formatEntry = (entry = {}, parentCommentId = null) => {
    const likes = Array.isArray(entry.likes) ? entry.likes : [];
    return {
      ...entry,
      parentCommentId: parentCommentId || entry.parentCommentId || null,
      likes,
      likesCount:
        typeof entry.likesCount === "number" ? entry.likesCount : likes.length,
      isLikedByCurrentUser: currentUserId
        ? likes.includes(currentUserId)
        : !!entry.isLikedByCurrentUser,
    };
  };

  const enrichComments = (rawComments = []) =>
    rawComments.map((comment) => ({
      ...formatEntry(comment),
      replies: Array.isArray(comment.replies)
        ? comment.replies.map((reply) =>
            formatEntry(reply, comment._id || comment.id || comment.id)
          )
        : [],
    }));

  useEffect(() => {
    if (!currentSetDesign || currentSetDesign._id !== id) {
      dispatch(getSetDesignById(id));
    }
  }, [dispatch, id, currentSetDesign?._id]);

  // Đồng bộ comments local để dễ cập nhật like/unlike mà không phải refetch toàn bộ
  useEffect(() => {
    if (currentSetDesign?.comments) {
      setComments(enrichComments(currentSetDesign.comments));
    }
  }, [currentSetDesign, currentUser]);

  // === GỬI BÌNH LUẬN ===
  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    setCommentLoading(true);
    try {
      const created = await dispatch(
        createSetDesignComment({
          setDesignId: id,
          message: newComment.trim(),
        })
      ).unwrap();

      setNewComment("");
      message.success("Gửi bình luận thành công!");

      // Backend có thể trả về cả set design (data.comments) hoặc chỉ comment mới
      if (created?.comments && Array.isArray(created.comments)) {
        setComments(enrichComments(created.comments));
      } else if (created && created._id) {
        const [formatted] = enrichComments([created]);
        setComments((prev) => [formatted, ...prev]);
      } else {
        dispatch(getSetDesignById(id));
      }
    } catch (err) {
      message.error(err?.message || "Gửi bình luận thất bại");
    } finally {
      setCommentLoading(false);
    }
  };

  const openReplyModal = (commentIndex, customerName) => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để trả lời bình luận");
      return;
    }
    setReplyModal({
      open: true,
      commentIndex,
      targetName: customerName || "bình luận",
    });
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    if (replyModal.commentIndex === null) return;
    if (!replyMessage.trim()) {
      message.warning("Vui lòng nhập nội dung trả lời");
      return;
    }
    try {
      setReplySubmitting(true);
      const result = await dispatch(
        replySetDesignComment({
          setDesignId: id,
          commentIndex: replyModal.commentIndex,
          message: replyMessage.trim(),
        })
      ).unwrap();

      message.success("Đã trả lời bình luận");
      setReplyModal({ open: false, commentIndex: null, targetName: "" });
      if (result?.comments && Array.isArray(result.comments)) {
        setComments(enrichComments(result.comments));
      } else {
        setComments((prev) =>
          prev.map((c, idx) =>
            idx === replyModal.commentIndex
              ? {
                  ...c,
                  replies: [
                    ...(c.replies || []),
                    formatEntry(
                      {
                        _id: Date.now().toString(),
                        id: Date.now().toString(),
                        userId: currentUserId,
                        userName:
                          currentUser?.fullName ||
                          currentUser?.username ||
                          currentUser?.name ||
                          "Bạn",
                        userRole: currentUser?.role || "customer",
                        message: replyMessage.trim(),
                        createdAt: new Date().toISOString(),
                        likes: [],
                      },
                      c._id || c.id || null
                    ),
                  ],
                }
              : c
          )
        );
      }
      setReplyMessage("");
    } catch (err) {
      message.error("Trả lời thất bại");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleToggleLike = async (
    target,
    parentIndex = null,
    parentCommentId = null
  ) => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để thích bình luận");
      return;
    }

    const commentId = target?._id || target?.id;
    if (!commentId) return;

    try {
      const isReply = !!parentCommentId || !!target.parentCommentId;
      const effectiveParentId =
        parentCommentId || target.parentCommentId || null;

      let result;
      if (isReply && effectiveParentId) {
        const action = target.isLikedByCurrentUser ? unlikeReply : likeReply;
        result = await dispatch(
          action({ commentId: effectiveParentId, replyId: commentId })
        ).unwrap();
      } else {
        const action = target.isLikedByCurrentUser
          ? unlikeComment
          : likeComment;
        result = await dispatch(action(commentId)).unwrap();
      }

      const likesFromApi = Array.isArray(result?.likes)
        ? result.likes
        : target.likes || [];
      const resolvedCount =
        typeof result?.likesCount === "number"
          ? result.likesCount
          : Array.isArray(result?.likes)
          ? result.likes.length
          : (target.likesCount || 0) + (target.isLikedByCurrentUser ? -1 : 1);
      const nextIsLikedByCurrentUser =
        currentUserId && Array.isArray(result?.likes)
          ? result.likes.includes(currentUserId)
          : !target.isLikedByCurrentUser;

      setComments((prev) =>
        prev.map((comment, idx) => {
          const commentKey = comment._id || comment.id;
          if (!isReply && commentKey === commentId) {
            return {
              ...comment,
              likes: likesFromApi,
              likesCount: resolvedCount,
              isLikedByCurrentUser: nextIsLikedByCurrentUser,
            };
          }

          const shouldInspectReplies =
            isReply &&
            ((parentIndex !== null && idx === parentIndex) ||
              commentKey === effectiveParentId);

          if (!shouldInspectReplies || !Array.isArray(comment.replies)) {
            return comment;
          }

          const updatedReplies = comment.replies.map((reply) => {
            if ((reply._id || reply.id) !== commentId) return reply;
            return {
              ...reply,
              likes: likesFromApi,
              likesCount: resolvedCount,
              isLikedByCurrentUser: nextIsLikedByCurrentUser,
            };
          });

          return {
            ...comment,
            replies: updatedReplies,
          };
        })
      );
    } catch (err) {
      message.error(err?.message || "Không thể cập nhật lượt thích");
    }
  };

  // Loading & Not Found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải chi tiết set design..." fullscreen />
      </div>
    );
  }

  if (!currentSetDesign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Empty description="Không tìm thấy Set Design này" />
        <Button
          type="primary"
          size="large"
          className="mt-6"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const item = currentSetDesign;
  const mainImage =
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1200&q=80";

  const categoryLabel =
    {
      wedding: "Tiệc cưới",
      corporate: "Doanh nghiệp & Sự kiện",
      birthday: "Sinh nhật",
      product: "Chụp sản phẩm",
      portrait: "Chân dung",
      other: "Khác",
    }[item.category] || "Không xác định";

  return (
    <Layout>
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
                <Tag
                  color="white"
                  className="text-lg px-5 py-2 backdrop-blur-sm bg-white/20 border-white"
                >
                  {categoryLabel}
                </Tag>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div>
                <Title
                  level={1}
                  className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
                >
                  {item.name}
                </Title>
                <div className="flex items-center gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    <Text strong>
                      {item.averageRating > 0
                        ? item.averageRating.toFixed(1)
                        : "Chưa có"}
                    </Text>
                    <Text type="secondary">({item.totalReviews} đánh giá)</Text>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="text-indigo-600" />
                    <Text strong>{comments.length} bình luận</Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <FiCalendar />
                <Text>
                  Đã tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </Text>
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
            <Title level={2} className="text-3xl font-bold mb-6">
              Giới thiệu về Set Design
            </Title>
            <Paragraph className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {item.description ||
                "Chưa có mô tả chi tiết. Set design này đang được hoàn thiện và sẽ sớm có thông tin đầy đủ."}
            </Paragraph>
          </div>

          {/* ==================== PHẦN BÌNH LUẬN ĐẸP NHƯ FACEBOOK ==================== */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <Title
              level={2}
              className="text-3xl font-bold mb-8 flex items-center gap-3"
            >
              <FiMessageCircle className="text-indigo-600" />
              Bình luận ({comments.length})
            </Title>

            {/* Form gửi bình luận */}
            <div className="mb-12">
              <div className="flex gap-4">
                <Avatar
                  size={48}
                  src={
                    currentUser?.avatar ||
                    "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                  }
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 cursor-pointer border border-white shadow-md"
                  onClick={() => navigate("/dashboard/customer/profile")}
                >
                  {!currentUser?.avatar &&
                    (currentUser?.fullName?.[0]?.toUpperCase() ||
                      currentUser?.username?.[0]?.toUpperCase() ||
                      "K")}
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
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
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
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Text strong className="text-gray-900">
                              {comment?.customerName || "Khách"}
                            </Text>
                            {comment.isStaff && (
                              <Tag color="gold" className="text-xs">
                                Nhân viên
                              </Tag>
                            )}
                            <Text type="secondary" className="text-xs">
                              {new Date(comment.createdAt).toLocaleString(
                                "vi-VN"
                              )}
                            </Text>
                          </div>
                          <button
                            className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={() => handleToggleLike(comment)}
                          >
                            {comment.isLikedByCurrentUser ? (
                              <AiFillHeart className="text-red-500" />
                            ) : (
                              <AiOutlineHeart className="text-gray-300" />
                            )}
                            <span>
                              {comment.likesCount ??
                                (Array.isArray(comment.likes)
                                  ? comment.likes.length
                                  : 0)}
                            </span>
                          </button>
                        </div>
                        <Paragraph className="text-gray-800 mb-0">
                          {comment.message}
                        </Paragraph>
                      </div>

                      <div className="mt-3 ml-2">
                        <Button
                          type="text"
                          size="small"
                          className="text-indigo-600 font-medium px-0"
                          onClick={() =>
                            openReplyModal(index, comment.customerName)
                          }
                        >
                          Trả lời
                        </Button>
                      </div>

                      {Array.isArray(comment.replies) &&
                        comment.replies.length > 0 && (
                          <div className="mt-4 ml-10 space-y-3">
                            {comment.replies.map((reply, replyIdx) => (
                              <div
                                key={reply._id || reply.id || replyIdx}
                                className="pl-6 border-l-2 border-indigo-100"
                              >
                                <div className="flex gap-3 items-start">
                                  <FiCornerDownRight className="mt-1 text-indigo-400" />
                                  <Avatar
                                    size={32}
                                    className="bg-gradient-to-br from-cyan-500 to-blue-600"
                                  >
                                    {reply.userName?.[0]?.toUpperCase() ||
                                      reply.userRole?.[0]?.toUpperCase() ||
                                      "R"}
                                  </Avatar>
                                  <div className="bg-indigo-50 rounded-2xl px-4 py-3 flex-1">
                                    <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Text
                                          strong
                                          className="text-indigo-700 text-sm"
                                        >
                                          {reply.userName || "Người dùng"}
                                        </Text>
                                        {reply.userRole === "staff" ||
                                        reply.userRole === "admin" ? (
                                          <Tag
                                            color="blue"
                                            className="text-[10px]"
                                          >
                                            {reply.userRole === "admin"
                                              ? "Quản trị"
                                              : "Nhân viên"}
                                          </Tag>
                                        ) : null}
                                        <Text
                                          type="secondary"
                                          className="text-[11px]"
                                        >
                                          {reply.createdAt
                                            ? new Date(
                                                reply.createdAt
                                              ).toLocaleString("vi-VN")
                                            : ""}
                                        </Text>
                                      </div>

                                      <button
                                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-500 transition-colors"
                                        onClick={() =>
                                          handleToggleLike(
                                            reply,
                                            index,
                                            comment._id || comment.id
                                          )
                                        }
                                      >
                                        {reply.isLikedByCurrentUser ? (
                                          <AiFillHeart className="text-red-500" />
                                        ) : (
                                          <AiOutlineHeart className="text-gray-300" />
                                        )}
                                        <span>
                                          {reply.likesCount ??
                                            (Array.isArray(reply.likes)
                                              ? reply.likes.length
                                              : 0)}
                                        </span>
                                      </button>
                                    </div>
                                    <Text className="text-indigo-900 text-sm block">
                                      {reply.message}
                                    </Text>
                                    <div className="mt-2">
                                      <Button
                                        type="text"
                                        size="small"
                                        className="text-indigo-600 font-medium px-0"
                                        onClick={() =>
                                          openReplyModal(index, reply.userName)
                                        }
                                      >
                                        Trả lời
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <FiMessageCircle
                    size={80}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <Text type="secondary" className="text-xl">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm
                    nhận!
                  </Text>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Modal
        title={`Trả lời ${replyModal.targetName}`}
        open={replyModal.open}
        onCancel={() =>
          setReplyModal({ open: false, commentIndex: null, targetName: "" })
        }
        onOk={handleSendReply}
        okText="Gửi trả lời"
        cancelText="Hủy"
        confirmLoading={replySubmitting}
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập nội dung trả lời..."
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
        />
      </Modal>
    </Layout>
  );
};

export default SetDesignDetail;
