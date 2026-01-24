import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../../components/ToastNotification";

// Thêm icon mắt (SVG inline đẹp hơn)
const EyeIcon = ({ isOpen }) => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    )}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const schema = z.object({
  username: z
    .string()
    .min(3, "Tối thiểu 3 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chữ cái, số, gạch dưới"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Tối thiểu 6 ký tự")
    .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Cần ít nhất 1 số"),
  fullName: z.string().min(2, "Tối thiểu 2 ký tự"),
  phone: z.string().regex(/^0[3|5|7|8|9]\d{8}$/, "Số điện thoại không hợp lệ"),
});

const RegisterPage = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Thêm state ẩn/hiện mật khẩu

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const password = watch("password", "");

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

  const onSubmit = async (data) => {
    dispatch(clearError());
    try {
      const result = await dispatch(register(data)).unwrap();
      localStorage.setItem("pendingEmail", data.email);
      setToast({
        type: "success",
        message: result.message || "Đăng ký thành công!",
      });
      reset();
      setTimeout(() => {
        navigate("/verify-email", { replace: true });
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Đăng ký thất bại. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    if (error && !loading) {
      setToast({ type: "error", message: error.message || "Có lỗi xảy ra" });
    }
  }, [error, loading]);

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
              Create Account
            </p>
            <h1 className="text-4xl font-semibold text-[#0F172A]">
              Đăng Ký
            </h1>
            <p className="text-slate-600 mt-2">
              Tạo tài khoản để bắt đầu hành trình
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: "username", placeholder: "customer01", type: "text" },
              {
                name: "email",
                placeholder: "customer01@example.com",
                type: "email",
              },
              {
                name: "fullName",
                placeholder: "Nguyễn Văn Customer",
                type: "text",
              },
              { name: "phone", placeholder: "0901234567", type: "tel" },
            ].map((field, idx) => (
              <div
                key={field.name}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="relative group"
              >
                <input
                  {...formRegister(field.name)}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={`w-full px-5 py-4 border-2 transition-all duration-300 outline-none text-[#0F172A] placeholder-slate-400 bg-white
                    ${
                      errors[field.name]
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-200 focus:border-[#C5A267]"
                    }
                    focus:ring-4 focus:ring-[#C5A267]/10 group-hover:border-[#C5A267]/50
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {errors[field.name] && (
                  <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}

            {/* Input Password với icon mắt */}
            <div
              ref={(el) => (inputsRef.current[4] = el)}
              className="relative group"
            >
              <input
                {...formRegister("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={loading}
                className={`w-full px-5 py-4 border-2 transition-all duration-300 outline-none text-[#0F172A] placeholder-slate-400 bg-white pr-14
                  ${
                    errors.password
                      ? "border-red-500 focus:border-red-600"
                      : "border-slate-200 focus:border-[#C5A267]"
                  }
                  focus:ring-4 focus:ring-[#C5A267]/10 group-hover:border-[#C5A267]/50
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              {/* Nút ẩn/hiện mật khẩu */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 transition-all duration-200"
                tabIndex={-1}
              >
                <EyeIcon isOpen={showPassword} />
              </button>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password Strength */}
            {password && !loading && (
              <div
                className="mt-3 space-y-1.5 text-xs"
                ref={(el) => (inputsRef.current[5] = el)}
              >
                {[
                  { check: password.length >= 6, text: "Tối thiểu 6 ký tự" },
                  { check: /[A-Z]/.test(password), text: "Có chữ hoa" },
                  { check: /[0-9]/.test(password), text: "Có số" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        item.check ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={
                        item.check ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
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
              className={`mt-6 w-full py-4 font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all duration-300
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
                "Đăng Ký Ngay"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="font-semibold text-[#C5A267] hover:underline"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
