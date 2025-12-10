import React, { useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSetDesignById } from "../../features/setDesign/setDesignSlice";
import { getComments } from "../../features/comment/commentSlice";
import SDHeader from "./components/SDHeader";
import SDGallery from "./components/SDGallery";
import SDInfo from "./components/SDInfo";
import SDLikeShareBar from "./components/SDLikeShareBar";
import SDCommentInput from "./components/SDCommentInput";
import SDRelatedDesigns from "./components/SDRelatedSetDesign";
import SDCommentList from "./components/SDCommentList";

const SetDesignDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentSetDesign: setDesign, loading } = useSelector(
    (s) => s.setDesign
  );
  const { comments } = useSelector((s) => s.comment);

  useEffect(() => {
    if (!setDesign || setDesign._id !== id) dispatch(getSetDesignById(id));
    // initial comments load (page 1) - SDCommentList will handle pagination
    dispatch(getComments({ targetType: "SetDesign", targetId: id, page: 1 }));
  }, [id, dispatch]);

  if (loading || !setDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Suspense fallback={<div>Đang tải giao diện...</div>}>
        <SDHeader setDesign={setDesign} />
        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          <SDGallery images={setDesign.images} />
          <div>
            <SDInfo data={setDesign} />
            <SDLikeShareBar setDesign={setDesign} />
          </div>
        </div>

        <div className="mt-8">
          <SDCommentInput targetId={id} />
          <SDCommentList targetId={id} />

        </div>

        <div className="mt-10">
          <SDRelatedDesigns currentId={setDesign._id} />
        </div>
      </Suspense>
    </div>
  );
};

export default SetDesignDetail;
