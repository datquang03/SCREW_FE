import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  getMessagesByConversation,
  createMessage,
  markMessageAsRead,
} from "../../features/message/messageSlice";
import {
  SearchOutlined,
  SendOutlined,
  MessageOutlined,
  PaperClipOutlined,
  CheckOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
};

const MessagePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const {
    conversations = [],
    messages = {},
    loadingConversations,
    loadingMessages,
  } = useSelector((state) => state.message || {});

  const [activeConversation, setActiveConversation] = useState(null);
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) dispatch(getConversations());
  }, [dispatch, user]);

  // Auto pick first conversation when list loads
  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      dispatch(getMessagesByConversation(activeConversation._id));
    }
  }, [dispatch, activeConversation]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
  };

  const conversationMessages =
    (activeConversation &&
      (messages[activeConversation._id]?.messages ||
        messages[activeConversation._id] ||
        activeConversation.messages)) ||
    [];

  const myId = user?._id;

  // Mark unread messages (not mine) as read when viewing a conversation
  useEffect(() => {
    if (!activeConversation) return;
    if (!conversationMessages || conversationMessages.length === 0) return;
    conversationMessages.forEach((m) => {
      const fromId = m.fromUserId?._id || m.fromUserId || m.senderId;
      const isMine = myId && fromId === myId;
      if (!isMine && m._id && !m.isRead && !m.read) {
        dispatch(markMessageAsRead(m._id));
      }
    });
  }, [conversationMessages, activeConversation, myId, dispatch]);

  const getPartnerId = () => {
    if (!activeConversation) return null;
    if (activeConversation.participantId)
      return activeConversation.participantId;
    if (activeConversation.receiverId) return activeConversation.receiverId;
    if (activeConversation.toUserId) return activeConversation.toUserId;
    if (conversationMessages.length > 0) {
      const m = conversationMessages[0];
      const from = m.fromUserId?._id || m.fromUserId;
      const to = m.toUserId?._id || m.toUserId;
      if (myId && from === myId) return to;
      return from || to;
    }
    return null;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim() || !activeConversation) return;
    const toUserId = getPartnerId();
    if (!toUserId) return;
    dispatch(
      createMessage({
        toUserId,
        conversationId: activeConversation._id,
        content: content.trim(),
      })
    );
    setContent("");
  };

  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return conversations;
    return conversations.filter((c) => {
      const name =
        c.name || c.receiverName || c.title || c._id || "Cuộc trò chuyện";
      return name.toLowerCase().includes(keyword);
    });
  }, [conversations, search]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-amber-100 px-6 py-10 text-center">
          <MessageOutlined className="text-3xl text-amber-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Đăng nhập để xem tin nhắn
          </h2>
          <p className="text-gray-500">
            Vui lòng đăng nhập để tiếp tục cuộc trò chuyện của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-500 font-semibold">
          Messages
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Hộp thư
        </h1>
        <p className="text-gray-500 mt-1">
          Thiết kế kiểu Google Messages: rõ ràng, tươi sáng, dễ nhìn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6">
        {/* Sidebar */}
        <div className="rounded-3xl bg-white/90 backdrop-blur shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <MessageOutlined />
            </div>
            <div>
              <p className="text-sm text-gray-500">Danh sách chat</p>
              <p className="text-base font-semibold text-gray-900">
                {conversations.length} cuộc trò chuyện
              </p>
            </div>
          </div>

          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2 border border-gray-100">
              <SearchOutlined className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên hoặc mã cuộc trò chuyện..."
                className="w-full bg-transparent text-sm outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-2 pb-4">
            {loadingConversations ? (
              <div className="px-3 py-6 text-sm text-gray-500">Đang tải...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-3 py-6 text-sm text-gray-500">
                Không tìm thấy cuộc trò chuyện.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive =
                  activeConversation && activeConversation._id === conv._id;
                const unread = conv.unreadCount || 0;
                const name =
                  conv.name ||
                  conv.receiverName ||
                  conv.title ||
                  "Cuộc trò chuyện";
                const lastContent =
                  conv.lastMessage?.content ||
                  conv.lastMessageText ||
                  conv.lastMessage ||
                  "Chưa có tin nhắn";
                const lastTime = formatTime(conv.lastMessage?.createdAt);
                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-start gap-3 rounded-2xl px-3 py-3 text-left transition border ${
                      isActive
                        ? "bg-amber-50/80 border-amber-200 shadow-sm"
                        : "bg-white hover:bg-gray-50 border-transparent"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white font-semibold">
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {name}
                        </p>
                        {unread > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {unread} mới
                          </span>
                        )}
                        {conv.bookingId && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-semibold">
                            Booking
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {lastContent}
                      </p>
                    </div>
                    <div className="text-[11px] text-gray-400">{lastTime}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="rounded-3xl bg-white/95 backdrop-blur shadow-xl border border-gray-100 flex flex-col overflow-hidden min-h-[70vh]">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold">
                Chat
              </p>
              <h2 className="text-xl font-bold text-gray-900">
                {activeConversation
                  ? activeConversation.name ||
                    activeConversation.receiverName ||
                    "Cuộc trò chuyện"
                  : "Chọn cuộc trò chuyện"}
              </h2>
              {activeConversation?.bookingId && (
                <p className="text-xs text-emerald-600 mt-1 font-semibold">
                  Booking: {activeConversation.bookingId}
                </p>
              )}
            </div>
            {loadingMessages && (
              <span className="text-xs text-gray-500">Đang tải...</span>
            )}
          </div>

          <div className="flex-1 bg-gradient-to-b from-white via-slate-50 to-white p-4 md:p-6 overflow-y-auto custom-scrollbar">
            {!activeConversation ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Chọn một cuộc trò chuyện để bắt đầu.
              </div>
            ) : conversationMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Chưa có tin nhắn.
              </div>
            ) : (
              <div className="space-y-3">
                {conversationMessages.map((msg) => {
                  const fromId =
                    msg.fromUserId?._id || msg.fromUserId || msg.senderId;
                  const fromName =
                    msg.fromUserId?.fullName ||
                    msg.fromUserId?.username ||
                    msg.senderName ||
                    msg.senderId ||
                    "Người dùng";
                  const isMine = myId && fromId === myId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex w-full ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border ${
                          isMine
                            ? "bg-amber-500 text-white border-amber-400"
                            : "bg-white text-gray-800 border-gray-100"
                        }`}
                      >
                        {!isMine && (
                          <div className="text-[11px] text-amber-600 font-semibold mb-1">
                            {fromName}
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </div>
                        <div
                          className={`text-[11px] mt-1 ${
                            isMine ? "text-amber-50/90" : "text-gray-400"
                          }`}
                        >
                          <span>{formatTime(msg.createdAt)}</span>
                          {isMine && (
                            <span className="ml-2 inline-flex items-center gap-1">
                              {msg.isRead || msg.read ? (
                                <CheckCircleFilled className="text-white drop-shadow-sm" />
                              ) : (
                                <CheckOutlined />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 bg-white px-4 md:px-6 py-4 flex items-center gap-3"
          >
            <button
              type="button"
              className="h-11 w-11 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center"
            >
              <PaperClipOutlined />
            </button>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2 focus-within:border-amber-300 focus-within:bg-white transition">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!activeConversation || !content.trim()}
              className="h-11 px-4 rounded-2xl bg-amber-500 text-white font-semibold shadow-md hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SendOutlined />
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
