import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  createComment,
  replyComment,
  getComments,
} from "../../../features/comment/commentSlice";
import dayjs from "dayjs";
import { Modal, Form, Input, Select, message } from "antd";
import { createReport } from "../../../features/report/reportSlice";

const StudioCommentList = ({ targetId }) => {
  const dispatch = useDispatch();
  const { comments = [], loading } = useSelector((s) => s.comment || {});
  const { user } = useSelector((s) => s.auth || {});
  const [value, setValue] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [replyValue, setReplyValue] = useState({});
  const [openReply, setOpenReply] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportForm] = Form.useForm();

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
      await dispatch(getComments({ targetType: "Studio", targetId })).unwrap();
    } catch (err) {
      alert(err?.message || "Gửi bình luận thất bại");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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

  const handleOpenReport = (comment) => {
    setReportTarget(comment);
    setReportModalOpen(true);
    reportForm.resetFields();
  };

  useEffect(() => {
    window.handleOpenReport = handleOpenReport;
    return () => {
      window.handleOpenReport = undefined;
    };
  }, []);

  const handleSubmitReport = async () => {
    try {
      const values = await reportForm.validateFields();
      let priority = "medium";
      if (
        [
          "damage",
          "complaint",
          "missing_item",
          "inappropriate_content",
        ].includes(values.issueType)
      ) {
        priority = "high";
      } else if (["equipment", "studio"].includes(values.issueType)) {
        priority = "low";
      }
      await dispatch(
        createReport({
          targetType: "Comment",
          targetId: reportTarget._id,
          issueType: values.issueType,
          description: values.description,
          priority,
        })
      ).unwrap();
      message.success("Đã gửi báo cáo thành công!");
      setReportModalOpen(false);
    } catch (err) {
      message.error(err?.message || "Gửi báo cáo thất bại!");
    }
  };

  return (
    <div className="relative bg-[#FCFBFA] border border-slate-200 shadow-lg p-8 mt-10">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Bình luận & Đánh giá</h2>
        <p className="text-slate-600">Chia sẻ cảm nhận của bạn</p>
      </div>

      {/* Input */}
      <div className="mb-8">
        <div className="flex gap-4 items-start">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Viết bình luận..."
            className="flex-1 p-4 bg-white text-[#0F172A] border-2 border-slate-200 outline-none focus:border-[#C5A267] focus:ring-2 focus:ring-[#C5A267]/20 transition-all"
            rows={4}
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#C5A267] hover:bg-[#A0826D] text-white px-6 py-3 font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            Gửi
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Nhấn Enter để gửi, Shift+Enter để xuống dòng</p>
      </div>

      {/* List */}
      <div className="space-y-5">
        {localComments.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200">
            <p className="text-slate-400 text-lg">Chưa có bình luận nào — hãy bắt đầu!</p>
          </div>
        ) : (
          localComments.map((c, idx) => (
            <motion.div
              key={c._id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-6 bg-white border-l-4 border-[#C5A267] shadow-md hover:shadow-lg transition-shadow group relative"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={c.userId?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-12 h-12 object-cover border-2 border-[#C5A267]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#0F172A] text-lg">
                    {c.userId?.fullName || c.userId?.username || "Người dùng"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {c.createdAt
                      ? dayjs(c.createdAt).format("DD/MM/YYYY HH:mm")
                      : ""}
                  </div>
                </div>
                <button
                  className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 px-3 py-1 hover:bg-red-50 border border-red-200"
                  title="Báo cáo bình luận này"
                  onClick={() =>
                    window.handleOpenReport && window.handleOpenReport(c)
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                  <span className="text-xs font-semibold">Báo cáo</span>
                </button>
              </div>
              <div className="text-[#0F172A] text-base leading-relaxed mb-3">{c.content}</div>
              {c.rating && (
                <div className="flex items-center gap-1 text-[#C5A267] mb-2">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-4">
                <button
                  className="text-sm font-semibold text-[#A0826D] hover:text-[#8B7355] transition-colors"
                  onClick={() =>
                    setOpenReply((prev) => (prev === c._id ? null : c._id))
                  }
                >
                  Trả lời
                </button>
              </div>
              {openReply === c._id && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-[#C5A267]">
                  <textarea
                    value={replyValue[c._id] || ""}
                    onChange={(e) =>
                      setReplyValue((p) => ({
                        ...p,
                        [c._id]: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Nhập trả lời..."
                    className="w-full p-3 border-2 border-slate-200 outline-none focus:border-[#C5A267] focus:ring-2 focus:ring-[#C5A267]/20 text-sm"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(c._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-[#A0826D] hover:bg-[#8B7355] text-white font-semibold disabled:opacity-50 transition-colors"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => setOpenReply(null)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 font-semibold transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
              {c.replies?.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-slate-200 space-y-4">
                  {c.replies.map((r, ridx) => (
                    <div
                      key={r._id || ridx}
                      className="p-4 bg-[#FCFBFA] border border-slate-200 group relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.userId?.avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="w-8 h-8 object-cover border border-[#A0826D]"
                          />
                          <div className="font-bold text-[#0F172A] text-sm">
                            {r.userId?.fullName ||
                              r.userId?.username ||
                              "Người dùng"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[11px] text-slate-500">
                            {r.createdAt
                              ? dayjs(r.createdAt).format("DD/MM/YYYY HH:mm")
                              : ""}
                          </div>
                          <button
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-1 hover:underline"
                            title="Báo cáo trả lời này"
                            onClick={() =>
                              window.handleOpenReport &&
                              window.handleOpenReport({
                                ...r,
                                parentCommentId: c._id,
                              })
                            }
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                            </svg>
                            <span className="text-xs font-semibold">
                              Báo cáo
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="text-[#0F172A] text-sm leading-relaxed">{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
      <Modal
        open={reportModalOpen}
        onCancel={() => setReportModalOpen(false)}
        footer={null}
        title="Báo cáo vi phạm bình luận"
        centered
      >
        <Form form={reportForm} layout="vertical" onFinish={handleSubmitReport}>
          {/* Mức độ ưu tiên hiển thị góc phải trên cùng */}
          <Form.Item shouldUpdate noStyle>
            {() => {
              const issueType = reportForm.getFieldValue("issueType");
              let priority = "Trung bình";
              let color = "#f59e42";
              if (["damage", "complaint", "missing_item", "inappropriate_content"].includes(issueType)) {
                priority = "Cao";
                color = "#ef4444";
              } else if (["equipment", "studio"].includes(issueType)) {
                priority = "Thấp";
                color = "#22c55e";
              }
              return (
                <div style={{ position: "absolute", top: 18, right: 24, zIndex: 10 }}>
                  <span style={{
                    background: color,
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "2px 12px",
                    fontSize: 13,
                    boxShadow: "0 1px 4px #0001"
                  }}>
                    Ưu tiên: {priority}
                  </span>
                </div>
              );
            }}
          </Form.Item>
          <Form.Item
            label="Loại đối tượng"
            name="targetType"
            initialValue="Comment"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="targetId" initialValue={reportTarget?._id} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại vấn đề"
            name="issueType"
            rules={[{ required: true, message: "Vui lòng chọn loại vấn đề" }]}
          >
            <Select
              options={[
                { value: "equipment", label: "Vấn đề về thiết bị" },
                { value: "studio", label: "Vấn đề về phòng studio" },
                { value: "staff", label: "Vấn đề về nhân viên" },
                { value: "damage", label: "Báo cáo hư hại" },
                { value: "complaint", label: "Khiếu nại chung" },
                { value: "missing_item", label: "Mất đồ" },
                { value: "inappropriate_content", label: "Nội dung không phù hợp" },
                { value: "other", label: "Khác" },
              ]}
              placeholder="Chọn loại vấn đề"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả chi tiết"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về vấn đề..."
            />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 border rounded bg-white text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{ background: '#ef4444', color: '#fff' }}
              className="px-4 py-2 rounded font-semibold"
            >
              Gửi báo cáo
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudioCommentList;
