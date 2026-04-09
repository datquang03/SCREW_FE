// src/pages/SetDesign/components/SDDetailSkeleton.jsx
import React from "react";
import { Skeleton, Divider } from "antd";

const SDDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      {/* Header Skeleton */}
      <div className="relative isolate overflow-hidden bg-[#0F172A] text-white mt-4 lg:mt-6 h-[280px]">
        <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-1 space-y-4">
              <Skeleton.Input active size="small" className="w-48" />
              <Skeleton.Input active size="large" className="w-3/4 h-12" />
              <Skeleton paragraph={{ rows: 2, width: ['80%', '60%'] }} active />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton.Input key={i} active size="small" className="w-20 h-7" />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white/5 border border-white/10 p-6 backdrop-blur-xl rounded-xl">
              <Skeleton.Input active size="small" className="w-32 mb-6" />
              <div className="space-y-5">
                <div className="flex justify-between">
                  <Skeleton.Input active size="small" className="w-20" />
                  <Skeleton.Input active size="small" className="w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton.Input active size="small" className="w-20" />
                  <Skeleton.Input active size="small" className="w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Gallery & Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery Skeleton */}
            <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-2 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-slate-200 relative">
                <Skeleton.Image active className="w-full h-full" />
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-8 border border-slate-200 rounded-2xl">
              <Skeleton.Input active size="large" className="w-64 mb-8" />
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton.Input active size="small" className="w-32" />
                    <Skeleton paragraph={{ rows: 1 }} active />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Like & Share */}
            <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-6 rounded-2xl">
              <Skeleton.Input active size="small" className="w-40 mb-4" />
              <div className="flex gap-3">
                <Skeleton.Button active size="large" className="flex-1" />
                <Skeleton.Button active size="large" className="flex-1" />
              </div>
            </div>

            {/* Related Designs */}
            <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-6 rounded-2xl">
              <Skeleton.Input active size="large" className="w-52 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton.Image active className="w-full aspect-square" />
                    <Skeleton.Input active size="small" className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section Skeleton */}
        <div className="mt-8 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <Skeleton.Input active size="large" className="w-80" />
            <Skeleton.Input active size="small" className="w-40" />
          </div>
          
          <div className="space-y-8">
            {/* Comment Input Skeleton */}
            <div className="flex gap-4">
              <Skeleton.Avatar active size={48} />
              <div className="flex-1">
                <Skeleton.Input active block size="large" className="mb-3" />
                <Skeleton.Button active size="large" className="w-32" />
              </div>
            </div>

            {/* Comment List Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton.Avatar active size={48} />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton.Input active size="small" className="w-32" />
                    <Skeleton.Input active size="small" className="w-20" />
                  </div>
                  <Skeleton paragraph={{ rows: 2 }} active />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDDetailSkeleton;