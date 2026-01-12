// src/features/admin/admin.staffSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNKS ===

// Lấy danh sách tất cả nhân viên với params (pagination + filter)
export const getAllStaffs = createAsyncThunk(
  "admin/staff/getAll",
  async (
    params = { page: 1, limit: 10, search: "", position: "", isActive: "" },
    { rejectWithValue }
  ) => {
    try {
      let { page, limit, search, position, isActive } = params;
      if (!position || position === "undefined") position = "";

      const response = await axiosInstance.get(
        `/admin/staff?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&position=${encodeURIComponent(position)}&isActive=${isActive}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách nhân viên thất bại" }
      );
    }
  }
);

// Lấy thông tin nhân viên theo ID
export const getStaffById = createAsyncThunk(
  "admin/staff/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/staff/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không tìm thấy nhân viên" }
      );
    }
  }
);

// Cập nhật thông tin nhân viên (Admin)
export const updateStaff = createAsyncThunk(
  "admin/staff/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/staff/${id}`, data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật nhân viên thất bại" }
      );
    }
  }
);

// Vô hiệu hóa nhân viên
export const deactivateStaff = createAsyncThunk(
  "admin/staff/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/staff/${id}/deactivate`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Vô hiệu hóa thất bại" }
      );
    }
  }
);

// Kích hoạt lại nhân viên
export const activateStaff = createAsyncThunk(
  "admin/staff/activate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/staff/${id}/activate`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Kích hoạt thất bại" }
      );
    }
  }
);



// === SLICE ===
const adminStaffSlice = createSlice({
  name: "adminStaff",
  initialState: {
    staffs: [],
    currentStaff: null,
    loading: false,
    error: null,
    successMessage: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL STAFFS ===
      .addCase(getAllStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload.users || [];
        state.page = action.payload.page || 1;
        state.limit = action.meta.arg.limit || 10;
        state.total = action.payload.total || 0;
      })
      .addCase(getAllStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === GET STAFF BY ID ===
      .addCase(getStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload;
      })
      .addCase(getStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE STAFF (Admin) ===
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Cập nhật nhân viên thành công";
        const idx = state.staffs.findIndex((s) => s._id === action.meta.arg.id);
        if (idx !== -1)
          state.staffs[idx] = { ...state.staffs[idx], ...action.payload };
        if (state.currentStaff?._id === action.meta.arg.id) {
          state.currentStaff = { ...state.currentStaff, ...action.payload };
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === DEACTIVATE STAFF ===
      .addCase(deactivateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Vô hiệu hóa thành công";
        const idx = state.staffs.findIndex((s) => s._id === action.meta.arg);
        if (idx !== -1) state.staffs[idx].isActive = false;
      })
      .addCase(deactivateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === ACTIVATE STAFF ===
      .addCase(activateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Kích hoạt thành công";
        const idx = state.staffs.findIndex((s) => s._id === action.meta.arg);
        if (idx !== -1) state.staffs[idx].isActive = true;
      })
      .addCase(activateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === UPDATE STAFF PROFILE (Nhân viên tự cập nhật) ===
     
  },
});

export const { clearError, clearSuccess, clearCurrentStaff } =
  adminStaffSlice.actions;

export default adminStaffSlice.reducer;
