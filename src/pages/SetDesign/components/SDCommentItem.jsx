import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  likeComment,
  unlikeComment,
  replyComment,
  getComments,
} from "../../../features/comment/commentSlice";
import SDReplyItem from "./SDReplyItem";

const SDCommentItem = ({ comment, targetId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth || {});
  const currentUserId = user?._id || user?.id;

  const [optimistic, setOptimistic] = useState({});
  const [showReply, setShowReply] = useState(false);
  const [replyValue, setReplyValue] = useState("");

  const toggleLike = useCallback(async () => {
    if (!currentUserId) return alert("Đăng nhập để thích");

    try {
      if (comment.isLikedByCurrentUser) {
        await dispatch(unlikeComment(comment._id)).unwrap();
      } else {
        await dispatch(likeComment(comment._id)).unwrap();
      }
      // refresh latest comments
      await dispatch(
        getComments({ targetType: "SetDesign", targetId })
      ).unwrap();
      setOptimistic({});
    } catch (err) {
      console.error(err);
    }
  }, [comment, currentUserId, dispatch, targetId]);

  const handleReply = async () => {
    if (!currentUserId) return alert("Đăng nhập để trả lời");
    if (!replyValue.trim()) return;
    try {
      await dispatch(
        replyComment({ commentId: comment._id, content: replyValue.trim() })
      ).unwrap();
      setReplyValue("");
      setShowReply(false);
      await dispatch(
        getComments({ targetType: "SetDesign", targetId })
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const name =
    comment.userId?.fullName ||
    comment.customerName ||
    comment.userName ||
    "Khách";
  const avatar = comment.userId?.avatar;
  const createdAt = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString("vi-VN")
    : "";

  const likeCount =
    comment.likesCount ??
    (Array.isArray(comment.likes) ? comment.likes.length : 0);
  const isLiked =
    comment.isLikedByCurrentUser ||
    (Array.isArray(comment.likes) &&
      currentUserId &&
      comment.likes.includes(currentUserId));

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {name?.[0] || "U"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">{name}</div>
              <div className="text-xs text-gray-400">{createdAt}</div>
            </div>

            {/* Like */}
            <button
              onClick={toggleLike}
              className="flex items-center gap-1 text-sm"
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500" />
              ) : (
                <AiOutlineHeart />
              )}
              <span>{likeCount}</span>
            </button>
          </div>

          <div className="mt-2 text-gray-700">
            {comment.content || comment.message}
          </div>
        </div>

        <div className="mt-2 ml-2 flex items-center gap-4 text-sm text-indigo-600">
          <button className="hover:underline" onClick={() => setShowReply((p) => !p)}>
            Trả lời
          </button>
          <button className="hover:underline">Báo cáo</button>
        </div>

        {showReply && (
          <div className="mt-2 ml-2 space-y-2">
            <textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              rows={2}
              placeholder="Nhập trả lời..."
              className="w-full p-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReply}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm"
              >
                Gửi
              </button>
              <button
                onClick={() => setShowReply(false)}
                className="px-3 py-1 rounded-lg border text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-3 pl-5 border-l-2 border-gray-100 space-y-3">
            {comment.replies.map((r) => (
              <SDReplyItem key={r._id} reply={r} parent={comment} targetId={targetId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SDCommentItem;
