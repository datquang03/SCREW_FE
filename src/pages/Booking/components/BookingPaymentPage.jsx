// src/pages/Booking/components/BookingPaymentPage.jsx

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
  Radio,
  Table,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";

import {
  createSinglePayment,
  resetPaymentState,
} from "../../../features/payment/paymentSlice";

const { Title, Text } = Typography;

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

  // Load booking
  useEffect(() => {
    const normalizeBooking = (raw) => (raw?.booking ? raw.booking : raw);

    if (bookingResult) {
      // bookingResult có thể là { booking, paymentOptions } hoặc booking thuần
      setBooking(normalizeBooking(bookingResult));
    } else if (reduxBooking) {
      // currentBooking trong redux đã là booking thuần, nhưng để an toàn vẫn normalize
      setBooking(normalizeBooking(reduxBooking));
    } else {
      const saved = localStorage.getItem("latestBooking");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBooking(normalizeBooking(parsed));
        } catch (e) {
          console.error("Cannot parse latestBooking from localStorage", e);
        }
      }
    }
  }, [bookingResult, reduxBooking]);

  useEffect(() => {
    return () => dispatch(resetPaymentState());
  }, [dispatch]);

  if (!booking || !currentStudio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Card className="mt-6">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
          <Card className="mt-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
          <div className="mt-6 flex gap-4">
            <Skeleton.Button active size="large" style={{ width: 150, height: 48 }} />
            <Skeleton.Button active size="large" style={{ width: 200, height: 48 }} />
          </div>
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
    financials = {},
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

      // Ưu tiên dùng url trả về từ BE
      const payUrl =
        result?.qrCodeUrl ||
        result?.payUrl ||
        result?.paymentLink ||
        result?.gatewayResponse?.qrCodeUrl ||
        result?.gatewayResponse?.checkoutUrl;

      if (payUrl) {
        window.open(payUrl, "_blank", "noopener,noreferrer");
        message.success(
          `Đang chuyển tới trang thanh toán PayOS (${percentage}%)`
        );
      } else {
        message.warning(
          "Tạo payment thành công nhưng không tìm thấy đường dẫn thanh toán."
        );
      }
    } catch (err) {
      message.error(err?.message || "Thanh toán thất bại!");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Card className="shadow-2xl rounded-2xl overflow-hidden border-0">
        {/* Header Compact */}
        <div className="text-center py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CheckCircleOutlined className="text-5xl mb-2" />
          <Title level={2} className="text-white m-0 !text-white">
            ĐẶT PHÒNG THÀNH CÔNG
          </Title>
          <Text className="text-white/80">
            Mã: <strong>{bookingId}</strong>
          </Text>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cột trái: Thông tin & Giá */}
            <div className="flex flex-col gap-4">
              {/* Studio Info (Compact) */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-4 border border-purple-100 shadow-sm flex gap-4 items-center">
                 {currentStudio?.images?.[0] ? (
                    <img 
                      src={currentStudio.images[0]} 
                      alt={currentStudio.name} 
                      className="w-20 h-20 rounded-xl object-cover border border-purple-100 shadow-sm flex-shrink-0"
                    />
                 ) : (
                    <div className="w-20 h-20 rounded-xl bg-purple-100 flex-shrink-0 flex items-center justify-center text-purple-400">
                       <CheckCircleOutlined className="text-2xl" />
                    </div>
                 )}
                 <div className="min-w-0 flex-1">
                    <Text type="secondary" className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full">
                      Studio
                    </Text>
                    <h4 className="m-0 text-gray-800 font-bold text-lg mt-1 truncate">
                      {currentStudio?.name || "Tên Studio"}
                    </h4>
                    <p className="m-0 text-xs text-gray-500 truncate mt-1 flex items-center gap-1">
                       <InfoCircleOutlined className="text-[10px]" />
                       {currentStudio?.location || "Địa chỉ đang cập nhật"}
                    </p>
                 </div>
              </div>

              {/* Bảng giá (Compact) */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <strong className="text-gray-800">{formatted(totalBeforeDiscount)}</strong>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Giảm giá</span>
                      <span>-{formatted(discountAmount)}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-700">TỔNG CỘNG</span>
                    <span className="text-2xl font-extrabold text-purple-700">
                      {formatted(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Chính sách (Condensed) */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-sm">
                  <InfoCircleOutlined className="text-blue-500" />
                  <span>Chính sách hủy</span>
                </div>
                <ul className="text-xs space-y-1 text-gray-600 pl-5 list-disc">
                   {cancellationTiers.length > 0 ? cancellationTiers.map(tier => (
                     <li key={tier._id}>
                        Trước <strong>{tier.hoursBeforeBooking}h</strong>: hoàn <strong>{tier.refundPercentage}%</strong>
                     </li>
                   )) : <li>Không có thông tin</li>}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-sm">
                  <InfoCircleOutlined className="text-red-500" />
                  <span>No-Show (Không đến)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className="bg-red-50 p-2 rounded text-center">
                      <div className="text-gray-500">Phạt</div>
                      <div className="font-bold text-red-600">{noShowRules.chargePercentage || 100}%</div>
                   </div>
                   <div className="bg-orange-50 p-2 rounded text-center">
                      <div className="text-gray-500">Ân hạn</div>
                      <div className="font-bold text-orange-600">{noShowRules.graceMinutes || 15}p</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="large" onClick={onBack} className="min-w-[120px]">
              Về trang chủ
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-amber-500 hover:bg-amber-600 border-none font-bold px-8 shadow-amber-200 shadow-lg min-w-[200px]"
              loading={localLoading || paymentLoading}
              disabled={!bookingId}
              onClick={() => setIsModalVisible(true)}
            >
              Thanh toán ngay
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <Text type="secondary" className="text-xs">
               Hotline hỗ trợ: <strong>0909 888 999</strong>
            </Text>
          </div>
        </div>
      </Card>

      {/* Modal chọn % */}
      <Modal
        centered
        title={
          <div className="text-center pt-6 pb-2">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 m-0 uppercase tracking-tight">
              Chọn mức thanh toán
            </h3>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Vui lòng chọn số tiền bạn muốn thanh toán ngay
            </p>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              size="large"
              className="rounded-xl font-semibold border-0 text-gray-500 hover:bg-gray-100"
              onClick={() => setIsModalVisible(false)}
            >
              Để sau
            </Button>
            <Button
              size="large"
              type="primary"
              className="rounded-xl px-8 font-bold bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.02] transition-all"
              onClick={() => {
                handlePayPercent(selectedPercent);
                setIsModalVisible(false);
              }}
            >
              Tiến hành thanh toán
            </Button>
          </div>
        }
        width={500}
        styles={{
          content: { borderRadius: "24px", padding: "0 24px 24px" },
          header: { borderBottom: "none" },
        }}
      >
        <div className="py-2">
          <div className="flex flex-col gap-4">
            {[30, 50, 100].map((p) => {
              const isActive = selectedPercent === p;
              const amount = (finalAmount * p) / 100;

              return (
                <div
                  key={p}
                  onClick={() => setSelectedPercent(p)}
                  className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 group
                  ${
                    isActive
                      ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-100 translate-x-1"
                      : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {/* Radio Circle Simulation */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${
                          isActive
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isActive && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`text-base font-bold transition-colors ${
                            isActive ? "text-purple-900" : "text-gray-700"
                          }`}
                        >
                          Thanh toán trước {p}%
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {p === 100
                            ? "Hoàn tất đơn hàng ngay"
                            : "Giữ chỗ và thanh toán sau"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`block text-xl font-extrabold transition-colors ${
                          isActive ? "text-purple-600" : "text-gray-900"
                        }`}
                      >
                        {formatted(amount)}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute -left-[2px] top-6 w-[4px] h-10 bg-purple-600 rounded-r-lg" />
                  )}

                  {p === 30 && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}
                  {p === 100 && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                      TIỆN LỢI NHẤT
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
