import React, { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import StudioHeader from "./components/StudioHeader";
import StudioGallery from "./components/StudioGallery";
import StudioInfo from "./components/StudioInfo";
import StudioServices from "./components/StudioService";
import StudioPricing from "./components/StudioPricing";
import StudioContact from "./components/StudioContact";
import StudioCommentList from "./components/StudioCommentList";
import StudioBookingButton from "./components/StudioBookingButton";
import StudioMap from "./components/StudioMap";
import StudioAmenities from "./components/StudioAmenities";
import { getComments } from "../../features/comment/commentSlice";
import { getStudioById, getActiveStudios } from "../../features/studio/studioSlice";

const SECTIONS = [
  { id: "info", label: "Thông tin" },
  { id: "services", label: "Dịch vụ" },
  { id: "amenities", label: "Tiện ích" },
  { id: "pricing", label: "Giá thuê" },
  { id: "location", label: "Vị trí" },
  { id: "reviews", label: "Đánh giá" },
];

export default function StudioDetailPage({ studio }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentStudio, loading } = useSelector((state) => state.studio);
  const safeStudio = studio || currentStudio || {};

  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState("info");
  const [hasSeenPricing, setHasSeenPricing] = useState(false);
  const [relatedStudios, setRelatedStudios] = useState([]);

  useEffect(() => {
    if (!studio && id) dispatch(getStudioById(id));
    if (id) dispatch(getComments({ targetType: "Studio", targetId: id }));
  }, [studio, id, dispatch]);

  useEffect(() => {
    dispatch(getActiveStudios({ page: 1, limit: 20 })).then((res) => {
      if (res?.payload?.data) {
        const cat = safeStudio.category || safeStudio.categories?.[0];
        const filtered = res.payload.data.filter(
          (s) => s._id !== safeStudio._id && (s.category === cat || s.categories?.includes(cat))
        );
        setRelatedStudios(filtered.slice(0, 4));
      }
    });
  }, [safeStudio._id, safeStudio.category, safeStudio.categories, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            if (entry.target.id === "pricing") {
              setHasSeenPricing(true);
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading && !safeStudio._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#C5A267] font-semibold tracking-widest uppercase text-xs">
        Đang khởi tạo không gian chuyên gia...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      {/* LUXURY HERO SECTION */}
      <div className="relative isolate overflow-hidden bg-[#0F172A] pt-24 pb-32">
        {/* Cinematic background lighting */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,#1E293B_0%,transparent_50%),radial-gradient(circle_at_80%_0%,#334155_0%,transparent_40%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A267]/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">Studio Showcase</p>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1]">
                {safeStudio.name?.split(' ').slice(0, -1).join(' ') || safeStudio.name || ''} <br/>
                <span className="font-semibold text-[#C5A267]">{safeStudio.name?.split(' ').slice(-1) || ''}</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
                {safeStudio.description || "Không gian làm việc đẳng cấp dành cho giới chuyên gia, kết hợp hoàn mỹ giữa công nghệ hiện đại và thẩm mỹ sang trọng."}
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => window.location.href = `/booking/${safeStudio._id}`}
                  className="bg-[#C5A267] hover:bg-[#B38F55] text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-[#C5A267]/20"
                >
                  Đặt lịch ngay
                </button>
              </div>
            </div>

            {/* QUICK OVERVIEW GLASS CARD */}
            <div className="lg:col-span-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-sm">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-8 flex items-center gap-3">
                  <div className="h-px w-6 bg-[#C5A267]"></div> Tổng quan nhanh
                </h2>
                <div className="space-y-6 text-white">
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Địa chỉ</span>
                    <span className="text-sm font-medium">{safeStudio.location || "TP. Hồ Chí Minh"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Giá từ</span>
                    <span className="text-sm font-bold text-[#C5A267]">{safeStudio.basePricePerHour?.toLocaleString()} đ <span className="text-[10px] font-normal text-slate-500">/ GIỜ</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Sức chứa</span>
                    <span className="text-sm font-medium">{safeStudio.capacity || "Theo gói"} người</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Suspense fallback={<div className="text-center py-20 font-serif italic text-slate-400">Đang khởi tạo không gian...</div>}>
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* LEFT CONTENT COLUMN */}
            <div className="lg:col-span-8 space-y-24">
              
              {/* GALLERY */}
              <div id="gallery" className="bg-white p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <StudioGallery images={safeStudio.images || []} />
              </div>

              {/* DETAILS SECTION */}
              <section id="info" ref={(el) => (sectionRefs.current.info = el)} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="text-2xl font-semibold text-slate-900">Thông tin chi tiết</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-100 to-transparent"></div>
                </div>
                <div className="bg-white p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#C5A267] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <StudioInfo studio={safeStudio} />
                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services" ref={(el) => (sectionRefs.current.services = el)} className="scroll-mt-32">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 mb-10">Dịch vụ đặc quyền</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <StudioServices services={safeStudio.services || []} />
                </div>
              </section>

              {/* COMMENTS SECTION */}
              <section id="reviews" ref={(el) => (sectionRefs.current.reviews = el)} className="scroll-mt-32">
                <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-8">
                  <h3 className="font-bold text-3xl text-slate-900">Bình luận & Đánh giá</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Chia sẻ cảm nhận của bạn</p>
                </div>
                <div className="space-y-10">
                  {safeStudio._id && <StudioCommentList targetId={safeStudio._id} />}
                </div>
              </section>
            </div>

            {/* RIGHT STICKY SIDEBAR */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-32 space-y-8">
                
                {/* BOOKING WIDGET */}
                <div className="bg-white border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-10 rounded-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A267]/5 rounded-bl-full -mr-12 -mt-12"></div>
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Giá thuê từ</p>
                    <p className="text-4xl font-semibold text-slate-900">
                      {safeStudio.basePricePerHour?.toLocaleString()}₫ <span className="text-sm text-[#C5A267]">/ giờ</span>
                    </p>
                  </div>
                  <StudioBookingButton studioId={safeStudio._id} />
                </div>

                {/* RELATED STUDIOS */}
                {relatedStudios.length > 0 && (
                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-6 uppercase">Studio liên quan</h3>
                    <div className="space-y-6">
                      {relatedStudios.map((studio) => (
                        <div 
                          key={studio._id} 
                          className="group flex gap-4 cursor-pointer" 
                          onClick={() => window.location.href = `/studio/${studio._id}`}
                        >
                          <div className="w-16 h-16 overflow-hidden bg-slate-100 shrink-0">
                            <img src={studio.images?.[0]} alt={studio.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-800 group-hover:text-[#C5A267] transition-colors line-clamp-1">{studio.name}</div>
                            <div className="text-[10px] font-bold text-[#C5A267] uppercase tracking-widest mt-1">{studio.basePricePerHour?.toLocaleString()}đ <span className="font-normal text-slate-400 italic">/ h</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      {/* REFINED MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-6 z-50">
        <button
          onClick={() => (window.location.href = `/booking/${safeStudio._id}`)}
          className="w-full h-16 bg-[#0F172A] text-white font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
}