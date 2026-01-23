import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Typography, Button, Carousel, Card, Skeleton } from "antd";
import { FiMapPin, FiUsers, FiCheckCircle, FiMaximize } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

const BookingStudioInfo = ({ onNext }) => {
  const { currentStudio, loading } = useSelector((state) => state.studio);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(currentStudio.images[index]);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % currentStudio.images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(currentStudio.images[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + currentStudio.images.length) % currentStudio.images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(currentStudio.images[prevIndex]);
  };

  if (loading || !currentStudio) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4">
          <Skeleton.Input active size="large" className="!w-64 !h-10" />
          <Skeleton.Input active size="default" className="!w-96 !h-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton.Image active className="!w-full !h-[500px] !rounded-sm" />
          <div className="space-y-8">
            <Card className="rounded-sm border-gray-100 p-8 shadow-sm">
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 pb-20">
      {/* LUXURY HEADER */}
      <div className="text-center space-y-4">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">Quy trình đặt phòng</p>
        <Title level={2} className="!text-4xl md:!text-5xl !font-semibold !text-[#0F172A] !mb-0">
          Thông tin Studio
        </Title>
        <div className="h-px w-24 bg-[#C5A267] mx-auto mt-6"></div>
        <Paragraph className="text-slate-400 text-sm uppercase tracking-widest pt-2">
          Vui lòng kiểm tra kỹ các thông số trước khi tiến hành thanh toán
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT: REFINED IMAGES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          {currentStudio.images && currentStudio.images.length > 0 ? (
            <div className="relative group">
               <Carousel
                autoplay
                effect="fade"
                dots={{ className: "custom-dots" }}
                className="overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 bg-white p-2"
              >
                {currentStudio.images.map((img, idx) => (
                  <div key={idx} className="h-[400px] lg:h-[600px] w-full overflow-hidden cursor-pointer" onClick={() => openLightbox(idx)}>
                    <img
                      src={img}
                      alt={currentStudio.name}
                      className="w-full h-full object-cover transition-all duration-1000"
                    />
                  </div>
                ))}
              </Carousel>
              <button 
                onClick={() => openLightbox(0)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 shadow-xl hover:bg-[#C5A267] hover:text-white transition-colors duration-300 cursor-pointer"
              >
                 <FiMaximize />
              </button>
            </div>
          ) : (
            <div className="h-[500px] w-full bg-[#F8F6F3] border border-dashed border-[#C5A267]/30 flex flex-col items-center justify-center text-[#C5A267]">
              <span className="text-4xl mb-4 font-semibold opacity-40">Luxe Space</span>
              <p className="text-[10px] uppercase tracking-widest font-bold">Hình ảnh đang cập nhật</p>
            </div>
          )}
        </motion.div>

        {/* RIGHT: EXECUTIVE INFO CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="bg-white border border-gray-100 p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] rounded-sm relative overflow-hidden">
            {/* Elegant corner accent */}
            <div className="absolute top-0 left-0 w-1 h-24 bg-[#C5A267]"></div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-4">Studio Chuyên Nghiệp</p>
            <Title level={1} className="!text-3xl md:!text-4xl !font-semibold !text-[#0F172A] !mb-6">
              {currentStudio.name}
            </Title>

            <Paragraph className="text-slate-500 text-sm leading-relaxed font-light mb-10 pb-10 border-b border-slate-50">
              {currentStudio.description || "Không có mô tả"}
            </Paragraph>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-y-8 mb-12">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Vị trí</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FiMapPin className="text-[#C5A267]" size={14} />
                  <span>{currentStudio.location || "TP. Hồ Chí Minh"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sức chứa</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FiUsers className="text-[#C5A267]" size={14} />
                  <span>{currentStudio.capacity} nhân sự</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Diện tích</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FiMaximize className="text-[#C5A267]" size={14} />
                  <span>{currentStudio.area} m²</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Trạng thái</p>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentStudio.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    {currentStudio.status === "active" ? "Sẵn sàng" : "Bảo trì"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRICING SECTION */}
            <div className="bg-[#0F172A] p-8 -mx-10 mb-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-4">Chi phí niêm yết</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-white">
                  {currentStudio.basePricePerHour?.toLocaleString() || 0}₫
                </span>
                <span className="text-[#C5A267] text-sm">/ giờ</span>
              </div>
            </div>

            {/* RATINGS */}
            {currentStudio.avgRating > 0 && (
              <div className="flex items-center gap-4 mb-10 pt-4 border-t border-slate-50">
                <div className="flex text-[#C5A267] gap-0.5">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <Text className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  {currentStudio.avgRating.toFixed(1)} / {currentStudio.reviewCount} Đánh giá
                </Text>
              </div>
            )}

            {/* CTA BUTTON */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                size="large"
                className="w-full !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !font-bold !h-16 !rounded-none !shadow-2xl transition-all duration-500 !flex !items-center !justify-center !gap-4 !text-[10px] !uppercase !tracking-[0.3em]"
                onClick={onNext}
              >
                <span>Xác nhận thông tin</span>
                <FiCheckCircle size={16} className="mb-0.5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal - Using Portal */}
      {selectedImage && currentStudio.images && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
              style={{ zIndex: 1000000 }}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {currentStudio.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
                style={{ zIndex: 1000000 }}
                aria-label="Previous"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {currentStudio.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
                style={{ zIndex: 1000000 }}
                aria-label="Next"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            {currentStudio.images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm" style={{ zIndex: 1000000 }}>
                {currentIndex + 1} / {currentStudio.images.length}
              </div>
            )}

            {/* Image */}
            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selectedImage}
              alt={`Studio fullscreen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

// Custom Star Icon for luxury look
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export default BookingStudioInfo;