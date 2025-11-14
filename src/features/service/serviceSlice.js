// src/features/service/serviceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNKS ===

// Lấy toàn bộ dịch vụ (có phân trang, tìm kiếm, lọc status)
export const getAllServices = createAsyncThunk(
  "service/getAllServices",
  async (
    { page = 1, limit = 10, status = "", search = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/services?page=${page}&limit=${limit}&status=${status}&search=${search}`
      );
      // API trả về: { success: true, data: [...], pagination: { total } }
      return response.data; // ← ĐÚNG: trả về toàn bộ response.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách dịch vụ" }
      );
    }
  }
);

// Lấy dịch vụ theo ID
export const getServiceById = createAsyncThunk(
  "service/getServiceById",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/services/${serviceId}`);
      return response.data.data; // ← API: { success: true, data: { _id, name, ... } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải thông tin dịch vụ" }
      );
    }
  }
);

// Tạo dịch vụ mới
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const response = await axiosInstance.post("/services", serviceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // ← API: { success: true, data: { _id, name, ... } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo dịch vụ thất bại" }
      );
    }
  }
);

// Cập nhật dịch vụ
export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ serviceId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const response = await axiosInstance.patch(
        `/services/${serviceId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // ← API: { success: true, data: { ... } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật dịch vụ thất bại" }
      );
    }
  }
);

// Xóa dịch vụ
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (serviceId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      await axiosInstance.delete(`/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return serviceId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa dịch vụ thất bại" }
      );
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  services: [],
  currentService: null,
  total: 0,
  loading: false,
  error: null,
};

// === SLICE ===
const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL SERVICES ===
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        // API trả về: { data: [...], pagination: { total } }
        state.services = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === GET BY ID ===
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === CREATE ===
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
        state.total += 1;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE ===
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.services.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.services[index] = updated;

        if (state.currentService?._id === updated._id) {
          state.currentService = updated;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === DELETE ===
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.services = state.services.filter((s) => s._id !== deletedId);
        state.total = Math.max(0, state.total - 1);
        if (state.currentService?._id === deletedId) {
          state.currentService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
