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
    <div className="py-12 md:py-20 bg-white">
      <div className="relative max-w-7xl mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-[36px]"
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
                    className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
                    onClick={() =>
                      (window.location.href = `/set-design/${design._id}`)
                    }
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-4 flex-shrink-0">
                      {design.images?.[0] ? (
                        <img
                          src={design.images[0]}
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-50 flex items-center justify-center font-bold text-amber-600">
                          {design.name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* BODY */}
                    <div className="flex-1 flex flex-col justify-between px-4 py-2">
                      <span className="inline-flex w-fit px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-semibold text-amber-700 mb-2">
                        Set Design nổi bật
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 min-h-[48px] flex items-center">
                        {design.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2 min-h-[40px] flex items-center">
                        {design.description?.length > 80
                          ? design.description.slice(0, 80) + "..."
                          : design.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2 min-h-[24px]">
                        {design.category && (
                          <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            {design.category}
                          </span>
                        )}
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          {design.price?.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    {/* PRICE + CTA */}
                    <div className="px-4 pb-6 flex flex-col gap-2">
                      <div className="text-xs text-gray-500">Giá từ</div>
                      <div className="text-2xl font-extrabold text-amber-600 mb-1">
                        {design.price?.toLocaleString("vi-VN")}₫
                        <span className="text-sm text-gray-500 ml-1">
                          / thiết kế
                        </span>
                      </div>
                      <a
                        href={`/set-design/${design._id}`}
                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4"
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
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-4 shadow-lg"
              >
                <FiChevronLeft size={30} className="text-amber-700" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-4 shadow-lg"
              >
                <FiChevronRight size={30} className="text-amber-700" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetDesignPage;
