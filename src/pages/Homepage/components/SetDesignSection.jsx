// src/pages/Homepage/components/SetDesignSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Skeleton, Empty } from "antd";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getActiveSetDesigns, getSetDesignById } from "../../../features/setDesign/setDesignSlice";

const { Title, Paragraph, Text } = Typography;

const SetDesignSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const setDesigns = useSelector((state) => state.setDesign.activeSetDesigns);
  const loading = useSelector((state) => state.setDesign.loading);

  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState('next');
  const timeoutRef = useRef(null);

  const filteredSetDesigns = setDesigns.filter(item => !item.isConvertedFromCustomRequest);

  // Load initial data
  useEffect(() => {
    dispatch(getActiveSetDesigns());
  }, [dispatch]);

  // Auto-slide effect
  useEffect(() => {
    if (!isHovering && filteredSetDesigns.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setDirection('next');
        setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovering, filteredSetDesigns.length]);

  const handlePrev = () => {
    setDirection('prev');
    setCurrent((prev) => (prev - 1 + filteredSetDesigns.length) % filteredSetDesigns.length);
  };
  
  const handleNext = () => {
    setDirection('next');
    setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);
  };

  // Navigate to detail page
  const goToDetail = (id) => {
    dispatch(getSetDesignById(id));
    navigate(`/set-design/${id}`);
  };

  if (loading && filteredSetDesigns.length === 0) {
    return (
      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center mb-10">
            <Title level={2} className="text-3xl md:text-5xl font-semibold text-[#0F172A]">
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
          <Title level={2} className="text-3xl md:text-5xl font-semibold text-[#0F172A] mb-8">
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
        <div className="text-center mb-10 space-y-3">
          <Title level={2} className="text-3xl md:text-5xl font-semibold text-[#0F172A] mb-0">
            Set Design Nổi Bật
          </Title>
          <Paragraph className="text-slate-600 text-lg max-w-2xl mx-auto">
            Bộ sưu tập thiết kế được curated kỹ lưỡng phục vụ mọi nhu cầu chụp ảnh chuyên nghiệp
          </Paragraph>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden" 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="grid md:grid-cols-2 gap-0 items-stretch bg-white overflow-hidden border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:border-[#C5A267] transition-all duration-300">
            {/* Image with slide animation */}
            <div className="relative overflow-hidden h-80 md:h-full min-h-80 bg-slate-200">
              <img
                key={current}
                src={filteredSetDesigns[current]?.images?.[0] || "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1000&q=80"}
                alt={filteredSetDesigns[current]?.name}
                className={`w-full h-full object-cover animate-${direction === 'next' ? 'slideInRight' : 'slideInLeft'}`}
                loading="lazy"
                style={{
                  animation: `${direction === 'next' ? 'slideInRight' : 'slideInLeft'} 0.6s ease-out`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content with fade animation */}
            <div 
              key={`content-${current}`}
              className="p-5 md:p-8 flex flex-col justify-between space-y-6 bg-white relative"
              style={{
                animation: 'fadeIn 0.6s ease-out'
              }}
            >
              {/* Star Rating - Top Right */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0F172A] px-4 py-2 border border-[#C5A267]">
                <FiStar className="text-white" size={20} />
                <Text strong className="text-white text-base">
                  {filteredSetDesigns[current]?.averageRating > 0 ? filteredSetDesigns[current]?.averageRating.toFixed(1) : "5.0"}
                </Text>
              </div>

              <div className="space-y-4 pt-8">
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-[0.2em]">
                    {filteredSetDesigns[current]?.category === "wedding" ? "Tiệc cưới" :
                     filteredSetDesigns[current]?.category === "corporate" ? "Doanh nghiệp" :
                     filteredSetDesigns[current]?.category === "birthday" ? "Sinh nhật" :
                     filteredSetDesigns[current]?.category === "other" ? "Khác" : filteredSetDesigns[current]?.category || "Danh mục"}
                  </div>
                  <Title level={2} className="text-2xl md:text-4xl font-semibold text-[#0F172A] mb-0 leading-tight pr-20">
                    {filteredSetDesigns[current]?.name}
                  </Title>
                </div>

                <Paragraph className="text-slate-600 text-base leading-relaxed">
                  {filteredSetDesigns[current]?.description || "Bộ thiết kế được thiết kế chuyên nghiệp, phù hợp với mọi nhu cầu chụp ảnh từ studio đến ngoại cảnh."}
                </Paragraph>
              </div>

              {/* Buttons with simple hover effects */}
              <div className="flex gap-3 relative z-10">
                <button
                  onClick={() => goToDetail(filteredSetDesigns[current]?._id)}
                  className="flex-1 px-6 py-3 bg-[#C5A267] text-white font-semibold uppercase tracking-[0.2em] border-none outline-none transition-all duration-300 hover:!bg-[#0F172A] hover:!text-white"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => navigate(`/booking/set-design/${filteredSetDesigns[current]?._id}`)}
                  className="flex-1 px-6 py-3 bg-white text-[#0F172A] border border-[#0F172A] font-semibold uppercase tracking-[0.2em] outline-none transition-all duration-300 hover:!bg-[#0F172A] hover:!text-white"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredSetDesigns.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0F172A]/80 hover:bg-[#C5A267] text-white p-3 border border-[#C5A267] transition-all duration-300 z-20"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0F172A]/80 hover:bg-[#C5A267] text-white p-3 border border-[#C5A267] transition-all duration-300 z-20"
                aria-label="Next slide"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Indicators */}
          {filteredSetDesigns.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {filteredSetDesigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 'next' : 'prev');
                    setCurrent(index);
                  }}
                  className={`w-3 h-3 transition-all duration-300 ${
                    index === current 
                      ? 'bg-[#C5A267] w-8' 
                      : 'bg-gray-400 hover:bg-[#A0826D]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SetDesignSection;