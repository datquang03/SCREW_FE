import React from "react";
import { motion } from "framer-motion";

const SDHeader = React.memo(({ setDesign }) => {
return (
<motion.div
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
      className="space-y-3"
>
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
          {setDesign.category || "Thiết kế"}
        </span>
        {setDesign.authorName && (
          <span className="text-sm text-gray-500">Tác giả: {setDesign.authorName}</span>
        )}
        {setDesign.createdAt && (
          <span className="text-sm text-gray-400">
            {new Date(setDesign.createdAt).toLocaleDateString("vi-VN")}
          </span>
        )}
      </div>

      <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
        {setDesign.name}
      </h1>

      {setDesign.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {setDesign.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
</motion.div>
);
});

export default SDHeader;