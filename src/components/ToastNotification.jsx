// src/components/ToastNotification.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { gsap } from 'gsap';

const ToastNotification = ({ type = 'success', message, suggestion = null, onClose, duration = 4000 }) => {
  const icons = {
    success: <FiCheckCircle className="w-6 h-6 text-green-600" />,
    error: <FiXCircle className="w-6 h-6 text-red-600" />,
    warning: <FiAlertCircle className="w-6 h-6 text-yellow-600" />,
    info: <FiInfo className="w-6 h-6 text-blue-600" />,
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '.toast',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );

    const timer = setTimeout(() => {
      tl.to('.toast', { x: 100, opacity: 0, duration: 0.3, onComplete: onClose });
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toastContent = (
    <div 
      className="fixed top-6 right-6" 
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        pointerEvents: 'none'
      }}
    >
      <div
        className={`toast flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-white min-w-80 max-w-md pointer-events-auto
          ${type === 'success' ? 'bg-green-600/95 border-green-500' : ''}
          ${type === 'error' ? 'bg-red-600/95 border-red-500' : ''}
          ${type === 'warning' ? 'bg-yellow-600/95 border-yellow-500' : ''}
          ${type === 'info' ? 'bg-blue-600/95 border-blue-500' : ''}
        `}
        style={{ 
          zIndex: 999999,
          position: 'relative'
        }}
      >
        {icons[type]}
        <div className="flex-1">
          <p className="font-semibold">
            {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : type === 'warning' ? 'Cảnh báo' : 'Thông báo'}
          </p>
          <p className="text-sm opacity-90">{message}</p>
          {suggestion && (
            <p className="text-xs opacity-75 mt-1 italic border-t border-white/20 pt-1">
              💡 {suggestion}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Sử dụng Portal để render toast ra ngoài DOM tree, đảm bảo z-index cao nhất
  return typeof document !== 'undefined' 
    ? createPortal(toastContent, document.body)
    : toastContent;
};

export default ToastNotification;