// src/features/message/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =====================================================
   ASYNC THUNKS
===================================================== */

// CREATE MESSAGE
export const createMessage = createAsyncThunk(
  "message/createMessage",
  async ({ toUserId, content }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post(
        "/messages",
        { toUserId, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data; // giả sử backend trả về message mới
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to send message" }
      );
    }
  }
);

// GET ALL CONVERSATIONS (danh sách cuộc trò chuyện)
export const getConversations = createAsyncThunk(
  "message/getConversations",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get("/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch conversations" }
      );
    }
  }
);

// GET MESSAGES OF A CONVERSATION
export const getMessagesByConversation = createAsyncThunk(
  "message/getMessagesByConversation",
  async (conversationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get(
        `/messages/conversation/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { conversationId, messages: response.data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch messages" }
      );
    }
  }
);

// MARK MESSAGE AS READ
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
        err.response?.data || { message: "Failed to mark as read" }
      );
    }
  }
);

// DELETE MESSAGE
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
        err.response?.data || { message: "Failed to delete message" }
      );
    }
  }
);

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
  conversations: [],           // danh sách các cuộc trò chuyện
  messages: {},                 // { [conversationId]: [...] } – lưu tin nhắn theo conversation
  loading: false,               // loading chung (send, delete, mark read...)
  loadingConversations: false,  // loading danh sách conversations
  loadingMessages: false,       // loading tin nhắn của 1 conversation
  error: null,
};

/* =====================================================
   SLICE
===================================================== */
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearMessageError: (state) => {
      state.error = null;
    },
    clearMessagesByConversation: (state, action) => {
      const conversationId = action.payload;
      if (conversationId) {
        delete state.messages[conversationId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE MESSAGE
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Backend có thể trả về conversationId trong payload nếu cần
        const message = action.payload;
        const convId = message.conversationId || message.receiverId; // tùy backend
        if (!state.messages[convId]) state.messages[convId] = [];
        state.messages[convId].push(message);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET CONVERSATIONS
      .addCase(getConversations.pending, (state) => {
        state.loadingConversations = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload;
      })

      // GET MESSAGES BY CONVERSATION
      .addCase(getMessagesByConversation.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(getMessagesByConversation.fulfilled, (state, action) => {
        state.loadingMessages = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = Array.isArray(messages) ? messages : [];
      })
      .addCase(getMessagesByConversation.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload;
      })

      // MARK AS READ
      .addCase(markMessageAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId } = action.payload;
        // Cập nhật trạng thái đã đọc trong tất cả conversation
        Object.keys(state.messages).forEach((convId) => {
          const msg = state.messages[convId].find((m) => m._id === messageId);
          if (msg) msg.isRead = true;
        });
      })
      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE MESSAGE
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
        state.error = action.payload;
      });
  },
});

export const { clearMessageError, clearMessagesByConversation } =
  messageSlice.actions;

export default messageSlice.reducer;