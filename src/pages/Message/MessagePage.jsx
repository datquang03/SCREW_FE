// src/pages/Message/MessagePage.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
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
import { disconnectSocket, getSocket } from "../../api/socketInstance";

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
  const activeConversationRef = useRef(activeConversation);
  const [isTyping, setIsTyping] = useState(false);
  const targetUserId = searchParams.get("user");

  // Update ref when activeConversation changes
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

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

    // Ưu tiên sử dụng bookingId hoặc conversationId nếu đó là ID đơn (ví dụ 24 ký tự - cho booking/group chat)
    if (conv.bookingId) return conv.bookingId;
    if (conv.conversationId && conv.conversationId.length === 24) return conv.conversationId;

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

  const displayConversations = useMemo(() => {
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
    const socket = initializeSocket(token);

    // Kích hoạt user room (thử các event name phổ biến để đảm bảo backend nhận diện)
    if (socket && user?._id) {
      socket.emit("setup", user._id);
      socket.emit("join", user._id);
      socket.emit("addUser", user._id);
      
      // Debug lắng nghe tất cả sự kiện
      socket.onAny((event, ...args) => {
        console.log(`[Socket Debug] Event: ${event}`, args);
      });

      // Listen for typing events
      socket.on("typing", ({ room, userId, isTyping }) => {
          // Check if typing event is for the CURRENT active conversation
          // If room is provided, compare it. If not, use generic check.
          // The sender sends: { room, userId, isTyping }
          
          if (userId === user?._id || userId === user?.id) return;
          
          const currentConv = activeConversationRef.current;
          if (!currentConv) return;
          
          const currentRoomId = currentConv.bookingId || currentConv.conversationId || normalizeConversationId(currentConv);
          const normalizedRoom = normalizeConversationId(currentConv); // fallback format
          
          // Match room logic:
          // 1. Exact match with room ID sent from client
          // 2. Match with normalized conversation ID
          if (room === currentRoomId || room === normalizedRoom || isTyping === false) { 
             setIsTyping(isTyping);
          }
      });
      
      // Lắng nghe notification để refresh tin nhắn khi có thông báo mới (fallback nếu realtime message fail)
      socket.on("notification", (data) => {
        console.log("Received notification via socket:", data);
        // NẾU notification có chứa dữ liệu message đầy đủ -> gọi action addMessage
        if (data && data.messageData) {
            dispatch(addMessageFromSocket(data.messageData));
            return;
        }

        // Kiểm tra nếu là thông báo tin nhắn mới
        if (data && (data.title === "Tin nhắn mới" || (typeof data.message === 'string' && data.message.includes("tin nhắn")))) {
          // Chỉ refresh conversation list để update thứ tự
          dispatch(getConversations());
          
          // Fetch message mới nhất (nhưng không hiện loading spinner) để đảm bảo message được thêm vào
          const currentConv = activeConversationRef.current;
          if (currentConv) {
            const convId = normalizeConversationId(currentConv);
            if (convId) {
              dispatch(getMessagesByConversation({ 
                conversationId: convId, 
                isSilent: true 
              }));
            }
          }
        }
      });
    }

    // Setup listeners với dispatch và getState
    setupSocketListeners(dispatch, () => {
      // Return state structure mà socket listeners cần
      return {};
    });

    // Cleanup khi unmount
    return () => {
      if (socket) {
        socket.offAny(); 
        socket.off("notification");
      }
      disconnectSocket();
    };
  }, [dispatch, token, user]);

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

      // Tham gia vào room chat (Booking hoặc Private)
      const socket = getSocket();
      if (socket && socket.connected) {
        // Nếu là booking chat thì dùng bookingId, ngược lại dùng ID conversation
        // Lưu ý: với DM, Backend đang emit tới room "userid-userid" nên emit join với convId (đã normalized là userid-userid) là đúng.
        const roomId = activeConversation?.bookingId || convId;
        console.log("Clients joining socket room:", roomId);
        socket.emit("join", roomId);
      }
    }
  }, [activeConversation, dispatch]);

  // Đánh dấu đã đọc
  useEffect(() => {
    // 1. Xác định ID conversation chuẩn
    const convId = normalizeConversationId(activeConversation);
    if (!activeConversation || !convId) return;
    
    // 2. Lấy list message từ store theo ID chuẩn
    const currentMessages = messages[convId];
    if (!currentMessages || !Array.isArray(currentMessages)) return;

    const myId = user?._id || user?.id;
    if (!myId) return;

    // 3. Lọc và mark read
    currentMessages.forEach((msg) => {
      const fromId = msg.fromUserId?._id || msg.fromUserId;
      // Convert to String để so sánh chính xác (tránh lỗi ObjectId object vs string)
      const isPartnerMessage = fromId && String(fromId) !== String(myId);
      const isUnread = !msg.isRead && !msg.read; // Check cả 2 trường hợp key

      if (isPartnerMessage && isUnread) {
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
    <div className="h-screen bg-[#FCFBFA]">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:text-[#C5A267] transition"
          >
            <LeftOutlined /> Quay về
          </button>
          <p className="text-sm uppercase tracking-widest text-[#C5A267] font-bold">
            Messages
          </p>
          <div />
        </div>

        {initialLoading ? (
          <div className="flex items-center justify-center flex-1 min-h-0 bg-white border border-slate-200 shadow-lg">
            <div className="text-center">
              <Spin
                size="large"
                tip={
                  <span className="text-[#C5A267] font-semibold text-base">
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
                loading={loadingConversations}isTyping={isTyping} 
              />
            </div>

            {/* Chat Area bên phải */}
            <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 shadow-lg overflow-hidden">
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
