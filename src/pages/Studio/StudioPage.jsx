// src/pages/Studio/StudioPage.jsx
import React, { useEffect } from "react";
import { Typography } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import Section from "../../components/common/Section";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveStudios } from "../../features/studio/studioSlice";
import SkeletonStudioCard from "../../components/skeletons/SkeletonStudioCard";

const { Title, Paragraph } = Typography;

const StudioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studios, loading } = useSelector((state) => state.studio);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonStudioCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#0F172A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 60% 40%,rgba(197,162,103,0.08),transparent 35%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center px-6 md:px-10 py-24">
          <div className="lg:col-span-3 space-y-5">
            <div className="uppercase tracking-[0.3em] text-xs font-semibold text-[#C5A267] mb-2">
              SEASONAL OFFERS
            </div>

            <Title
              level={1}
              className="!text-4xl md:!text-5xl !text-white font-semibold leading-[1.05] mb-2"
            >
              Ưu Đãi Đặc Biệt Từ <br />
              <span className="font-semibold text-[#C5A267]">S+ Studio</span>
            </Title>

            <Paragraph className="!text-base md:!text-lg !text-white max-w-2xl leading-relaxed mb-6">
              Nâng tầm sáng tạo với những gói dịch vụ cao cấp và ưu đãi độc
              quyền dành riêng cho cộng đồng nghệ sĩ.
            </Paragraph>

            <a
              href="#studio-list"
              className="inline-flex items-center gap-2 bg-[#A0826D] text-white font-semibold px-6 py-3 hover:bg-[#8B7355] transition-all uppercase tracking-[0.2em]"
            >
              Khám phá bộ sưu tập
            </a>
          </div>
        </div>
      </div>

      {/* LIST */}
      <Section
        id="studio-list"
        className="py-24 bg-[#FCFBFA]"
        containerClass="max-w-7xl mx-auto px-4"
        title="Studio Nổi Bật"
        subtitle="Không gian được khách hàng yêu thích nhất"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studios.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold mb-4">Chưa có studio nào</h2>
              <p className="text-slate-500">
                Hiện tại chưa có studio hoạt động.
              </p>
            </div>
          ) : (
            studios.map((studio) => (
              <div key={studio._id} className="flex justify-center">
                <div
                  className="w-full max-w-[340px] border border-slate-100 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C5A267] group flex flex-col cursor-pointer"
                  onClick={() => navigate(`/studio/${studio._id}`)}
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-48 overflow-hidden">
                    {studio.images?.[0] ? (
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FCFBFA]">
                        <span className="studio-name text-center px-2">
                          {studio.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                  </div>

                  {/* BODY */}
                  <div className="flex-1 flex flex-col px-6 py-3">
                    <span className="inline-flex w-fit px-3 py-1 border border-[#C5A267] text-xs font-semibold text-[#C5A267] uppercase tracking-[0.2em] mb-2">
                      Studio nổi bật
                    </span>

                    {/* 🌈 NAME */}
                    <h3 className="studio-name line-clamp-2 mb-2 min-h-[48px] flex items-center">
                      {studio.name}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-2 min-h-[40px]">
                      {studio.description?.length > 80
                        ? studio.description.slice(0, 80) + "..."
                        : studio.description}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="px-6 pb-6">
                    <p className="text-sm uppercase text-slate-400 font-bold mb-1">
                      Giá thuê từ
                    </p>

                    <div className="text-2xl font-semibold text-[#C5A267] mb-3">
                      {studio.basePricePerHour?.toLocaleString("vi-VN")}₫
                      <span className="text-sm text-slate-500 ml-1">/ giờ</span>
                    </div>

                    <div className="w-full h-12 bg-[#A0826D] hover:bg-[#8B7355] text-white flex items-center justify-center gap-2 transition uppercase tracking-[0.2em]">
                      <FiShoppingCart size={16} /> Xem chi tiết
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* 🌈 STYLE */}
      <style>
        {`
        .studio-name {
          font-size: 32px;
          font-weight: 800;
          color: #0F172A;
          transition: all 0.4s ease;
        }

        .group:hover .studio-name {
          background: linear-gradient(
            90deg,
            #ff0000,
            #ff7f00,
            #ffff00,
            #7fff00,
            #00ff00,
            #00ff7f,
            #00ffff,
            #007fff,
            #0000ff,
            #7f00ff,
            #ff00ff,
            #ff007f,
            #ff4d4d,
            #ffa500
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation: rainbowMove 4s linear infinite;

          transform: scale(1.06);
          letter-spacing: 0.5px;

          filter: drop-shadow(0 0 6px rgba(197,162,103,0.4));
        }

        @keyframes rainbowMove {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        @media (max-width: 640px) {
          .studio-name {
            font-size: 16px;
          }
        }
        `}
      </style>
    </>
  );
};

export default StudioPage;
