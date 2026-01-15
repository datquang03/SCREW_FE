// src/pages/Authentication/Login/LoginPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import ToastNotification from "../../../components/ToastNotification";

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

  // Xử lý đăng nhập Google (placeholder - bạn cần implement thực tế)
  const handleGoogleLogin = () => {
    // Ví dụ: dispatch(googleLogin());
    // Hoặc dùng @react-oauth/google, Firebase, etc.
    setToast({
      type: "info",
      message: "Chức năng đăng nhập Google đang được triển khai...",
    });
    // Sau khi implement thành công → navigate giống như login thường
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
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 gradient-bg bg-[length:200%_200%] flex items-center justify-center p-4"
      >
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Form Card */}
        <div
          ref={formRef}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Đăng Nhập
            </h1>
            <p className="text-gray-600 mt-2">Chào mừng bạn trở lại</p>
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
                  className={`w-full px-5 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 outline-none text-gray-800 placeholder-gray-400 bg-gray-50/80 backdrop-blur-sm
                    ${
                      errors[field.name]
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-200 focus:border-purple-500"
                    }
                    focus:ring-4 focus:ring-purple-500/20 group-hover:border-purple-400
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {field.icon && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
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
              className={`mt-6 w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all duration-300 cursor-pointer
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95"
                }`}
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
                <div className="w-full border-t border-gray-300/70"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 backdrop-blur-sm rounded-full">
                  hoặc
                </span>
              </div>
            </div>

            {/* Nút Đăng nhập với Google */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className={`w-full py-4 px-6 rounded-2xl font-medium text-gray-800 flex items-center justify-center gap-4 shadow-md transition-all duration-300 cursor-pointer border border-gray-300/80 bg-white hover:bg-gray-50 active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50
                ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.8z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.75 20.94 6.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.7 0 2.75 2.06.96 5.34l4.55 2.45C6.42 5.02 8.98 4.98 12 4.98z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập với Google
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a
              href="/forgot-password"
              className="block text-sm text-purple-600 hover:underline"
            >
              Quên mật khẩu?
            </a>
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-semibold text-purple-600 hover:underline"
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
