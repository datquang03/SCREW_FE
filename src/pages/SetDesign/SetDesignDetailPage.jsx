import React, { useEffect, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button, Modal } from "antd";

const SetDesignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSetDesign: setDesign, loading } = useSelector(
    (s) => s.setDesign
  );
  const { lastUploadedImages } = useSelector((s) => s.upload || {});
  const [openBookingModal, setOpenBookingModal] = useState(false);
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Suspense fallback={<div className="text-center py-10">Đang tải giao diện...</div>}>
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <SDHeader setDesign={setDesign} />
                <Button
                  type="primary"
                  className="bg-indigo-600"
                  onClick={() => setOpenBookingModal(true)}
                >
                  Đặt lịch / Yêu cầu custom
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <SDGallery images={setDesign.images} />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <SDInfo data={setDesign} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <SDLikeShareBar setDesign={setDesign} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Bình luận</h3>
              <div className="space-y-6">
                <SDCommentInput targetId={id} />
                <SDCommentList targetId={id} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <SDRelatedDesigns currentId={setDesign._id} />
            </div>
          </div>
        </Suspense>
      </div>

      <Modal
        open={openBookingModal}
        onCancel={() => setOpenBookingModal(false)}
        footer={null}
        centered
        title="Chọn hành động"
      >
        <div className="space-y-3">
          <Button
            type="primary"
            block
            size="large"
            className="bg-indigo-600"
            onClick={() => {
              navigate(`/booking/set-design/${setDesign._id}`);
              setOpenBookingModal(false);
            }}
          >
            Đặt ngay set design này
          </Button>
          <Button
            block
            size="large"
            onClick={() => {
              navigate("/set-design-request", {
                state: {
                  fromSetDesign: {
                    id: setDesign._id,
                    name: setDesign.name,
                    category: setDesign.category,
                    images: setDesign.images,
                    uploadedImages: lastUploadedImages,
                  },
                },
              });
              setOpenBookingModal(false);
            }}
          >
            Yêu cầu custom (chuyển đến form)
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SetDesignDetail;
