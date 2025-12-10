// src/pages/Message/components/MessageList.jsx
const formatTime = (date) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const MessageList = ({ messages, currentUserId, loading }) => {
  if (loading) return <p className="text-center text-gray-400">Đang tải tin nhắn...</p>;

  if (messages.length === 0)
    return <p className="text-center text-gray-400 py-10">Chưa có tin nhắn nào.</p>;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((msg) => {
        const isMine = msg.fromUserId?._id === currentUserId || msg.fromUserId === currentUserId;
        const name = msg.fromUserId?.fullName || msg.fromUserId?.username || "Người dùng";

        return (
          <div
            key={msg._id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                isMine
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {!isMine && <p className="text-xs font-bold text-amber-600 mb-1">{name}</p>}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${isMine ? "text-amber-100" : "text-gray-500"}`}>
                {formatTime(msg.createdAt)}
                {isMine && msg.isRead && " Đã xem"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;