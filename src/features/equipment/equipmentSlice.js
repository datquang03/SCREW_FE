// src/features/equipment/equipmentSlice.js  ← ĐÚNG TÊN FILE
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === THUNKS ===
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
      return rejectWithValue(err.response?.data || { message: "Failed to create equipment" });
    }
  }
);

export const getAllEquipments = createAsyncThunk(
  "equipment/getAllEquipments",
  async ({ page = 1, limit = 10, status = "", search = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/equipment?page=${page}&limit=${limit}&status=${status}&search=${search}`
      );
      return response.data.data; // { equipment: [...], pagination: { total: 6 } }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch equipment" });
    }
  }
);

export const getEquipmentById = createAsyncThunk(
  "equipment/getEquipmentById",
  async (equipmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/equipment/${equipmentId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch equipment" });
    }
  }
);

export const updateEquipment = createAsyncThunk(
  "equipment/updateEquipment",
  async ({ equipmentId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.patch(`/equipment/${equipmentId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update equipment" });
    }
  }
);

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
      return rejectWithValue(err.response?.data || { message: "Failed to delete equipment" });
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  equipments: [],      // ← SỬA: equipments (có 's')
  currentEquipment: null,
  total: 0,
  loading: false,
  error: null,
};

// === SLICE ===
const equipmentSlice = createSlice({  // ← SỬA: equipmentSlice
  name: "equipment",
  initialState,
  reducers: {
    clearEquipmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments.push(action.payload); // ← equipments
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllEquipments.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // GET BY ID
      .addCase(getEquipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEquipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEquipment = action.payload;
      })
      .addCase(getEquipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.equipments.findIndex((e) => e._id === updated._id);
        if (index !== -1) state.equipments[index] = updated;
        if (state.currentEquipment?._id === updated._id) {
          state.currentEquipment = updated;
        }
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = state.equipments.filter((e) => e._id !== action.payload);
        if (state.currentEquipment?._id === action.payload) {
          state.currentEquipment = null;
        }
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEquipmentError } = equipmentSlice.actions;
export default equipmentSlice.reducer;