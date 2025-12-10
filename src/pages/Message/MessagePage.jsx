// src/pages/Message/MessagePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getConversations,
  getMessagesByConversation,
  createMessage,
  markMessageAsRead,
} from "../../features/message/messageSlice";

import MessageSidebar from "./components/MessageSidebar";
import MessageHeader from "./components/MessageHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import EmptyState from "./components/EmptyState";

const MessagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useSelector((state) => state.auth || {});
  const { conversations, messages, loadingConversations, loadingMessages } =
    useSelector((state) => state.message || {});

  const [activeConversation, setActiveConversation] = useState(null);
  const targetUserId = searchParams.get("user");

  // Helper: normalize conversation id from various shapes
  const extractIdsFromString = (str) => {
    if (!str || typeof str !== "string") return [];
    const ids = [];
    const regex = /ObjectId\('([0-9a-fA-F]{24})'\)/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      ids.push(match[1]);
    }
    if (ids.length >= 2) return ids;
    // fallback: try split by "}-{" pattern
    const split = str.split("}-{");
    split.forEach((part) => {
      const m = /([0-9a-fA-F]{24})/.exec(part);
      if (m && !ids.includes(m[1])) ids.push(m[1]);
    });
    return ids;
  };

  // Helper: normalize conversation id from various shapes / malformed backend _id
  const normalizeConversationId = (conv) => {
    if (!conv) return "";
    if (typeof conv._id === "string") return conv._id;
    if (typeof conv.conversationId === "string") return conv.conversationId;
    const ids = (conv.participants || [])
      .map((p) => p?._id || p)
      .filter(Boolean);
    if (ids.length >= 2) return ids.sort().join("_");
    const last = conv.lastMessage;
    const from = last?.fromUserId?._id || last?.fromUserId;
    const to = last?.toUserId?._id || last?.toUserId;
    if (from && to) return [from, to].sort().join("_");
    // Try to parse weird _id string
    if (typeof conv._id === "string") {
      const parsed = extractIdsFromString(conv._id);
      if (parsed.length >= 2) return parsed.sort().join("_");
    }
    return "";
  };

  const displayConversations = React.useMemo(() => {
    const myId = user?._id || user?.id;
    return (conversations || []).map((conv) => {
      const convId = normalizeConversationId(conv);
      const last = conv.lastMessage;
      const from = last?.fromUserId;
      const to = last?.toUserId;
      const partner =
        (from && (from._id || from) !== myId && from) ||
        (to && (to._id || to) !== myId && to) ||
        (conv.participants || []).find((p) => (p?._id || p) !== myId) ||
        {};
      const name =
        partner.fullName || partner.username || conv.name || conv.receiverName || "Người dùng";
      const avatar = partner.avatar;
      return {
        ...conv,
        _id: convId || conv._id,
        conversationId: convId || conv.conversationId,
        partnerUser: partner,
        participant: partner,
        name,
        receiverName: name,
        avatar,
      };
    });
  }, [conversations, user]);

  // Load danh sách chat
  useEffect(() => {
    if (user) dispatch(getConversations());
  }, [dispatch, user]);

  // Tự động chọn cuộc chat nếu có ?user=...
  useEffect(() => {
    if (!targetUserId || !displayConversations.length || activeConversation) return;

    const found = displayConversations.find((conv) =>
      (conv.participants || []).some((p) => (p._id || p) === targetUserId)
    );

    if (found) {
      setActiveConversation(found);
      navigate("/message", { replace: true });
    }
  }, [displayConversations, targetUserId, activeConversation, navigate]);

  // Load tin nhắn khi chọn chat
  useEffect(() => {
    const convId = normalizeConversationId(activeConversation);
    if (convId) {
      dispatch(getMessagesByConversation(convId));
    }
  }, [activeConversation, dispatch]);

  // Đánh dấu đã đọc
  useEffect(() => {
    if (!activeConversation || !messages[activeConversation._id]) return;
    const myId = user?._id;
    messages[activeConversation._id].forEach((msg) => {
      const fromId = msg.fromUserId?._id || msg.fromUserId;
      if (fromId !== myId && !msg.isRead) {
        dispatch(markMessageAsRead(msg._id));
      }
    });
  }, [messages, activeConversation, user, dispatch]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-700">
          Vui lòng đăng nhập để xem tin nhắn
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-amber-600 font-bold">
          Messages
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2">Hộp thư</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[78vh]">
        {/* Sidebar */}
        <MessageSidebar
          conversations={displayConversations}
          activeConversation={activeConversation}
          onSelect={(conv) =>
            setActiveConversation({
              ...conv,
              _id: normalizeConversationId(conv),
            })
          }
          loading={loadingConversations}
        />

        {/* Chat Area */}
        <div className="flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {activeConversation ? (
            <>
              <MessageHeader conversation={activeConversation} />
              <MessageList
                messages={
                  messages[normalizeConversationId(activeConversation)] || []
                }
                currentUserId={user._id}
                loading={loadingMessages}
              />
              <MessageInput
                conversation={activeConversation}
                currentUserId={user._id}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;