// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// === UTILS ===
const saveToStorage = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
  // refreshToken lưu riêng
};

const loadFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("pendingEmail");
};

// === INITIAL STATE ===
const { user: storedUser, token: storedToken } = loadFromStorage();

const initialState = {
  user: storedUser,
  token: storedToken,
  loading: false,
  error: null,
};

// === THUNKS ===
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/register/customer",
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng ký thất bại" }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify", {
        email,
        code,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Mã OTP không hợp lệ" }
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/resend-code", { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi lại OTP thất bại" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { user, accessToken, refreshToken } = response.data.data;
      localStorage.setItem("refreshToken", refreshToken);
      saveToStorage(user, accessToken);
      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng nhập thất bại" }
      );
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy thông tin user" }
      );
    }
  }
);
// === THUNKS (đã có) ===
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Không có token để xác thực");

      const response = await axiosInstance.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // <-- thành công
    } catch (err) {
      // trả về lỗi chi tiết + status
      const payload = err.response?.data || {
        message: "Đổi mật khẩu thất bại",
      };
      payload.status = err.response?.status;
      return rejectWithValue(payload);
    }
  }
);

// === SLICE ===
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      clearStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === REGISTER ===
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const email = action.meta.arg.email;
        state.user = { ...action.payload.user, email, verified: false };
        saveToStorage(state.user, null);
        localStorage.setItem("pendingEmail", email);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === VERIFY OTP ===
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.verified = true;
          saveToStorage(state.user, null); // token = null
        }
        localStorage.removeItem("pendingEmail");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === RESEND OTP ===
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === LOGIN ===
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, verified: true };
        state.token = action.payload.accessToken;
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        saveToStorage(state.user, state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // === GET CURRENT USER ===
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        saveToStorage(state.user, state.token);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        if (action.payload?.status === 401) {
        }
      })
      // === CHANGE PASSWORD ===
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        // có thể lưu message thành công nếu backend trả về
        // state.success = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // { message, status, ... }

        // 401 → token hết hạn → logout tự động
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          clearStorage();
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
