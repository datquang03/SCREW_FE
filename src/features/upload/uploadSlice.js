// src/features/upload/uploadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ========================== ASYNC THUNKS ==========================

// 1. Upload nhiều ảnh thông thường (dùng cho avatar, banner, v.v.)
export const uploadImages = createAsyncThunk(
  "upload/uploadImages",
  async (files, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post("/upload/images", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data; // mong đợi: { images: [{ url, publicId, ... }] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err?.message || "Upload ảnh thất bại" }
      );
    }
  }
);

// 1b. Upload 1 ảnh (đơn lẻ)
export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (fileOrFiles, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((f) => formData.append("image", f));
      console.log([...formData.entries()]);
      const res = await axiosInstance.post("/upload/image", formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thất bại" }
      );
    }
  }
);

// 1c. Upload nhiều ảnh dành cho customer set-design request
export const uploadSetDesignImagesforCustomer = createAsyncThunk(
  "upload/uploadSetDesignImagesforCustomer",
  async ({ images }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const files = (images || []).filter((f) => f instanceof File);
      if (!files.length) {
        throw { message: "Không có file ảnh để upload" };
      }

      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));

      const res = await axiosInstance.post(
        "/set-designs/upload-images",
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // để axios tự set boundary
          },
        }
      );

      // chuẩn hóa trả về: luôn có mảng images
      const data = res.data?.data || res.data || {};
      const imagesResp =
        data.images ||
        data.imageUrls ||
        data.data?.images ||
        data.data?.imageUrls ||
        (Array.isArray(data) ? data : []);
      return { images: imagesResp };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thất bại" }
      );
    }
  }
);

// 2. Upload media trong studio (có thể là video ngắn, ảnh RAW, v.v.)
export const uploadStudioMedia = createAsyncThunk(
  "upload/uploadStudioMedia",
  async (file, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      formData.append("media", file);

      const res = await axiosInstance.post("/upload/studio-media", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload studio media thất bại" }
      );
    }
  }
);

// 3. Upload ảnh thiết bị (gắn vào equipment cụ thể)
export const uploadEquipmentImage = createAsyncThunk(
  "upload/uploadEquipmentImage",
  async ({ equipmentId, file }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosInstance.post(
        `/upload/equipment/${equipmentId}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh thiết bị thất bại" }
      );
    }
  }
);

// 4. Upload nhiều ảnh đánh giá
export const uploadReviewImages = createAsyncThunk(
  "upload/uploadReviewImages",
  async ({ reviewId, files }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post(
        `/upload/review/${reviewId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh đánh giá thất bại" }
      );
    }
  }
);

// 5. Upload nhiều ảnh set design
export const uploadSetDesignImages = createAsyncThunk(
  "upload/uploadSetDesignImages",
  async ({ setDesignId, files }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post(
        `/upload/set-design/${setDesignId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh set design thất bại" }
      );
    }
  }
);

// 5b. Upload nhiều ảnh set design cho khách hàng (endpoint: set-designs/upload-images)
export const uploadCustomerSetDesignImages = createAsyncThunk(
  "upload/uploadCustomerSetDesignImages",
  async (files, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      for (let pair of formData.entries()) {
        console.log(
          "FORMDATA:",
          pair[0],
          pair[1],
          pair[1] instanceof File,
          pair[1].name
        );
      }
      const res = await axiosInstance.post(
        "/set-designs/upload-images",
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload ảnh set design thất bại" }
      );
    }
  }
);

// 6. Upload video
export const uploadVideo = createAsyncThunk(
  "upload/uploadVideo",
  async (file, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      formData.append("video", file);

      const res = await axiosInstance.post("/upload/video", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        // Có thể thêm timeout lớn hơn nếu video to
        timeout: 600000, // 10 phút
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload video thất bại" }
      );
    }
  }
);

// 7. Xóa file theo publicId (Cloudinary, v.v.)
export const deleteFile = createAsyncThunk(
  "upload/deleteFile",
  async (publicId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      await axiosInstance.delete(`/upload/file/${publicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return publicId; // trả về publicId để dễ xóa khỏi state local
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa file thất bại" }
      );
    }
  }
);

// ========================== INITIAL STATE ==========================
const initialState = {
  // Có thể lưu kết quả upload gần nhất nếu cần hiển thị preview
  lastUploadedImages: [],
  lastUploadedVideo: null,
  uploading: false,
  uploadProgress: 0, // nếu muốn hiển thị % tiến trình
  error: null,
};

// ========================== SLICE ==========================
const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.error = null;
    },
    clearLastUploaded: (state) => {
      state.lastUploadedImages = [];
      state.lastUploadedVideo = null;
    },
    // Nếu bạn muốn hỗ trợ progress (axios support onUploadProgress)
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    const uploadActions = [
      uploadImages,
      uploadImage,
      uploadStudioMedia,
      uploadEquipmentImage,
      uploadReviewImages,
      uploadSetDesignImages,
      uploadCustomerSetDesignImages,
      uploadVideo,
    ];

    // Áp dụng chung pending/fulfilled/rejected cho tất cả upload
    uploadActions.forEach((action) => {
      builder
        .addCase(action.pending, (state) => {
          state.uploading = true;
          state.error = null;
          state.uploadProgress = 0;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.uploading = false;
          // Lưu kết quả nếu cần dùng lại ngay (ví dụ preview)
          if (action.meta.arg?.files || Array.isArray(action.meta.arg)) {
            state.lastUploadedImages = Array.isArray(action.payload)
              ? action.payload
              : action.payload.images || [];
          } else if (
            action.meta.arg &&
            action.type.includes("upload/uploadImage")
          ) {
            const img =
              action.payload?.image ||
              action.payload?.url ||
              action.payload?.secure_url ||
              action.payload;
            state.lastUploadedImages = img ? [img] : [];
          } else if (action.meta.arg?.file && action.type.includes("Video")) {
            state.lastUploadedVideo = action.payload;
          }
        })
        .addCase(action.rejected, (state, action) => {
          state.uploading = false;
          state.error = action.payload;
        });
    });

    // Xử lý riêng cho delete
    builder
      .addCase(deleteFile.fulfilled, (state, action) => {
        // Có thể xóa khỏi lastUploadedImages nếu cần
        const deletedId = action.payload;
        state.lastUploadedImages = state.lastUploadedImages.filter(
          (img) => img.publicId !== deletedId
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUploadError, clearLastUploaded, setUploadProgress } =
  uploadSlice.actions;

export default uploadSlice.reducer;
