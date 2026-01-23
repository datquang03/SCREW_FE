import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  FiStar,
  FiUsers,
  FiShoppingCart,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import { createSearch } from "../../features/search/searchSlice";
import { FaInfoCircle } from "react-icons/fa";
import { Modal, Divider, Progress, Tag, Typography } from "antd";
const { Title, Text } = Typography;

const SearchPage = () => {
  const dispatch = useDispatch();
  const { results = [], loading, error } = useSelector((state) => state.search);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEquipment, setSelectedEquipment] = React.useState(null);

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

  // Thêm hàm formatPrice
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  const getStockPercent = (available, total) =>
    total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className="bg-[#FCFBFA] min-h-screen">
      {/* Navy Header */}
      <div className="bg-[#0F172A] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
            Search Results
          </p>
          <h1 className="text-4xl font-semibold text-white mb-4">
            Kết quả tìm kiếm cho: <span className="text-[#C5A267]">{keyword}</span>
          </h1>
          {!loading && totalResults > 0 && (
            <p className="text-slate-300 text-sm uppercase tracking-[0.3em]">Tìm thấy {totalResults} kết quả</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-24">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex flex-col animate-pulse">
              <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] flex flex-col p-6">
                <div className="w-full h-48 bg-slate-100 mb-4" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="h-5 w-24 bg-slate-100 mb-2" />
                  <div className="h-6 w-40 bg-slate-200 mb-2" />
                  <div className="h-4 w-full bg-slate-100 mb-2" />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="h-4 w-16 bg-slate-100 mb-1" />
                  <div className="h-8 w-32 bg-[#C5A267]/20 mb-1" />
                  <div className="h-10 w-full bg-[#0F172A]/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="text-red-500">{error.message || "Có lỗi xảy ra."}</p>
      )}
      {!loading && !error && totalResults === 0 && (
        <p className="text-gray-600">Không tìm thấy kết quả phù hợp.</p>
      )}

      {/* STUDIOS */}
      {!loading && studios.length > 0 && (
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">Studios</p>
            <h2 className="text-3xl font-semibold text-[#0F172A]">Studio Spaces</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div key={studio._id} className="flex flex-col">
                <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden flex-shrink-0 transition-all duration-500">
                    {studio.images?.[0] ? (
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                        {studio.name}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#0F172A] px-4 py-2 flex items-center gap-2">
                      <FiStar className="text-[#C5A267]" size={14} />
                      <span className="text-sm font-bold text-[#C5A267]">
                        {studio.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                      Studio
                    </span>
                    <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3">
                      {studio.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {studio.description?.length > 80
                        ? studio.description.slice(0, 80) + "..."
                        : studio.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                      {studio.capacity && (
                        <span className="inline-block border border-slate-200 px-3 py-1 font-semibold uppercase tracking-wider">
                          <FiUsers className="inline-block mr-1" size={14} />
                          {studio.capacity} người
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex flex-col gap-3">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Giá từ</div>
                    <div className="text-2xl font-semibold text-[#C5A267] mb-2">
                      {studio.basePricePerHour?.toLocaleString("vi-VN")}₫
                      <span className="text-sm text-slate-500 ml-1">/ giờ</span>
                    </div>
                    <a
                      href={`/studio/${studio._id}`}
                      className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300"
                    >
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
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">Equipment</p>
            <h2 className="text-3xl font-semibold text-[#0F172A]">Thiết bị</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <div key={item._id} className="flex flex-col">
                <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden flex-shrink-0 transition-all duration-500">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                      <FiPackage className="inline-block mr-1" size={12} />
                      Thiết bị
                    </span>
                    <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {item.description?.length > 80
                        ? item.description.slice(0, 80) + "..."
                        : item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                      {item.availableQty && (
                        <span className="inline-block border border-slate-200 px-3 py-1 font-semibold uppercase tracking-wider">
                          Còn {item.availableQty} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex flex-col gap-3">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Giá thuê</div>
                    <div className="text-2xl font-semibold text-[#C5A267] mb-2">
                      {item.pricePerHour?.toLocaleString("vi-VN")}₫
                      <span className="text-sm text-slate-500 ml-1">/ giờ</span>
                    </div>
                    <button
                      className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300"
                      onClick={() => {
                        setSelectedEquipment(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaInfoCircle size={16} /> Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* MODAL CHI TIẾT THIẾT BỊ */}
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={900}
            centered
          >
            {selectedEquipment && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <img
                  src={selectedEquipment.image}
                  alt={selectedEquipment.name}
                  className="w-full h-[360px] object-cover rounded-xl"
                />
                <div>
                  <Title level={2}>{selectedEquipment.name}</Title>
                  <Text>{selectedEquipment.description}</Text>
                  <Divider />
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Tag color="green">Còn: {selectedEquipment.availableQty}</Tag>
                  </div>
                  <Divider />
                  <Title level={1} className="text-amber-600">
                    {formatPrice(selectedEquipment.pricePerHour)} / giờ
                  </Title>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}

      {/* SERVICES */}
      {!loading && services.length > 0 && (
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">Services</p>
            <h2 className="text-3xl font-semibold text-[#0F172A]">Dịch vụ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="flex flex-col">
                <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col">
                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                      <FiTag className="inline-block mr-1" size={12} />
                      Dịch vụ
                    </span>
                    <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {service.description}
                    </p>
                    <div className="text-2xl font-semibold text-[#C5A267] mb-4">
                      {service.price?.toLocaleString("vi-VN")}₫
                    </div>
                    <button className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300">
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
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">Promotions</p>
            <h2 className="text-3xl font-semibold text-[#0F172A]">Khuyến mãi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div key={promo._id} className="flex flex-col">
                <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col px-6 py-6">
                  <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                    Khuyến mãi
                  </span>
                  <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3">
                    {promo.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {promo.description}
                  </p>
                  <div className="text-2xl font-semibold text-[#C5A267] mb-4">
                    Giảm {promo.discount}%
                  </div>
                  <button className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300">
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
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">Set Designs</p>
            <h2 className="text-3xl font-semibold text-[#0F172A]">Set Design</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setDesigns.map((design) => (
              <div key={design._id} className="flex flex-col">
                <div className="h-full bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#C5A267] group flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden flex-shrink-0 transition-all duration-500">
                    {design.image ? (
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                        {design.name}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <span className="inline-flex w-fit text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-3">
                      Set Design
                    </span>
                    <h3 className="text-xl font-semibold text-[#0F172A] line-clamp-2 mb-3">
                      {design.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {design.description}
                    </p>
                  </div>
                  <div className="px-6 pb-6 flex flex-col gap-3">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Giá</div>
                    <div className="text-2xl font-semibold text-[#C5A267] mb-2">
                      {design.price?.toLocaleString("vi-VN")}₫
                    </div>
                    <a
                      href={`/set-design/${design._id}`}
                      className="w-full h-12 bg-[#0F172A] hover:bg-[#C5A267] font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[#C5A267] hover:text-[#0F172A] transition-all duration-300"
                    >
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
    </div>
  );
};

export default SearchPage;
