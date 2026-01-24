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
    <div className="min-h-screen bg-[#FCFBFA]">
      <div className="relative isolate overflow-hidden bg-[#0F172A] text-white mt-4 lg:mt-6">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#1E293B_0%,transparent_50%),radial-gradient(circle_at_80%_0%,#334155_0%,transparent_40%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A267]/30 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">Set Design Showcase</p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">{setDesign.name}</h1>
              <p className="text-slate-300 max-w-2xl text-lg">
                {setDesign.shortDescription || "Khám phá thiết kế được tinh chỉnh cho những buổi chụp chuyên nghiệp, tối ưu ánh sáng và bố cục."}
              </p>
              <div className="flex flex-wrap gap-2">
                {(setDesign.tags || setDesign.categories || []).slice(0, 4).map((t) => (
                  <Tag key={t} className="border border-[#C5A267] px-3 py-1 text-sm bg-[#C5A267]/10 text-[#C5A267] font-semibold">
                    {t}
                  </Tag>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: '#C5A267', borderColor: '#C5A267' }}
                  className="!bg-[#C5A267] hover:!bg-[#B38F55] border-none shadow-2xl shadow-[#C5A267]/20 font-bold text-[10px] uppercase tracking-[0.2em] px-10 py-3 h-auto"
                  onClick={() => setOpenBookingModal(true)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B38F55'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C5A267'; }}
                >
                  Đặt lịch ngay
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-80 bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-6 flex items-center gap-3">
                <div className="h-px w-6 bg-[#C5A267]"></div> Tổng quan nhanh
              </div>
              <div className="space-y-4 text-white">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Danh mục</span>
                  <span className="font-medium text-sm">{setDesign.category || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Giá từ</span>
                  <span className="font-bold text-sm text-[#C5A267]">{setDesign.price ? `${setDesign.price.toLocaleString()} đ` : "Liên hệ"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Thời lượng</span>
                  <span className="font-medium text-sm">{setDesign.duration || "Theo gói"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-10 text-slate-500">Đang tải giao diện...</div>}>
          <div className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-2 border border-slate-200">
                  <SDGallery images={setDesign.images} />
                </div>

                <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-8 border border-slate-200">
                  <h3 className="text-2xl font-semibold text-[#0F172A] mb-6">Thông tin chi tiết</h3>
                  <SDInfo data={setDesign} />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-6">
                  <SDLikeShareBar setDesign={setDesign} />
                </div>

                <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-6">
                  <SDRelatedDesigns currentId={setDesign._id} />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-200 p-8">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-3xl font-bold text-[#0F172A]">Bình luận & Đánh giá</h3>
                <span className="text-xs text-slate-400 uppercase tracking-widest">Chia sẻ cảm nhận của bạn</span>
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
          className="relative overflow-hidden"
          style={{
            backgroundImage: modalBg ? `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.95)), url(${modalBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#0F172A]/80" />
          <div className="relative p-5 sm:p-6 grid md:grid-cols-2 gap-4">
            <div
              className="group bg-white/5 border border-[#C5A267]/30 p-6 flex flex-col justify-between min-h-[180px] transition-all duration-300 hover:bg-[#C5A267]/10 hover:border-[#C5A267] cursor-pointer"
              onClick={() => {
                navigate(`/booking/set-design/${setDesign._id}`);
                setOpenBookingModal(false);
              }}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Đặt ngay</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Chọn set này và tiếp tục đặt lịch với các bước đơn giản.</p>
              </div>
              <div className="flex items-center justify-between text-[#C5A267] group-hover:text-white transition-colors">
                <span className="font-medium">Tiếp tục</span>
                <span className="text-lg">→</span>
              </div>
            </div>

            <div
              className="group bg-white/5 border border-[#C5A267]/30 p-6 flex flex-col justify-between min-h-[180px] transition-all duration-300 hover:bg-[#C5A267]/10 hover:border-[#C5A267] cursor-pointer"
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
                <h3 className="text-2xl font-bold text-white">Yêu cầu custom</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Gửi brief và ảnh tham khảo để đội ngũ tinh chỉnh theo nhu cầu.</p>
              </div>
              <div className="flex items-center justify-between text-[#C5A267] group-hover:text-white transition-colors">
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
