// src/features/equipment/equipmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =====================================================
   ASYNC THUNKS
===================================================== */

// CREATE EQUIPMENT
export const createEquipment = createAsyncThunk(
  "equipment/createEquipment",
  async (equipmentData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post("/equipment", equipmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to create equipment" }
      );
    }
  }
);

// GET ALL EQUIPMENT
export const getAllEquipments = createAsyncThunk(
  "equipment/getAllEquipments",
  async (
    { page = 1, limit = 10, status = "", search = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/equipment?page=${page}&limit=${limit}&status=${status}&search=${search}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch equipment" }
      );
    }
  }
);

// GET AVAILABLE EQUIPMENT (FOR RELATED ITEMS)
export const getAvailableEquipment = createAsyncThunk(
  "equipment/getAvailableEquipment",
  async ({ category } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/equipment/available", {
        params: { category },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch available equipment" }
      );
    }
  }
);

// GET SINGLE EQUIPMENT BY ID
export const getEquipmentById = createAsyncThunk(
  "equipment/getEquipmentById",
  async (equipmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/equipment/${equipmentId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch equipment details" }
      );
    }
  }
);

// UPDATE EQUIPMENT
export const updateEquipment = createAsyncThunk(
  "equipment/updateEquipment",
  async ({ equipmentId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(
        `/equipment/${equipmentId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to update equipment" }
      );
    }
  }
);

// DELETE EQUIPMENT
export const deleteEquipment = createAsyncThunk(
  "equipment/deleteEquipment",
  async (equipmentId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      await axiosInstance.delete(`/equipment/${equipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return equipmentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to delete equipment" }
      );
    }
  }
);

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
  equipments: [],
  availableEquipments: [],
  currentEquipment: null,
  total: 0,
  loading: false, // general loading
  loadingCurrent: false, // for single equipment
  relatedLoading: false, // for related equipments
  error: null,
};

/* =====================================================
   SLICE
===================================================== */
const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    clearEquipmentError: (state) => {
      state.error = null;
    },
    clearCurrentEquipment: (state) => {
      state.currentEquipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createEquipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments.push(action.payload);
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllEquipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = Array.isArray(action.payload?.equipment)
          ? action.payload.equipment
          : [];
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(getAllEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET AVAILABLE (RELATED)
      .addCase(getAvailableEquipment.pending, (state) => {
        state.relatedLoading = true;
      })
      .addCase(getAvailableEquipment.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.availableEquipments = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getAvailableEquipment.rejected, (state, action) => {
        state.relatedLoading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getEquipmentById.pending, (state) => {
        state.loadingCurrent = true;
      })
      .addCase(getEquipmentById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentEquipment = action.payload;
      })
      .addCase(getEquipmentById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateEquipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.equipments.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.equipments[index] = action.payload;
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEquipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = state.equipments.filter(
          (e) => e._id !== action.payload
        );
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEquipmentError, clearCurrentEquipment } =
  equipmentSlice.actions;
export default equipmentSlice.reducer;
