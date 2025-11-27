// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";


export const createPaymentWebHook = createAsyncThunk(
  "payment/createPaymentWebHook",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để xác nhận thanh toán");

      const response = await axiosInstance.post(
        "/payment/webhook",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo webhook thanh toán thất bại" }
      );
    }
  }
);

const initialState = {
  paymentResult: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createPaymentWebHook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentWebHook.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
      })
      .addCase(createPaymentWebHook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
