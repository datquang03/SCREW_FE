import React, { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import SDCommentItem from "./SDCommentItem";

const SDCommentList = ({ storeComments, targetId }) => {
  const globalComments = useSelector((s) => s.comment?.comments || []);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(storeComments || globalComments || []);
  }, [storeComments, globalComments]);

  return (
    <div className="mt-6">
      <div className="mt-2 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">Chưa có bình luận nào — hãy bắt đầu!</p>
        ) : (
          comments.map((c, idx) => (
            <motion.div
              key={c._id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <SDCommentItem comment={c} targetId={targetId} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(SDCommentList);
