// src/pages/SetDesign/components/SDInfo.jsx
import React from "react";
import { motion } from "framer-motion";

const SDInfo = React.memo(({ data }) => {
  const getCategoryLabel = (category) => {
    if (!category) return "Chưa cập nhật";

    const categoryMap = {
      wedding: "Tiệc cưới",
      corporate: "Doanh nghiệp",
      birthday: "Sinh nhật",
      portrait: "Chân dung",
      fashion: "Thời trang",
      product: "Sản phẩm",
      event: "Sự kiện",
      other: "Khác",
    };

    return categoryMap[category.toLowerCase()] || 
           category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      {/* Giới thiệu */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A267] to-transparent" />
          <h2 className="text-2xl font-bold text-[#0F172A] whitespace-nowrap">Giới thiệu</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A267] to-transparent" />
        </div>
        
        <div className="prose prose-slate max-w-none text-[15.5px] leading-relaxed text-slate-700 whitespace-pre-line">
          {data.description || "Chưa có mô tả cho set design này."}
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A267] to-transparent" />
          <h2 className="text-2xl font-bold text-[#0F172A] whitespace-nowrap">Thông tin chi tiết</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A267] to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Ngày tạo */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-[#C5A267]/30 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C5A267]/10 flex items-center justify-center">
                <span className="text-[#C5A267] text-xl">📅</span>
              </div>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Ngày tạo</span>
            </div>
            <p className="text-xl font-semibold text-[#0F172A]">
              {data.createdAt 
                ? new Date(data.createdAt).toLocaleDateString("vi-VN", { 
                    day: "2-digit", 
                    month: "long", 
                    year: "numeric" 
                  }) 
                : "Chưa có thông tin"}
            </p>
          </div>

          {/* Danh mục */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-[#C5A267]/30 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C5A267]/10 flex items-center justify-center">
                <span className="text-[#C5A267] text-xl">🏷️</span>
              </div>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Danh mục</span>
            </div>
            <p className="text-xl font-semibold text-[#0F172A]">
              {getCategoryLabel(data.category)}
            </p>
          </div>

          {/* Thời lượng */}
          {data.duration && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-[#C5A267]/30 transition-colors group sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C5A267]/10 flex items-center justify-center">
                  <span className="text-[#C5A267] text-xl">⏱️</span>
                </div>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Thời lượng thực hiện</span>
              </div>
              <p className="text-xl font-semibold text-[#0F172A]">{data.duration}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default SDInfo;