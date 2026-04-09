import React from "react";

const SkeletonStudioCard = () => {
  return (
    <div className="animate-pulse h-full border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm">
      {/* Image */}
      <div className="w-full h-40 bg-slate-200" />

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>

        <div className="h-6 bg-slate-200 rounded w-1/3 mt-4"></div>
      </div>

      {/* Button */}
      <div className="px-5 pb-5">
        <div className="h-10 bg-slate-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonStudioCard;