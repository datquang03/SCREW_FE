import React, { useCallback, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getComments,
  likeReply,
  unlikeReply,
  replyComment,
} from "../../../features/comment/commentSlice";

const SDReplyItem = React.memo(({ reply, parent, targetId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth || {});
  const currentUserId = user?._id || user?.id;
  const [showReply, setShowReply] = useState(false);
  const [replyValue, setReplyValue] = useState("");

  const toggleLike = useCallback(async () => {
    if (!currentUserId) return alert("Đăng nhập để thích");
    try {
      if (reply.isLikedByCurrentUser) {
        await dispatch(unlikeReply({ commentId: parent._id, replyId: reply._id })).unwrap();
      } else {
        await dispatch(likeReply({ commentId: parent._id, replyId: reply._id })).unwrap();
      }
      await dispatch(getComments({ targetType: "SetDesign", targetId })).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, [currentUserId, dispatch, parent._id, reply, targetId]);

  const handleReply = useCallback(async () => {
    if (!currentUserId) return alert("Đăng nhập để trả lời");
    if (!replyValue.trim()) return;
    try {
      await dispatch(
        replyComment({ commentId: parent._id, content: replyValue.trim() })
      ).unwrap();
      setReplyValue("");
      setShowReply(false);
      await dispatch(getComments({ targetType: "SetDesign", targetId })).unwrap();
    } catch (err) {
      console.error(err);
    }
  }, [currentUserId, dispatch, parent._id, replyValue, targetId]);

  const name =
    reply.userId?.fullName || reply.userName || reply.userRole || "Người dùng";
  const avatar = reply.userId?.avatar;
  const createdAt = reply.createdAt
    ? new Date(reply.createdAt).toLocaleString("vi-VN")
    : "";
  const likeCount =
    reply.likesCount ??
    (Array.isArray(reply.likes) ? reply.likes.length : 0);
  const isLiked =
    reply.isLikedByCurrentUser ||
    (Array.isArray(reply.likes) &&
      currentUserId &&
      reply.likes.includes(currentUserId));

  return (
    <div className="flex items-start gap-3">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium">
          {name?.[0] || "R"}
        </div>
      )}
      <div className="flex-1">
        <div className="bg-indigo-50 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-indigo-700">
                {name}
              </div>
              <div className="text-xs text-gray-400">
                {createdAt}
              </div>
            </div>
            <div>
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
          </div>

          <div className="mt-2 text-indigo-900">
            {reply.content || reply.message}
          </div>
        </div>

        <div className="mt-2 ml-1 flex items-center gap-3 text-xs text-indigo-600">
          <button
            className="hover:underline"
            onClick={() => setShowReply((p) => !p)}
          >
            Trả lời
          </button>
        </div>

        {showReply && (
          <div className="mt-2 ml-1 space-y-2">
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
      </div>
    </div>
  );
});

export default SDReplyItem;
