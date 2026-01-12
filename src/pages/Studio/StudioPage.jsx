// src/pages/Studio/StudioPage.jsx
import React, { useEffect } from "react";
import { Typography, Button, Spin, Carousel } from "antd";
import { FiStar, FiMapPin, FiUsers } from "react-icons/fi";
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
      <div className="px-4 md:px-6 lg:px-12 mt-4 md:mt-8">
        <div className="studio-hero w-full text-white py-10 md:py-14 px-6 md:px-10 lg:px-14">
          <div className="studio-hero__glass inline-flex items-center gap-3 px-4 py-2 mb-4 text-sm font-semibold uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-glow"></span>
            Studio tuyển chọn bởi S+ Studio
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
            <div className="lg:col-span-3 space-y-4">
              <Title level={1} className="!text-4xl md:!text-5xl !text-white font-black drop-shadow-lg leading-[1.05]">
                Trải nghiệm không gian sáng tạo chuẩn điện ảnh
              </Title>
              <Paragraph className="!text-lg md:!text-xl text-gray-200 max-w-3xl leading-relaxed">
                Những studio được tuyển chọn kỹ lưỡng, ánh sáng đẹp, tiêu chuẩn âm thanh và dịch vụ chuyên nghiệp. Chỉ cần mang concept, còn lại để S+ Studio lo.
              </Paragraph>
              <div className="flex flex-wrap gap-3">
                <span className="studio-badge">Hỗ trợ setup ánh sáng</span>
                <span className="studio-badge">Phòng chờ VIP</span>
                <span className="studio-badge">Đội ngũ onsite</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#studio-list" className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-5 py-3 shadow-lg hover:-translate-y-0.5 transition-transform">
                  Khám phá ngay
                </a>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-5 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Sắp xếp theo gợi ý
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <div className="studio-chip w-full justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-amber-700/80">Studio đang mở</div>
                <div className="text-3xl font-black text-amber-900">{studios.length || 0}</div>
              </div>
              <div className="studio-chip w-full justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-amber-700/80">Xếp hạng trung bình</div>
                <div className="text-3xl font-black text-amber-900">4.8</div>
              </div>
              <div className="studio-chip w-full justify-between col-span-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-amber-700/80">Trải nghiệm nổi bật</div>
                  <div className="text-lg font-bold text-amber-900">Ánh sáng, âm thanh, dịch vụ đồng bộ</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center text-amber-700 font-black shadow">
                  S+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studios List */}
      <Section
        id="studio-list"
        className="bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
        containerClass="container mx-auto"
        title="Danh sách Studio cho thuê"
        subtitle="Chọn studio phù hợp với dự án của bạn - từ chụp ảnh sản phẩm đến quay phim chuyên nghiệp"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studios.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              Không có studio nào đang hoạt động
            </div>
          ) : (
            studios.map((studio, index) => (
              <motion.div
                key={studio._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 16px 32px rgba(15,23,42,0.12)",
                }}
                onClick={() => navigate(`/studio/${studio._id}`)}
                className="studio-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col"
              >
                {/* Hình ảnh + Carousel */}
                <div className="relative h-60 md:h-64 overflow-hidden studio-card__image">
                  {studio.images && studio.images.length > 0 ? (
                    <Carousel
                      autoplay
                      autoplaySpeed={4000}
                      dots
                      className="h-full"
                    >
                      {studio.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={studio.name}
                          className="h-60 md:h-64 w-full object-cover"
                        />
                      ))}
                    </Carousel>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-700 text-white/60 text-5xl">
                      📷
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="studio-card__overlay" />

                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full shadow-sm studio-rating-badge">
                    <FiStar className="text-amber-300" />
                    <Text strong className="text-sm text-white">
                      {(studio.avgRating || studio.rating || 0).toFixed
                        ? (studio.avgRating || studio.rating || 0).toFixed(1)
                        : studio.avgRating || studio.rating || 0 || "—"}
                    </Text>
                  </div>

                  {/* Info bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Title
                      level={3}
                      className="mb-2 text-xl md:text-2xl font-bold line-clamp-1"
                    >
                      <span className="bg-white/90 text-slate-900 px-2.5 py-1 rounded-lg shadow-sm">
                      {studio.name}
                      </span>
                    </Title>
                    <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} />
                        <span className="line-clamp-1">
                          {studio.location || "Không xác định"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers size={14} />
                        <span>{studio.capacity || "—"} người</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <Text className="text-gray-500 text-xs uppercase tracking-wide">Mô tả</Text>
                    <Paragraph className="text-gray-800 text-sm mt-1 line-clamp-3 leading-relaxed">
                      {studio.description || "Chưa có mô tả chi tiết."}
                    </Paragraph>
                  </div>

                  <div className="studio-card__footer flex items-center justify-between pt-4 border border-amber-50 px-4 py-3">
                    <div className="space-y-1">
                      <Text className="text-gray-500 text-xs uppercase tracking-wide">Giá thuê</Text>
                      <div className="flex items-baseline gap-2 flex-wrap text-slate-900 leading-none">
                        <span className="text-2xl font-extrabold whitespace-nowrap">
                          {formatPrice(studio.basePricePerHour)}
                        </span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          VNĐ /giờ
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {/* Nút đặt lịch */}
                      <Button
                        size="large"
                        className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-none shadow-lg px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking/${studio._id}`);
                        }}
                      >
                        Đặt lịch
                      </Button>

                      {/* Nút xem chi tiết */}
                      <Button
                        type="primary"
                        size="large"
                        className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 border-none shadow-lg px-4 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/studio/${studio._id}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Section>
    </>
  );
};

export default StudioPage;
