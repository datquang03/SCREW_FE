// src/features/studio/studioSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== THUNKS ==========================

// CREATE STUDIO
export const createStudio = createAsyncThunk(
  "studio/createStudio",
  async (studioData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post("/studios", studioData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo studio thất bại" }
      );
    }
  }
);

// GET STUDIO SCHEDULE
// Có thể truyền các query như { studioId, date, from, to, ... }
export const getStudioSchedule = createAsyncThunk(
  "studio/getStudioSchedule",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/studios/schedule", {
        params,
      });
      // API dự kiến trả về { data: [...] }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy lịch studio thất bại" }
      );
    }
  }
);

// GET ALL STUDIOS
export const getAllStudios = createAsyncThunk(
  "studio/getAllStudios",
  async (
    { page = 1, limit = 10, status = "", search = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/studios?page=${page}&limit=${limit}&status=${status}&search=${search}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy studio thất bại" }
      );
    }
  }
);

// GET ACTIVE STUDIOS
export const getActiveStudios = createAsyncThunk(
  "studio/getActiveStudios",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      minPrice = "",
      maxPrice = "",
      minCapacity = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/studios/active?page=${page}&limit=${limit}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&minCapacity=${minCapacity}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy studio active thất bại" }
      );
    }
  }
);

// GET BY ID
export const getStudioById = createAsyncThunk(
  "studio/getStudioById",
  async (studioId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/studios/${studioId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy studio thất bại" }
      );
    }
  }
);

// GET STUDIO AVAILABILITY
export const getStudioAvailability = createAsyncThunk(
  "studio/getStudioAvailability",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/studios/availability", {
        params,
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy trạng thái phòng thất bại" }
      );
    }
  }
);

// UPDATE
export const updateStudio = createAsyncThunk(
  "studio/updateStudio",
  async ({ studioId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.patch(
        `/studios/${studioId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật thất bại" }
      );
    }
  }
);

// DELETE
export const deleteStudio = createAsyncThunk(
  "studio/deleteStudio",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/studios/${studioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return studioId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Xóa thất bại" });
    }
  }
);

// STATUS
export const setActivate = createAsyncThunk(
  "studio/setActivate",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.patch(
        `/studios/${studioId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Kích hoạt thất bại" }
      );
    }
  }
);

export const setDeactivate = createAsyncThunk(
  "studio/setDeactivate",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.patch(
        `/studios/${studioId}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Ngưng hoạt động thất bại" }
      );
    }
  }
);

export const setMaintenance = createAsyncThunk(
  "studio/setMaintenance",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.patch(
        `/studios/${studioId}/maintenance`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Bảo trì thất bại" }
      );
    }
  }
);

// UPLOAD IMAGES
export const uploadStudioImage = createAsyncThunk(
  "studio/uploadStudioImage",
  async ({ studioId, files }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const formData = new FormData();
      files.forEach((file) => {
        if (file instanceof File) formData.append("images", file);
      });

      const response = await axiosInstance.post(
        `/studios/${studioId}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload thất bại" }
      );
    }
  }
);

// ========================== STATE ==========================
const initialState = {
  studios: [],
  currentStudio: null,
  studioSchedule: [],
  studioAvailability: null, // Thêm state cho availability
  total: 0,
  loading: false,
  error: null,
};

// ========================== SLICE ==========================
const studioSlice = createSlice({
  name: "studio",
  initialState,
  reducers: {
    clearStudioError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.studios.push(action.payload);
      })
      .addCase(createStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllStudios.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStudios.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = action.payload?.studios || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getAllStudios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getActiveStudios.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveStudios.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = action.payload?.studios || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getActiveStudios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getStudioById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudioById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudio = action.payload;
      })
      .addCase(getStudioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // STUDIO SCHEDULE
      .addCase(getStudioSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudioSchedule.fulfilled, (state, action) => {
        state.loading = false;
        // Lưu toàn bộ payload từ API (bao gồm studios, pagination, dateRange)
        const payload = action.payload || {};
        // API trả về: { studios: [...], pagination: {...}, dateRange: {...} }
        state.studioSchedule = {
          studios: payload.studios || payload.data?.studios || [],
          pagination: payload.pagination || {},
          dateRange: payload.dateRange || {},
        };
      })
      .addCase(getStudioSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getStudioAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudioAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.studioAvailability = action.payload;
      })
      .addCase(getStudioAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStudio.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudio.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.studios.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.studios[index] = updated;
        if (state.currentStudio?._id === updated._id)
          state.currentStudio = updated;
      })
      .addCase(updateStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStudio.fulfilled, (state, action) => {
        state.studios = state.studios.filter((s) => s._id !== action.payload);
      })

      .addCase(uploadStudioImage.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.studios.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.studios[index] = updated;
        if (state.currentStudio?._id === updated._id)
          state.currentStudio = updated;
      })

      // ================= addMatcher (cuối) =================
      .addMatcher(
        (action) =>
          [setActivate, setDeactivate, setMaintenance].some((t) =>
            t.pending.match(action)
          ),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          [setActivate, setDeactivate, setMaintenance].some((t) =>
            t.fulfilled.match(action)
          ),
        (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.studios.findIndex((s) => s._id === updated._id);
          if (index !== -1) state.studios[index] = updated;
          if (state.currentStudio?._id === updated._id)
            state.currentStudio = updated;
        }
      )
      .addMatcher(
        (action) =>
          [setActivate, setDeactivate, setMaintenance].some((t) =>
            t.rejected.match(action)
          ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearStudioError } = studioSlice.actions;
export default studioSlice.reducer;
