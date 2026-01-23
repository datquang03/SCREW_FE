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
  const totalSlides = Math.ceil(setDesigns.length / itemsPerView);

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllSetDesigns({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (setDesigns.length <= itemsPerView) return;
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, setDesigns.length, itemsPerView, totalSlides]);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const extendedDesigns =
    setDesigns.length > 0
      ? [
          ...setDesigns.slice(-itemsPerView),
          ...setDesigns,
          ...setDesigns.slice(0, itemsPerView),
        ]
      : [];

  const offset = itemsPerView;
  const translateX = -(currentIndex + offset) * (100 / itemsPerView);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-24">
      {/* Navy Header */}
      <div className="bg-[#0F172A] py-24 mb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
            Set Designs
          </p>
          <h1 className="text-5xl font-semibold text-white mb-4">
            Set Design
          </h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Khám phá các thiết kế set chuyên nghiệp cho dự án của bạn
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="px-6 py-10">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {extendedDesigns.map((design, index) => (
                <div
                  key={`${design._id}-${index}`}
                  className="flex-shrink-0 flex flex-col"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: 340,
                    maxWidth: 340,
                    marginRight: 24,
                  }}
                >
                  <div
                    className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col"
                    onClick={() =>
                      (window.location.href = `/set-design/${design._id}`)
                    }
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-48 overflow-hidden flex-shrink-0 transition-all duration-500">
                      {design.images?.[0] ? (
                        <img
                          src={design.images[0]}
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                          {design.name}
                        </div>
                      )}
                    </div>
                    {/* BODY */}
                    <div className="flex-1 flex flex-col justify-between px-6 py-6">
                      <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                        Set Design nổi bật
                      </span>
                      <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3 min-h-[48px] flex items-center">
                        {design.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[40px] flex items-center">
                        {design.description?.length > 80
                          ? design.description.slice(0, 80) + "..."
                          : design.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2 min-h-[24px]">
                        {design.category && (
                          <span className="inline-block border border-slate-200 px-3 py-1 font-semibold uppercase tracking-wider">
                            {design.category}
                          </span>
                        )}
                        <span className="inline-block border border-slate-200 px-3 py-1 font-semibold uppercase tracking-wider">
                          {design.price?.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    {/* PRICE + CTA */}
                    <div className="px-6 pb-6 flex flex-col gap-3">
                      <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Giá từ</div>
                      <div className="text-2xl font-semibold text-[#C5A267] mb-2">
                        {design.price?.toLocaleString("vi-VN")}₫
                        <span className="text-sm text-slate-500 ml-1">
                          / thiết kế
                        </span>
                      </div>
                      <a
                        href={`/set-design/${design._id}`}
                        className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300"
                        style={{ marginTop: "auto" }}
                      >
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {setDesigns.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#0F172A] hover:bg-[#C5A267] p-4 shadow-lg transition-colors duration-300"
              >
                <FiChevronLeft size={30} className="text-[#C5A267] hover:text-[#0F172A]" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#0F172A] hover:bg-[#C5A267] p-4 shadow-lg transition-colors duration-300"
              >
                <FiChevronRight size={30} className="text-[#C5A267] hover:text-[#0F172A]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetDesignPage;
