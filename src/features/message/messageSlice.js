// src/features/message/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Helpers ------------------------------------------------
const extractIdsFromString = (str) => {
  if (!str || typeof str !== "string") return [];
  const ids = [];
  // Tìm tất cả ObjectId trong string
  const regex = /ObjectId\('([0-9a-fA-F]{24})'\)/g;
  let m;
  while ((m = regex.exec(str)) !== null) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  // Nếu đã có đủ 2 ID, return
  if (ids.length >= 2) return ids;
  
  // Fallback: tìm tất cả các chuỗi 24 ký tự hex
  const fallback = str.match(/[0-9a-fA-F]{24}/g);
  if (fallback) {
    fallback.forEach((id) => {
      if (!ids.includes(id)) ids.push(id);
    });
  }
  return ids;
};

// Kiểm tra xem một string có phải là conversation ID hợp lệ không
const isValidConversationId = (str) => {
  if (!str || typeof str !== "string") return false;
  // Conversation ID hợp lệ: 2 ObjectId (24 ký tự mỗi cái) được join bằng "_"
  // Format: "6916b10ddd40e9e31c5c2a1d_6916bac2dd40e9e31c5c2b17" (49 ký tự)
  const pattern = /^[0-9a-fA-F]{24}_[0-9a-fA-F]{24}$/;
  return pattern.test(str);
};

const normalizeConversationId = (conv) => {
  if (!conv) return "";

  // Kiểm tra conversationId trước (nếu có và hợp lệ)
  if (typeof conv.conversationId === "string" && isValidConversationId(conv.conversationId)) {
    return conv.conversationId;
  }

  // Kiểm tra _id: chỉ return nếu nó là conversation ID hợp lệ
  if (typeof conv._id === "string") {
    // Nếu _id là conversation ID hợp lệ (format: id_id), return ngay
    if (isValidConversationId(conv._id)) {
      return conv._id;
    }
    
    // Nếu _id là string dài chứa object (như backend đang trả về), parse nó
    if (conv._id.length > 80 || conv._id.includes("ObjectId") || conv._id.includes("}-{")) {
      const parsed = extractIdsFromString(conv._id);
      if (parsed.length >= 2) {
        return parsed.sort().join("_");
      }
    }
  }

  // Thử lấy từ participants
  const participantIds =
    conv.participants?.map((p) => p?._id || p).filter(Boolean) || [];
  if (participantIds.length >= 2) {
    const normalized = participantIds.map(id => String(id).trim()).filter(Boolean);
    if (normalized.length >= 2) {
      return normalized.sort().join("_");
    }
  }

  // Thử lấy từ lastMessage
  const last = conv.lastMessage || conv;
  const from = last?.fromUserId?._id || last?.fromUserId;
  const to = last?.toUserId?._id || last?.toUserId;
  if (from && to) {
    const fromId = String(from).trim();
    const toId = String(to).trim();
    if (fromId && toId) {
      return [fromId, toId].sort().join("_");
    }
  }

  return "";
};

/* =====================================================
   ASYNC THUNKS
===================================================== */

export const createMessage = createAsyncThunk(
  "message/createMessage",
  async ({ toUserId, content, conversationId: payloadConvId }, { rejectWithValue, getState }) => {
    try {
      const { token, user } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post(
        "/messages",
        { toUserId, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const messageData = response.data.data;
      const currentUserId = user?._id || user?.id;
      const conversationId =
        payloadConvId ||
        messageData.conversationId ||
        [currentUserId, toUserId].filter(Boolean).sort().join("_");

      // Chỉ return message data từ backend + conversationId (không thêm currentUserId vào message object)
      return {
        ...messageData,
        conversationId,
        // Lưu currentUserId riêng để dùng trong reducer (không merge vào message)
        _currentUserId: currentUserId,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi tin nhắn thất bại" }
      );
    }
  }
);

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get("/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách chat" }
      );
    }
  }
);

