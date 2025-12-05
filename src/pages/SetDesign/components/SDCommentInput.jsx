import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createComment } from "../../../features/comment/commentSlice";


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
} catch (err) {
console.error(err);
alert("Gửi thất bại");
}
};


return (
<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
<div className="flex gap-4 items-start">
<textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Viết bình luận..." className="flex-1 p-3 rounded-2xl bg-white/90 dark:bg-gray-800 outline-none" rows={3} />
<button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded-full">Gửi</button>
</div>
</motion.div>
);
});


export default SDCommentInput;