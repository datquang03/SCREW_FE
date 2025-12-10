// src/pages/Message/components/MessageList.jsx
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../../features/message/messageSlice";

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const MessageList = ({ messages, currentUserId, loading }) => {
  const dispatch = useDispatch();

  if (loading) return <p className="text-center text-gray-400">Đang tải tin nhắn...</p>;

  if (messages.length === 0)
    return <p className="text-center text-gray-400 py-10">Chưa có tin nhắn nào.</p>;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((msg) => {
        const isMine = msg.fromUserId?._id === currentUserId || msg.fromUserId === currentUserId;
        const name = msg.fromUserId?.fullName || msg.fromUserId?.username || "Người dùng";
        const isRead = msg.isRead || msg.read;

        return (
          <div
            key={msg._id}
            className={`group flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                isMine
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {!isMine && <p className="text-xs font-bold text-amber-600 mb-1">{name}</p>}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className={`text-xs ${isMine ? "text-amber-100" : "text-gray-500"}`}>
                  {formatTime(msg.createdAt)}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  {isMine ? (
                    isRead ? (
                      <span className="flex items-center gap-1 text-amber-50">
                        <EyeOutlined /> Đã xem
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-50 opacity-80">
                        <EyeInvisibleOutlined /> Chưa xem
                      </span>
                    )
                  ) : (
                    !isRead && (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <EyeInvisibleOutlined /> Chưa đọc
                      </span>
                    )
                  )}
                </div>
              </div>

              {isMine && (
                <button
                  onClick={() => dispatch(deleteMessage(msg._id))}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                  title="Xóa tin nhắn của bạn"
                >
                  <DeleteOutlined />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;