// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { initSocket, getSocket } from "../../api/socketInstance";

/* ================= UTILS ================= */
const saveToStorage = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
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

/* ================= INITIAL STATE ================= */
const { user: storedUser, token: storedToken } = loadFromStorage();

const initialState = {
  user: storedUser,
  token: storedToken,
  loading: false,
  error: null,
};

/* ================= THUNKS ================= */
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register/customer", data);
      return res.data;
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
      const res = await axiosInstance.post("/auth/verify", { email, code });
      return res.data;
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
      const res = await axiosInstance.post("/auth/resend-code", { email });
      return res.data;
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
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { user, accessToken, refreshToken } = res.data.data;
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

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login/google", { idToken });
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem("refreshToken", refreshToken);
      saveToStorage(user, accessToken);
      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng nhập Google thất bại" }
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token");
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy thông tin user" }
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token");
      const res = await axiosInstance.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      const payload = err.response?.data || {
        message: "Đổi mật khẩu thất bại",
      };
      payload.status = err.response?.status;
      return rejectWithValue(payload);
    }
  }
);

export const registerStaff = createAsyncThunk(
  "auth/registerStaff",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register/staff", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng ký nhân viên thất bại" }
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async ({ avatar }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token");

      const formData = new FormData();
      formData.append("avatar", avatar);

      const res = await axiosInstance.post("/upload/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload avatar thất bại" }
      );
    }
  }
);

/* ======= FORGOT PASSWORD (THÊM MỚI) ======= */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Gửi email khôi phục mật khẩu thất bại",
        }
      );
    }
  }
);

/* ================= SLICE ================= */
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
      /* REGISTER */
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        const email = a.meta.arg.email;
        s.user = { ...a.payload.user, email, verified: false };
        saveToStorage(s.user, null);
        localStorage.setItem("pendingEmail", email);
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* VERIFY OTP */
      .addCase(verifyOtp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(verifyOtp.fulfilled, (s) => {
        s.loading = false;
        if (s.user) {
          s.user.verified = true;
          saveToStorage(s.user, null);
        }
        localStorage.removeItem("pendingEmail");
      })
      .addCase(verifyOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* RESEND OTP */
      .addCase(resendOtp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(resendOtp.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(resendOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* LOGIN */
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = { ...a.payload.user, verified: true };
        s.token = a.payload.accessToken;
        saveToStorage(s.user, s.token);
        // Tự động kết nối socket sau khi đăng nhập thành công
        initSocket(a.payload.accessToken);
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* LOGIN WITH GOOGLE */
      .addCase(loginWithGoogle.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (s, a) => {
        s.loading = false;
        s.user = { ...a.payload.user, verified: true };
        s.token = a.payload.accessToken;
        saveToStorage(s.user, s.token);
        initSocket(a.payload.accessToken);
      })
      .addCase(loginWithGoogle.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* GET CURRENT USER */
      .addCase(getCurrentUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = { ...s.user, ...a.payload };
        saveToStorage(s.user, s.token);
      })
      .addCase(getCurrentUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* CHANGE PASSWORD */
      .addCase(changePassword.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(changePassword.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(changePassword.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
        if (a.payload?.status === 401) {
          s.user = null;
          s.token = null;
          clearStorage();
        }
      })

      /* REGISTER STAFF */
      .addCase(registerStaff.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerStaff.fulfilled, (s, a) => {
        s.loading = false;
        const email = a.meta.arg.email;
        s.user = { ...a.payload.user, email, verified: false };
        saveToStorage(s.user, null);
        localStorage.setItem("pendingEmail", email);
      })
      .addCase(registerStaff.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* UPLOAD AVATAR */
      .addCase(uploadAvatar.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (s, a) => {
        s.loading = false;
        const avatar =
          a.payload?.data?.avatarUrl ||
          a.payload?.avatarUrl ||
          a.payload?.avatar;
        if (avatar && s.user) {
          s.user.avatar = avatar;
          saveToStorage(s.user, s.token);
        }
      })
      .addCase(uploadAvatar.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(forgotPassword.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(forgotPassword.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
