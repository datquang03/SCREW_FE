// src/hooks/useToast.js
import { useState, useCallback } from 'react';

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message, duration = 4000) => {
    setToast({ type, message, duration });
    // Auto close after duration
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const success = useCallback((message, duration) => {
    showToast('success', message, duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast('error', message, duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast('warning', message, duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast('info', message, duration);
  }, [showToast]);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    success,
    error,
    warning,
    info,
    closeToast,
  };
};

export default useToast;

