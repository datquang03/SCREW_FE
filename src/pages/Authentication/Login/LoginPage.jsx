// src/pages/Authentication/Login/LoginPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError, loginWithGoogle } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import ToastNotification from "../../../components/ToastNotification";
import { GoogleLogin } from '@react-oauth/google';

const schema = z.object({
  username: z
    .string()
    .min(3, "Tối thiểu 3 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chữ cái, số, gạch dưới"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
});

const LoginPage = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  // GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".gradient-bg", {
        backgroundPosition: "200% 200%",
        duration: 20,
        repeat: -1,
        ease: "none",
      });
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(formRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.7)",
      });
      gsap.from(inputsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Xử lý đăng nhập thông thường
  const onSubmit = async (data) => {
    dispatch(clearError());
    try {
      const result = await dispatch(login(data)).unwrap();
      setToast({
        type: "success",
        message: result.message || "Đăng nhập thành công!",
      });
      reset();
      setTimeout(() => navigate("/", { replace: true }), 1500);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Đăng nhập thất bại" });
    }
  };

  // Xử lý đăng nhập Google
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    dispatch(clearError());
    try {
      const result = await dispatch(loginWithGoogle({ idToken: credentialResponse.credential })).unwrap();
      setToast({
        type: "success",
        message: result.message || "Đăng nhập Google thành công!",
      });
      setTimeout(() => navigate("/", { replace: true }), 1500);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Đăng nhập Google thất bại" });
    }
  };

  // Hiển thị lỗi backend
  useEffect(() => {
    if (error && !loading) {
      setToast({ type: "error", message: error.message || "Có lỗi xảy ra" });
      dispatch(clearError());
    }
  }, [error, loading, dispatch]);

  // Chuyển hướng khi có token
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <>
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div
        ref={containerRef}
        className="min-h-screen relative overflow-hidden bg-[#0F172A] gradient-bg bg-[length:200%_200%] flex items-center justify-center p-4"
      >
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#C5A267] opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#C5A267] opacity-10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Form Card */}
        <div
          ref={formRef}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] p-8 border border-slate-100"
        >
          <div ref={titleRef} className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
              Welcome Back
            </p>
            <h1 className="text-4xl font-semibold text-[#0F172A]">
              Đăng Nhập
            </h1>
            <p className="text-slate-600 mt-2">Chào mừng bạn trở lại</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              {
                name: "username",
                placeholder: "customer01",
                type: "text",
                icon: null,
              },
              {
                name: "password",
                placeholder: "••••••••",
                type: showPassword ? "text" : "password",
                icon: showPassword ? <FiEyeOff /> : <FiEye />,
              },
            ].map((field, idx) => (
              <div
                key={field.name}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="relative group"
              >
                <input
                  {...register(field.name)}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={`w-full px-5 py-4 pr-12 border-2 transition-all duration-300 outline-none text-[#0F172A] placeholder-slate-400 bg-white
                    ${
                      errors[field.name]
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-200 focus:border-[#C5A267]"
                    }
                    focus:ring-4 focus:ring-[#C5A267]/10 group-hover:border-[#C5A267]/50
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {field.icon && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#C5A267] transition-colors"
                  >
                    {field.icon}
                  </button>
                )}
                {errors[field.name] && (
                  <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}

            {/* Nút Đăng nhập chính */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#94a3b8' : '#A0826D',
                borderColor: loading ? '#94a3b8' : '#A0826D',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#8B7355';
                  e.currentTarget.style.borderColor = '#8B7355';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#A0826D';
                  e.currentTarget.style.borderColor = '#A0826D';
                }
              }}
              className={`mt-6 w-full py-4 font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all duration-300 cursor-pointer
                ${loading ? "cursor-not-allowed" : "active:scale-95"}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  Đăng Nhập
                </>
              )}
            </button>

            {/* Phân cách OR */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 backdrop-blur-sm">
                  hoặc
                </span>
              </div>
            </div>

            {/* Nút Đăng nhập với Google */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setToast({ type: "error", message: "Đăng nhập Google thất bại" })}
                width="100%"
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a
              href="/forgot-password"
              className="block text-sm text-[#C5A267] hover:underline font-semibold"
            >
              Quên mật khẩu?
            </a>
            <p className="text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-semibold text-[#C5A267] hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
