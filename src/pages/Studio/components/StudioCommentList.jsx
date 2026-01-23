import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  createComment,
  replyComment,
  getComments,
} from "../../../features/comment/commentSlice";
import dayjs from "dayjs";

const StudioCommentList = ({ targetId }) => {
  const dispatch = useDispatch();
  const { comments = [], loading } = useSelector((s) => s.comment || {});
  const { user } = useSelector((s) => s.auth || {});
  const [value, setValue] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [replyValue, setReplyValue] = useState({});
  const [openReply, setOpenReply] = useState(null);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    if (!user) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }
    try {
      await dispatch(
        createComment({
          content: value.trim(),
          targetType: "Studio",
          targetId,
        })
      ).unwrap();
      setValue("");
    } catch (err) {
      alert(err?.message || "Gửi bình luận thất bại");
    }
  };

  const handleReply = async (commentId) => {
    const content = replyValue[commentId]?.trim();
    if (!content) return;
    if (!user) {
      alert("Vui lòng đăng nhập để trả lời");
      return;
    }
    try {
      await dispatch(replyComment({ commentId, content })).unwrap();
      setReplyValue((p) => ({ ...p, [commentId]: "" }));
      setOpenReply(null);
      await dispatch(getComments({ targetType: "Studio", targetId })).unwrap();
    } catch (err) {
      alert(err?.message || "Gửi trả lời thất bại");
    }
  };

  return (
    <div className="studio-panel p-6 md:p-7 mt-10">
      <h2 className="text-2xl font-extrabold mb-4 text-slate-900">Bình luận</h2>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-4 items-start">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 p-3 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className=" border bg-amber-200 px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50 hover:scale-3d cursor-pointer font-semibold text-slate-800"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {localComments.length === 0 ? (
          <p className="text-gray-400">
            Chưa có bình luận nào — hãy bắt đầu!
          </p>
        ) : (
          localComments.map((c, idx) => (
            <motion.div
              key={c._id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 rounded-xl studio-comment-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-900">
                  {c.userId?.fullName || c.userId?.username || "Người dùng"}
                </div>
                <div className="text-xs text-slate-500">
                  {c.createdAt ? dayjs(c.createdAt).format("DD/MM/YYYY HH:mm") : ""}
                </div>
              </div>
              <div className="text-slate-800">{c.content}</div>

              {/* Actions */}
              <div className="mt-2 flex items-center gap-4 text-sm text-indigo-600">
                <button
                  className="hover:underline"
                  onClick={() =>
                    setOpenReply((prev) => (prev === c._id ? null : c._id))
                  }
                >
                  Trả lời
                </button>
              </div>

              {/* Reply box */}
              {openReply === c._id && (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={replyValue[c._id] || ""}
                    onChange={(e) =>
                      setReplyValue((p) => ({ ...p, [c._id]: e.target.value }))
                    }
                    rows={2}
                    placeholder="Nhập trả lời..."
                    className="w-full p-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(c._id)}
                      disabled={loading}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-50"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => setOpenReply(null)}
                      className="px-3 py-1 rounded-lg border text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {c.replies?.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                  {c.replies.map((r, ridx) => (
                    <div
                      key={r._id || ridx}
                      className="p-3 rounded-xl bg-white border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900 text-sm">
                          {r.userId?.fullName || r.userId?.username || "Người dùng"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {r.createdAt
                            ? dayjs(r.createdAt).format("DD/MM/YYYY HH:mm")
                            : ""}
                        </div>
                      </div>
                      <div className="text-slate-700 text-sm">{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudioCommentList;
