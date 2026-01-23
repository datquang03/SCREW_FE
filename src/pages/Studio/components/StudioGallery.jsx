import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function StudioGallery({ images = [] }) {
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

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="studio-panel overflow-hidden rounded-2xl group hover:border-amber-200 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img}
                alt={`Studio image ${i + 1}`}
                className="w-full h-64 md:h-72 object-cover group-hover:scale-110 transition duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal - Using Portal */}
      {selectedImage && createPortal(
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
            {images.length > 1 && (
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
            {images.length > 1 && (
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
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm" style={{ zIndex: 1000000 }}>
                {currentIndex + 1} / {images.length}
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
    </>
  );
}
