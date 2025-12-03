
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
   COMMENTS FOR SET DESIGN
   - CREATE COMMENT
   - REPLY COMMENT
   - UPDATE COMMENT
   - UPDATE REPLY
   - DELETE REPLY
   - DELETE COMMENT
============================= */

export const createSetDesignComment = createAsyncThunk(
  "setDesign/createSetDesignComment",
  async ({ setDesignId, message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/set-designs/${setDesignId}/comments`,
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi bình luận thất bại" }
      );
    }
  }
);

export const replySetDesignComment = createAsyncThunk(
  "setDesign/replySetDesignComment",
  async ({ setDesignId, commentIndex, message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/set-designs/${setDesignId}/comments/${commentIndex}/reply`,
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Trả lời bình luận thất bại" }
      );
    }
  }
);

export const updateSetDesignComment = createAsyncThunk(
  "setDesign/updateSetDesignComment",
  async ({ setDesignId, commentIndex, message }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.put(
        `/set-designs/${setDesignId}/comments/${commentIndex}`,
        { message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật bình luận thất bại" }
      );
    }
  }
);

export const updateSetDesignReply = createAsyncThunk(
  "setDesign/updateSetDesignReply",
  async (
    { setDesignId, commentIndex, replyIndex, replyContent },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.put(
        `/set-designs/${setDesignId}/comments/${commentIndex}/replies/${replyIndex}`,
        { content: replyContent },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật trả lời thất bại" }
      );
    }
  }
);

export const deleteSetDesignReply = createAsyncThunk(
  "setDesign/deleteSetDesignReply",
  async ({ setDesignId, commentIndex, replyIndex }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      await axiosInstance.delete(
        `/set-designs/${setDesignId}/comments/${commentIndex}/replies/${replyIndex}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { setDesignId, commentIndex, replyIndex };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa trả lời thất bại" }
      );
    }
  }
);

export const deleteSetDesignComment = createAsyncThunk(
  "setDesign/deleteSetDesignComment",
  async ({ setDesignId, commentIndex }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      await axiosInstance.delete(
        `/set-designs/${setDesignId}/comments/${commentIndex}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { setDesignId, commentIndex };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa bình luận thất bại" }
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
   GET ACTIVE SET DESIGNS (cho Homepage)
============================= */
export const getActiveSetDesigns = createAsyncThunk(
  "setDesign/getActiveSetDesigns",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/set-designs/active");
      return res.data.data; // mảng các set design active
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải Set Design nổi bật" }
      );
    }
  }
);
/* =============================
   UPLOAD SET DESIGN IMAGES
   POST {{base_url}}/api/upload/set-design/:setDesignId/images
   body: FormData với images là File objects
============================= */
export const uploadSetDesignImages = createAsyncThunk(
  "setDesign/uploadSetDesignImages",
  async ({ setDesignId, images }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      // Tạo FormData và append các File objects
      const formData = new FormData();
      images.forEach((file) => {
        // Đảm bảo file là File object
        if (file instanceof File) {
          formData.append("images", file);
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

      // Backend nên trả về danh sách URL / publicId đã lưu trong set design
      return res.data; // ví dụ: { success: true, data: updatedSetDesign } hoặc { images: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thất bại" }
      );
    }
  }
);

/* =============================
   DELETE UPLOADED FILE (Dùng chung)
   DELETE {{base_url}}/api/upload/file/:publicId
============================= */
export const deleteUploadedFile = createAsyncThunk(
  "upload/deleteUploadedFile",
  async ({ publicId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const encodedId = encodeURIComponent(publicId);

      const res = await axiosInstance.delete(`/upload/file/${encodedId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return { publicId, response: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa file thất bại" }
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
  activeSetDesigns: [],
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

      // COMMENTS (SET DESIGN)
      .addCase(createSetDesignComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSetDesignComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSetDesignComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(replySetDesignComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(replySetDesignComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replySetDesignComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSetDesignComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSetDesignComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSetDesignComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSetDesignReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSetDesignReply.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSetDesignReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSetDesignReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSetDesignReply.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSetDesignReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSetDesignComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSetDesignComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSetDesignComment.rejected, (state, action) => {
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
        // lưu thông tin ảnh mới upload (tùy backend trả về)
        state.uploadedImages =
          action.payload?.images ||
          action.payload?.data?.images ||
          action.payload?.data ||
          [];
      })
      .addCase(uploadSetDesignImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE UPLOADED FILE (không ảnh hưởng nhiều tới state chung)
      .addCase(deleteUploadedFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUploadedFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUploadedFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
            // GET ACTIVE SET DESIGNS
      .addCase(getActiveSetDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveSetDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSetDesigns = action.payload || []; // lưu riêng để dùng ở homepage
      })
      .addCase(getActiveSetDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearSetDesignError, clearUploadedImages } =
  setDesignSlice.actions;
export default setDesignSlice.reducer;