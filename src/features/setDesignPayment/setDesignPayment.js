// src/features/setDesignPayment/setDesignPayment.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =========================================================
// ================          THUNKS API        =============
// =========================================================

// 1) Tạo đơn hàng Set Design
export const createOrderSetDesign = createAsyncThunk(
  "setDesignPayment/createOrderSetDesign",
  async (orderPayload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để đặt hàng");

      const response = await axiosInstance.post(
        "/set-design-orders",
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo đơn hàng thất bại" }
      );
    }
  }
);

// 2) Thanh toán đầy đủ (100%)
export const createPaymentFull = createAsyncThunk(
  "setDesignPayment/createPaymentFull",
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để thanh toán");

      const response = await axiosInstance.post(
        `/set-design-orders/${orderId}/payment`,
        { payType: "full" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thanh toán thất bại" }
      );
    }
  }
);

// 3) Thanh toán trước 30%
export const createPayment30 = createAsyncThunk(
  "setDesignPayment/createPayment30",
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để thanh toán");

      const response = await axiosInstance.post(
        `/set-design-orders/${orderId}/payment`,
        { payType: "prepay_30" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thanh toán thất bại" }
      );
    }
  }
);

// 4) Lấy danh sách đơn hàng Set Design của tôi
export const getMySetDesignOrder = createAsyncThunk(
  "setDesignPayment/getMySetDesignOrder",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập");

      const response = await axiosInstance.get("/set-design-orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy danh sách đơn hàng" }
      );
    }
  }
);

// 5) Lấy chi tiết đơn hàng Set Design
export const getSetDesignOrderDetail = createAsyncThunk(
  "setDesignPayment/getSetDesignOrderDetail",
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập");

      const response = await axiosInstance.get(
        `/set-design-orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy chi tiết đơn hàng" }
      );
    }
  }
);

// =========================================================
// ================          SLICE              =============
// =========================================================

const initialState = {
  myOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
};

const setDesignPaymentSlice = createSlice({
  name: "setDesignPayment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // ========== CREATE ORDER ==========
    builder
      .addCase(createOrderSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrderSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ========== PAYMENT FULL ==========
    builder
      .addCase(createPaymentFull.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createPaymentFull.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.currentOrder = action.payload;
        state.paymentError = null;
        // Cập nhật order trong danh sách nếu có
        const index = state.myOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.myOrders[index] = action.payload;
        }
      })
      .addCase(createPaymentFull.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });

    // ========== PAYMENT 30% ==========
    builder
      .addCase(createPayment30.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createPayment30.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.currentOrder = action.payload;
        state.paymentError = null;
        // Cập nhật order trong danh sách nếu có
        const index = state.myOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.myOrders[index] = action.payload;
        }
      })
      .addCase(createPayment30.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });

    // ========== GET MY ORDERS ==========
    builder
      .addCase(getMySetDesignOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySetDesignOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.orders || [];
        state.error = null;
      })
      .addCase(getMySetDesignOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ========== GET ORDER DETAIL ==========
    builder
      .addCase(getSetDesignOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSetDesignOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(getSetDesignOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = setDesignPaymentSlice.actions;
export default setDesignPaymentSlice.reducer;
