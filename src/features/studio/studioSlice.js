// src/features/studio/studioSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNK: CREATE STUDIO ===
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
        err.response?.data || { message: "Failed to create studio" }
      );
    }
  }
);

// === THUNK: GET ACTIVE STUDIOS ===
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
        err.response?.data || { message: "Failed to fetch active studios" }
      );
    }
  }
);

// === THUNK: GET ALL STUDIOS ===
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
        err.response?.data || { message: "Failed to fetch studios" }
      );
    }
  }
);

// === THUNK: GET STUDIO BY ID ===
export const getStudioById = createAsyncThunk(
  "studio/getStudioById",
  async (studioId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/studios/${studioId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch studio" }
      );
    }
  }
);

// === THUNK: UPDATE STUDIO ===
export const updateStudio = createAsyncThunk(
  "studio/updateStudio",
  async ({ studioId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(
        `/studios/${studioId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to update studio" }
      );
    }
  }
);

// === THUNK: DELETE STUDIO ===
export const deleteStudio = createAsyncThunk(
  "studio/deleteStudio",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      await axiosInstance.delete(`/studios/${studioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return studioId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to delete studio" }
      );
    }
  }
);

// === THUNK: ACTIVATE STUDIO ===
export const setActivate = createAsyncThunk(
  "studio/setActivate",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(
        `/studios/${studioId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data; // trả về studio đã cập nhật
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to activate studio" }
      );
    }
  }
);

// === THUNK: DEACTIVATE STUDIO ===
export const setDeactivate = createAsyncThunk(
  "studio/setDeactivate",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(
        `/studios/${studioId}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to deactivate studio" }
      );
    }
  }
);
// === THUNK: MAINTENANCE STUDIO ===
export const setMaintenance = createAsyncThunk(
  "studio/setMaintenance",
  async (studioId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(
        `/studios/${studioId}/maintenance`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to set maintenance" }
      );
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  studios: [],
  currentStudio: null,
  total: 0,
  loading: false,
  error: null,
};

// === SLICE ===
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
      // CREATE
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

      // GET ALL
      .addCase(getAllStudios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudios.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = Array.isArray(action.payload?.studios)
          ? action.payload.studios
          : [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getAllStudios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getStudioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudioById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudio = action.payload;
      })
      .addCase(getStudioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudio.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudio = action.payload;
        if (state.currentStudio?._id === updatedStudio._id) {
          state.currentStudio = updatedStudio;
        }
        const index = state.studios.findIndex(
          (s) => s._id === updatedStudio._id
        );
        if (index !== -1) state.studios[index] = updatedStudio;
      })
      .addCase(updateStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = state.studios.filter((s) => s._id !== action.payload);
        if (state.currentStudio?._id === action.payload)
          state.currentStudio = null;
      })
      .addCase(deleteStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ACTIVATE
      .addCase(setActivate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setActivate.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.studios.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.studios[index] = updated;
        if (state.currentStudio?._id === updated._id) {
          state.currentStudio = updated;
        }
      })
      .addCase(setActivate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DEACTIVATE
      .addCase(setDeactivate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDeactivate.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.studios.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.studios[index] = updated;
        if (state.currentStudio?._id === updated._id) {
          state.currentStudio = updated;
        }
      })
      .addCase(setDeactivate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MAINTENANCE
      .addCase(setMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.studios.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.studios[index] = updated;
        if (state.currentStudio?._id === updated._id) {
          state.currentStudio = updated;
        }
      })
      .addCase(setMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET ACTIVE STUDIOS
      .addCase(getActiveStudios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveStudios.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = Array.isArray(action.payload?.studios)
          ? action.payload.studios
          : [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getActiveStudios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudioError } = studioSlice.actions;
export default studioSlice.reducer;

      // ========== 2. addMatcher() — luôn nằm cuối ==========
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
