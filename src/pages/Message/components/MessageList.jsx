// src/pages/Message/components/MessageList.jsx
import { useState, useEffect, useRef } from "react";
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../../features/message/messageSlice";
import SetDesignCard, { parseSetDesignFromMessage } from "./SetDesignCard";

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

// Skeleton cho message item
const MessageSkeleton = ({ isMine }) => (
  <div
    className={`flex ${isMine ? "justify-end" : "justify-start"} items-start gap-2 mb-4 animate-pulse`}
  >
    {!isMine && <div className="w-8 h-8 bg-gray-200 flex-shrink-0" />}
    <div
      className={`max-w-xs lg:max-w-md px-4 py-3 ${
        isMine ? "bg-[#D4C4B0]" : "bg-gray-200"
      }`}
    >
      <div className="h-4 bg-gray-300 w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 w-1/2" />
      <div className="flex items-center justify-between mt-2">
        <div className="h-3 bg-gray-300 w-16" />
        <div className="h-3 bg-gray-300 w-12" />
      </div>
    </div>
    {isMine && <div className="w-8 h-8 bg-gray-200 flex-shrink-0" />}
  </div>
);

const MessageList = ({ messages, currentUserId, loading }) => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    messageId: null,
  });
  const bottomRef = useRef(null);

  // Auto scroll to newest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleDeleteClick = (messageId) => {
    setDeleteModal({
      visible: true,
      messageId,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.messageId) {
      dispatch(deleteMessage(deleteModal.messageId));
      setDeleteModal({ visible: false, messageId: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ visible: false, messageId: null });
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {[...Array(6)].map((_, i) => (
          <MessageSkeleton key={i} isMine={i % 3 === 0} />
        ))}
      </div>
    );
  }

  if (messages.length === 0)
    return <p className="text-center text-slate-400 py-10">Chưa có tin nhắn nào.</p>;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FCFBFA]" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#C5A267 #f1f5f9'
    }}>
      {messages.map((msg) => {
        const isMine = msg.fromUserId?._id === currentUserId || msg.fromUserId === currentUserId;
        const name = msg.fromUserId?.fullName || msg.fromUserId?.username || "Người dùng";
        const isRead = msg.isRead || msg.read;

        return (
          <div
            key={msg._id}
            className={`group flex ${isMine ? "justify-end" : "justify-start"} relative items-start gap-2`}
          >
            {/* Icon delete hiển thị ở phía trước (bên trái) khi hover - giống Messenger */}
            {isMine && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(msg._id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-red-500 text-slate-600 hover:text-white shadow-sm hover:shadow-md mt-1 flex-shrink-0"
                title="Xóa tin nhắn"
              >
                <DeleteOutlined className="text-sm" />
              </button>
            )}
            
            <div
              className={`relative max-w-xs lg:max-w-md px-4 py-3 shadow-sm transition-all ${
                isMine
                  ? "bg-[#A0826D] text-white border border-[#A0826D]"
                  : "bg-white text-[#0F172A] border border-slate-200"
              }`}
            >
              {!isMine && <p className="text-xs font-bold text-[#C5A267] mb-1">{name}</p>}
              
              {/* Parse và hiển thị Set Design card nếu có */}
              {(() => {
                const setDesignInfo = parseSetDesignFromMessage(msg.content);
                const textContent = setDesignInfo
                  ? msg.content
                      .replace(
                        /📦\s*Set Design được gửi kèm:[\s\S]*?(?=\n\n|\n$|$)/,
                        ""
                      )
                      .trim()
                  : msg.content;

                return (
                  <>
                    {textContent && (
                      <p className="text-sm whitespace-pre-wrap mb-2">
                        {textContent}
                      </p>
                    )}
                    {setDesignInfo && (
                      <SetDesignCard
                        designInfo={setDesignInfo}
                        isMine={isMine}
                        messageContent={msg.content}
                      />
                    )}
                  </>
                );
              })()}

              <div className="mt-1 flex items-center justify-between gap-3">
                <span className={`text-xs ${
                  isMine ? "text-white/80" : "text-slate-500"
                }`}>
                  {formatTime(msg.createdAt)}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  {isMine ? (
                    isRead ? (
                      <span className="flex items-center gap-1 text-white/90">
                        <EyeOutlined /> Đã xem
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-white/70">
                        <EyeInvisibleOutlined /> Chưa xem
                      </span>
                    )
                  ) : (
                    !isRead && (
                      <span className="flex items-center gap-1 text-[#10b981] font-semibold">
                        <EyeInvisibleOutlined /> Chưa đọc
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal xác nhận xóa tin nhắn */}
      <Modal
        title="Xóa tin nhắn"
        open={deleteModal.visible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn có chắc muốn xóa tin nhắn này không? Hành động này không thể hoàn tác.</p>
      </Modal>
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;