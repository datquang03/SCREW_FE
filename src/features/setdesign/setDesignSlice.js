// src/features/setDesign/setDesignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =====================================
   GET ALL SET DESIGNS (pagination + search + status)
===================================== */
export const getAllSetDesigns = createAsyncThunk(
  "setDesign/getAllSetDesigns",
  async ( { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/set-designs`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải set design" }
      );
    }
  }
);
/* =====================================
   GET SET DESIGN BY ID
===================================== */
export const getSetDesignById = createAsyncThunk(
  "setDesign/getSetDesignById",
  async (setDesignId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/set-designs/${setDesignId}`);
      return response.data.data; // { _id, name, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải set design" }
      );
    }
  }
);

/* =====================================
   CREATE SET DESIGN
===================================== */
export const createSetDesign = createAsyncThunk(
  "setDesign/createSetDesign",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const response = await axiosInstance.post(`/set-designs`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo set design thất bại" }
      );
    }
  }
);

/* =====================================
   UPDATE SET DESIGN
===================================== */
export const updateSetDesign = createAsyncThunk(
  "setDesign/updateSetDesign",
  async ({ setDesignId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      const response = await axiosInstance.patch(
        `/set-designs/${setDesignId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật set design thất bại" }
      );
    }
  }
);

/* =====================================
   DELETE SET DESIGN
===================================== */
export const deleteSetDesign = createAsyncThunk(
  "setDesign/deleteSetDesign",
  async (setDesignId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không tìm thấy token");

      await axiosInstance.delete(`/set-designs/${setDesignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return setDesignId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa set design thất bại" }
      );
    }
  }
);

/* =====================================
   INITIAL STATE
===================================== */
const initialState = {
  setDesigns: [],
  currentSetDesign: null,
  total: 0,
  loading: false,
  error: null,
};

/* =====================================
   SLICE
===================================== */
const setDesignSlice = createSlice({
  name: "setDesign",
  initialState,
  reducers: {
    clearSetDesignError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== GET ALL ===== */
      .addCase(getAllSetDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSetDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(getAllSetDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== GET BY ID ===== */
      .addCase(getSetDesignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSetDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSetDesign = action.payload;
      })
      .addCase(getSetDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(createSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns.push(action.payload);
        state.total += 1;
      })
      .addCase(createSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.setDesigns.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.setDesigns[index] = updated;

        if (state.currentSetDesign?._id === updated._id) {
          state.currentSetDesign = updated;
        }
      })
      .addCase(updateSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== DELETE ===== */
      .addCase(deleteSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;

        state.setDesigns = state.setDesigns.filter((s) => s._id !== deletedId);
        state.total = Math.max(0, state.total - 1);

        if (state.currentSetDesign?._id === deletedId) {
          state.currentSetDesign = null;
        }
      })
      .addCase(deleteSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetDesignError } = setDesignSlice.actions;
export default setDesignSlice.reducer;
