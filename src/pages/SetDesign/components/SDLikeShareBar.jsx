import React from "react";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";


const SDLikeShareBar = React.memo(({ setDesign }) => {
const likes = setDesign.likesCount || setDesign.likes || 0;


return (
<motion.div className="flex items-center gap-4 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
<button className="flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow" aria-label="like-btn">
<AiOutlineHeart /> <span>{likes}</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 rounded-full border">Chia sẻ</button>
</motion.div>
);
});


export default SDLikeShareBar;