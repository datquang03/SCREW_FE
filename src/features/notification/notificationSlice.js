// src/features/notification/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== THUNKS ==========================

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const res = await axiosInstance.get(`/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách thông báo" }
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notification/markNotificationRead",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const res = await axiosInstance.put(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể đánh dấu thông báo" }
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      await axiosInstance.delete(`/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa thông báo thất bại" }
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async ({ title, message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const res = await axiosInstance.post(
        `/notifications`,
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo thông báo thất bại" }
      );
    }
  }
);

// ========================== INITIAL STATE ==========================
const initialState = {
  notifications: [],
  pagination: null,
  loading: false,
  error: null,
};

// ========================== SLICE ==========================
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },

    // THÊM ACTION: Đánh dấu tất cả đã đọc (client-side, không cần API mới)
    markAllAsRead: (state) => {
      state.notifications.forEach((notif) => {
        if (!notif.read) {
          notif.read = true;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MARK ONE READ
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.notifications.findIndex((n) => n._id === updated._id);
        if (idx !== -1) state.notifications[idx] = updated;
      })

      // DELETE
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );
      })

      // CREATE
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      });
  },
});

// Export actions - ĐÃ THÊM markAllAsRead
export const { clearNotificationError, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;