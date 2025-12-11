import React from "react";

export default function StudioContact({ studio }) {
  const hasContact = studio?.phone || studio?.address || studio?.location;
  
  if (!hasContact) return null;

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6 md:p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
          📞
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Liên hệ</h2>
      </div>
      <div className="space-y-4">
        {studio.phone && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <span className="text-2xl">📞</span>
            <p className="text-base md:text-lg text-gray-800 font-medium">{studio.phone}</p>
          </div>
        )}
        {(studio.address || studio.location) && (
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <span className="text-2xl mt-0.5">📍</span>
            <p className="text-base md:text-lg text-gray-800 font-medium leading-relaxed">{studio.address || studio.location}</p>
          </div>
        )}
      </div>
    </div>
  );
}
