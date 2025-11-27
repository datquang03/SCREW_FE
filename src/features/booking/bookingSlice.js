// src/features/booking/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

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

const initialState = {
  // Dữ liệu tạm người dùng đang chọn (trước khi bấm xác nhận cuối)
  draft: {
    studioId: null,
    startTime: null,
    endTime: null,
    details: [], 
    promoId: null,
    promoCode: null, 
  },

  // Booking đã được tạo thành công trên server
  currentBooking: null, // { bookingId, totalPrice, status, paymentUrl?, ... }

  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Bắt đầu booking mới
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

    // Cập nhật thời gian
    setBookingTime: (state, action) => {
      state.draft.startTime = action.payload.startTime;
      state.draft.endTime = action.payload.endTime;
    },

    // Thêm/sửa/xóa thiết bị hoặc dịch vụ
    setBookingDetails: (state, action) => {
      state.draft.details = action.payload; // mảng mới
    },

    // Áp dụng mã giảm giá
    applyPromo: (state, action) => {
      state.draft.promoId = action.payload.promoId;
      state.draft.promoCode = action.payload.promoCode;
    },

    // Xóa mã giảm giá
    removePromo: (state) => {
      state.draft.promoId = null;
      state.draft.promoCode = null;
    },

    // Reset khi rời trang hoặc thành công
    resetBooking: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload; // lưu kết quả cuối cùng
        state.draft = initialState.draft; // xóa draft
      })
      .addCase(createBooking.rejected, (state, action) => {
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
