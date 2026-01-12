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
  async (
    { setDesignId, commentIndex, message },
    { rejectWithValue, getState }
  ) => {
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
  async (
    { setDesignId, commentIndex, message },
    { rejectWithValue, getState }
  ) => {
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
  async (
    { setDesignId, commentIndex, replyIndex },
    { rejectWithValue, getState }
  ) => {
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
   POST {{base_url}}/api/upload/images
   body: FormData với images là File objects
============================= */
export const uploadSetDesignImages = createAsyncThunk(
  "setDesign/uploadSetDesignImages",
  async (images, { rejectWithValue, getState }) => {
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
        `/upload/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend trả về danh sách ảnh
      return res.data.data; // { images: [{...}, {...}] }
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
   CUSTOM SET DESIGN REQUEST
   POST /set-designs/custom-request
============================= */
// SEND CUSTOM SET DESIGN REQUEST
export const customSetDesignRequest = createAsyncThunk(
  "setDesign/customSetDesignRequest",
  async (
    {
      description,
      preferredCategory,
      budget,
      referenceImages = [],
      setDesignId,
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().auth || {};

      // Tạo FormData để gửi file + data
      const formData = new FormData();
      formData.append("description", description);
      formData.append("preferredCategory", preferredCategory);
      formData.append("budget", budget);
      if (setDesignId) formData.append("setDesignId", setDesignId);

      // Append files (referenceImages là File objects)
      referenceImages.forEach((file) => {
        if (file instanceof File) {
          formData.append("referenceImages", file);
        }
      });

      const res = await axiosInstance.post(
        "/set-designs/custom-request",
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi yêu cầu custom thất bại" }
      );
    }
  }
);

// GET MY CUSTOM REQUESTS (pagination)
export const getMyCustomSetDesign = createAsyncThunk(
  "setDesign/getMyCustomSetDesign",
  async ({ page = 1, limit = 10 }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const res = await axiosInstance.get(
        `/set-designs/custom-request?page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Không thể tải danh sách yêu cầu của bạn",
        }
      );
    }
  }
);

// DELETE MY CUSTOM REQUEST
export const deleteMyCustomSetDesign = createAsyncThunk(
  "setDesign/deleteMyCustomSetDesign",
  async (requestId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      await axiosInstance.delete(`/set-designs/custom-requests/${requestId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return requestId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa yêu cầu custom thất bại" }
      );
    }
  }
);

/* =============================
   GET ALL CUSTOM REQUESTS
   GET /set-designs/custom-requests
============================= */
export const getCustomRequestSetDesign = createAsyncThunk(
  "setDesign/getCustomRequestSetDesign",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.get("/set-designs/custom-requests", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return res.data.data; // danh sách yêu cầu custom
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Không thể tải danh sách yêu cầu custom",
        }
      );
    }
  }
);

/* =============================
   GET CUSTOM REQUEST BY ID
   GET /set-designs/custom-requests/:id
============================= */
export const getCustomRequestSetDesignById = createAsyncThunk(
  "setDesign/getCustomRequestSetDesignById",
  async (requestId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.get(
        `/set-designs/custom-requests/${requestId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      return res.data.data; // yêu cầu custom theo id
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải yêu cầu custom" }
      );
    }
  }
);
export const updateCustomRequestStatus = createAsyncThunk(
  "setDesign/updateCustomRequestStatus",
  async ({ requestId, status }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.patch(
        `/set-designs/custom-requests/${requestId}/status`,
        { status }, // chỉ gửi đúng 1 field status → đúng chuẩn API
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return res.data.data; // backend trả về custom request đã được update
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật trạng thái thất bại" }
      );
    }
  }
);
/* =============================
   CONVERT CUSTOM REQUEST → SET DESIGN
   POST /api/set-designs/custom-requests/:id/convert
   Body: { name, price, category, tags }
============================= */
export const convertCustomRequestToSetDesign = createAsyncThunk(
  "setDesign/convertCustomRequestToSetDesign",
  async ({ requestId, setDesignData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};

      const res = await axiosInstance.post(
        `/set-designs/custom-requests/${requestId}/convert`,
        setDesignData, // { name, price, tags, isActive, additionalImages }
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Backend thường trả về Set Design mới được tạo
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Chuyển đổi yêu cầu thành Set Design thất bại",
        }
      );
    }
  }
);

