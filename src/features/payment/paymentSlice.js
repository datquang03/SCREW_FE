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

// 5) Yêu cầu hoàn tiền (Refund Request)
export const refundPayment = createAsyncThunk(
  "payment/refundPayment",
  async (
    { bookingId, formData },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/bookings/${bookingId}/refund-request`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi yêu cầu hoàn tiền thất bại" }
      );
    }
  }
);

// Yêu cầu hoàn tiền Set Design Order
export const requestRefundSetDesign = createAsyncThunk(
  "payment/requestRefundSetDesign",
  async ({ orderId, formData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/set-design-orders/${orderId}/refund-request`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi yêu cầu hoàn tiền set design thất bại" }
      );
    }
  }
);

// 6) Duyệt yêu cầu hoàn tiền (Approve Refund)
export const approveRefund = createAsyncThunk(
  "payment/approveRefund",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/bookings/${bookingId}/refund-approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Duyệt hoàn tiền thất bại" }
      );
    }
  }
);

// 7) Từ chối yêu cầu hoàn tiền (Reject Refund)
export const rejectRefund = createAsyncThunk(
  "payment/rejectRefund",
  async ({ bookingId, reason }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/bookings/${bookingId}/refund-reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Từ chối hoàn tiền thất bại" }
      );
    }
  }
);

// 8) Lấy danh sách yêu cầu hoàn tiền (Pending)
export const getCustomerRefunds = createAsyncThunk(
  "payment/getCustomerRefunds",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(
        `/refunds/pending?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách hoàn tiền thất bại" }
      );
    }
  }
);

// 9) Lấy chi tiết yêu cầu hoàn tiền
export const getCustomerRefundById = createAsyncThunk(
  "payment/getCustomerRefundById",
  async (refundId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/refunds/${refundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy chi tiết hoàn tiền thất bại" }
      );
    }
  }
);

// 10) Duyệt yêu cầu hoàn tiền (Approve -> Chờ chuyển tiền)
export const approveCustomerRefund = createAsyncThunk(
  "payment/approveCustomerRefund",
  async (refundId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/refunds/${refundId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Duyệt hoàn tiền thất bại" }
      );
    }
  }
);

// 11) Từ chối yêu cầu hoàn tiền
export const rejectCustomerRefund = createAsyncThunk(
  "payment/rejectCustomerRefund",
  async ({ refundId, reason }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        `/refunds/${refundId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Từ chối hoàn tiền thất bại" }
      );
    }
  }
);

// 12) Xem danh sách đã approve (chờ chuyển tiền)
export const getApprovedRefunds = createAsyncThunk(
  "payment/getApprovedRefunds",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(
        `/refunds/approved?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách hoàn tiền đã duyệt thất bại" }
      );
    }
  }
);

// 13) Xác nhận đã chuyển tiền - ĐÃ SỬA ĐỂ NHẬN FormData (text + file ảnh)
export const confirmRefundPayment = createAsyncThunk(
  "payment/confirmRefundPayment",
  async ({ refundId, formData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/refunds/${refundId}/confirm`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      return res.data.data;
    } catch (err) {
      // Lấy thông báo lỗi chi tiết từ backend nếu có
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Xác nhận chuyển tiền hoàn tiền thất bại";

      return rejectWithValue({
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  }
);

// 14) Lấy danh sách yêu cầu hoàn tiền của tôi
export const getMyRequestRefund = createAsyncThunk(
  "payment/getMyRequestRefund",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/refunds/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách yêu cầu hoàn tiền thất bại" }
      );
    }
  }
);

// ========================== INITIAL STATE ==========================
const initialState = {
  paymentData: null,
  paymentStatus: null,
  refundsList: [],
  refundDetail: null,
  approvedRefunds: [],
  myRefundRequests: [],
  loading: false,
  error: null,
  pagination: {},
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
      })

      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // requestRefundSetDesign
      .addCase(requestRefundSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRefundSetDesign.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(requestRefundSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getCustomerRefunds
      .addCase(getCustomerRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerRefunds.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.refundsList = payload;
        } else if (payload && Array.isArray(payload.refunds)) {
          state.refundsList = payload.refunds;
        } else if (payload && Array.isArray(payload.data)) {
          state.refundsList = payload.data;
        } else if (payload && Array.isArray(payload.docs)) {
          state.refundsList = payload.docs;
        } else {
          state.refundsList = [];
        }

        if (payload?.pagination) {
          state.pagination = payload.pagination;
        } else if (payload?.total) {
          state.pagination = {
            total: payload.total,
            page: payload.page,
            pages: payload.pages,
          };
        }
      })
      .addCase(getCustomerRefunds.rejected, (state, action) => {
        state.loading = false;
        state.refundsList = [];
        state.error = action.payload;
      })

      // getCustomerRefundById
      .addCase(getCustomerRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerRefundById.fulfilled, (state, action) => {
        state.loading = false;
        state.refundDetail = action.payload;
      })
      .addCase(getCustomerRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // approveCustomerRefund
      .addCase(approveCustomerRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCustomerRefund.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(approveCustomerRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // rejectCustomerRefund
      .addCase(rejectCustomerRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCustomerRefund.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(rejectCustomerRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getApprovedRefunds
      .addCase(getApprovedRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApprovedRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedRefunds = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getApprovedRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // confirmRefundPayment - ĐÃ SỬA
      .addCase(confirmRefundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmRefundPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Có thể lưu kết quả xác nhận nếu cần
        // Ví dụ: state.lastConfirmedRefund = action.payload;
      })
      .addCase(confirmRefundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMyRequestRefund
      .addCase(getMyRequestRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRequestRefund.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.myRefundRequests = payload;
        } else if (payload && Array.isArray(payload.refunds)) {
          state.myRefundRequests = payload.refunds;
          if (payload.pagination || payload.total) {
            state.pagination = {
              total: payload.total,
              page: payload.page,
              pages: payload.pages,
            };
          }
        } else if (payload && Array.isArray(payload.data)) {
          state.myRefundRequests = payload.data;
        } else {
          state.myRefundRequests = [];
        }
      })
      .addCase(getMyRequestRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;