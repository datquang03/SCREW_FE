// src/pages/Message/MessagePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import {
  getConversations,
  getMessagesByConversation,
  createMessage,
  markMessageAsRead,
  initializeSocket,
  setupSocketListeners,
} from "../../features/message/messageSlice";
import { disconnectSocket } from "../../api/socketInstance";

import MessageSidebar from "./components/MessageSidebar";
import MessageHeader from "./components/MessageHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import EmptyState from "./components/EmptyState";
import { LeftOutlined } from "@ant-design/icons";

const MessagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, token } = useSelector((state) => state.auth || {});
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
  // Normalize về format "-" để nhất quán với backend
  const normalizeConversationId = (conv) => {
    if (!conv) return "";

    // Nếu _id hoặc conversationId đã có, normalize format (chuyển "_" thành "-")
    if (typeof conv._id === "string") {
      const normalized = conv._id.replace(/_/g, "-");
      // Kiểm tra xem có phải conversation ID hợp lệ không (2 ObjectId cách nhau bởi - hoặc _)
      if (/^[0-9a-fA-F]{24}[_-][0-9a-fA-F]{24}$/.test(conv._id)) {
        return normalized;
      }
    }
    if (typeof conv.conversationId === "string") {
      return conv.conversationId.replace(/_/g, "-");
    }

    // Tạo conversation ID từ participants
    const ids = (conv.participants || [])
      .map((p) => p?._id || p)
      .filter(Boolean)
      .map((id) => String(id).trim());
    if (ids.length >= 2) return ids.sort().join("-");

    // Tạo từ lastMessage
    const last = conv.lastMessage;
    const from = last?.fromUserId?._id || last?.fromUserId;
    const to = last?.toUserId?._id || last?.toUserId;
    if (from && to)
      return [String(from).trim(), String(to).trim()].sort().join("-");

    // Try to parse weird _id string
    if (typeof conv._id === "string") {
      const parsed = extractIdsFromString(conv._id);
      if (parsed.length >= 2) return parsed.sort().join("-");
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
        partner.fullName ||
        partner.username ||
        conv.name ||
        conv.receiverName ||
        "Người dùng";
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

  // Initialize socket và setup listeners
  useEffect(() => {
    if (!token) return;

    // Initialize socket với token
    initializeSocket(token);

    // Setup listeners với dispatch và getState
    setupSocketListeners(dispatch, () => {
      // Return state structure mà socket listeners cần
      return {};
    });

    // Cleanup khi unmount
    return () => {
      disconnectSocket();
    };
  }, [dispatch, token]);

  // Load danh sách chat
  useEffect(() => {
    if (user) dispatch(getConversations());
  }, [dispatch, user]);

  // Tự động chọn cuộc chat nếu có ?user=...
  useEffect(() => {
    if (!targetUserId || !displayConversations.length || activeConversation)
      return;

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

  // Loading chung khi đang tải lần đầu
  const initialLoading =
    loadingConversations && displayConversations.length === 0;

  return (
    <div className="h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-amber-600"
          >
            <LeftOutlined /> Quay về
          </button>
          <p className="text-sm uppercase tracking-widest text-amber-600 font-bold">
            Messages
          </p>
          <div />
        </div>

        {initialLoading ? (
          <div className="flex items-center justify-center flex-1 min-h-0 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="text-center">
              <Spin
                size="large"
                tip={
                  <span className="text-amber-600 font-semibold text-base">
                    Đang tải tin nhắn...
                  </span>
                }
              >
                <div className="w-32 h-32" />
              </Spin>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-3">
            {/* Sidebar chiếm bên trái */}
            <div className="w-full max-w-[360px] flex-shrink-0 h-full">
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
            </div>

            {/* Chat Area bên phải */}
            <div className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {activeConversation ? (
                <>
                  <MessageHeader conversation={activeConversation} />
                  <MessageList
                    messages={
                      messages[normalizeConversationId(activeConversation)] ||
                      []
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
        )}
      </div>
    </div>
  );
};

export default MessagePage;
