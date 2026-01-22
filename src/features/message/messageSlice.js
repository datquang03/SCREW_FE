// src/features/message/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { initSocket, getSocket } from "../../api/socketInstance";

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
  // Conversation ID hợp lệ: 2 ObjectId (24 ký tự mỗi cái) được join bằng "_" hoặc "-"
  // Format: "6916b10ddd40e9e31c5c2a1d_6916bac2dd40e9e31c5c2b17" hoặc "6916b10ddd40e9e31c5c2a1d-6916bac2dd40e9e31c5c2b17"
  const pattern = /^[0-9a-fA-F]{24}[_-][0-9a-fA-F]{24}$/;
  return pattern.test(str);
};

// Normalize conversation ID về format nhất quán (dùng "-" vì backend trả về format này)
const normalizeIdFormat = (id) => {
  if (!id || typeof id !== "string") return id;
  // Chuyển từ format "_" sang "-" để nhất quán với backend
  return id.replace(/_/g, "-");
};

const normalizeConversationId = (conv) => {
  if (!conv) return "";

  // 1. Nếu có bookingId, ưu tiên dùng nó
  if (conv.bookingId) return conv.bookingId;

  // 2. Nếu conversationId là ID đơn (24 chars) -> Booking Chat / Group
  // (Chúng ta kiểm tra độ dài và không chứa ký tự nối "-" hoặc "_")
  if (typeof conv.conversationId === "string" && conv.conversationId.length === 24 && !conv.conversationId.includes("-")) {
    return conv.conversationId;
  }
  if (typeof conv._id === "string" && conv._id.length === 24 && !conv._id.includes("-") && !conv._id.startsWith("ObjectId")) {
     // Lưu ý: conv._id thường là 24 chars. Nhưng nếu logic Direct Message yêu cầu user-user, 
     // ta phải cẩn thận. Tuy nhiên các đoạn code dưới sẽ xử lý user-user nếu cần.
     // Ở đây nếu backend trả về object conversation (booking) có _id mà không phải user-user, ta có thể muốn dùng nó?
     // Tuy nhiên logic cũ ưu tiên tìm participants.
  }

  // Kiểm tra conversationId trước (nếu có và hợp lệ theo format user-user)
  if (typeof conv.conversationId === "string" && isValidConversationId(conv.conversationId)) {
    return normalizeIdFormat(conv.conversationId);
  }

  // Kiểm tra _id: chỉ return nếu nó là conversation ID hợp lệ
  if (typeof conv._id === "string") {
    // Nếu _id là conversation ID hợp lệ (format: id_id hoặc id-id), normalize và return
    if (isValidConversationId(conv._id)) {
      return normalizeIdFormat(conv._id);
    }
    
    // Nếu _id là string dài chứa object (như backend đang trả về), parse nó
    if (conv._id.length > 80 || conv._id.includes("ObjectId") || conv._id.includes("}-{")) {
      const parsed = extractIdsFromString(conv._id);
      if (parsed.length >= 2) {
        return parsed.sort().join("-"); // Dùng "-" để nhất quán với backend
      }
    }
  }

  // Thử lấy từ participants
  const participantIds =
    conv.participants?.map((p) => p?._id || p).filter(Boolean) || [];
  if (participantIds.length >= 2) {
    const normalized = participantIds.map(id => String(id).trim()).filter(Boolean);
    if (normalized.length >= 2) {
      return normalized.sort().join("-"); // Dùng "-" để nhất quán với backend
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
      return [fromId, toId].sort().join("-"); // Dùng "-" để nhất quán với backend
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
      
      // Tạo conversationId từ fromUserId và toUserId nếu chưa có
      let conversationId = payloadConvId || messageData.conversationId;
      if (!conversationId && messageData.fromUserId && messageData.toUserId) {
        const fromId = messageData.fromUserId._id || messageData.fromUserId;
        const toId = messageData.toUserId._id || messageData.toUserId;
        if (fromId && toId) {
          conversationId = [String(fromId).trim(), String(toId).trim()].sort().join("-");
        }
      }
      // Fallback: dùng currentUserId và toUserId nếu không có từ messageData
      if (!conversationId) {
        conversationId = [currentUserId, toUserId].filter(Boolean).map(id => String(id).trim()).sort().join("-");
      }

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
  async (arg, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      // Support passing object with options or just string ID
      const conversationId = typeof arg === 'object' ? arg.conversationId : arg;

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
    // Socket actions
    addMessageFromSocket: (state, action) => {
      const message = action.payload;
      const fromId = message.fromUserId?._id || message.fromUserId;
      const toId = message.toUserId?._id || message.toUserId;
      
      let convId = "";

      // 1. Nếu có bookingId, ưu tiên dùng nó
      if (message.bookingId) {
        convId = message.bookingId;
      }
      // 2. Nếu conversationId là ID đơn (24 chars) -> Booking Chat / Group
      else if (message.conversationId && message.conversationId.length === 24) {
        convId = message.conversationId;
      }
      // 3. Logic cũ: Direct Message -> Tạo ID từ 2 user ID
      else if (fromId && toId) {
        convId = [String(fromId).trim(), String(toId).trim()].sort().join("-");
      } 
      // 4. Fallback
      else {
        convId = normalizeIdFormat(message.conversationId);
      }

      if (!convId) return;

      // Thêm message vào conversation
      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }
      
      // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
      const existingIndex = state.messages[convId].findIndex(m => m._id === message._id);
      if (existingIndex >= 0) {
        state.messages[convId][existingIndex] = message;
      } else {
        state.messages[convId].push(message);
      }

      // Cập nhật conversation trong danh sách
      const existsIdx = state.conversations.findIndex(
        (c) => {
          const cId = normalizeConversationId(c);
          return cId === convId || c._id === convId || c.conversationId === convId;
        }
      );

      const convPayload = {
        _id: convId,
        conversationId: convId,
        lastMessage: message,
        participants: [message.fromUserId, message.toUserId].filter(Boolean),
      };

      if (existsIdx >= 0) {
        state.conversations[existsIdx] = {
          ...state.conversations[existsIdx],
          ...convPayload,
        };
        // Di chuyển conversation lên đầu
        const updated = state.conversations.splice(existsIdx, 1)[0];
        state.conversations.unshift(updated);
      } else {
        state.conversations.unshift(convPayload);
      }
    },
    updateMessageFromSocket: (state, action) => {
      const { messageId, updates } = action.payload;
      Object.keys(state.messages).forEach((convId) => {
        const msgIndex = state.messages[convId].findIndex(m => m._id === messageId);
        if (msgIndex >= 0) {
          state.messages[convId][msgIndex] = {
            ...state.messages[convId][msgIndex],
            ...updates,
          };
        }
      });
    },
    removeMessageFromSocket: (state, action) => {
      const messageId = action.payload;
      Object.keys(state.messages).forEach((convId) => {
        state.messages[convId] = state.messages[convId].filter(
          (m) => m._id !== messageId
        );
      });
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
        
        // Đảm bảo conversationId được tính đúng (dùng format "-" để nhất quán với backend)
        const fromId = message.fromUserId?._id || message.fromUserId;
        const toId = message.toUserId?._id || message.toUserId;
        
        let convId = "";
        
        // 1. Ưu tiên Booking ID / Single ID phù hợp socket
        if (message.bookingId) {
          convId = message.bookingId;
        } else if (message.conversationId && message.conversationId.length === 24) {
          convId = message.conversationId;
        } 
        // 2. Fallback sang logic User-User
        else if (fromId && toId) {
          convId = [String(fromId).trim(), String(toId).trim()].sort().join("-");
        } else {
           convId = normalizeIdFormat(message.conversationId) || normalizeConversationId(message);
        }

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

        // Emit qua socket để bên kia nhận ngay
        const socket = getSocket();
        if (socket?.connected) {
          socket.emit("sendMessage", message);
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
      .addCase(getMessagesByConversation.pending, (state, action) => {
        // Only set loading if not silent
        const isSilent = typeof action.meta.arg === 'object' ? action.meta.arg.isSilent : false;
        if (!isSilent) {
           state.loadingMessages = true;
        }
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

export const { 
  clearMessageError, 
  clearMessagesByConversation,
  addMessageFromSocket,
  updateMessageFromSocket,
  removeMessageFromSocket,
} = messageSlice.actions;

// Socket middleware để lắng nghe events
export const setupSocketListeners = (dispatch) => {
  const socket = getSocket();
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  // Remove old listeners để tránh duplicate
  socket.off("newMessage");
  socket.off("messageUpdated");
  socket.off("messageDeleted");
  socket.off("conversationUpdated");

  // Lắng nghe message mới
  socket.on("newMessage", (message) => {
    console.log("Received new message via socket:", message);
    dispatch(addMessageFromSocket(message));
  });

  // Lắng nghe message được cập nhật (ví dụ: đã đọc)
  socket.on("messageUpdated", ({ messageId, updates }) => {
    console.log("Message updated via socket:", messageId, updates);
    dispatch(updateMessageFromSocket({ messageId, updates }));
  });

  // Lắng nghe message bị xóa
  socket.on("messageDeleted", (messageId) => {
    console.log("Message deleted via socket:", messageId);
    dispatch(removeMessageFromSocket(messageId));
  });

  // Lắng nghe conversation được cập nhật
  socket.on("conversationUpdated", (conversation) => {
    console.log("Conversation updated via socket:", conversation);
    // Refresh conversations list
    dispatch(getConversations());
  });
};

// Initialize socket connection
export const initializeSocket = (token) => {
  if (!token) return;
  const socket = initSocket(token);
  return socket;
};

export default messageSlice.reducer;
