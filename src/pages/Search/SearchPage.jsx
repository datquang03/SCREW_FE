import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FiStar, FiUsers, FiShoppingCart, FiPackage, FiTag } from 'react-icons/fi';
import { createSearch } from '../../features/search/searchSlice';

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

  // Lấy dữ liệu từ kết quả API
  const searchData = results?.data || {};
  const studios = searchData.studios || [];
  const equipment = searchData.equipment || [];
  const services = searchData.services || [];
  const promotions = searchData.promotions || [];
  const setDesigns = searchData.setDesigns || [];
  const totalResults = results?.totalResults || 0;

  return (
    <div className="max-w-7xl mx-auto pt-20 pb-16 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho: <span className="text-amber-600">{keyword}</span>
      </h1>
      {!loading && totalResults > 0 && (
        <p className="text-gray-600 mb-8">Tìm thấy {totalResults} kết quả</p>
      )}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex flex-col animate-pulse">
              <div className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.10)] flex flex-col">
                <div className="w-full h-48 bg-amber-50 rounded-[24px] mb-4" />
                <div className="flex-1 flex flex-col justify-between px-4 py-2">
                  <div className="h-5 w-24 bg-amber-100 rounded mb-2" />
                  <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                  <div className="flex gap-2 mb-2">
                    <div className="h-4 w-16 bg-amber-100 rounded" />
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
      {!loading && !error && totalResults === 0 && (
        <p className="text-gray-600">Không tìm thấy kết quả phù hợp.</p>
      )}

      {/* STUDIOS */}
      {!loading && studios.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Studios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div key={studio._id} className="flex flex-col">
                <div className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col">
                  <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-4 flex-shrink-0">
                    {studio.images?.[0] ? (
                      <img src={studio.images[0]} alt={studio.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-amber-50 flex items-center justify-center font-bold text-amber-600">{studio.name}</div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                      <FiStar className="text-amber-500" size={14} />
                      <span className="text-sm font-bold text-amber-700">{studio.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-4 py-2">
                    <span className="inline-flex w-fit px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-xs font-semibold text-amber-700 mb-2">Studio</span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{studio.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{studio.description?.length > 80 ? studio.description.slice(0, 80) + '...' : studio.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                      {studio.capacity && (
                        <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                          <FiUsers className="inline-block mr-1" size={14} />{studio.capacity} người
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 pb-6 flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Giá từ</div>
                    <div className="text-2xl font-extrabold text-amber-600 mb-1">
                      {studio.basePricePerHour?.toLocaleString("vi-VN")}₫<span className="text-sm text-gray-500 ml-1">/ giờ</span>
                    </div>
                    <a href={`/studio/${studio._id}`} className="w-full h-12 bg-amber-500 hover:bg-amber-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4">
                      <FiShoppingCart size={16} /> Đặt ngay
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EQUIPMENT */}
      {!loading && equipment.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Thiết bị</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <div key={item._id} className="flex flex-col">
                <div className="h-full rounded-[28px] border border-blue-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col">
                  <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-4 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">{item.name}</div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-4 py-2">
                    <span className="inline-flex w-fit px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-2">
                      <FiPackage className="inline-block mr-1" size={12} />Thiết bị
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description?.length > 80 ? item.description.slice(0, 80) + '...' : item.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                      {item.availableQty && (
                        <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          Còn {item.availableQty} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 pb-6 flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Giá thuê</div>
                    <div className="text-2xl font-extrabold text-blue-600 mb-1">
                      {item.pricePerHour?.toLocaleString("vi-VN")}₫<span className="text-sm text-gray-500 ml-1">/ giờ</span>
                    </div>
                    <a href={`/equipment/${item._id}`} className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4">
                      <FiShoppingCart size={16} /> Thuê ngay
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES */}
      {!loading && services.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Dịch vụ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="flex flex-col">
                <div className="h-full rounded-[28px] border border-green-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col">
                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <span className="inline-flex w-fit px-3 py-1 bg-green-50 border border-green-100 rounded-full text-xs font-semibold text-green-700 mb-2">
                      <FiTag className="inline-block mr-1" size={12} />Dịch vụ
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{service.description}</p>
                    <div className="text-2xl font-extrabold text-green-600 mb-4">
                      {service.price?.toLocaleString("vi-VN")}₫
                    </div>
                    <button className="w-full h-12 bg-green-500 hover:bg-green-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROMOTIONS */}
      {!loading && promotions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Khuyến mãi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div key={promo._id} className="flex flex-col">
                <div className="h-full rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 to-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col px-6 py-6">
                  <span className="inline-flex w-fit px-3 py-1 bg-red-100 border border-red-200 rounded-full text-xs font-semibold text-red-700 mb-2">
                    Khuyến mãi
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{promo.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{promo.description}</p>
                  <div className="text-2xl font-extrabold text-red-600 mb-4">
                    Giảm {promo.discount}%
                  </div>
                  <button className="w-full h-12 bg-red-500 hover:bg-red-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4">
                    Áp dụng ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SET DESIGNS */}
      {!loading && setDesigns.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Set Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setDesigns.map((design) => (
              <div key={design._id} className="flex flex-col">
                <div className="h-full rounded-[28px] border border-purple-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col">
                  <div className="relative w-full h-48 rounded-[24px] overflow-hidden mb-4 flex-shrink-0">
                    {design.image ? (
                      <img src={design.image} alt={design.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center font-bold text-purple-600">{design.name}</div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-4 py-2">
                    <span className="inline-flex w-fit px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700 mb-2">
                      Set Design
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{design.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{design.description}</p>
                  </div>
                  <div className="px-4 pb-6 flex flex-col gap-2">
                    <div className="text-xs text-gray-500">Giá</div>
                    <div className="text-2xl font-extrabold text-purple-600 mb-1">
                      {design.price?.toLocaleString("vi-VN")}₫
                    </div>
                    <a href={`/set-design/${design._id}`} className="w-full h-12 bg-purple-500 hover:bg-purple-600 border-none rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-none text-white transition-all py-2 px-4">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
