import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== THUNKS ==========================
// API search: truyền vào keyword
export const createSearch = createAsyncThunk(
  "search/createSearch",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/search", { keyword });
      // API dự kiến trả về { data: [...] }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tìm kiếm thất bại" }
      );
    }
  }
);

// ======================== INITIAL STATE =====================
const initialState = {
  results: [],
  loading: false,
  error: null,
};

// ============================ SLICE ========================
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(createSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;