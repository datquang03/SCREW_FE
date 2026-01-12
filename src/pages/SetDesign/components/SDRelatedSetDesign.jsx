import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Empty, Skeleton } from "antd";
import { getAllSetDesigns } from "../../../features/setDesign/setDesignSlice";

const SDRelatedDesigns = React.memo(({ currentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setDesigns, loading } = useSelector((s) => s.setDesign);

  useEffect(() => {
    if (!setDesigns || setDesigns.length === 0) {
      dispatch(getAllSetDesigns({ page: 1, limit: 12 }));
    }
  }, [dispatch, setDesigns?.length]);

  const relatedDesigns = useMemo(() => {
    const source = Array.isArray(setDesigns) ? setDesigns : [];
    const filtered = source.filter((item) => item && item._id && item._id !== currentId);
    return filtered.slice(0, 4);
  }, [setDesigns, currentId]);

  const handleNavigate = (id) => {
    navigate(`/set-design/${id}`);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-slate-900">Gợi ý tương tự</h4>
      {loading && (!setDesigns || setDesigns.length === 0) ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm p-2 border border-slate-100">
              <Skeleton.Image active className="!w-full !h-36" />
              <Skeleton
                active
                title={false}
                paragraph={{ rows: 1, width: "70%" }}
                className="pt-2"
              />
            </div>
          ))}
        </div>
      ) : relatedDesigns.length === 0 ? (
        <Empty description="Chưa có thiết kế tương tự" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedDesigns.map((d) => (
            <div
              key={d._id}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer bg-white"
              onClick={() => handleNavigate(d._id)}
            >
              <div className="relative w-full" style={{ paddingTop: "120%" }}>
                <img
                  src={
                    d.images?.[0]?.url ||
                    d.images?.[0] ||
                    "https://placehold.co/600x750?text=Set+Design"
                  }
                  loading="lazy"
                  alt={d.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white space-y-1">
                  <div className="text-sm font-semibold leading-tight line-clamp-2">
                    {d.name || "Set Design"}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-200">
                    {d.category || d.categories?.[0] || "Danh mục"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SDRelatedDesigns.displayName = "SDRelatedDesigns";

export default SDRelatedDesigns;
