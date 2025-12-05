import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { likeComment, unlikeComment } from "../../../features/comment/commentSlice";
import SDReplyItem from "./SDReplyItem";

const SDCommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth || {});
  const currentUserId = user?._id || user?.id;

  const [optimistic, setOptimistic] = useState({});

  const toggleLike = useCallback(async () => {
    if (!currentUserId) return alert("Đăng nhập để thích");

    try {
      if (comment.isLikedByCurrentUser) {
        await dispatch(unlikeComment(comment._id)).unwrap();
      } else {
        await dispatch(likeComment(comment._id)).unwrap();
      }
      setOptimistic({});
    } catch (err) {
      console.error(err);
    }
  }, [comment, currentUserId, dispatch]);

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {comment.customerName?.[0] || "U"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {comment.customerName || "Khách"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>

            {/* Like */}
            <button
              onClick={toggleLike}
              className="flex items-center gap-1 text-sm"
            >
              {comment.isLikedByCurrentUser ? (
                <AiFillHeart className="text-red-500" />
              ) : (
                <AiOutlineHeart />
              )}
              <span>
                {comment.likesCount ??
                  (Array.isArray(comment.likes) ? comment.likes.length : 0)}
              </span>
            </button>
          </div>

          <div className="mt-2 text-gray-700">
            {comment.content || comment.message}
          </div>
        </div>

        <div className="mt-2 ml-2 flex items-center gap-4 text-sm text-indigo-600">
          <button className="hover:underline">Trả lời</button>
          <button className="hover:underline">Báo cáo</button>
        </div>

        {comment.replies?.length > 0 && (
          <div className="mt-3 pl-5 border-l-2 border-gray-100 space-y-3">
            {comment.replies.map((r) => (
              <SDReplyItem key={r._id} reply={r} parent={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SDCommentItem;
