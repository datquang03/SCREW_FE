// src/pages/Message/components/MessageSidebar.jsx
import React, { useState, useMemo } from "react";
import { SearchOutlined, MessageOutlined, EyeOutlined } from "@ant-design/icons";

const formatTime = (date) =>
  date ? new Date(date).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "";

// Skeleton cho conversation item
const ConversationSkeleton = () => (
  <div className="w-full p-4 rounded-2xl border border-gray-100 mb-2 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  </div>
);

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
            <p className="font-bold">
              {loading ? (
                <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                `${conversations.length} cuộc trò chuyện`
              )}
            </p>
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
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {loading ? (
          <div className="py-2">
            {[...Array(5)].map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Không có cuộc trò chuyện</p>
        ) : (
          filtered.map((conv) => {
            const convId = conv._id || conv.conversationId || "";
            const isActive = activeConversation?._id === convId;
            const name = conv.name || conv.receiverName || "Người dùng";
            const avatar = conv.avatar || conv.partnerUser?.avatar;
            const lastMsg = conv.lastMessage?.content || "Chưa có tin nhắn";
            const unread = conv.unreadCount || 0;

            return (
              <button
                key={conv._id}
                onClick={() => onSelect({ ...conv, _id: convId })}
                className={`w-full text-left p-4 rounded-2xl transition mb-2 border ${
                  isActive
                    ? "bg-amber-50 border-amber-200"
                    : unread > 0
                    ? "bg-blue-50 border-blue-100 hover:bg-blue-100"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold flex-center">
                      {name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{name}</p>
                      {unread > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <EyeOutlined className="text-[10px]" /> {unread}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        unread > 0 ? "text-gray-700 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {lastMsg}
                    </p>
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