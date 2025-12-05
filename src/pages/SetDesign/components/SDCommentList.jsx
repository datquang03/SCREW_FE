import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { getComments } from "../../../features/comment/commentSlice";
import SDCommentItem from "./SDCommentItem";

const PAGE_SIZE = 6;

const SDCommentList = ({ storeComments, targetId }) => {
  const dispatch = useDispatch();

  // 🔥 TẤT CẢ hooks phải nằm trong component
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Load lại nếu dữ liệu redux thay đổi
  useEffect(() => {
    setComments(storeComments || []);
  }, [storeComments]);

  // =======================
  // LOAD MORE
  // =======================
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    try {
      const res = await dispatch(
        getComments({
          targetType: "SetDesign",
          targetId,
          page: page + 1,
          limit: PAGE_SIZE,
        })
      ).unwrap();

      // Trường hợp backend trả array
      if (Array.isArray(res)) {
        setComments((prev) => [...prev, ...res]);
        if (res.length < PAGE_SIZE) setHasMore(false);
      }

      // Trường hợp backend trả object
      else if (res && Array.isArray(res.comments)) {
        setComments((prev) => [...prev, ...res.comments]);
        setHasMore(res.hasMore);
      } else {
        setHasMore(false);
      }

      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      loadingRef.current = false;
    }
  }, [dispatch, page, hasMore, targetId]);

  // =======================
  // INTERSECTION OBSERVER
  // =======================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold">Bình luận</h3>

      <div className="mt-4 space-y-4">
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
              <SDCommentItem comment={c} />
            </motion.div>
          ))
        )}
      </div>

      <div ref={sentinelRef} className="h-6" />

      {!hasMore && (
        <p className="text-sm text-gray-400 mt-3">Đã tải hết bình luận.</p>
      )}
    </div>
  );
};

export default memo(SDCommentList);
