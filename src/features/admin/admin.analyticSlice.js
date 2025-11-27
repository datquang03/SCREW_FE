// src/features/analytics/analyticSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNK ===
// Lấy analytics cho dashboard (Admin)
export const getAdminAnalytics = createAsyncThunk(
  "analytics/getAdminAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/analytics/dashboard`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy dữ liệu analytics thất bại" }
      );
    }
  }
);

// === SLICE ===
const analyticSlice = createSlice({
  name: "analytics",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearAnalyticsData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAdminAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalyticsError, clearAnalyticsData } =
  analyticSlice.actions;

export default analyticSlice.reducer;
