// src/features/promotion/promotionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// APPLY PROMOTION CODE
export const applyPromotionCode = createAsyncThunk(
  "promotion/applyPromotionCode",
  async ({ code, subtotal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/promotions/apply`, {
        code,
        subtotal,
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể áp dụng mã khuyến mãi" }
      );
    }
  }
);

// GET ALL PROMOTIONS
export const getAllPromotions = createAsyncThunk(
  "promotion/getAllPromotions",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/promotions?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách khuyến mãi thất bại" }
      );
    }
  }
);

// GET PROMOTION DETAILS
export const getPromotionDetails = createAsyncThunk(
  "promotion/getPromotionDetails",
  async (promotionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/promotions/${promotionId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy chi tiết khuyến mãi" }
      );
    }
  }
);

// GET PROMOTION USAGE STATS (MỚI THÊM)
export const getPromotionStats = createAsyncThunk(
  "promotion/getPromotionStats",
  async (promotionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/promotions/${promotionId}/stats`
      );
      return response.data.data; // { usageCount, usedBy: [...], dailyUsage: [...], ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy thống kê sử dụng" }
      );
    }
  }
);

// CREATE PROMOTION
export const createPromotion = createAsyncThunk(
  "promotion/createPromotion",
  async (promotionData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.post(`/promotions`, promotionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo khuyến mãi thất bại" }
      );
    }
  }
);

// UPDATE PROMOTION
export const updatePromotion = createAsyncThunk(
  "promotion/updatePromotion",
  async ({ promotionId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.put(
        `/promotions/${promotionId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật khuyến mãi thất bại" }
      );
    }
  }
);

// DELETE PROMOTION
export const deletePromotion = createAsyncThunk(
  "promotion/deletePromotion",
  async (promotionId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/promotions/${promotionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return promotionId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa khuyến mãi thất bại" }
      );
    }
  }
);

// INITIAL STATE
const initialState = {
  promotions: [],
  currentPromotion: null,
  promotionStats: null, // ← THÊM MỚI: lưu thống kê
  statsLoading: false, // ← loading riêng cho stats
  total: 0,
  loading: false,
  error: null,
};

// SLICE
const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    clearPromotionError: (state) => {
      state.error = null;
    },
    clearPromotionStats: (state) => {
      state.promotionStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL PROMOTIONS
      .addCase(getAllPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = Array.isArray(action.payload?.promotions)
          ? action.payload.promotions
          : [];
        state.total = action.payload?.pagination?.totalItems || 0;
      })
      .addCase(getAllPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET DETAILS
      .addCase(getPromotionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPromotionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPromotion = action.payload.promotion;
      })
      .addCase(getPromotionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET STATS (MỚI THÊM)
      .addCase(getPromotionStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getPromotionStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.promotionStats = action.payload; // có thể là { usageCount, dailyUsage, usedBy... }
      })
      .addCase(getPromotionStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions.unshift(action.payload.promotion);
        state.total += 1;
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.promotion;
        const index = state.promotions.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.promotions[index] = updated;
        if (state.currentPromotion?._id === updated._id) {
          state.currentPromotion = updated;
        }
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.loading = false;  
        state.promotions = state.promotions.filter(
          (p) => p._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        if (state.currentPromotion?._id === action.payload) {
          state.currentPromotion = null;
        }
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPromotionError, clearPromotionStats } =
  promotionSlice.actions;
export default promotionSlice.reducer;
