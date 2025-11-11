// src/pages/Authentication/Verify/Email.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearError } from '../../../features/auth/authSlice';
import { FiArrowLeft, FiRefreshCw, FiCheck } from 'react-icons/fi';
import ToastNotification from '../../../components/ToastNotification';

const VerifyEmailPage = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const otpBoxRef = useRef(null);
  const buttonRef = useRef(null);
  const backButtonRef = useRef(null);

  const [code, setCode] = useState('');
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const pendingEmail = localStorage.getItem('pendingEmail');
  const email = user?.email || pendingEmail || 'customer01@example.com';

  // === XÓA pendingEmail SAU KHI XÁC THỰC ===
  useEffect(() => {
    if (user?.verified) {
      localStorage.removeItem('pendingEmail');
    }
  }, [user]);

  // === GSAP + HOVER ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from(otpBoxRef.current, { scale: 0.95, opacity: 0, duration: 0.6, delay: 0.3, ease: 'back.out(1.5)' });
      gsap.from(buttonRef.current, { y: 20, opacity: 0, duration: 0.5, delay: 0.6 });

      const backBtn = backButtonRef.current;
      if (backBtn) {
        backBtn.addEventListener('mouseenter', () => {
          gsap.to(backBtn, { scale: 1.05, duration: 0.2 });
          gsap.to(backBtn.querySelector('span'), { textDecoration: 'underline', duration: 0.2 });
        });
        backBtn.addEventListener('mouseleave', () => {
          gsap.to(backBtn, { scale: 1, duration: 0.2 });
          gsap.to(backBtn.querySelector('span'), { textDecoration: 'none', duration: 0.2 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // === XÁC THỰC OTP ===
  const handleVerify = async () => {
    if (code.length !== 6) {
      setToast({ type: 'error', message: 'Vui lòng nhập đủ 6 chữ số' });
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ email, code })).unwrap();
      setToast({ type: 'success', message: result.message || 'Xác thực thành công!' });
      localStorage.removeItem('pendingEmail');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Mã OTP không hợp lệ' });
      dispatch(clearError());
    }
  };

  // === GỬI LẠI OTP ===
  const handleResend = async () => {
    try {   
      const result = await dispatch(resendOtp({ email })).unwrap();
      setToast({ type: 'success', message: result.message || 'Đã gửi lại mã OTP!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Gửi lại thất bại' });
      dispatch(clearError());
    }
  };

  // === HIỆN TOAST LỖI – CHỈ 1 LẦN ===
  useEffect(() => {
    if (error && !loading) {
      setToast({ type: 'error', message: error.message || 'Có lỗi xảy ra' });
      dispatch(clearError());
    }
  }, [error, loading, dispatch]);

  return (
    <>
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <button
          ref={backButtonRef}
          onClick={() => navigate('/register', { replace: true })}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 transition-all duration-200 z-10"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay về đăng ký</span>
        </button>

        <div className="w-full max-w-md">
          <div ref={otpBoxRef} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div ref={titleRef} className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Xác thực email</h1>
              <p className="text-gray-600 mt-3">
                Mã đã được gửi đến <span className="font-semibold text-indigo-600">{email}</span>
              </p>
            </div>

            <div className="mb-6 relative">
              <div className="flex justify-center gap-2">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200
                    ${code[i] ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-300 bg-white text-gray-400'}
                    focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100`}>
                    {code[i] || ''}
                  </div>
                ))}
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                autoFocus
              />
            </div>

            {/* === XÓA HOÀN TOÀN ĐẾM NGƯỢC === */}
            {/* <div ref={timerRef} className="text-center mb-6">...</div> */}

            <div ref={buttonRef} className="flex justify-center gap-3">
              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300
                  ${loading || code.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95'
                  }`}
              >
                <FiCheck className="w-5 h-5" />
                Xác nhận
              </button>

              {/* === NÚT GỬI LẠI MÃ – LUÔN BẬT === */}
              <button
                onClick={handleResend}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300
                  ${loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-indigo-600 hover:bg-gray-200 active:scale-95'
                  }`}
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Gửi lại mã
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;