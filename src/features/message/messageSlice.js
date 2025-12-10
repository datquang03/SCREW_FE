// src/features/message/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =====================================================
   ASYNC THUNKS
===================================================== */

export const createMessage = createAsyncThunk(
  "message/createMessage",
  async ({ toUserId, content }, { rejectWithValue, getState }) => {
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
        messageData.conversationId ||
        [currentUserId, toUserId].sort().join("_");

      return {
        ...messageData,
        conversationId,
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
   SLICE – ĐÃ BỔ SUNG LẠI ĐỦ CASE
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
        const message = action.payload;
        const convId = message.conversationId || "unknown";

        if (!state.messages[convId]) state.messages[convId] = [];
        state.messages[convId].push(message);

        const exists = state.conversations.some(
          (c) => c._id === convId || c.conversationId === convId
        );
        if (!exists) {
          state.conversations.unshift({
            _id: convId,
            conversationId: convId,
            lastMessage: message,
            participant:
              message.fromUserId._id === action.meta.arg.toUserId
                ? message.toUserId
                : message.fromUserId,
          });
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
        state.conversations = Array.isArray(action.payload)
          ? action.payload
          : [];
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
