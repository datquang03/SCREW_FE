// src/pages/Homepage/components/SetDesignSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Skeleton, Empty } from "antd";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  getActiveSetDesigns,
  getSetDesignById,
} from "../../../features/setDesign/setDesignSlice";

const { Title, Paragraph } = Typography;

const SetDesignSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setDesigns = useSelector((state) => state.setDesign.activeSetDesigns);
  const loading = useSelector((state) => state.setDesign.loading);

  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState("next");

  const timeoutRef = useRef(null);

  const filteredSetDesigns = setDesigns.filter(
    (item) => !item.isConvertedFromCustomRequest
  );

  // Load data
  useEffect(() => {
    dispatch(getActiveSetDesigns());
  }, [dispatch]);

  // Auto slide
  useEffect(() => {
    if (!isHovering && filteredSetDesigns.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setDirection("next");
        setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovering, filteredSetDesigns.length]);

  const handlePrev = () => {
    setDirection("prev");
    setCurrent(
      (prev) =>
        (prev - 1 + filteredSetDesigns.length) % filteredSetDesigns.length
    );
  };

  const handleNext = () => {
    setDirection("next");
    setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);
  };

  const goToDetail = (id) => {
    dispatch(getSetDesignById(id));
    navigate(`/set-design/${id}`);
  };

  // current design
  const currentDesign = filteredSetDesigns[current];

  // Hàm click toàn bộ card
  const handleCardClick = () => {
    if (currentDesign?._id) {
      goToDetail(currentDesign._id);
    }
  };

  if (loading && filteredSetDesigns.length === 0) {
    return (
      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center mb-10">
            <Title
              level={2}
              className="text-3xl md:text-5xl font-semibold text-[#0F172A]"
            >
              Set Design Nổi Bật
            </Title>
          </div>
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (filteredSetDesigns.length === 0) {
    return (
      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 text-center">
          <Title
            level={2}
            className="text-3xl md:text-5xl font-semibold text-[#0F172A] mb-8"
          >
            Set Design Nổi Bật
          </Title>
          <Empty description="Chưa có Set Design nào" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        {/* HEADER */}
        <div className="text-center mb-10 space-y-3">
          <Title
            level={2}
            className="text-3xl md:text-5xl font-semibold text-[#0F172A] mb-0"
          >
            Set Design Nổi Bật
          </Title>
          <Paragraph className="text-slate-600 text-lg max-w-2xl mx-auto">
            Bộ sưu tập thiết kế được curated kỹ lưỡng phục vụ mọi nhu cầu chụp
            ảnh chuyên nghiệp
          </Paragraph>
        </div>

        {/* Carousel Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="grid md:grid-cols-2 h-[460px] bg-white overflow-hidden border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:border-[#C5A267] transition-all duration-300 rounded-3xl cursor-pointer"
            onClick={handleCardClick}
          >
            {/* IMAGE */}
            <div className="relative overflow-hidden h-full bg-slate-200">
              <img
                key={current}
                src={
                  currentDesign?.images?.[0] ||
                  "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1000&q=80"
                }
                alt={currentDesign?.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* CONTENT */}
            <div
              key={`content-${current}`}
              className="p-6 md:p-8 flex flex-col justify-between h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4 pt-4">
                {/* CATEGORY */}
                <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-[0.2em]">
                  {currentDesign?.category === "wedding"
                    ? "Tiệc cưới"
                    : currentDesign?.category === "corporate"
                    ? "Doanh nghiệp"
                    : currentDesign?.category === "birthday"
                    ? "Sinh nhật"
                    : currentDesign?.category === "portrait"
                    ? "Chân dung"
                    : currentDesign?.category === "event"
                    ? "Sự kiện"
                    : currentDesign?.category === "other"
                    ? "Khác"
                    : currentDesign?.category || "Danh mục"}
                </div>

                {/* TITLE */}
                <Title
                  level={2}
                  className="text-2xl md:text-4xl font-semibold text-[#0F172A] leading-tight line-clamp-2 min-h-[72px]"
                >
                  {currentDesign?.name}
                </Title>

                {/* DESCRIPTION */}
                <Paragraph className="text-slate-600 text-base leading-relaxed whitespace-pre-line line-clamp-6 min-h-[72px]">
                  {currentDesign?.description ||
                    "Bộ thiết kế được thiết kế chuyên nghiệp, phù hợp với mọi nhu cầu chụp ảnh từ studio đến ngoại cảnh."}
                </Paragraph>
              </div>

              {/* BUTTON */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDetail(currentDesign?._id);
                  }}
                  className="flex-1 px-6 py-3 bg-[#C5A267] text-white font-semibold uppercase tracking-[0.2em]  
                             transition-all duration-300 rounded-lg shadow-md hover:scale-105 cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* ARROWS */}
          {filteredSetDesigns.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white cursor-pointer
                           text-[#0F172A] hover:text-white hover:bg-[#C5A267] p-4 rounded-full shadow-xl border border-slate-200 
                           hover:border-transparent transition-all z-30"
              >
                <FiChevronLeft size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white cursor-pointer
                           text-[#0F172A] hover:text-white hover:bg-[#C5A267] p-4 rounded-full shadow-xl border border-slate-200 
                           hover:border-transparent transition-all z-30"
              >
                <FiChevronRight size={28} />
              </button>
            </>
          )}

          {/* DOTS */}
          {filteredSetDesigns.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {filteredSetDesigns.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(index > current ? "next" : "prev");
                    setCurrent(index);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-[#C5A267] w-10"
                      : "bg-slate-300 hover:bg-slate-400 w-2.5"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SetDesignSection;
