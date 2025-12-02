// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ngay lập tức lên đầu trang khi chuyển route
    // Sử dụng scrollTo(0, 0) để tránh delay
    window.scrollTo(0, 0);
    
    // Nếu muốn smooth scroll, có thể dùng:
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  // Đảm bảo F5/reload cũng scroll lên đầu
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo(0, 0);
    };

    // Lắng nghe sự kiện load (F5, reload)
    window.addEventListener("load", handleLoad);
    
    // Scroll ngay khi component mount
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
};

export default ScrollToTop;