// src/features/booking/bookingSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// =========================================================
// ================       THUNKS API      ==================
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
      return res.data.data;
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
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy booking" }
      );
    }
  }
);

// 4) Lấy booking + services + equipment
export const getBookingWithDetails = createAsyncThunk(
  "booking/getBookingWithDetails",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/bookings/${bookingId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
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

// 6) Staff xác nhận booking
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

// 7) Cập nhật booking
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

// 8) ⭐ Lấy tất cả booking active dành cho STAFF
export const getAllBookingForStaff = createAsyncThunk(
  "booking/getAllBookingForStaff",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const res = await axiosInstance.get("/bookings/staff?includeAll=true", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // mong đợi trả về mảng bookings
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy booking cho staff" }
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
  },
  currentBooking: null,
  myBookings: [],
  staffBookings: [], // ⭐ thêm cho staff
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
    },
    removePromo: (state) => {
      state.draft.promoId = null;
      state.draft.promoCode = null;
    },
    resetBooking: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // CREATE BOOKING
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

      // GET ALL MY BOOKINGS
      .addCase(getAllMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        state.myBookings = data.items || data;
      })
      .addCase(getAllMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BOOKING BY ID
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

      // GET BOOKING WITH DETAILS
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

      // GET BY STATUS
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

      // CONFIRM BOOKING
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking || action.payload;
        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BOOKING
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking || action.payload;
        state.currentBooking = updated;
        state.myBookings = state.myBookings.map((b) =>
          b._id === updated._id ? updated : b
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ GET ALL BOOKING FOR STAFF
      .addCase(getAllBookingForStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingForStaff.fulfilled, (state, action) => {
        state.loading = false;
        // API trả về { bookings: [...], pagination: {...}, filters: {...} }
        const data = action.payload || {};
        state.staffBookings = data.bookings || data.data?.bookings || [];
      })
      .addCase(getAllBookingForStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  startNewBooking,
  setBookingTime,
  setBookingDetails,
  applyPromo,
  removePromo,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

// src/features/booking/bookingSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNKS ===

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

      return response.data.data; // → { booking: { ... }, paymentOptions: [...] }
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
      const res = await axiosInstance.get("/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
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
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy booking" }
      );
    }
  }
);

// 4) Lấy booking kèm chi tiết services/equipment
export const getBookingWithDetails = createAsyncThunk(
  "booking/getBookingWithDetails",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/bookings/${bookingId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
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

// === INITIAL STATE ===
const initialState = {
  draft: {
    studioId: null,
    startTime: null,
    endTime: null,
    details: [],
    promoId: null,
    promoCode: null,
  },
  currentBooking: null, // booking vừa tạo hoặc đang xem
  myBookings: [], // tất cả booking của user
  loading: false,
  error: null,
};

// === SLICE ===
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
    },
    removePromo: (state) => {
      state.draft.promoId = null;
      state.draft.promoCode = null;
    },
    resetBooking: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // CREATE BOOKING – QUAN TRỌNG NHẤT
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        // ĐÃ SỬA: CHỈ LẤY PHẦN booking THẬT SỰ
        state.currentBooking = action.payload.booking;
        state.draft = initialState.draft;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL MY BOOKINGS
      .addCase(getAllMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(getAllMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BOOKING BY ID – thêm fallback an toàn
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        // Backend có thể trả { booking: ... } hoặc trực tiếp booking object
        state.currentBooking = action.payload.booking || action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BOOKING WITH DETAILS – cũng thêm fallback
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

      // GET BOOKINGS BY STATUS
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
      });
  },
});

export const {
  startNewBooking,
  setBookingTime,
  setBookingDetails,
  applyPromo,
  removePromo,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;