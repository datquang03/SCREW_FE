// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// NOTE: tất cả thunks nhận một object args để dễ mở rộng: { bookingId, percentage, paymentId }

export const createOptionPayment = createAsyncThunk(
  "payment/createOptionPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/options/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo option thanh toán thất bại" }
      );
    }
  }
);

export const createSinglePayment = createAsyncThunk(
  "payment/createSinglePayment",
  // percentage sẽ được truyền trực tiếp từ UI (BookingPaymentPage)
  async ({ bookingId, percentage }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/create/${bookingId}`,
        { percentage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo thanh toán trả trước thất bại" }
      );
    }
  }
);

export const createRemainingPayment = createAsyncThunk(
  "payment/createRemainingPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/remaining/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Thanh toán phần còn lại thất bại",
        }
      );
    }
  }
);

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

// initial state
const initialState = {
  paymentData: null,
  paymentStatus: null,
  loading: false,
  error: null,
};

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
      // create option
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

      // create single
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

      // create remaining
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

      // get status
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

// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// NOTE: tất cả thunks nhận một object args để dễ mở rộng: { bookingId, percentage, paymentId }

export const createOptionPayment = createAsyncThunk(
  "payment/createOptionPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/options/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo option thanh toán thất bại" }
      );
    }
  }
);

export const createSinglePayment = createAsyncThunk(
  "payment/createSinglePayment",
  async ({ bookingId, percentage = 30 }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/create/${bookingId}`,
        { percentage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo thanh toán trả trước thất bại" }
      );
    }
  }
);

export const createRemainingPayment = createAsyncThunk(
  "payment/createRemainingPayment",
  async ({ bookingId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/payments/remaining/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Thanh toán phần còn lại thất bại",
        }
      );
    }
  }
);

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

// initial state
const initialState = {
  paymentData: null,
  paymentStatus: null,
  loading: false,
  error: null,
};

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
      // create option
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

      // create single
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

      // create remaining
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

      // get status
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
