import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== THUNKS ==========================

// 1) Tạo option thanh toán
export const createOptionPayment = createAsyncThunk(
  "payment/createOptionPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/options/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo option thanh toán thất bại" }
      );
    }
  }
);

// 2) Tạo thanh toán trả trước
export const createSinglePayment = createAsyncThunk(
  "payment/createSinglePayment",
  async ({ bookingId, percentage = 30 }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/create/${bookingId}`,
        { percentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo thanh toán trả trước thất bại" }
      );
    }
  }
);

// 3) Thanh toán phần còn lại
export const createRemainingPayment = createAsyncThunk(
  "payment/createRemainingPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/remaining/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Thanh toán phần còn lại thất bại" }
      );
    }
  }
);

// 4) Lấy trạng thái thanh toán
export const getPaymentStatus = createAsyncThunk(
  "payment/getPaymentStatus",
  async ({ paymentId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/payments/${paymentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy trạng thái thanh toán" }
      );
    }
  }
);

// ========================== INITIAL STATE ==========================
const initialState = {
  paymentData: null,
  paymentStatus: null,
  loading: false,
  error: null,
};

// ========================== SLICE ==========================
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    resetPaymentState: (state) => {
      state.paymentData = null;
      state.paymentStatus = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOptionPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOptionPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(createOptionPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSinglePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSinglePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(createSinglePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createRemainingPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRemainingPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(createRemainingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
