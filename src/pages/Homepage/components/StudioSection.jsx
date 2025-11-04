/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiHeart, FiStar } from "react-icons/fi";

const studios = [
  {
    id: 1,
    name: "Studio 1",
    size: "100m² Floor Plan",
    price: "4.000.000/16 tiếng",
    rating: 4.5,
    img: "/images/studio1.jpg",
  },
  {
    id: 2,
    name: "Studio 2",
    size: "180m² Floor Plan",
    price: "5.000.000/16 tiếng",
    rating: 4.5,
    img: "/images/studio2.jpg",
  },
  {
    id: 3,
    name: "Studio 3",
    size: "220m² Floor Plan",
    price: "6.000.000/16 tiếng",
    rating: 4.7,
    img: "/images/studio3.jpg",
  },
  {
    id: 4,
    name: "Studio 4",
    size: "260m² Floor Plan",
    price: "7.000.000/16 tiếng",
    rating: 4.8,
    img: "/images/studio4.jpg",
  },
];

const StudioSection = () => {
  return (
    <section className="w-full bg-[#0b0b0b] text-white py-20 px-6 md:px-16 lg:px-28">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Phòng phổ biến
        </h2>
        <button className="text-blue-400 hover:text-blue-500 transition-all duration-300">
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {studios.map((studio) => (
          <motion.div
            key={studio.id}
            whileHover={{ scale: 1.05 }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#111] shadow-lg border border-[#222] cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={studio.img}
                alt={studio.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              {/* Heart icon */}
              <button className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all">
                <FiHeart />
              </button>
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold">{studio.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{studio.size}</p>
              <p className="text-yellow-400 font-medium mt-2">
                {studio.price}
              </p>
              <div className="flex items-center justify-end mt-3 text-sm text-gray-300">
                <FiStar className="text-yellow-400 mr-1" /> {studio.rating}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StudioSection;