/* =============================
   CONVERTED CUSTOM DESIGNS (STAFF/CUSTOMER)
============================= */
export const getConvertedCustomDesigns = createAsyncThunk(
  "setDesign/getConvertedCustomDesigns",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const res = await axiosInstance.get(
        `/set-designs/converted-custom-designs?page=${page}&limit=${limit}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách thiết kế đã chuyển đổi" }
      );
    }
  }
);

// Staff get by ID
export const getConvertedCustomDesignById = createAsyncThunk(
  "setDesign/getConvertedCustomDesignById",
  async (designId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const res = await axiosInstance.get(
        `/set-designs/converted-custom-designs/${designId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải thiết kế đã chuyển đổi" }
      );
    }
  }
);

// Customer get by ID (same endpoint, no token required)
export const getConvertedCustomDesignByIdPublic = createAsyncThunk(
  "setDesign/getConvertedCustomDesignByIdPublic",
  async (designId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const res = await axiosInstance.get(
        `/set-designs/converted-custom-designs/${designId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải thiết kế đã chuyển đổi" }
      );
    }
  }
);

export const updateConvertedCustomDesign = createAsyncThunk(
  "setDesign/updateConvertedCustomDesign",
  async ({ designId, payload }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const res = await axiosInstance.put(
        `/set-designs/converted-custom-designs/${designId}`,
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể cập nhật thiết kế đã chuyển đổi" }
      );
    }
  }
);

export const deleteConvertedCustomDesign = createAsyncThunk(
  "setDesign/deleteConvertedCustomDesign",
  async (designId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      await axiosInstance.delete(
        `/set-designs/converted-custom-designs/${designId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return designId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể xóa thiết kế đã chuyển đổi" }
      );
    }
  }
);

