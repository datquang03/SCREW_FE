import React, { useCallback } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

const SDReplyItem = React.memo(({ reply, parent }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth || {});
  const currentUserId = user?._id || user?.id;

  const toggleLike = useCallback(async () => {
    if (!currentUserId) return alert("Đăng nhập để thích");
    try {
      if (reply.isLikedByCurrentUser) {
        await dispatch(
          unlikeReply({ commentId: parent._id, replyId: reply._id })
        ).unwrap();
      } else {
        await dispatch(
          likeReply({ commentId: parent._id, replyId: reply._id })
        ).unwrap();
      }
    } catch (err) {
      console.error(err);
    }
  }, [reply, parent, currentUserId, dispatch]);

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium">
        {reply.userName?.[0] || "R"}
      </div>
      <div className="flex-1">
        <div className="bg-indigo-50 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-indigo-700">
                {reply.userName || "Người dùng"}
              </div>
              <div className="text-xs text-gray-400">
                {reply.createdAt
                  ? new Date(reply.createdAt).toLocaleString("vi-VN")
                  : ""}
              </div>
            </div>
            <div>
              <button
                onClick={toggleLike}
                className="flex items-center gap-1 text-sm"
              >
                {reply.isLikedByCurrentUser ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart />
                )}
                <span>
                  {reply.likesCount ??
                    (Array.isArray(reply.likes) ? reply.likes.length : 0)}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-2 text-indigo-900">
            {reply.content || reply.message}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SDReplyItem;
