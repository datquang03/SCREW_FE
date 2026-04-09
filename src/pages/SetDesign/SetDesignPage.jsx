// src/pages/SetDesign/SetDesignPage.jsx   (hoặc đường dẫn file của bạn)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSetDesigns } from "../../features/setDesign/setDesignSlice";
import { Button, Spin } from "antd";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

const SetDesignPage = () => {
  const dispatch = useDispatch();
  const { setDesigns, loading } = useSelector((state) => state.setDesign);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllSetDesigns({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Auto slide
  useEffect(() => {
    if (setDesigns.length <= itemsPerView) return;

    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prev) => (prev + 1) % setDesigns.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering, setDesigns.length, itemsPerView]);

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + setDesigns.length) % setDesigns.length
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % setDesigns.length);
  };

  // TranslateX đơn giản và mượt mà
  const translateX = -currentIndex * (100 / itemsPerView);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-24">
      {/* Header */}
      <div className="bg-[#0F172A] py-24 mb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
            SET DESIGNS
          </p>
          <h1 className="text-5xl font-semibold text-white mb-4">
            Set Design Nổi Bật
          </h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Bộ sưu tập thiết kế được curated kỹ lưỡng phục vụ mọi nhu cầu chụp
            ảnh chuyên nghiệp
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Container chính */}
          <div className="px-8 py-10">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {setDesigns.map((design) => (
                <div
                  key={design._id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / itemsPerView}%`,
                  }}
                >
                  {/* Card cố định kích thước */}
                  <div
                    className="w-full h-[520px] bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] 
                               transition-all duration-300 hover:border-[#C5A267] group flex flex-col overflow-hidden rounded-3xl cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/set-design/${design._id}`)
                    }
                  >
                    {/* IMAGE - Cố định chiều cao */}
                    <div className="relative h-72 w-full overflow-hidden flex-shrink-0">
                      {design.images?.[0] ? (
                        <img
                          src={design.images[0]}
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {design.name}
                        </div>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="flex-1 flex flex-col px-6 py-6">
                      <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                        SET DESIGN NỔI BẬT
                      </span>

                      <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3 min-h-[56px]">
                        {design.name}
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                        {design.description || "Không có mô tả"}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
                        {design.category && (
                          <span className="inline-block border border-slate-200 px-3 py-1 font-semibold uppercase tracking-wider">
                            {design.category}
                          </span>
                        )}
                      </div>

                      {/* Giá */}
                      <div className="mt-auto">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-1">
                          Giá từ
                        </div>
                        <div className="text-2xl font-semibold text-[#C5A267]">
                          {design.price?.toLocaleString("vi-VN")}₫
                          <span className="text-sm text-slate-500 ml-1">
                            / thiết kế
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-6">
                      <a
                        href={`/set-design/${design._id}`}
                        className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] text-[#C5A267] hover:text-[#0F172A] 
                                   font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center rounded-2xl transition-all"
                      >
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Prev / Next - Đã highlight nổi bật */}
          {setDesigns.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#0F172A] 
                           text-[#0F172A] hover:text-white border border-slate-200 hover:border-transparent 
                           p-5 rounded-full shadow-2xl transition-all duration-300 z-20"
              >
                <FiChevronLeft size={32} />
              </button>

              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#0F172A] 
                           text-[#0F172A] hover:text-white border border-slate-200 hover:border-transparent 
                           p-5 rounded-full shadow-2xl transition-all duration-300 z-20"
              >
                <FiChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetDesignPage;