// Public (customer) list converted designs
export const getConvertedCustomDesignsPublic = createAsyncThunk(
  "setDesign/getConvertedCustomDesignsPublic",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/set-designs/converted-custom-designs?page=${page}&limit=${limit}`
      );
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể tải danh sách thiết kế chuyển đổi" }
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
  convertedDesigns: [],
  convertedDesignPagination: { page: 1, limit: 10, total: 0, pages: 0 },
  currentConvertedDesign: null,
  convertedDesignsPublic: [],
  convertedDesignPaginationPublic: { page: 1, limit: 10, total: 0, pages: 0 },
  currentConvertedDesignPublic: null,
  customRequests: [],
  myCustomRequests: [],
  myCustomPagination: { page: 1, limit: 10, total: 0, pages: 0 },
  currentCustomRequest: null,
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
      // CUSTOM REQUEST

      .addCase(customSetDesignRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(customSetDesignRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(customSetDesignRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCustomRequestSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomRequestSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.customRequests = action.payload || [];
      })
      .addCase(getCustomRequestSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET MY CUSTOM REQUESTS
      .addCase(getMyCustomSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCustomSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.myCustomRequests = data;
        } else if (data?.items) {
          state.myCustomRequests = data.items;
          state.myCustomPagination = {
            page: data.page || 1,
            limit: data.limit || 10,
            total: data.total || data.items?.length || 0,
            pages:
              data.pages || Math.ceil((data.total || 0) / (data.limit || 10)),
          };
        }
      })
      .addCase(getMyCustomSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE MY CUSTOM REQUEST
      .addCase(deleteMyCustomSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMyCustomSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.myCustomRequests = state.myCustomRequests.filter(
          (r) => r._id !== id
        );
        state.myCustomPagination = {
          ...state.myCustomPagination,
          total: Math.max(0, (state.myCustomPagination.total || 1) - 1),
        };
      })
      .addCase(deleteMyCustomSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCustomRequestSetDesignById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomRequestSetDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomRequest = action.payload;
      })
      .addCase(getCustomRequestSetDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        // Cập nhật trong danh sách
        const idx = state.customRequests.findIndex(
          (r) => r._id === updated._id
        );
        if (idx !== -1) state.customRequests[idx] = updated;

        // Cập nhật chi tiết nếu đang xem
        if (state.currentCustomRequest?._id === updated._id) {
          state.currentCustomRequest = updated;
        }
      })
      .addCase(updateCustomRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CONVERT CUSTOM REQUEST → SET DESIGN
      .addCase(convertCustomRequestToSetDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(convertCustomRequestToSetDesign.fulfilled, (state, action) => {
        state.loading = false;

        const newSetDesign = action.payload;

        // Thêm Set Design mới vào đầu danh sách (nếu cần hiển thị ngay)
        state.setDesigns.unshift(newSetDesign);

        // Cập nhật custom request: đánh dấu đã chuyển đổi (nếu backend có trả về)
        if (state.currentCustomRequest?._id === action.meta.arg.requestId) {
          state.currentCustomRequest.convertedToDesignId = newSetDesign._id;
          state.currentCustomRequest.status = "completed"; // hoặc "converted"
        }

        // Cập nhật trong danh sách custom requests
        const idx = state.customRequests.findIndex(
          (r) => r._id === action.meta.arg.requestId
        );
        if (idx !== -1) {
          state.customRequests[idx].convertedToDesignId = newSetDesign._id;
          state.customRequests[idx].status = "completed";
        }

        // Tăng total set design (nếu dùng pagination)
        state.total += 1;
      })
      .addCase(convertCustomRequestToSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Chuyển đổi thất bại";
      })

      // ================= CONVERTED CUSTOM DESIGNS =================
      .addCase(getConvertedCustomDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConvertedCustomDesigns.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.convertedDesigns = data;
        } else if (data?.items) {
          state.convertedDesigns = data.items;
          state.convertedDesignPagination = {
            page: data.page || 1,
            limit: data.limit || 10,
            total: data.total || data.items?.length || 0,
            pages: data.pages || Math.ceil((data.total || 0) / (data.limit || 10)),
          };
        } else {
          state.convertedDesigns = data?.data || [];
        }
      })
      .addCase(getConvertedCustomDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getConvertedCustomDesignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConvertedCustomDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConvertedDesign = action.payload;
      })
      .addCase(getConvertedCustomDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getConvertedCustomDesignByIdPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConvertedCustomDesignByIdPublic.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConvertedDesign = action.payload;
      })
      .addCase(getConvertedCustomDesignByIdPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateConvertedCustomDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConvertedCustomDesign.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // update list
        state.convertedDesigns = state.convertedDesigns.map((d) =>
          d._id === updated._id ? updated : d
        );
        if (state.currentConvertedDesign?._id === updated._id) {
          state.currentConvertedDesign = updated;
        }
      })
      .addCase(updateConvertedCustomDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteConvertedCustomDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConvertedCustomDesign.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.convertedDesigns = state.convertedDesigns.filter((d) => d._id !== id);
        if (state.currentConvertedDesign?._id === id) {
          state.currentConvertedDesign = null;
        }
      })
      .addCase(deleteConvertedCustomDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Public converted designs list
      .addCase(getConvertedCustomDesignsPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConvertedCustomDesignsPublic.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.convertedDesignsPublic = data;
        } else if (data?.items) {
          state.convertedDesignsPublic = data.items;
          state.convertedDesignPaginationPublic = {
            page: data.page || 1,
            limit: data.limit || 10,
            total: data.total || data.items?.length || 0,
            pages: data.pages || Math.ceil((data.total || 0) / (data.limit || 10)),
          };
        } else {
          state.convertedDesignsPublic = data?.data || [];
        }
      })
      .addCase(getConvertedCustomDesignsPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetDesignError, clearUploadedImages } =
  setDesignSlice.actions;
export default setDesignSlice.reducer;