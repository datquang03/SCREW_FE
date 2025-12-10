// src/pages/Message/components/MessageInput.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createMessage } from "../../../features/message/messageSlice";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

const MessageInput = ({ conversation, currentUserId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const partnerId =
    conversation.participants?.find((p) => (p._id || p) !== currentUserId)?._id ||
    conversation.participant?._id;

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim() || !partnerId) return;

    dispatch(
      createMessage({
        toUserId: partnerId,
        content: content.trim(),
      })
    );
    setContent("");
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t flex gap-3">
      <button type="button" className="btn-icon">
        <PaperClipOutlined />
      </button>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:border-amber-300 border"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="btn-primary flex items-center gap-2"
      >
        <SendOutlined /> Gửi
      </button>
    </form>
  );
};

export default MessageInput;