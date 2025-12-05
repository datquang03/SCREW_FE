import React from "react";
import { motion } from "framer-motion";


const SDHeader = React.memo(({ setDesign }) => {
return (
<motion.div
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
>
<h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{setDesign.name}</h1>
<p className="text-sm text-gray-500 mt-2">{setDesign.category || "Không xác định"} • Đăng bởi {setDesign.authorName || "Nhóm"}</p>
</motion.div>
);
});


export default SDHeader;