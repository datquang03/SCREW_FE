// src/features/admin/admin.customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ------------------ GET ALL CUSTOMERS ------------------ */
export const getAllCustomers = createAsyncThunk(
  "admin/customer/getAll",
  async (
    { page = 1, limit = 10, search = "", isActive = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const url = `/admin/customers?page=${page}&limit=${limit}&search=${search}&isActive=${isActive}`;
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách khách hàng thất bại" }
      );
    }
  }
);

/* ------------------ GET CUSTOMER BY ID ------------------ */
export const getCustomerById = createAsyncThunk(
  "admin/customer/getById",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/customers/${customerId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không tìm thấy khách hàng" }
      );
    }
  }
);

/* ------------------ BAN CUSTOMER ------------------ */
export const banCustomer = createAsyncThunk(
  "admin/customer/ban",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/customers/${customerId}/ban`
      );
      return { customerId, data: response.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Khóa tài khoản thất bại" }
      );
    }
  }
);

/* ------------------ UNBAN CUSTOMER ------------------ */
export const unbanCustomer = createAsyncThunk(
  "admin/customer/unban",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/customers/${customerId}/unban`
      );
      return { customerId, data: response.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Mở khóa tài khoản thất bại" }
      );
    }
  }
);

/* ------------------ INITIAL STATE ------------------ */
const initialState = {
  customers: [],
  currentCustomer: null,
  pagination: { current: 1, pageSize: 10, total: 0 },
  loading: false,
  error: null,
  successMessage: null,
};

/* ------------------ SLICE ------------------ */
const adminCustomerSlice = createSlice({
  name: "adminCustomer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    resetPagination: (state) => {
      state.pagination = { current: 1, pageSize: 10, total: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const { users = [], total = 0, page = 1, limit = 10 } = action.payload;
        state.customers = users;
        state.pagination = {
          current: Number(page),
          pageSize: Number(limit),
          total,
        };
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = { ...(action.payload.data || action.payload) };
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BAN CUSTOMER
      .addCase(banCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.data.message || "Khóa tài khoản thành công";
        const { customerId } = action.payload;
        state.customers = state.customers.map((c) =>
          c._id === customerId ? { ...c, isActive: false } : c
        );
        if (state.currentCustomer?._id === customerId) {
          state.currentCustomer = { ...state.currentCustomer, isActive: false };
        }
      })
      .addCase(banCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UNBAN CUSTOMER
      .addCase(unbanCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.data.message || "Mở khóa tài khoản thành công";
        const { customerId } = action.payload;
        state.customers = state.customers.map((c) =>
          c._id === customerId ? { ...c, isActive: true } : c
        );
        if (state.currentCustomer?._id === customerId) {
          state.currentCustomer = { ...state.currentCustomer, isActive: true };
        }
      })
      .addCase(unbanCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentCustomer,
  resetPagination,
} = adminCustomerSlice.actions;
export default adminCustomerSlice.reducer;
