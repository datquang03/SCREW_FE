import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
import StudioAmenities from "./components/StudioAmenities";
import { getStudioById } from "../../features/studio/studioSlice";

export default function StudioDetailPage({ studio }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentStudio, loading } = useSelector(
    (state) => state.studio || { currentStudio: null, loading: false }
  );

  useEffect(() => {
    if (!studio && id) {
      dispatch(getStudioById(id));
    }
  }, [studio, id, dispatch]);

  const safeStudio = studio || currentStudio || {};

  if (loading && !safeStudio._id) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-gray-500">Đang tải chi tiết studio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      <Suspense fallback={<div className="p-10">Đang tải...</div>}>
        <StudioHeader studio={safeStudio} />
        <StudioGallery images={safeStudio?.images || []} />
        <div className="max-w-6xl mx-auto px-4 space-y-12 mt-10">
          <StudioInfo studio={safeStudio} />
          <StudioServices services={safeStudio?.services || []} />
          <StudioAmenities amenities={safeStudio?.amenities || []} />

          <StudioPricing
            pricing={safeStudio?.basePricePerHour || safeStudio?.pricing || 0}
          />
          <StudioContact studio={safeStudio} />
          <StudioMap location={safeStudio?.location || {}} />

          {safeStudio?._id && <StudioCommentList targetId={safeStudio._id} />}
        </div>
        <StudioBookingButton studio={safeStudio} />
      </Suspense>
    </div>
  );
}
