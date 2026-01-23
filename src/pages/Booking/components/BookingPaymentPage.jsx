import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tag,
  Divider,
  Skeleton,
  message,
  Modal,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import ArrowRightOutlined from "@ant-design/icons/ArrowRightOutlined";
import {
  createSinglePayment,
  resetPaymentState,
} from "../../../features/payment/paymentSlice";

const { Title, Text, Paragraph } = Typography;

export default function BookingPaymentPage({
  bookingResult,
  onBack,
  onPaymentSuccess,
}) {
  const dispatch = useDispatch();
  const reduxBooking = useSelector((state) => state.booking.currentBooking);
  const currentStudio = useSelector((state) => state.studio.currentStudio);
  const paymentLoading = useSelector((state) => state.payment.loading);

  const [booking, setBooking] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState(30);

  useEffect(() => {
    const normalizeBooking = (raw) => (raw?.booking ? raw.booking : raw);

    if (bookingResult) {
      setBooking(normalizeBooking(bookingResult));
    } else if (reduxBooking) {
      setBooking(normalizeBooking(reduxBooking));
    } else {
      const saved = localStorage.getItem("latestBooking");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBooking(normalizeBooking(parsed));
        } catch (e) {
          console.error("Cannot parse latestBooking", e);
        }
      }
    }
  }, [bookingResult, reduxBooking]);

  useEffect(() => {
    return () => dispatch(resetPaymentState());
  }, [dispatch]);

  if (!booking || !currentStudio) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  const {
    _id: bookingId,
    totalBeforeDiscount = 0,
    discountAmount = 0,
    finalAmount = 0,
    policySnapshots = {},
  } = booking;

  const hasDiscount = discountAmount > 0;
  const formatted = (num) => num.toLocaleString("vi-VN") + "₫";

  const cancellationTiers = policySnapshots.cancellation?.refundTiers || [];
  const noShowRules = policySnapshots.noShow?.noShowRules || {};

  const handlePayPercent = async (percentage) => {
    if (!bookingId) return message.error("Không có Booking ID!");

    setLocalLoading(true);
    try {
      const result = await dispatch(
        createSinglePayment({ bookingId, percentage })
      ).unwrap();

      const payUrl =
        result?.qrCodeUrl ||
        result?.payUrl ||
        result?.paymentLink ||
        result?.gatewayResponse?.checkoutUrl;

      if (payUrl) {
        window.open(payUrl, "_blank", "noopener,noreferrer");
        message.success(`Đang chuyển tới trang thanh toán (${percentage}%)`);
      } else {
        message.warning("Không tìm thấy đường dẫn thanh toán.");
      }
    } catch (err) {
      message.error(err?.message || "Thanh toán thất bại!");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 selection:bg-[#C5A267]/20">
      <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden rounded-sm">
        {/* EXECUTIVE SUCCESS HEADER */}
        <div className="text-center py-16 bg-[#0F172A] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#C5A267]/5 rounded-br-full"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#C5A267]/10 flex items-center justify-center rounded-full mb-6 border border-[#C5A267]/20">
              <CheckCircleOutlined className="text-[#C5A267] text-2xl" />
            </div>
            <Title
              level={2}
              className="!text-4xl !font-semibold !text-white !mb-2"
            >
              Đặt phòng thành công
            </Title>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">
              Mã giao dịch: <span className="text-white">{bookingId}</span>
            </p>
          </div>
        </div>

        <div className="p-12 md:p-16">
          <div className="grid md:grid-cols-2 gap-16">
            {/* LEFT: STUDIO & PRICING */}
            <div className="space-y-10">
              <div className="flex gap-6 items-center p-6 border border-slate-50 bg-[#F8F9FA]">
                {currentStudio?.images?.[0] ? (
                  <img
                    src={currentStudio.images[0]}
                    alt={currentStudio.name}
                    className="w-24 h-24 object-cover transition-all duration-700"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100" />
                )}
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold block mb-1">
                    Cơ sở thực hiện
                  </span>
                  <h4 className="m-0 text-[#0F172A] text-xl font-semibold">
                    {currentStudio?.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-1">
                    {currentStudio?.location}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-widest">
                  <span>Giá tạm tính</span>
                  <span className="font-bold text-slate-700">
                    {formatted(totalBeforeDiscount)}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-emerald-600">
                    <span>Chiết khấu ưu đãi</span>
                    <span>-{formatted(discountAmount)}</span>
                  </div>
                )}
                <div className="h-px bg-slate-50 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#0F172A]">
                    Tổng thanh toán
                  </span>
                  <span className="text-4xl font-semibold text-[#C5A267]">
                    {formatted(finalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: POLICIES */}
            <div className="space-y-8">
              <div className="p-8 border border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-16 bg-[#C5A267]"></div>
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-6 flex items-center gap-2">
                  <InfoCircleOutlined className="text-[#C5A267]" />
                  Chính sách hoàn hủy
                </h5>
                <ul className="space-y-4 m-0 p-0 list-none">
                  {cancellationTiers.length > 0 ? (
                    cancellationTiers.map((tier) => (
                      <li
                        key={tier._id}
                        className="flex justify-between items-center border-b border-slate-50 pb-2"
                      >
                        <span className="text-xs text-slate-500 font-light">
                          Trước {tier.hoursBeforeBooking} giờ
                        </span>
                        <span className="text-xs font-bold text-[#0F172A]">
                          Hoàn {tier.refundPercentage}%
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic font-light">
                      Không áp dụng hoàn phí
                    </li>
                  )}
                </ul>
              </div>

              <div className="p-8 border border-slate-100 bg-[#F8F9FA]">
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-6 flex items-center gap-2">
                  <InfoCircleOutlined className="text-rose-500" />
                  Điều khoản vắng mặt
                </h5>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block mb-1">
                      Mức phí phạt
                    </span>
                    <span className="text-lg font-bold text-[#0F172A]">
                      {noShowRules.chargePercentage || 100}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block mb-1">
                      Thời gian ân hạn
                    </span>
                    <span className="text-lg font-bold text-[#0F172A]">
                      {noShowRules.graceMinutes || 15} phút
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-6 pt-10 border-t border-slate-100">
            <Button
              onClick={onBack}
              className="!h-16 !px-12 !rounded-none !border-slate-200 !text-[10px] !uppercase !tracking-widest !font-bold hover:!border-[#0F172A]"
            >
              Quay lại trang chủ
            </Button>
            <Button
              type="primary"
              loading={localLoading || paymentLoading}
              onClick={() => setIsModalVisible(true)}
              className="!h-16 !px-16 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !font-bold !rounded-none !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] transition-all duration-500"
            >
              Tiến hành thanh toán
              <ArrowRightOutlined className="ml-4 text-xs" />
            </Button>
          </div>
        </div>
      </div>

      {/* LUXURY PAYMENT MODAL */}
      <Modal
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={550}
        className="executive-modal"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
              Phương thức chi trả
            </p>
            <Title level={3} className="!text-[#0F172A] !font-semibold !m-0">
              Chọn mức thanh toán
            </Title>
          </div>

          <div className="space-y-4">
            {[30, 50, 100].map((p) => {
              const isActive = selectedPercent === p;
              const amount = (finalAmount * p) / 100;
              return (
                <div
                  key={p}
                  onClick={() => setSelectedPercent(p)}
                  className={`p-6 border cursor-pointer transition-all duration-500 relative flex justify-between items-center group ${
                    isActive
                      ? "border-[#C5A267] bg-[#F8F6F3]"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-5 h-5 border transition-all flex items-center justify-center ${
                        isActive
                          ? "bg-[#0F172A] border-[#0F172A]"
                          : "border-slate-200"
                      }`}
                    >
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-[#C5A267]"></div>
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                          isActive ? "text-[#0F172A]" : "text-slate-400"
                        }`}
                      >
                        Thanh toán {p}%
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-1 uppercase">
                        {p === 100
                          ? "Xác nhận toàn bộ dịch vụ"
                          : `Giữ chỗ tạm tính (${p}%)`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                        isActive ? "text-[#C5A267]" : "text-slate-700"
                      }`}
                    >
                      {formatted(amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            block
            type="primary"
            onClick={() => {
              handlePayPercent(selectedPercent);
              setIsModalVisible(false);
            }}
            className="!h-16 !mt-10 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !font-bold !rounded-none !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] transition-all duration-500"
          >
            Xác nhận chi trả
          </Button>
          <Button
            type="text"
            onClick={() => setIsModalVisible(false)}
            className="w-full !mt-4 !text-[10px] !uppercase !tracking-widest !text-slate-400"
          >
            Để sau
          </Button>
        </div>
      </Modal>
    </div>
  );
}
