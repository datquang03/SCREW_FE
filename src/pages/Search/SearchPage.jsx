import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiStar, FiMapPin, FiUsers, FiShoppingCart } from 'react-icons/fi';
import { createSearch } from '../../features/search/searchSlice';

const CARD_WIDTH = 340; // px
const CARD_GAP = 24; // px
const SLIDE_STEP = 1;

const SearchPage = () => {
  const dispatch = useDispatch();
  const { results = [], loading, error } = useSelector(state => state.search);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get('keyword');

  // Gọi lại search khi vào trang hoặc refresh
  useEffect(() => {
    if (keyword) {
      dispatch(createSearch(keyword));
    }
  }, [keyword, dispatch]);

  // Lấy studios từ kết quả API mới
  let studios = [];
  if (results && results.data && results.data.studios) {
    studios = results.data.studios;
  } else if (Array.isArray(results)) {
    studios = results; // fallback nếu kết quả là mảng studio
  }

  // Slide logic
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const maxVisible = Math.max(1, Math.floor((window.innerWidth - 64) / (CARD_WIDTH + CARD_GAP)));
  const totalSlides = Math.max(0, studios.length - maxVisible + 1);

  useEffect(() => {
    setCurrent(0);
  }, [keyword]);

  const goPrev = () => setCurrent((prev) => Math.max(0, prev - SLIDE_STEP));
  const goNext = () => setCurrent((prev) => Math.min(totalSlides, prev + SLIDE_STEP));

  return (
    <div className="max-w-7xl mx-auto pt-20 pb-16 px-4"> {/* Tăng padding top và bottom */}
      <h1 className="text-2xl font-bold mb-8">
        Kết quả tìm kiếm cho: <span className="text-amber-600">{keyword}</span>
      </h1>
      {loading && (
        <div className="flex gap-6 mb-8" style={{ minHeight: 420 }}>
          {[...Array(maxVisible)].map((_, idx) => (
            <div
              key={idx}
              style={{ minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH }}
              className="flex-shrink-0 flex flex-col animate-pulse"
            >
              <div className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.10)] flex flex-col">
                <div className="w-full h-48 bg-amber-50 rounded-[24px] mb-4" />
                <div className="flex-1 flex flex-col justify-between px-4 py-2">
                  <div className="h-5 w-24 bg-amber-100 rounded mb-2" />
                  <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-56 bg-gray-100 rounded mb-2" />
                  <div className="flex gap-2 mb-2">
                    <div className="h-4 w-16 bg-amber-100 rounded" />
                    <div className="h-4 w-20 bg-blue-100 rounded" />
                  </div>
                </div>
                <div className="px-4 pb-6 flex flex-col gap-2">
                  <div className="h-4 w-16 bg-gray-100 rounded mb-1" />
                  <div className="h-8 w-32 bg-amber-100 rounded mb-1" />
                  <div className="h-10 w-full bg-amber-200 rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500">{error.message || 'Có lỗi xảy ra.'}</p>}
      {!loading && !error && studios && studios.length === 0 && (
        <p>Không tìm thấy kết quả phù hợp.</p>
      )}
      <div className="relative">
        {/* Slide buttons */}
        {studios.length > maxVisible && (
          <>
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg border border-amber-100 disabled:opacity-40"
            >
              <FiChevronLeft size={28} className="text-amber-700" />
            </button>
            <button
              onClick={goNext}
              disabled={current >= totalSlides}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg border border-amber-100 disabled:opacity-40"
            >
              <FiChevronRight size={28} className="text-amber-700" />
            </button>
          </>
        )}
        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent"
          style={{ padding: '0 48px' }}
        >
          <div
            className="flex gap-6 transition-transform duration-500"
            style={{
              transform: `translateX(-${(CARD_WIDTH + CARD_GAP) * current}px)`
            }}
          >
            {studios.map((studio) => (
              <div
                key={studio._id}
                style={{ minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH }}
                className="flex-shrink-0 flex flex-col"
              >
                <div
                  className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-4 flex-shrink-0">
                    {studio.images?.[0] ? (
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-50 flex items-center justify-center font-bold text-amber-600">
                        {studio.name}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                      <FiStar className="text-amber-500" size={14} />
                      <span className="text-sm font-bold text-amber-700">
                        {studio.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>
                  {/* BODY */}
                  <div className="flex-1 flex flex-col justify-between px-4 py-2">
                    <span className="inline-flex w-fit px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-semibold text-amber-700 mb-2">
                      Studio nổi bật
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 min-h-[48px] flex items-center">
                      {studio.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2 min-h-[40px] flex items-center">
                      {studio.description?.length > 80 ? studio.description.slice(0, 80) + '...' : studio.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2 min-h-[24px]">
                      {studio.capacity && (
                        <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                          <FiUsers className="inline-block mr-1" size={14} />
                          {studio.capacity} người
                        </span>
                      )}
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        {studio.basePricePerHour?.toLocaleString()}đ/giờ
                      </span>
                    </div>
                  </div>
                  {/* PRICE + CTA */}
                  <div className="px-4 pb-6 flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Giá từ</div>
                    <div className="text-2xl font-extrabold text-amber-600 mb-1">
                      {studio.basePricePerHour?.toLocaleString("vi-VN")}₫
                      <span className="text-sm text-gray-500 ml-1">/ giờ</span>
                    </div>
                    <a
                      href={`/studio/${studio._id}`}
                      className="w-full h-12 bg-amber-500 hover:bg-amber-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4"
                      style={{ marginTop: 'auto' }}
                    >
                      <FiShoppingCart size={16} /> Đặt ngay
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
