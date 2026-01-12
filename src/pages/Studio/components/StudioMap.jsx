import React from "react";
import { Button } from "antd";
import { FiMapPin, FiExternalLink, FiNavigation } from "react-icons/fi";
import { motion } from "framer-motion";

export default function StudioMap({ location }) {
  if (!location || (typeof location === 'string' && !location.trim())) {
    return null;
  }

  const locationString = typeof location === 'string' ? location : location?.address || location?.location || '';

  if (!locationString) return null;

  // Encode location for Google Maps URL
  const encodedLocation = encodeURIComponent(locationString);
  
  // Google Maps Search URL (works without API key)
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  
  // Google Maps Directions URL (opens directions in new tab)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

  const handleOpenMap = (e) => {
    e.preventDefault();
    window.open(mapSearchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDirections = (e) => {
    e.preventDefault();
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="studio-panel studio-map-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            🗺️
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Bản đồ</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="default"
            icon={<FiMapPin />}
            onClick={handleOpenMap}
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
          >
            Xem bản đồ
          </Button>
          <Button
            type="primary"
            icon={<FiNavigation />}
            onClick={handleOpenDirections}
            className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-md"
          >
            Chỉ đường
          </Button>
        </div>
      </div>
      
      {/* Location Info */}
      <div className="mb-4 flex items-center gap-2 text-slate-100 bg-white/5 p-4 rounded-xl border border-white/10">
        <FiMapPin className="text-emerald-300 text-lg flex-shrink-0" />
        <span className="text-sm md:text-base font-medium">{locationString}</span>
      </div>

      {/* Clickable Map Preview */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleOpenMap}
        className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg cursor-pointer relative group"
      >
        {/* Map Preview with Google Maps Static API (no key needed for basic usage) */}
        <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-blue-50 to-indigo-100 relative flex items-center justify-center">
          {/* Placeholder map design */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4 mx-auto">
                <FiMapPin className="text-white text-2xl" />
              </div>
            </div>
            <p className="text-gray-700 font-medium mb-2">📍 {locationString}</p>
            <p className="text-sm text-gray-500">Nhấn để mở Google Maps</p>
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <FiExternalLink className="text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Mở Google Maps</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Nhấn vào bản đồ hoặc nút <span className="font-semibold text-emerald-600">"Chỉ đường"</span> để mở Google Maps
        </p>
      </div>
    </div>
  );
}
