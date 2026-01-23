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

  // SCROLL SPY
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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải studio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/5">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white mt-4 lg:mt-6">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.2),transparent_30%)]" />
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Studio Showcase</p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">{safeStudio.name}</h1>
              <p className="text-slate-200 max-w-2xl">{safeStudio.description || "Khám phá không gian studio chuyên nghiệp, tối ưu ánh sáng và tiện ích."}</p>
              <div className="flex flex-wrap gap-2">
                {(safeStudio.tags || safeStudio.categories || []).slice(0, 4).map((t) => (
                  <span key={t} className="border-0 px-3 py-1 text-sm bg-white/10 text-white rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  className="bg-indigo-500 border-none shadow-lg shadow-indigo-500/30 text-white font-bold px-6 py-3 rounded-2xl text-lg"
                  onClick={() => window.location.href = `/booking/${safeStudio._id}`}
                >
                  Đặt lịch ngay
                </button>
              </div>
            </div>
            <div className="w-full lg:w-80 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur">
              <div className="text-sm text-slate-100 mb-2">Tổng quan nhanh</div>
              <div className="space-y-3 text-white">
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Địa chỉ</span>
                  <span className="font-semibold">{safeStudio.location || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Giá từ</span>
                  <span className="font-semibold">{safeStudio.basePricePerHour ? `${safeStudio.basePricePerHour.toLocaleString()} đ` : "Liên hệ"}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Sức chứa</span>
                  <span className="font-semibold">{safeStudio.capacity || "Theo gói"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Suspense fallback={<div className="text-center py-10">Đang tải giao diện...</div>}>
          <div className="space-y-8">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-4 border border-slate-100">
                  <StudioGallery images={safeStudio.images || []} />
                </div>
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-6 border border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Thông tin chi tiết</h3>
                  <StudioInfo studio={safeStudio} />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-5">
                  <StudioBookingButton studioId={safeStudio._id} />
                </div>
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-5">
                  <StudioServices services={safeStudio.services || []} />
                </div>
                {/* Related Studios Section */}
                {relatedStudios.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Studio liên quan</h3>
                    <div className="space-y-4">
                      {relatedStudios.map((studio) => (
                        <div key={studio._id} className="flex gap-3 items-center cursor-pointer hover:bg-slate-50 rounded-xl p-2 transition" onClick={() => window.location.href = `/studio/${studio._id}`}>
                          <img src={studio.images?.[0]} alt={studio.name} className="w-16 h-16 object-cover rounded-xl border" />
                          <div>
                            <div className="font-semibold text-slate-800">{studio.name}</div>
                            <div className="text-xs text-slate-500">{studio.basePricePerHour?.toLocaleString()}đ/giờ</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Bình luận</h3>
                <span className="text-sm text-slate-500">Chia sẻ cảm nhận hoặc câu hỏi của bạn</span>
              </div>
              <div className="space-y-6">
                {safeStudio._id && <StudioCommentList targetId={safeStudio._id} />}
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      {/* MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-100 px-4 py-4">
        <button
          onClick={() => (window.location.href = `/booking/${safeStudio._id}`)}
          className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl"
        >
          Đặt studio ngay
        </button>
      </div>
    </div>
  );
}
