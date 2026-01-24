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
              className="p-4 rounded-xl studio-comment-card bg-white border border-slate-200 shadow group relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={c.userId?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-base">
                    {c.userId?.fullName || c.userId?.username || "Người dùng"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {c.createdAt
                      ? dayjs(c.createdAt).format("DD/MM/YYYY HH:mm")
                      : ""}
                  </div>
                </div>
                <button
                  className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-1 hover:underline"
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
              <div className="text-slate-800 text-base mb-1">{c.content}</div>
              {c.rating && (
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              )}
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
              {openReply === c._id && (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={replyValue[c._id] || ""}
                    onChange={(e) =>
                      setReplyValue((p) => ({
                        ...p,
                        [c._id]: e.target.value,
                      }))
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
              {c.replies?.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                  {c.replies.map((r, ridx) => (
                    <div
                      key={r._id || ridx}
                      className="p-3 rounded-xl bg-white border border-slate-100 group relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.userId?.avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="w-7 h-7 rounded-full object-cover border"
                          />
                          <div className="font-semibold text-slate-900 text-sm">
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
                      <div className="text-slate-700 text-sm">{r.content}</div>
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
