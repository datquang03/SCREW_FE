import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// CREATE REPORT
export const createReport = createAsyncThunk(
  "report/createReport",
  async (reportData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.post(`/reports`, reportData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo báo cáo thất bại" }
      );
    }
  }
);

// GET ALL REPORTS
export const getReports = createAsyncThunk(
  "report/getReports",
  async ({}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.get(
        `/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy danh sách báo cáo thất bại" }
      );
    }
  }
);

// GET REPORT BY ID
export const getReportById = createAsyncThunk(
  "report/getReportById",
  async (reportId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axiosInstance.get(`/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Lấy chi tiết báo cáo thất bại" }
      );
    }
  }
);

// UPDATE REPORT (Status & Compensation)
export const updateReport = createAsyncThunk(
  "report/updateReport",
  async ({ reportId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      // updateData can include { status, compensationAmount }
      const response = await axiosInstance.patch(
        `/reports/${reportId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật báo cáo thất bại" }
      );
    }
  }
);

// INITIAL STATE
const initialState = {
  reports: [],
  currentReport: null,
  total: 0,
  loading: false,
  error: null,
};

// SLICE
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
    resetCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE REPORT
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET REPORTS
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Case: payload is direct array
        if (Array.isArray(payload)) {
           state.reports = payload;
        } 
        // Case: { data: [...], pagination: {...} } or { reports: [...], total: ... }
        else if (payload && (Array.isArray(payload.data) || Array.isArray(payload.reports))) {
           state.reports = payload.data || payload.reports || [];
           if (payload.pagination || payload.total) {
                state.total = payload.pagination?.totalItems || payload.total || 0;
           }
        } 
        else {
           state.reports = [];
        }
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET REPORT BY ID
      .addCase(getReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE REPORT
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // Update list
        const index = state.reports.findIndex((r) => r._id === updated._id);
        if (index !== -1) {
          state.reports[index] = updated;
        }
        // Update current detail if matching
        if (state.currentReport?._id === updated._id) {
          state.currentReport = updated;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError, resetCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
