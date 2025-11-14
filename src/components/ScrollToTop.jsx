// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll mượt về đầu trang
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // Đảm bảo F5 cũng scroll lên đầu
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Lắng nghe sự kiện load (F5, reload)
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
};

export default ScrollToTop;