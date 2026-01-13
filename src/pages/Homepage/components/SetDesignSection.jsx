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
  const timeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const filteredSetDesigns = setDesigns.filter(item => !item.isConvertedFromCustomRequest);

  // Chỉ gọi API một lần khi component được mount
  useEffect(() => {
    dispatch(getActiveSetDesigns());
  }, [dispatch]);

  useEffect(() => {
    if (!isHovering && filteredSetDesigns.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovering, filteredSetDesigns.length]);

  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + filteredSetDesigns.length) % filteredSetDesigns.length);
  const handleNext = () =>
    setCurrent((prev) => (prev + 1) % filteredSetDesigns.length);

  // Hàm chung: chuyển sang trang chi tiết + gọi API
  const goToDetail = (id) => {
    dispatch(getSetDesignById(id));        // Gọi API lấy chi tiết trước
    navigate(`/set-design/${id}`);         // Chuyển trang luôn
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center mb-12">
            <Title level={2} className="text-3xl md:text-5xl font-black text-gray-900">
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
      <div className="w-full bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 text-center">
          <Title level={2} className="text-3xl md:text-5xl font-black text-gray-900 mb-8">
            Set Design Nổi Bật
          </Title>
          <Empty description="Chưa có Set Design nào" />
        </div>
      </div>
    );
  }

  const item = filteredSetDesigns[current];
  const imageUrl = item.images?.[0] || "https://images.unsplash.com/photo-1618776148559-309e0b8775d3?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="relative w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs uppercase tracking-wider font-semibold">
            Tinh Lọc & Chuyên Nghiệp
          </div>
          <Title level={2} className="text-3xl md:text-5xl font-black text-gray-900 mb-0">
            Set Design Nổi Bật
          </Title>
          <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bộ sưu tập thiết kế được curated kỹ lưỡng phục vụ mọi nhu cầu chụp ảnh chuyên nghiệp
          </Paragraph>
        </div>

        <div className="relative overflow-visible">
          <div
            className="grid md:grid-cols-2 gap-0 items-stretch bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => goToDetail(item._id)}
          >
            <div className="relative overflow-hidden h-80 md:h-full min-h-96 bg-slate-200">
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {item.category === "wedding" ? "Tiệc cưới" :
                       item.category === "corporate" ? "Doanh nghiệp" :
                       item.category === "birthday" ? "Sinh nhật" :
                       item.category === "other" ? "Khác" : item.category || "Danh mục"}
                    </div>
                    <Title level={2} className="text-2xl md:text-4xl font-black text-gray-900 mb-0 leading-tight">
                      {item.name}
                    </Title>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-2 rounded-full whitespace-nowrap border border-amber-200">
                    <FiStar className="text-amber-500" size={18} />
                    <Text strong className="text-amber-900 text-sm">
                      {item.averageRating > 0 ? item.averageRating.toFixed(1) : "5.0"}
                    </Text>
                  </div>
                </div>

                <Paragraph className="text-gray-600 text-base leading-relaxed">
                  {item.description || "Bộ thiết kế được thiết kế chuyên nghiệp, phù hợp với mọi nhu cầu chụp ảnh từ studio đến ngoại cảnh."}
                </Paragraph>
              </div>

              <div className="space-y-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDetail(item._id);
                  }}
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 border-0"
                  style={{ color: "#fff" }}
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/booking/set-design/${item._id}`);
                  }}
                  className="w-full px-6 py-3 bg-slate-100 text-gray-800 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 mt-1"
                >
                  Đặt ngay set design này
                </button>
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          {filteredSetDesigns.length > 1 && (
            <>
              <button 
                onClick={handlePrev} 
                className="absolute top-1/2 -left-8 md:-left-16 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3.5 hover:bg-slate-50 hover:shadow-xl transition-all duration-200 z-10 border border-slate-200"
                aria-label="Previous"
              >
                <FiChevronLeft size={28} className="text-gray-800" />
              </button>
              <button 
                onClick={handleNext} 
                className="absolute top-1/2 -right-8 md:-right-16 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3.5 hover:bg-slate-50 hover:shadow-xl transition-all duration-200 z-10 border border-slate-200"
                aria-label="Next"
              >
                <FiChevronRight size={28} className="text-gray-800" />
              </button>
            </>
          )}
        </div>

        {/* Chỉ báo slides */}
        {filteredSetDesigns.length > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {filteredSetDesigns.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`rounded-full transition-all duration-300 ${
                  current === idx 
                    ? "bg-indigo-600 w-10 h-3" 
                    : "bg-slate-300 w-3 h-3 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetDesignSection;