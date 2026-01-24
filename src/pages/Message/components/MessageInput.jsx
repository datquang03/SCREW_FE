// src/pages/Message/components/MessageInput.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createMessage } from "../../../features/message/messageSlice";
import { getSocket } from "../../../api/socketInstance";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

const MessageInput = ({ conversation, currentUserId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const typingTimeoutRef = React.useRef(null);

  // Emit typing event
  const handleTyping = (text) => {
    setContent(text);
    
    const socket = getSocket();
    if (socket && socket.connected) {
      if (!typingTimeoutRef.current) {
        socket.emit("typing", {
          room: conversation.bookingId || conversation.conversationId || conversation._id,
          userId: currentUserId,
          isTyping: true
        });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
           room: conversation.bookingId || conversation.conversationId || conversation._id,
           userId: currentUserId,
           isTyping: false
        });
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  // Lấy partnerId từ nhiều nguồn khác nhau
  const getPartnerId = () => {
    const myId = currentUserId;
    
    // Thử từ participants
    if (conversation.participants?.length) {
      const partner = conversation.participants.find(
        (p) => (p?._id || p) !== myId
      );
      if (partner) return partner._id || partner;
    }
    
    // Thử từ participant
    if (conversation.participant) {
      const pid = conversation.participant._id || conversation.participant;
      if (pid !== myId) return pid;
    }
    
    // Thử từ partnerUser
    if (conversation.partnerUser) {
      const pid = conversation.partnerUser._id || conversation.partnerUser;
      if (pid !== myId) return pid;
    }
    
    // Thử từ lastMessage
    if (conversation.lastMessage) {
      const fromId = conversation.lastMessage.fromUserId?._id || conversation.lastMessage.fromUserId;
      const toId = conversation.lastMessage.toUserId?._id || conversation.lastMessage.toUserId;
      if (fromId === myId && toId) return toId;
      if (toId === myId && fromId) return fromId;
    }
    
    // Thử parse từ conversationId (nếu có format id_id)
    if (conversation.conversationId || conversation._id) {
      const convId = conversation.conversationId || conversation._id;
      if (typeof convId === "string" && convId.includes("_")) {
        const ids = convId.split("_");
        const otherId = ids.find(id => id !== myId);
        if (otherId) return otherId;
      }
    }
    
    return null;
  };

  const partnerId = getPartnerId();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !partnerId) {
      console.warn("Cannot send message: missing content or partnerId", { content, partnerId, conversation });
      return;
    }

    try {
      await dispatch(
        createMessage({
          toUserId: partnerId,
          content: content.trim(),
        })
      ).unwrap();
      setContent("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-3">
      <button 
        type="button" 
        className="px-3 py-2 border border-slate-300 text-slate-600 hover:border-[#C5A267] hover:text-[#C5A267] transition"
      >
        <PaperClipOutlined />
      </button>
      <input
        value={content}
        onChange={(e) => handleTyping(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-1 px-4 py-3 bg-[#FCFBFA] outline-none focus:bg-white focus:border-[#C5A267] border border-slate-200 text-[#0F172A]"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="px-6 py-3 flex items-center gap-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: content.trim() ? '#A0826D' : '#e2e8f0',
          color: content.trim() ? 'white' : '#64748b',
          borderColor: content.trim() ? '#A0826D' : '#e2e8f0',
        }}
        onMouseEnter={(e) => {
          if (content.trim()) {
            e.currentTarget.style.backgroundColor = '#8B7355';
            e.currentTarget.style.borderColor = '#8B7355';
          }
        }}
        onMouseLeave={(e) => {
          if (content.trim()) {
            e.currentTarget.style.backgroundColor = '#A0826D';
            e.currentTarget.style.borderColor = '#A0826D';
          }
        }}
      >
        <SendOutlined /> Gửi
      </button>
    </form>
  );
};

export default MessageInput;