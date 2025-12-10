// src/pages/Message/components/MessageSidebar.jsx
import React, { useState, useMemo } from "react";
import { SearchOutlined, MessageOutlined } from "@ant-design/icons";

const formatTime = (date) =>
  date ? new Date(date).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "";

const MessageSidebar = ({ conversations, activeConversation, onSelect, loading }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return conversations;
    const kw = search.toLowerCase();
    return conversations.filter((c) => {
      const name = c.name || c.receiverName || "";
      return name.toLowerCase().includes(kw);
    });
  }, [conversations, search]);

  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex-center">
            <MessageOutlined className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Danh sách chat</p>
            <p className="font-bold">{conversations.length} cuộc trò chuyện</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border">
          <SearchOutlined className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Không có cuộc trò chuyện</p>
        ) : (
          filtered.map((conv) => {
            const isActive = activeConversation?._id === conv._id;
            const name = conv.name || conv.receiverName || "Người dùng";
            const lastMsg = conv.lastMessage?.content || "Chưa có tin nhắn";
            const unread = conv.unreadCount || 0;

            return (
              <button
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`w-full text-left p-4 rounded-2xl transition mb-2 ${
                  isActive ? "bg-amber-50 border border-amber-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold flex-center">
                    {name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{name}</p>
                      {unread > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{lastMsg}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(conv.lastMessage?.createdAt)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageSidebar;