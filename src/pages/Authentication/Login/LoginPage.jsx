// src/pages/Authentication/Login/LoginPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import ToastNotification from '../../../components/ToastNotification';

const schema = z.object({
  username: z.string().min(3, 'Tối thiểu 3 ký tự').regex(/^[a-zA-Z0-9_]+$/, 'Chỉ chữ cái, số, gạch dưới'),
  password: z.string().min(6, 'Tối thiểu 6 ký tự'),
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
  const { loading, error, user, token } = useSelector((state) => state.auth); // LẤY token

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  // GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.gradient-bg', { backgroundPosition: '200% 200%', duration: 20, repeat: -1, ease: 'none' });
      gsap.from(titleRef.current, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from(formRef.current, { scale: 0.9, opacity: 0, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' });
      gsap.from(inputsRef.current, { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.5, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Xử lý đăng nhập
  const onSubmit = async (data) => {
    dispatch(clearError());
    try {
      const result = await dispatch(login(data)).unwrap();
      setToast({ type: 'success', message: result.message || 'Đăng nhập thành công!' });
      reset();
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Đăng nhập thất bại' });
    }
  };

  // Hiển thị lỗi backend
  useEffect(() => {
    if (error && !loading) {
      setToast({ type: 'error', message: error.message || 'Có lỗi xảy ra' });
      dispatch(clearError());
    }
  }, [error, loading, dispatch]);

  // CHỈ CHUYỂN HƯỚNG KHI CÓ TOKEN (SAU LOGIN THÀNH CÔNG)
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  return (
    <>
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

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
        <div ref={formRef} className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Đăng Nhập
            </h1>
            <p className="text-gray-600 mt-2">Chào mừng bạn trở lại</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'username', placeholder: 'customer01', type: 'text', icon: null },
              { name: 'password', placeholder: '••••••••', type: showPassword ? 'text' : 'password', icon: showPassword ? <FiEyeOff /> : <FiEye /> },
            ].map((field, idx) => (
              <div key={field.name} ref={el => inputsRef.current[idx] = el} className="relative group">
                <input
                  {...register(field.name)}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={`w-full px-5 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 outline-none text-gray-800 placeholder-gray-400 bg-gray-50/80 backdrop-blur-sm
                    ${errors[field.name] ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-500'}
                    focus:ring-4 focus:ring-purple-500/20 group-hover:border-purple-400
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all duration-300
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
          </form>

          <div className="mt-6 text-center space-y-3">
            <a href="/forgot-password" className="block text-sm text-purple-600 hover:underline">
              Quên mật khẩu?
            </a>
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <a href="/register" className="font-semibold text-purple-600 hover:underline">
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