// src/features/schedule/scheduleSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNKS ===

// 1) Lấy tất cả schedules
export const getAllSchedules = createAsyncThunk(
  "schedule/getAllSchedules",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get("/schedules", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.data; // BE có thể trả { items, ... } hoặc []
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy danh sách lịch" }
      );
    }
  }
);

// 2) Lấy schedule theo ID
export const getScheduleById = createAsyncThunk(
  "schedule/getScheduleById",
  async (scheduleId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.get(`/schedules/${scheduleId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy thông tin lịch" }
      );
    }
  }
);

// 3) Tạo schedule mới
export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post("/schedules", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tạo lịch mới" }
      );
    }
  }
);

// 4) Cập nhật schedule
export const updateSchedule = createAsyncThunk(
  "schedule/updateSchedule",
  async ({ scheduleId, payload }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.patch(
        `/schedules/${scheduleId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể cập nhật lịch" }
      );
    }
  }
);

// 5) Xóa schedule
export const deleteSchedule = createAsyncThunk(
  "schedule/deleteSchedule",
  async (scheduleId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return scheduleId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể xóa lịch" }
      );
    }
  }
);

// === INITIAL STATE ===

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

// === SLICE ===

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetScheduleState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || [];
        state.items = Array.isArray(data) ? data : data.items || [];
      })
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload;
        state.current = created;
        state.items = [created, ...(state.items || [])];
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.current = updated;
        state.items = state.items.map((s) =>
          s._id === updated._id ? updated : s
        );
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.items = state.items.filter((s) => s._id !== id);
        if (state.current?._id === id) {
          state.current = null;
        }
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetScheduleState } = scheduleSlice.actions;

export default scheduleSlice.reducer;
