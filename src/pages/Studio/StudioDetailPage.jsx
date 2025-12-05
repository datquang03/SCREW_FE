import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import StudioHeader from "./components/StudioHeader";
import StudioGallery from "./components/StudioGallery";
import StudioInfo from "./components/StudioInfo";
import StudioServices from "./components/StudioService";
import StudioPricing from "./components/StudioPricing";
import StudioContact from "./components/StudioContact";
import StudioCommentList from "./components/StudioCommentList";
import StudioBookingButton from "./components/StudioBookingButton";
import StudioMap from "./components/StudioMap";

export default function StudioDetailPage({ studio }) {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      <Suspense fallback={<div className="p-10">Đang tải...</div>}>
        <StudioHeader studio={studio} />
        <StudioGallery images={studio?.images || []} />
        <div className="max-w-6xl mx-auto px-4 space-y-12 mt-10">
          <StudioInfo studio={studio} />
          <StudioServices services={studio?.services} />
          <StudioAmenities amenities={studio.amenities} />

          <StudioPricing pricing={studio.pricing} />
          <StudioContact studio={studio} />
          <StudioMap location={studio.location} />

          <StudioCommentList targetId={studio._id} />
        </div>
        <StudioBookingButton studio={studio} />
      </Suspense>
    </div>
  );
}
