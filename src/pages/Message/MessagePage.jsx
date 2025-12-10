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

  // Load danh sách chat
  useEffect(() => {
    if (user) dispatch(getConversations());
  }, [dispatch, user]);

  // Tự động chọn cuộc chat nếu có ?user=...
  useEffect(() => {
    if (!targetUserId || !conversations.length || activeConversation) return;

    const found = conversations.find((conv) =>
      (conv.participants || []).some((p) => (p._id || p) === targetUserId)
    );

    if (found) {
      setActiveConversation(found);
      navigate("/message", { replace: true });
    }
  }, [conversations, targetUserId, activeConversation, navigate]);

  // Load tin nhắn khi chọn chat
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(getMessagesByConversation(activeConversation._id));
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
          conversations={conversations}
          activeConversation={activeConversation}
          onSelect={setActiveConversation}
          loading={loadingConversations}
        />

        {/* Chat Area */}
        <div className="flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {activeConversation ? (
            <>
              <MessageHeader conversation={activeConversation} />
              <MessageList
                messages={messages[activeConversation._id] || []}
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