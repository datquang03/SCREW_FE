import React from "react";

export default function StudioContact({ studio }) {
  const hasContact = studio?.phone || studio?.address || studio?.location;
  
  if (!hasContact) return null;

  return (
    <div className="studio-panel p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="studio-panel__title">
          <span className="h-8 w-8 rounded-lg bg-white/70 flex items-center justify-center text-2xl">📞</span>
          <span className="text-xl md:text-2xl font-extrabold">Liên hệ</span>
        </div>
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
