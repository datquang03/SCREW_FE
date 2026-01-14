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
import { getStudioById } from "../../features/studio/studioSlice";

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

  useEffect(() => {
    if (!studio && id) dispatch(getStudioById(id));
    if (id) dispatch(getComments({ targetType: "Studio", targetId: id }));
  }, [studio, id, dispatch]);

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
    <div className="min-h-screen bg-[#fafafa] pb-36">
      <Suspense fallback={<div className="p-10">Đang tải...</div>}>
        {/* HERO */}
        <StudioHeader studio={safeStudio} />
        <StudioGallery images={safeStudio.images || []} />

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <section id="info" ref={(el) => (sectionRefs.current.info = el)}>
              <StudioInfo studio={safeStudio} />
            </section>

            <section
              id="services"
              ref={(el) => (sectionRefs.current.services = el)}
            >
              <StudioServices services={safeStudio.services || []} />
            </section>

            <section
              id="amenities"
              ref={(el) => (sectionRefs.current.amenities = el)}
            >
              <StudioAmenities amenities={safeStudio.amenities || []} />
            </section>

            <section
              id="pricing"
              ref={(el) => (sectionRefs.current.pricing = el)}
            >
              <StudioPricing
                pricing={safeStudio.basePricePerHour || 0}
              />
            </section>

            <section
              id="location"
              ref={(el) => (sectionRefs.current.location = el)}
            >
              <StudioContact studio={safeStudio} />
              <StudioMap location={safeStudio.location || {}} />
            </section>

            <section
              id="reviews"
              ref={(el) => (sectionRefs.current.reviews = el)}
            >
              {safeStudio._id && (
                <StudioCommentList targetId={safeStudio._id} />
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR (DESKTOP ONLY) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* SCROLL SPY */}
              <div className="bg-white rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Nội dung
                </p>
                <ul className="space-y-2">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => scrollTo(s.id)}
                        className={`text-sm w-full text-left px-3 py-2 rounded-lg transition ${
                          activeSection === s.id
                            ? "bg-amber-100 text-amber-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* STICKY PRICING */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <p className="text-sm text-gray-500">Giá thuê từ</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {safeStudio.basePricePerHour?.toLocaleString("vi-VN")}₫
                  <span className="text-base text-gray-500"> / giờ</span>
                </p>

                <button
                  onClick={() =>
                    (window.location.href = `/booking/${safeStudio._id}`)
                  }
                  className="mt-6 w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl"
                >
                  {hasSeenPricing ? "Đặt ngay" : "Xem giá & đặt"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE CTA */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <button
            onClick={() =>
              (window.location.href = `/booking/${safeStudio._id}`)
            }
            className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl"
          >
            Đặt studio ngay
          </button>
        </div>
      </Suspense>
    </div>
  );
}
