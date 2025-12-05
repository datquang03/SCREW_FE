import React from "react";
import { motion } from "framer-motion";


const SDInfo = React.memo(({ data }) => {
return (
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
<h2 className="text-xl font-semibold">Giới thiệu</h2>
<p className="mt-3 text-gray-700 whitespace-pre-line">{data.description || "Chưa có mô tả"}</p>


<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
<div>Ngày tạo: {data.createdAt ? new Date(data.createdAt).toLocaleDateString("vi-VN") : "-"}</div>
<div>Thể loại: {data.category || "-"}</div>
</div>
</motion.div>
);
});


export default SDInfo;