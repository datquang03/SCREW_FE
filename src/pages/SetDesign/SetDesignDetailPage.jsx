import React, { useEffect, Suspense, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Tag } from "antd";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSetDesign: setDesign, loading } = useSelector(
    (s) => s.setDesign
  );
  const { lastUploadedImages } = useSelector((s) => s.upload || {});
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const { comments } = useSelector((s) => s.comment);

  const modalBg = useMemo(() => {
    const imgs = Array.isArray(setDesign?.images) ? setDesign.images : [];
    if (imgs.length === 0) return null;
    const pick = imgs[Math.floor(Math.random() * imgs.length)];
    return pick?.url || pick;
  }, [setDesign]);

  useEffect(() => {
    if (!setDesign || setDesign._id !== id) dispatch(getSetDesignById(id));
    // initial comments load (page 1) - SDCommentList will handle pagination
    dispatch(getComments({ targetType: "SetDesign", targetId: id, page: 1 }));
  }, [id, dispatch]);

  if (loading || !setDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/5">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white mt-4 lg:mt-6">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.2),transparent_30%)]" />
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Set Design Showcase</p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">{setDesign.name}</h1>
              <p className="text-slate-200 max-w-2xl">
                {setDesign.shortDescription || "Khám phá thiết kế được tinh chỉnh cho những buổi chụp chuyên nghiệp, tối ưu ánh sáng và bố cục."}
              </p>
              <div className="flex flex-wrap gap-2">
                {(setDesign.tags || setDesign.categories || []).slice(0, 4).map((t) => (
                  <Tag key={t} color="geekblue" className="border-0 px-3 py-1 text-sm bg-white/10 text-white">
                    {t}
                  </Tag>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  type="primary"
                  size="large"
                  className="bg-indigo-500 border-none shadow-lg shadow-indigo-500/30"
                  onClick={() => setOpenBookingModal(true)}
                >
                  Đặt lịch ngay
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-80 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur">
              <div className="text-sm text-slate-100 mb-2">Tổng quan nhanh</div>
              <div className="space-y-3 text-white">
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Danh mục</span>
                  <span className="font-semibold">{setDesign.category || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Giá từ</span>
                  <span className="font-semibold">{setDesign.price ? `${setDesign.price.toLocaleString()} đ` : "Liên hệ"}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-slate-200">Thời lượng</span>
                  <span className="font-semibold">{setDesign.duration || "Theo gói"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Suspense fallback={<div className="text-center py-10">Đang tải giao diện...</div>}>
          <div className="space-y-8">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-4 border border-slate-100">
                  <SDGallery images={setDesign.images} />
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-6 border border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Thông tin chi tiết</h3>
                  <SDInfo data={setDesign} />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-5">
                  <SDLikeShareBar setDesign={setDesign} />
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-5">
                  <SDRelatedDesigns currentId={setDesign._id} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Bình luận</h3>
                <span className="text-sm text-slate-500">Chia sẻ cảm nhận hoặc câu hỏi của bạn</span>
              </div>
              <div className="space-y-6">
                <SDCommentInput targetId={id} />
                <SDCommentList targetId={id} />
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      <Modal
        open={openBookingModal}
        onCancel={() => setOpenBookingModal(false)}
        footer={null}
        centered
        title={null}
        width={900}
        styles={{
          content: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
          body: {
            padding: 0,
          },
        }}
        className="custom-booking-modal"
      >
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            backgroundImage: modalBg ? `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.85)), url(${modalBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="relative p-5 sm:p-6 grid md:grid-cols-2 gap-4">
            <div
              className="group bg-slate-800/80 border border-white/10 rounded-xl p-5 flex flex-col justify-between min-h-[180px] transition duration-200 transform hover:scale-[1.02] hover:bg-slate-800/95 cursor-pointer"
              onClick={() => {
                navigate(`/booking/set-design/${setDesign._id}`);
                setOpenBookingModal(false);
              }}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">Đặt ngay</h3>
                <p className="text-slate-200 text-sm">Chọn set này và tiếp tục đặt lịch với các bước đơn giản.</p>
              </div>
              <div className="flex items-center justify-between text-indigo-200 group-hover:text-white">
                <span className="font-medium">Tiếp tục</span>
                <span className="text-lg">→</span>
              </div>
            </div>

            <div
              className="group bg-slate-800/80 border border-white/10 rounded-xl p-5 flex flex-col justify-between min-h-[180px] transition duration-200 transform hover:scale-[1.02] hover:bg-slate-800/95 cursor-pointer"
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
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">Yêu cầu custom</h3>
                <p className="text-slate-200 text-sm">Gửi brief và ảnh tham khảo để đội ngũ tinh chỉnh theo nhu cầu.</p>
              </div>
              <div className="flex items-center justify-between text-indigo-200 group-hover:text-white">
                <span className="font-medium">Mở form</span>
                <span className="text-lg">→</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SetDesignDetail;
