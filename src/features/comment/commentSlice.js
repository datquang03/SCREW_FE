// src/features/comment/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =============================
// TẠO COMMENT MỚI CHO SET DESIGN
// POST /api/set-designs/:setDesignId/comments
// =============================
export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ setDesignId, message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const response = await axiosInstance.post(
        `/set-designs/${setDesignId}/comments`,
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // API trả về comment mới vừa tạo
      return {
        setDesignId,
        comment: response.data.data, // hoặc response.data.comment tùy backend
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi bình luận thất bại" }
      );
    }
  }
);

// =============================
// NHÂN VIÊN TRẢ LỜI COMMENT
// POST /api/set-designs/:setDesignId/comments/:commentIndex/reply
// =============================
export const replyCommentForStaff = createAsyncThunk(
  "comment/replyCommentForStaff",
  async ({ setDesignId, commentIndex, replyContent }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để trả lời");

      const response = await axiosInstance.post(
        `/set-designs/${setDesignId}/comments/${commentIndex}/reply`,
        { content: replyContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        setDesignId,
        commentIndex,
        reply: response.data.data, // hoặc response.data.reply
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Trả lời bình luận thất bại" }
      );
    }
  }
);

// =============================
// INITIAL STATE
// =============================
const initialState = {
  loading: false,
  error: null,
};

// =============================
// SLICE
// =============================
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === CREATE COMMENT ===
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.loading = false;
        // Không cần lưu vào state toàn cục vì comment thuộc về setDesign
        // → Sẽ được cập nhật ở component chi tiết qua refetch hoặc optimistic
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === REPLY COMMENT (STAFF) ===
      .addCase(replyCommentForStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replyCommentForStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replyCommentForStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;