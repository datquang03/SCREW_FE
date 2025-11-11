// src/pages/Authentication/Register/RegisterPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../../../components/ToastNotification';

const schema = z.object({
  username: z.string().min(3, 'Tối thiểu 3 ký tự').regex(/^[a-zA-Z0-9_]+$/, 'Chỉ chữ cái, số, gạch dưới'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Tối thiểu 6 ký tự').regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa').regex(/[0-9]/, 'Cần ít nhất 1 số'),
  fullName: z.string().min(2, 'Tối thiểu 2 ký tự'),
  phone: z.string().regex(/^0[3|5|7|8|9]\d{8}$/, 'Số điện thoại không hợp lệ'),
});

const RegisterPage = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);
  const [toast, setToast] = useState(null);

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

  const password = watch('password', '');

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

  // XỬ LÝ SUBMIT – CHỈ CHUYỂN TRANG KHI THÀNH CÔNG
  const onSubmit = async (data) => {
    dispatch(clearError());
    try {
      const result = await dispatch(register(data)).unwrap();

      // LƯU EMAIL CHO VERIFY
      localStorage.setItem('pendingEmail', data.email);

      // TOAST THÀNH CÔNG
      setToast({ type: 'success', message: result.message || 'Đăng ký thành công!' });
      reset();

      // CHỈ CHUYỂN TRANG KHI THÀNH CÔNG
      setTimeout(() => {
        navigate('/verify-email', { replace: true }); // replace: true → không quay lại được
      }, 1500);

    } catch (err) {
      // LỖI → KHÔNG CHUYỂN TRANG, CHỈ HIỆN TOAST
      setToast({ type: 'error', message: err.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
    }
  };

  // HIỆN LỖI BACKEND
  useEffect(() => {
    if (error && !loading) {
      setToast({ type: 'error', message: error.message || 'Có lỗi xảy ra' });
    }
  }, [error, loading]);

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
              Đăng Ký
            </h1>
            <p className="text-gray-600 mt-2">Tạo admission để bắt đầu hành trình</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'username', placeholder: 'customer01', type: 'text' },
              { name: 'email', placeholder: 'customer01@example.com', type: 'email' },
              { name: 'password', placeholder: '••••••••', type: 'password' },
              { name: 'fullName', placeholder: 'Nguyễn Văn Customer', type: 'text' },
              { name: 'phone', placeholder: '0901234567', type: 'tel' },
            ].map((field, idx) => (
              <div key={field.name} ref={el => inputsRef.current[idx] = el} className="relative group">
                <input
                  {...formRegister(field.name)}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-gray-800 placeholder-gray-400 bg-gray-50/80 backdrop-blur-sm
                    ${errors[field.name] ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-500'}
                    focus:ring-4 focus:ring-purple-500/20 group-hover:border-purple-400
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {errors[field.name] && (
                  <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}

            {/* Password Strength */}
            {password && !loading && (
              <div className="mt-3 space-y-1.5 text-xs" ref={el => inputsRef.current[5] = el}>
                {[
                  { check: password.length >= 6, text: 'Tối thiểu 6 ký tự' },
                  { check: /[A-Z]/.test(password), text: 'Có chữ hoa' },
                  { check: /[0-9]/.test(password), text: 'Có số' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${item.check ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={item.check ? 'text-green-600' : 'text-gray-500'}>{item.text}</span>
                  </div>
                ))}
              </div>
            )}

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
                'Đăng Ký Ngay'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <a href="/login" className="font-semibold text-purple-600 hover:underline">Đăng nhập</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;