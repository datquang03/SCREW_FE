// src/features/booking/bookingSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =========================================================
// ================          THUNKS API        =============
// =========================================================

// 1) Tạo booking mới
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingPayload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để đặt phòng");

      const response = await axiosInstance.post("/bookings", bookingPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Trả về { booking, paymentOptions }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đặt phòng thất bại" }
      );
    }
  }
);

// 2) Lấy tất cả booking của user
export const getAllMyBookings = createAsyncThunk(
  "booking/getAllMyBookings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.get("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // → luôn trả array
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy booking" }
      );
    }
  }
);

// 3) Lấy 1 booking theo ID
export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.get(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // { booking } hoặc trực tiếp booking
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy booking" }
      );
    }
  }
);

// 4) Lấy booking + details
export const getBookingWithDetails = createAsyncThunk(
  "booking/getBookingWithDetails",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.get(`/bookings/${bookingId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // backend có thể trả { booking } hoặc details
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy chi tiết booking" }
      );
    }
  }
);

// 5) Lấy booking theo trạng thái
export const getBookingsByStatus = createAsyncThunk(
  "booking/getBookingsByStatus",
  async (status, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/bookings?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lọc booking" }
      );
    }
  }
);

// 7) Staff xác nhận booking
export const confirmBooking = createAsyncThunk(
  "booking/confirmBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể xác nhận booking" }
      );
    }
  }
);

// 8) Update booking
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ bookingId, payload }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.patch(`/bookings/${bookingId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể cập nhật booking" }
      );
    }
  }
);
// 9) Check-in booking
export const checkInBooking = createAsyncThunk(
  "booking/checkInBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/checkin`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data; // { booking }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể check-in" }
      );
    }
  }
);

// 10) Check-out booking
export const checkOutBooking = createAsyncThunk(
  "booking/checkOutBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/checkout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể check-out" }
      );
    }
  }
);

// 11) Cancel Booking (Refund Request)
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể hủy đơn đặt" }
      );
    }
  }
);

// 12) Request Refund
export const requestRefund = createAsyncThunk(
  "booking/requestRefund",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/refund-request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể gửi yêu cầu hoàn tiền" }
      );
    }
  }
);

// 13) Extend Studio Schedule
export const extendStudioSchedule = createAsyncThunk(
  "booking/extendStudioSchedule",
  async ({ bookingId, newEndTime }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.post(
        `/bookings/${bookingId}/extend`,
        { newEndTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể gia hạn lịch đặt" }
      );
    }
  }
);

// =========================================================
// ================       INITIAL STATE     =================
// =========================================================

const initialState = {
  draft: {
    studioId: null,
    startTime: null,
    endTime: null,
    details: [],
    promoId: null,
    promoCode: null,
    discountAmount: 0,
  },

  currentBooking: null,
  myBookings: [],
  staffBookings: [],

  loading: false,
  error: null,
};

// =========================================================
// ========================  SLICE  =========================
// =========================================================

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startNewBooking: (state, action) => {
      state.draft = {
        studioId: action.payload?.studioId || null,
        startTime: null,
        endTime: null,
        details: [],
        promoId: null,
        promoCode: null,
      };
      state.currentBooking = null;
      state.error = null;
    },

    setBookingTime: (state, action) => {
      state.draft.startTime = action.payload.startTime;
      state.draft.endTime = action.payload.endTime;
    },

    setBookingDetails: (state, action) => {
      state.draft.details = action.payload;
    },

    applyPromo: (state, action) => {
      state.draft.promoId = action.payload.promoId;
      state.draft.promoCode = action.payload.promoCode;
      state.draft.discountAmount = action.payload.discountAmount || 0;
    },

    removePromo: (state) => {
      state.draft.promoId = null;
      state.draft.promoCode = null;
      state.draft.discountAmount = 0;
    },

    resetBooking: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // ================= CREATE =================
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.draft = initialState.draft;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= MY BOOKINGS =================
      .addCase(getAllMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload?.items;
      })
      .addCase(getAllMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET BY ID =================
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking || action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DETAILS =================
      .addCase(getBookingWithDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingWithDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking || action.payload;
      })
      .addCase(getBookingWithDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= STATUS FILTER =================
      .addCase(getBookingsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(getBookingsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CONFIRM =================
      .addCase(confirmBooking.fulfilled, (state, action) => {
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })

      // ================= UPDATE =================
      .addCase(updateBooking.fulfilled, (state, action) => {
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      // ================= CHECK-IN =================
      .addCase(checkInBooking.fulfilled, (state, action) => {
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })

      // ================= CHECK-OUT =================
      .addCase(checkOutBooking.fulfilled, (state, action) => {
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })

      // ================= CANCEL BOOKING =================
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= REFUND REQUEST =================
      .addCase(requestRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= EXTEND SCHEDULE =================
      .addCase(extendStudioSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendStudioSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking || action.payload;

        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(extendStudioSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// EXPORT ACTIONS
export const {
  startNewBooking,
  setBookingTime,
  setBookingDetails,
  applyPromo,
  removePromo,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
