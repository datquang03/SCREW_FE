import React from "react";
import { motion } from "framer-motion";

const SDInfo = React.memo(({ data }) => {
return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Giới thiệu</h2>
        <p className="mt-2 text-slate-700 leading-relaxed whitespace-pre-line">
          {data.description || "Chưa có mô tả"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col p-4 bg-[#FCFBFA] border border-slate-200">
          <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ngày tạo</span>
          <span className="font-bold text-[#0F172A]">
            {data.createdAt ? new Date(data.createdAt).toLocaleDateString("vi-VN") : "-"}
          </span>
        </div>
        <div className="flex flex-col p-4 bg-[#FCFBFA] border border-slate-200">
          <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Thể loại</span>
          <span className="font-bold text-[#0F172A]">{data.category || "-"}</span>
        </div>
</div>
</motion.div>
);
});

export default SDInfo;