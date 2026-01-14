import React from "react";

export default function StudioContact({ studio }) {
  const hasContact = studio?.phone || studio?.address || studio?.location;
  
  if (!hasContact) return null;

  return (
    <div className="studio-panel p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="studio-panel__title">
          <span className="h-8 w-8 rounded-lg bg-white/70 flex items-center justify-center text-xl">📞</span>
          <span className="text-lg md:text-xl font-extrabold">Liên hệ</span>
        </div>
      </div>
      <div className="space-y-3">
        {studio.phone && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <span className="text-xl">📞</span>
            <p className="text-sm md:text-base text-gray-800 font-medium">{studio.phone}</p>
          </div>
        )}
        {(studio.address || studio.location) && (
          <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <span className="text-xl mt-0.5">📍</span>
            <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed">{studio.address || studio.location}</p>
          </div>
        )}
      </div>
    </div>
  );
}
