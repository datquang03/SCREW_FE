// src/features/comment/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =============================
// TẠO COMMENT MỚI CHO SET DESIGN
// POST {{base_url}}/api/set-designs/:id/comments
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
// CUSTOMER REPLY COMMENT
// POST {{base_url}}/api/set-designs/:id/comments/:commentIndex/reply
// =============================
export const replyComment = createAsyncThunk(
  "comment/replyComment",
  async (
    { setDesignId, commentIndex, replyContent },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth;

      const response = await axiosInstance.post(
        `/set-designs/${setDesignId}/comments/${commentIndex}/reply`,
        { content: replyContent },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return {
        setDesignId,
        commentIndex,
        reply: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Trả lời bình luận thất bại" }
      );
    }
  }
);

// =============================
// UPDATE COMMENT
// PUT {{base_url}}/api/set-designs/:id/comments/:commentIndex
// =============================
export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async (
    { setDesignId, commentIndex, message },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth;

      const response = await axiosInstance.put(
        `/set-designs/${setDesignId}/comments/${commentIndex}`,
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return {
        setDesignId,
        commentIndex,
        comment: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật bình luận thất bại" }
      );
    }
  }
);

// =============================
// UPDATE REPLY
// PUT {{base_url}}/api/set-designs/:id/comments/:commentIndex/replies/:replyIndex
// =============================
export const updateReply = createAsyncThunk(
  "comment/updateReply",
  async (
    { setDesignId, commentIndex, replyIndex, replyContent },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth;

      const response = await axiosInstance.put(
        `/set-designs/${setDesignId}/comments/${commentIndex}/replies/${replyIndex}`,
        { content: replyContent },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return {
        setDesignId,
        commentIndex,
        replyIndex,
        reply: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật trả lời thất bại" }
      );
    }
  }
);

// =============================
// DELETE REPLY
// DELETE {{base_url}}/api/set-designs/:id/comments/:commentIndex/replies/:replyIndex
// =============================
export const deleteReply = createAsyncThunk(
  "comment/deleteReply",
  async (
    { setDesignId, commentIndex, replyIndex },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth;

      await axiosInstance.delete(
        `/set-designs/${setDesignId}/comments/${commentIndex}/replies/${replyIndex}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { setDesignId, commentIndex, replyIndex };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa trả lời thất bại" }
      );
    }
  }
);

// =============================
// DELETE COMMENT
// DELETE {{base_url}}/api/set-designs/:id/comments/:commentIndex
// =============================
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ setDesignId, commentIndex }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      await axiosInstance.delete(
        `/set-designs/${setDesignId}/comments/${commentIndex}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { setDesignId, commentIndex };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa bình luận thất bại" }
      );
    }
  }
);

// =============================
// LIKE / UNLIKE COMMENT (GLOBAL)
// POST   {{base_url}}/api/comments/:commentId/like
// DELETE {{base_url}}/api/comments/:commentId/like
// =============================
export const likeComment = createAsyncThunk(
  "comment/likeComment",
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/comments/${commentId}/like`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Chuẩn hoá data: { commentId, likes, likesCount }
      const data = res.data?.data || res.data || {};
      return {
        commentId: data.commentId || commentId,
        likes: data.likes || [],
        likesCount:
          typeof data.likesCount === "number"
            ? data.likesCount
            : Array.isArray(data.likes)
            ? data.likes.length
            : 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thích bình luận thất bại" }
      );
    }
  }
);

export const unlikeComment = createAsyncThunk(
  "comment/unlikeComment",
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.delete(`/comments/${commentId}/like`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = res.data?.data || res.data || {};
      return {
        commentId: data.commentId || commentId,
        likes: data.likes || [],
        likesCount:
          typeof data.likesCount === "number"
            ? data.likesCount
            : Array.isArray(data.likes)
            ? data.likes.length
            : 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Bỏ thích bình luận thất bại" }
      );
    }
  }
);

// =============================
// LIKE / UNLIKE REPLY (GLOBAL)
// POST   {{base_url}}/api/comments/:commentId/replies/:replyId/like
// DELETE {{base_url}}/api/comments/:commentId/replies/:replyId/like
// =============================
export const likeReply = createAsyncThunk(
  "comment/likeReply",
  async ({ commentId, replyId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/comments/${commentId}/replies/${replyId}/like`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = res.data?.data || res.data || {};
      return {
        commentId: data.commentId || commentId,
        replyId: data.replyId || replyId,
        likes: data.likes || [],
        likesCount:
          typeof data.likesCount === "number"
            ? data.likesCount
            : Array.isArray(data.likes)
            ? data.likes.length
            : 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thích phản hồi thất bại" }
      );
    }
  }
);

export const unlikeReply = createAsyncThunk(
  "comment/unlikeReply",
  async ({ commentId, replyId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.delete(
        `/comments/${commentId}/replies/${replyId}/like`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = res.data?.data || res.data || {};
      return {
        commentId: data.commentId || commentId,
        replyId: data.replyId || replyId,
        likes: data.likes || [],
        likesCount:
          typeof data.likesCount === "number"
            ? data.likesCount
            : Array.isArray(data.likes)
            ? data.likes.length
            : 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Bỏ thích phản hồi thất bại" }
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

      // === REPLY COMMENT ===
      .addCase(replyComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replyComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE COMMENT ===
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE REPLY ===
      .addCase(updateReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReply.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === DELETE REPLY ===
      .addCase(deleteReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReply.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === DELETE COMMENT ===
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === LIKE / UNLIKE COMMENT ===
      // Không đụng tới state.loading để tránh giật UI khi chỉ like/unlike
      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(likeReply.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlikeReply.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
