// src/features/setDesign/setDesignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =============================
   GET ALL SET DESIGNS
============================= */
export const getAllSetDesigns = createAsyncThunk(
  "setDesign/getAllSetDesigns",
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/set-designs?page=${page}&limit=${limit}`
      );
      return res.data; // expected { success, data: [...], pagination: {...} }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách set design" }
      );
    }
  }
);

/* =============================
   GET BY ID
============================= */
export const getSetDesignById = createAsyncThunk(
  "setDesign/getSetDesignById",
  async (setDesignId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/set-designs/${setDesignId}`);
      return res.data.data; // single item
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải thông tin Set Design" }
      );
    }
  }
);

/* =============================
   CREATE
============================= */
export const createSetDesign = createAsyncThunk(
  "setDesign/createSetDesign",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(`/set-designs`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo set design thất bại" }
      );
    }
  }
);

/* =============================
   UPDATE
============================= */
export const updateSetDesign = createAsyncThunk(
  "setDesign/updateSetDesign",
  async ({ setDesignId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.put(
        `/set-designs/${setDesignId}`,
        updateData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật set design thất bại" }
      );
    }
  }
);

/* =============================
   DELETE
============================= */
export const deleteSetDesign = createAsyncThunk(
  "setDesign/deleteSetDesign",
  async (setDesignId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/set-designs/${setDesignId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return setDesignId; // return deleted id
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa set design thất bại" }
      );
    }
  }
);

/* =============================
   UPLOAD MULTIPLE IMAGES
   API: /api/upload/set-design/:id/images
   body: FormData with files
============================= */
export const uploadSetDesignImages = createAsyncThunk(
  "setDesign/uploadSetDesignImages",
  async ({ setDesignId, images }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      // Create FormData and append files
      const formData = new FormData();

      // images should be an array of File objects
      // Append each file with the same field name "images" for multiple files
      images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        } else {
          // If not a File object, skip or handle error
          console.warn("Invalid file object:", file);
        }
      });

      const res = await axiosInstance.post(
        `/upload/set-design/${setDesignId}/images`,
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Expect res.data to include uploaded images array or URLs
      return res.data; // e.g. { success: true, images: [ ... ] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thất bại" }
      );
    }
  }
);

/* =============================
   INITIAL
============================= */
const initialState = {
  setDesigns: [],
  currentSetDesign: null,
  total: 0,
  loading: false,
  uploadedImages: [], // last uploaded images info
  error: null,
};

/* =============================
   SLICE
============================= */
const setDesignSlice = createSlice({
  name: "setDesign",
  initialState,
  reducers: {
    clearSetDesignError: (state) => {
      state.error = null;
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllSetDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSetDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = action.payload.data || [];
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(getAllSetDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getSetDesignById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSetDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSetDesign = action.payload;
      })
      .addCase(getSetDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns.unshift(action.payload); // thêm lên đầu
        state.total += 1;
      })
      .addCase(createSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.setDesigns.findIndex((s) => s._id === updated._id);
        if (idx !== -1) state.setDesigns[idx] = updated;
        if (state.currentSetDesign?._id === updated._id)
          state.currentSetDesign = updated;
      })
      .addCase(updateSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = state.setDesigns.filter(
          (i) => i._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        if (state.currentSetDesign?._id === action.payload)
          state.currentSetDesign = null;
      })
      .addCase(deleteSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD IMAGES
      .addCase(uploadSetDesignImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadSetDesignImages.fulfilled, (state, action) => {
        state.loading = false;
        // store whatever backend returned (try common keys)
        state.uploadedImages =
          action.payload?.images || action.payload?.data || [];
      })
      .addCase(uploadSetDesignImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetDesignError, clearUploadedImages } =
  setDesignSlice.actions;
export default setDesignSlice.reducer;

// src/features/setDesign/setDesignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =============================
   GET ALL SET DESIGNS
============================= */
export const getAllSetDesigns = createAsyncThunk(
  "setDesign/getAllSetDesigns",
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/set-designs?page=${page}&limit=${limit}`
      );
      return res.data; // expected { success, data: [...], pagination: {...} }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách set design" }
      );
    }
  }
);

/* =============================
   GET BY ID
============================= */
export const getSetDesignById = createAsyncThunk(
  "setDesign/getSetDesignById",
  async (setDesignId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/set-designs/${setDesignId}`);
      return res.data.data; // single item
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải thông tin Set Design" }
      );
    }
  }
);

/* =============================
   CREATE
============================= */
export const createSetDesign = createAsyncThunk(
  "setDesign/createSetDesign",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(`/set-designs`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Tạo set design thất bại" }
      );
    }
  }
);

/* =============================
   UPDATE
============================= */
export const updateSetDesign = createAsyncThunk(
  "setDesign/updateSetDesign",
  async ({ setDesignId, updateData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.put(
        `/set-designs/${setDesignId}`,
        updateData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật set design thất bại" }
      );
    }
  }
);

/* =============================
   DELETE
============================= */
export const deleteSetDesign = createAsyncThunk(
  "setDesign/deleteSetDesign",
  async (setDesignId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/set-designs/${setDesignId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return setDesignId; // return deleted id
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa set design thất bại" }
      );
    }
  }
);

/* =============================
   UPLOAD MULTIPLE IMAGES (Option B)
   body: { images: [ { base64Image, fileName }, ... ] }
============================= */
export const uploadSetDesignImages = createAsyncThunk(
  "setDesign/uploadSetDesignImages",
  async ({ images }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      // Ensure shape exactly { base64Image, fileName }
      const payload = {
        images: images.map((img) => ({
          base64Image:
            img.base64Image ||
            img.base64 ||
            img.base64Img ||
            img.base64_data ||
            img.base64,
          fileName: img.fileName || img.name || "file.png",
        })),
      };

      const res = await axiosInstance.post(
        `/set-designs/upload-image`,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Expect res.data to include uploaded images array or URLs
      return res.data; // e.g. { success: true, images: [ ... ] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thất bại" }
      );
    }
  }
);

/* =============================
   INITIAL
============================= */
const initialState = {
  setDesigns: [],
  currentSetDesign: null,
  total: 0,
  loading: false,
  uploadedImages: [], // last uploaded images info
  error: null,
};

/* =============================
   SLICE
============================= */
const setDesignSlice = createSlice({
  name: "setDesign",
  initialState,
  reducers: {
    clearSetDesignError: (state) => {
      state.error = null;
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllSetDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSetDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = action.payload.data || [];
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(getAllSetDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getSetDesignById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSetDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSetDesign = action.payload;
      })
      .addCase(getSetDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns.unshift(action.payload); // thêm lên đầu
        state.total += 1;
      })
      .addCase(createSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.setDesigns.findIndex((s) => s._id === updated._id);
        if (idx !== -1) state.setDesigns[idx] = updated;
        if (state.currentSetDesign?._id === updated._id)
          state.currentSetDesign = updated;
      })
      .addCase(updateSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = state.setDesigns.filter(
          (i) => i._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        if (state.currentSetDesign?._id === action.payload)
          state.currentSetDesign = null;
      })
      .addCase(deleteSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD IMAGES
      .addCase(uploadSetDesignImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadSetDesignImages.fulfilled, (state, action) => {
        state.loading = false;
        // store whatever backend returned (try common keys)
        state.uploadedImages =
          action.payload?.images || action.payload?.data || [];
      })
      .addCase(uploadSetDesignImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetDesignError, clearUploadedImages } =
  setDesignSlice.actions;
export default setDesignSlice.reducer;