export const getMessagesByConversation = createAsyncThunk(
  "message/getMessagesByConversation",
  async (conversationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get(
        `/messages/conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        conversationId,
        messages: response.data.data?.messages || response.data.data || [],
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải tin nhắn" }
      );
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "message/markMessageAsRead",
  async (messageId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.put(
        `/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { messageId, data: response.data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể đánh dấu đã đọc" }
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      await axiosInstance.delete(`/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return messageId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể xóa tin nhắn" }
      );
    }
  }
);

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
  conversations: [], // danh sách các cuộc trò chuyện
  messages: {}, // { [conversationId]: [...] } – lưu tin nhắn theo conversation
  loading: false, // loading chung (send, delete, mark read...)
  loadingConversations: false, // loading danh sách conversations
  loadingMessages: false, // loading tin nhắn của 1 conversation
  error: null,
};

/* =====================================================
   SLICE
===================================================== */
const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [],
    messages: {},
    loading: false,
    loadingConversations: false,
    loadingMessages: false,
    error: null,
  },
  reducers: {
    clearMessageError: (state) => {
      state.error = null;
    },
    clearMessagesByConversation: (state, action) => {
      delete state.messages[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE MESSAGE
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Lấy message từ payload (backend trả về đầy đủ thông tin)
        const payload = action.payload;
        const currentUserId = payload._currentUserId; // Lấy từ payload riêng
        // Tách message ra, loại bỏ _currentUserId
        const { _currentUserId, ...message } = payload;
        
        // Đảm bảo conversationId được tính đúng
        const fromId = message.fromUserId?._id || message.fromUserId;
        const toId = message.toUserId?._id || message.toUserId;
        const convId = 
          message.conversationId || 
          (fromId && toId ? [fromId, toId].filter(Boolean).sort().join("_") : normalizeConversationId(message));

        // Lưu message vào state với đầy đủ thông tin từ backend (không có _currentUserId)
        if (!state.messages[convId]) state.messages[convId] = [];
        
        // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
        const existingIndex = state.messages[convId].findIndex(m => m._id === message._id);
        if (existingIndex >= 0) {
          // Update message nếu đã tồn tại
          state.messages[convId][existingIndex] = message;
        } else {
          // Push message mới với đầy đủ thông tin từ backend (gọn gàng, không có thông tin thừa)
          state.messages[convId].push(message);
        }

        // Cập nhật conversation trong danh sách
        const from = message.fromUserId;
        const to = message.toUserId;
        const existsIdx = state.conversations.findIndex(
          (c) => {
            const cId = normalizeConversationId(c);
            return cId === convId || c._id === convId || c.conversationId === convId;
          }
        );
        
        // Xác định partner user (người không phải current user)
        const partner = 
          (fromId === currentUserId ? to : from) ||
          (toId === currentUserId ? from : to) ||
          to ||
          from ||
          {};
        
        const convPayload = {
          _id: convId,
          conversationId: convId,
          lastMessage: message, // Message gọn gàng từ backend
          participants: [from, to].filter(Boolean),
          partnerUser: partner,
          name: partner?.fullName || partner?.username || "Người dùng",
          avatar: partner?.avatar,
        };
        
        if (existsIdx >= 0) {
          // Update conversation hiện có
          state.conversations[existsIdx] = {
            ...state.conversations[existsIdx],
            ...convPayload,
          };
        } else {
          // Thêm conversation mới
          state.conversations.unshift(convPayload);
        }
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Gửi tin nhắn thất bại";
      })

      // GET CONVERSATIONS
      .addCase(getConversations.pending, (state) => {
        state.loadingConversations = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.conversations = list.map((c) => {
          const convId = normalizeConversationId(c);
          return {
            ...c,
            _id: convId || c._id,
            conversationId: convId || c.conversationId,
          };
        });
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload?.message;
      })

      // GET MESSAGES BY CONVERSATION
      .addCase(getMessagesByConversation.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(getMessagesByConversation.fulfilled, (state, action) => {
        state.loadingMessages = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = Array.isArray(messages)
          ? messages
          : [];
      })
      .addCase(getMessagesByConversation.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload?.message;
      })

      // MARK AS READ – ĐÃ CÓ LẠI
      .addCase(markMessageAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId } = action.payload;
        Object.values(state.messages).forEach((conv) => {
          const msg = conv.find((m) => m._id === messageId);
          if (msg) msg.isRead = true;
        });
      })
      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // DELETE MESSAGE – ĐÃ CÓ LẠI
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const messageId = action.payload;
        Object.keys(state.messages).forEach((convId) => {
          state.messages[convId] = state.messages[convId].filter(
            (m) => m._id !== messageId
          );
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearMessageError, clearMessagesByConversation } =
  messageSlice.actions;

export default messageSlice.reducer;
