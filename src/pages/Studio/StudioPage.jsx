// src/pages/Studio/StudioPage.jsx
import React, { useEffect } from "react";
import { Typography, Button, Spin, Carousel } from "antd";
import { FiStar, FiMapPin, FiUsers, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import Section from "../../components/common/Section";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveStudios } from "../../features/studio/studioSlice";

const { Title, Text, Paragraph } = Typography;

const StudioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studios, loading } = useSelector((state) => state.studio);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "—";
    if (typeof price === "number") return price.toLocaleString();
    const parsed = Number(price);
    return Number.isNaN(parsed) ? "—" : parsed.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-[#f5ede6] shadow-xl">
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(circle at 60% 40%,rgba(99,102,241,0.08),transparent 35%)",
          }}
        />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center px-6 md:px-10 py-14">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-3 space-y-5">
            <div className="uppercase tracking-widest text-xs font-bold text-blue-700 mb-2">
              SEASONAL OFFERS
            </div>
            <Title
              level={1}
              className="!text-4xl md:!text-5xl !text-gray-900 font-black leading-[1.05] mb-2"
            >
              Ưu Đãi Đặc Biệt Từ <br />
              <span className="italic font-serif text-4xl md:text-5xl text-gray-900">
                S+ Studio
              </span>
            </Title>
            <Paragraph className="!text-base md:!text-lg text-gray-700 max-w-2xl leading-relaxed mb-6">
              Nâng tầm sáng tạo với những gói dịch vụ cao cấp và ưu đãi độc
              quyền dành riêng cho cộng đồng nghệ sĩ đương đại.
            </Paragraph>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#studio-list"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white font-semibold px-6 py-3 shadow hover:-translate-y-0.5 transition-all"
              >
                Khám phá bộ sưu tập
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 font-semibold px-6 py-3 shadow border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Xem bảng giá
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Studios List */}
      <Section
        id="studio-list"
        className="py-12 md:py-20 bg-white"
        containerClass="max-w-7xl mx-auto px-4"
        title="Studio Nổi Bật"
        subtitle="Không gian được khách hàng yêu thích nhất"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studios.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              Không có studio nào đang hoạt động
            </div>
          ) : (
            studios.map((studio, index) => (
              <div
                key={studio._id}
                className="flex-shrink-0 flex flex-col"
                style={{ minWidth: 340, maxWidth: 340, margin: "0 auto" }}
              >
                <div
                  className="h-full rounded-[28px] border border-amber-100 bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
                  onClick={() => navigate(`/studio/${studio._id}`)}
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
                      {studio.description?.length > 80
                        ? studio.description.slice(0, 80) + "..."
                        : studio.description}
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
                      style={{ marginTop: "auto" }}
                    >
                      <FiShoppingCart size={16} /> Đặt ngay
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Section>
    </>
  );
};

export default StudioPage;
