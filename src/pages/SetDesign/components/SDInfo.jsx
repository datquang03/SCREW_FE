import React from "react";
import { motion } from "framer-motion";

const SDInfo = React.memo(({ data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Giới thiệu</h2>
        <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
          {data.description || "Chưa có mô tả"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Ngày tạo</span>
          <span className="font-semibold">
            {data.createdAt ? new Date(data.createdAt).toLocaleDateString("vi-VN") : "-"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Thể loại</span>
          <span className="font-semibold">{data.category || "-"}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default SDInfo;