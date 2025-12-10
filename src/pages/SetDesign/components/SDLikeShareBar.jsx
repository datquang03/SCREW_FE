import React from "react";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const SDLikeShareBar = React.memo(({ setDesign }) => {
const likes = setDesign.likesCount || setDesign.likes || 0;

return (
    <motion.div
      className="flex flex-wrap items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition">
        <AiOutlineHeart className="text-lg" />
        <span className="font-semibold">{likes}</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition">
        Chia sẻ
</button>
</motion.div>
);
});

export default SDLikeShareBar;