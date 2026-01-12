// src/features/ai/AISlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =============================
   AI CHAT
   POST /set-designs/ai-chat
============================= */
export const aiChat = createAsyncThunk(
  "ai/aiChat",
  async ({ message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        "/set-designs/ai-chat",
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data; // ChatBot trả lời
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi tin nhắn AI thất bại" }
      );
    }
  }
);

/* =============================
   AI GENERATE DESIGN
   POST /set-designs/ai-generate-design
============================= */
export const aiGenerateDesign = createAsyncThunk(
  "ai/aiGenerateDesign",
  async ({ prompt }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        "/set-designs/ai-generate-design",
        { prompt },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data; // backend trả về ảnh hoặc data render
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "AI tạo thiết kế thất bại" }
      );
    }
  }
);

/* =============================
   INITIAL STATE
============================= */
const initialState = {
  aiMessages: [],      // tin nhắn chat bot
  generatedDesign: null, // kết quả generate
  loading: false,
  error: null,
};

/* =============================
   SLICE
============================= */
const AISlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAIGenerated: (state) => {
      state.generatedDesign = null;
    },
    clearAIError: (state) => {
      state.error = null;
    },
    clearAIChat: (state) => {
      state.aiMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // AI CHAT
      .addCase(aiChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(aiChat.fulfilled, (state, action) => {
        state.loading = false;
        state.aiMessages.push({
          role: "assistant",
          content: action.payload,
        });
      })
      .addCase(aiChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // AI GENERATE DESIGN
      .addCase(aiGenerateDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(aiGenerateDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedDesign = action.payload; // data ảnh thiết kế
      })
      .addCase(aiGenerateDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAIGenerated, clearAIError, clearAIChat } =
  AISlice.actions;

export default AISlice.reducer;
