import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createComment, getComments } from "../../../features/comment/commentSlice";


const SDCommentInput = React.memo(({ targetId }) => {
const [value, setValue] = useState("");
const dispatch = useDispatch();
const { user } = useSelector((s) => s.auth || {});


const handleSubmit = async () => {
if (!value.trim()) return;
if (!user) return alert("Vui lòng đăng nhập");


try {
await dispatch(createComment({ content: value.trim(), targetType: "SetDesign", targetId })).unwrap();
setValue("");
// Fetch lại comments để có đầy đủ thông tin user được populate
await dispatch(getComments({ targetType: "SetDesign", targetId }));
} catch (err) {
console.error(err);
alert("Gửi thất bại");
}
};


return (
<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
<div className="flex gap-4 items-start">
<textarea
value={value}
onChange={(e) => setValue(e.target.value)}
placeholder="Viết bình luận..."
className="flex-1 p-4 bg-white text-[#0F172A] border-2 border-slate-200 outline-none focus:border-[#C5A267] focus:ring-2 focus:ring-[#C5A267]/20 transition-all"
rows={3}
/>
<button onClick={handleSubmit} className="bg-[#C5A267] hover:bg-[#A0826D] text-white px-6 py-3 font-bold transition-all shadow-md hover:shadow-lg">Gửi</button>
</div>
</motion.div>
);
});


export default SDCommentInput;