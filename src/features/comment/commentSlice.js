// src/features/comment/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =========================================================
// GET COMMENTS BY TARGET (SetDesign hoặc Studio)
// GET /api/comments?targetType=SetDesign&targetId={id}
// =========================================================
export const getComments = createAsyncThunk(
  "comment/getComments",
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/comments?targetType=${targetType}&targetId=${targetId}`
      );
      return res.data.data; // trả về list comments
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách bình luận thất bại" }
      );
    }
  }
);

// =========================================================
// CREATE COMMENT (chung cho SetDesign + Studio)
// POST /api/comments
// body: { content, targetType, targetId }
// =========================================================
export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ content, targetType, targetId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        "/comments",
        { content, targetType, targetId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data; // trả về comment vừa tạo
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo bình luận thất bại" }
      );
    }
  }
);

// =========================================================
// REPLY COMMENT
// POST /api/comments/:id/reply
// body: { content }
// =========================================================
export const replyComment = createAsyncThunk(
  "comment/replyComment",
  async ({ commentId, content }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/comments/${commentId}/reply`,
        { content },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return {
        commentId,
        reply: res.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Trả lời bình luận thất bại" }
      );
    }
  }
);

// =========================================================
// UPDATE COMMENT
// PUT /api/comments/:id
// body: { content }
// =========================================================
export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.put(
        `/comments/${commentId}`,
        { content },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data; // comment updated
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật bình luận thất bại" }
      );
    }
  }
);

// =========================================================
// DELETE COMMENT
// DELETE /api/comments/:id
// =========================================================
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ commentId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return { commentId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa bình luận thất bại" }
      );
    }
  }
);
// LIKE COMMENT
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

      return { commentId, data: res.data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thích bình luận thất bại" }
      );
    }
  }
);

// UNLIKE COMMENT
export const unlikeComment = createAsyncThunk(
  "comment/unlikeComment",
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      await axiosInstance.delete(`/comments/${commentId}/like`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return { commentId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Bỏ thích bình luận thất bại" }
      );
    }
  }
);

// =========================================================
// SLICE
// =========================================================
const initialState = {
  comments: [],
  loading: false,
  error: null,
};

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
      // GET COMMENTS
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE COMMENT
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload); // thêm vào đầu list
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REPLY COMMENT
      .addCase(replyComment.fulfilled, (state, action) => {
        const { commentId, reply } = action.payload;
        const cmt = state.comments.find((c) => c._id === commentId);
        if (cmt) {
          cmt.replies = cmt.replies ? [reply, ...cmt.replies] : [reply];
        }
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE COMMENT
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        state.comments = state.comments.map((c) =>
          c._id === updated._id ? updated : c
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE COMMENT
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload.commentId
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      // LIKE COMMENT
      .addCase(likeComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        const cmt = state.comments.find((c) => c._id === commentId);
        if (cmt) {
          cmt.isLikedByCurrentUser = true;
          cmt.likesCount = (cmt.likesCount || 0) + 1;
        }
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UNLIKE COMMENT
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        const cmt = state.comments.find((c) => c._id === commentId);
        if (cmt) {
          cmt.isLikedByCurrentUser = false;
          cmt.likesCount = Math.max(0, (cmt.likesCount || 0) - 1);
        }
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
