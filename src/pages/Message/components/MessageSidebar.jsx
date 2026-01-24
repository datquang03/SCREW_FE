// src/pages/Message/components/MessageSidebar.jsx
import React, { useState, useMemo } from "react";
import { SearchOutlined, MessageOutlined, EyeOutlined } from "@ant-design/icons";

const formatTime = (date) =>
  date ? new Date(date).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "";

// Skeleton cho conversation item
const ConversationSkeleton = () => (
  <div className="w-full p-4 border border-slate-100 mb-2 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 w-24" />
          <div className="h-3 bg-gray-200 w-12" />
        </div>
        <div className="h-3 bg-gray-200 w-full" />
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
    <div className="bg-white border border-slate-200 shadow-lg flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A267] text-white shadow-md border-2 border-[#C5A267] flex items-center justify-center">
            <MessageOutlined className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-slate-600 uppercase tracking-wider">Danh sách chat</p>
            <p className="font-bold text-[#0F172A]">
              {loading ? (
                <span className="inline-block h-4 w-16 bg-gray-200 animate-pulse" />
              ) : (
                `${conversations.length} cuộc trò chuyện`
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 bg-[#FCFBFA] px-4 py-2 border border-slate-200 hover:border-[#C5A267] transition">
          <SearchOutlined className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="flex-1 outline-none text-sm bg-transparent text-[#0F172A]"
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
                className={`w-full text-left p-4 transition mb-2 border ${
                  isActive
                    ? "bg-[#FCFBFA] border-[#C5A267] border-2"
                    : unread > 0
                    ? "bg-[#FCFBFA] border-[#10b981] hover:bg-white"
                    : "border-slate-100 hover:bg-[#FCFBFA] hover:border-[#A0826D]"
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
                    <div className="w-10 h-10 bg-[#C5A267] text-white font-bold flex items-center justify-center border-2 border-[#C5A267]">
                      {name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate text-[#0F172A]">{name}</p>
                      {unread > 0 && (
                        <span className="text-xs bg-[#10b981] text-white px-2 py-0.5 flex items-center gap-1 font-semibold">
                          <EyeOutlined className="text-[10px]" /> {unread}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        unread > 0 ? "text-[#0F172A] font-semibold" : "text-slate-500"
                      }`}
                    >
                      {lastMsg}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
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