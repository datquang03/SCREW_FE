import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMail, FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { forgotPassword, clearError } from "../../../features/auth/authSlice";
import ToastNotification from "../../../components/ToastNotification";

/* ================= VALIDATION ================= */
const schema = z.object({
  email: z.string().email("Email không hợp lệ").nonempty("Vui lòng nhập email"),
});

const ForgotPassword = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  /* ================= GSAP ================= */
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

      gsap.from(inputRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    dispatch(clearError());
    try {
      const res = await dispatch(forgotPassword(data)).unwrap();

      setToast({
        type: "success",
        message:
          res?.message ||
          "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư!",
      });

      reset();

      // ⏳ Delay nhỏ để user thấy toast rồi mới chuyển trang
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Gửi email thất bại. Vui lòng thử lại sau.",
      });
    }
  };

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
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Card */}
        <div
          ref={formRef}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quên Mật Khẩu
            </h1>
            <p className="text-gray-600 mt-2">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div ref={inputRef} className="relative">
              <div className="flex items-center border-2 rounded-2xl bg-gray-50/80 border-gray-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20">
                <FiMail className="text-gray-500 ml-4" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-4 rounded-2xl outline-none bg-transparent"
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 disabled:opacity-70"
            >
              <FiSend />
              {loading ? "Đang gửi..." : "Xác nhận"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-purple-600 hover:underline"
            >
              Quay lại trang đăng nhập
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
