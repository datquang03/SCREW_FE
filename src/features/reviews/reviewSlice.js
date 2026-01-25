import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// CREATE REVIEW
export const createReviews = createAsyncThunk(
  "reviews/createReviews",
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.post(`/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) { 
      return rejectWithValue(
        err.response?.data || { message: "Tạo đánh giá thất bại" }
      );
    }
  }
);

// GET ALL REVIEWS
export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.get(`/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách đánh giá thất bại" }
      );
    }
  }
);

// GET REVIEW BY ID
export const getReviewById = createAsyncThunk(
  "reviews/getReviewById",
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.get(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy chi tiết đánh giá thất bại" }
      );
    }
  }
);

// UPDATE REVIEW
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.put(
        `/reviews/${reviewId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật đánh giá thất bại" }
      );
    }
  }
);

// REPLY TO REVIEW
export const replyReviews = createAsyncThunk(
  "reviews/replyReviews",
  async ({ reviewId, replyData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.post(
        `/reviews/${reviewId}/reply`,
        replyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Trả lời đánh giá thất bại" }
      );
    }
  }
);

// UPDATE REPLY
export const updateReply = createAsyncThunk(
  "reviews/updateReply",
  async ({ reviewId, replyData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.put(
        `/reviews/${reviewId}/reply`,
        replyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật trả lời thất bại" }
      );
    }
  }
);

// TOGGLE VISIBILITY
export const toogleVisibilityReviews = createAsyncThunk(
  "reviews/toogleVisibilityReviews",
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.patch(
        `/reviews/${reviewId}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Ẩn/hiện đánh giá thất bại" }
      );
    }
  }
);

const initialState = {
  reviews: [],
  currentReview: null,
  total: 0,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    resetCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE REVIEW
      .addCase(createReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET REVIEWS
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.reviews = payload;
        } else if (payload && (Array.isArray(payload.data) || Array.isArray(payload.reviews))) {
          state.reviews = payload.data || payload.reviews || [];
          if (payload.pagination || payload.total) {
            state.total = payload.pagination?.totalItems || payload.total || 0;
          }
        } else {
          state.reviews = [];
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET REVIEW BY ID
      .addCase(getReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE REVIEW
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // REPLY REVIEW
      .addCase(replyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(replyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE REPLY
      .addCase(updateReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReply.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // TOGGLE VISIBILITY
      .addCase(toogleVisibilityReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toogleVisibilityReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(toogleVisibilityReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError, resetCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
