// src/features/transaction/transactionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== THUNKS ==========================

// 1) Lấy toàn bộ giao dịch (Staff)
export const getAllTransactions = createAsyncThunk(
  "transaction/getAllTransactions",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(
        `/payments/transactions/all?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy danh sách giao dịch" }
      );
    }
  }
);

// 2) Lấy giao dịch theo ID
export const getTransactionById = createAsyncThunk(
  "transaction/getTransactionById",
  async (transactionId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(
        `/payments/transactions/${transactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy giao dịch" }
      );
    }
  }
);
export const getMyTransactions = createAsyncThunk(
  "transaction/getMyTransactions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get("/payments/transaction-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy lịch sử giao dịch" }
      );
    }
  }
);

// ========================== INITIAL STATE ==========================
const initialState = {
  transactions: [],
  transactionDetail: null,
  loading: false,
  error: null,
};

// ========================== SLICE ==========================
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllTransactions
      .addCase(getAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || [];
        state.pagination = action.payload.pagination || {};
        state.summary = action.payload.summary || {};
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getTransactionById
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionDetail = action.payload;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyTransactions
      .addCase(getMyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload || [];
      })
      .addCase(getMyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
