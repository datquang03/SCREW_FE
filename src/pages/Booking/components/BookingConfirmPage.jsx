// src/pages/Booking/components/BookingConfirmPage.jsx
import React, { useRef, useState } from "react";
import { Button, message, Skeleton, Card, Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { createBooking } from "../../../features/booking/bookingSlice";
import { motion } from "framer-motion";

// Icon import chuẩn
import PrinterOutlined from "@ant-design/icons/PrinterOutlined";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import ShopOutlined from "@ant-design/icons/ShopOutlined";
import CalendarOutlined from "@ant-design/icons/CalendarOutlined";
import GiftOutlined from "@ant-design/icons/GiftOutlined";

export default function BookingConfirmPage({ onBack, onSuccess }) {
  const dispatch = useDispatch();
  const printRef = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { currentStudio: studio, loading: studioLoading } = useSelector(
    (state) => state.studio
  );
  const { draft, loading: bookingLoading } = useSelector(
    (state) => state.booking
  );

  const {
    startTime,
    endTime,
    details = [],
    promoId,
    promoCode,
    discountAmount = 0,
  } = draft || {};

  const duration =
    startTime && endTime
      ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
      : 0;

  const equipment = (details || []).filter((d) => d.detailType === "equipment");
  const services = (details || []).filter(
    (d) => d.detailType === "extra_service"
  );

  const roomPrice = (studio?.basePricePerHour || 0) * duration;
  const equipmentPrice = equipment.reduce(
    (s, d) => s + (d.pricePerHour || 0) * duration * (d.quantity || 1),
    0
  );
  const servicePrice = services.reduce(
    (s, d) => s + (d.pricePerUse || 0) * (d.quantity || 1),
    0
  );
  const subtotal = roomPrice + equipmentPrice + servicePrice;
  const discount = discountAmount || 0; // Lấy từ draft (đã được tính khi apply promotion)
  const totalPrice = subtotal - discount;

  const invoiceId = `HD${dayjs().format("YYMMDDHHmm")}${String(
    Math.floor(Math.random() * 1000)
  ).padStart(3, "0")}`;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `HoaDon_${(studio?.name || "studio").replace(
      /\s/g,
      "_"
    )}_${dayjs().format("DD-MM-YYYY")}`,
    pageStyle:
      "@page { size: A4; margin: 10mm; } @media print { .no-print { display: none !important; } }",
  });

  const handleConfirm = async () => {
    if (!draft) {
      return message.error(
        "Không có thông tin booking, vui lòng hoàn thành các bước trước."
      );
    }

    const payload = {
      studioId: draft.studioId,
      startTime: draft.startTime,
      endTime: draft.endTime,
      ...(details.length > 0 && { details }),
      ...(promoId && { promoId }),
    };

    try {
      const result = await dispatch(createBooking(payload)).unwrap();

      // lưu backup để PaymentPage fallback nếu parent không truyền prop
      try {
        localStorage.setItem("latestBooking", JSON.stringify(result));
      } catch (e) {
        // ignore
      }

      // Hiển thị modal success animation
      setShowSuccessModal(true);

      // Delay 2 giây rồi chuyển trang
      setTimeout(() => {
        setShowSuccessModal(false);
        message.success("Đặt phòng thành công! Đang chuyển sang thanh toán...");
        if (onSuccess) onSuccess(result);
      }, 2000);
    } catch (err) {
      message.error(err?.message || "Đặt phòng thất bại, vui lòng thử lại!");
    }
  };

  if (studioLoading || !studio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Card className="mt-6">
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
          <Card className="mt-6">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
          <div className="mt-6 flex gap-4">
            <Skeleton.Button active size="large" style={{ width: 150, height: 48 }} />
            <Skeleton.Button active size="large" style={{ width: 200, height: 48 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      {/* HEADER PAGE */}
      <div className="w-full max-w-3xl px-4 flex items-center justify-between mb-4">
            <Button
              size="middle"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
          Quay lại
            </Button>
            <h2 className="text-lg font-bold text-gray-700 m-0 uppercase tracking-wide">Xác nhận đặt phòng</h2>
            <div className="w-[88px]"></div> {/* Spacer for alignment */}
      </div>

      {/* CONTAINER */}
      <div className="w-full max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* HÓA ĐƠN IN */}
          <div ref={printRef} className="bg-white flex flex-col h-full">
            {/* INVOICE HEADER */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-5 py-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <span className="font-black text-lg">S</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight m-0 uppercase">Hóa đơn dịch vụ</h1>
                        <p className="text-[10px] opacity-80 font-mono tracking-wider">{invoiceId}</p>
                    </div>
                 </div>
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] uppercase font-bold opacity-70">Ngày lập</p>
                    <p className="font-bold text-sm">{dayjs().format("DD/MM/YYYY HH:mm")}</p>
                 </div>
              </div>
            </div>

            {/* INVOICE BODY */}
            <div className="p-5">
              {/* 2 COLUMNS INFO */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* LEFT: STUDIO */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase border-b border-purple-100 pb-1 mb-1">
                    <ShopOutlined /> Thông tin Studio
                  </div>
                  <div>
                      <h3 className="text-base font-bold text-gray-800 leading-tight m-0">{studio.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {studio.location || studio.address || "123 Đường Sáng Tạo, Q.1, TP.HCM"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Hotline: 0909 888 999</p>
                  </div>
                </div>

                {/* RIGHT: TIME */}
                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase border-b border-blue-100 pb-1 mb-1">
                    <CalendarOutlined /> Thời gian sử dụng
                  </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                          <div className="text-[10px] text-blue-600 font-semibold uppercase">Ngày nhận</div>
                          <div className="text-sm font-bold text-gray-800">{dayjs(startTime).format("DD/MM/YYYY")}</div>
                      </div>
                      <div className="bg-orange-50/50 p-2 rounded border border-orange-100">
                          <div className="text-[10px] text-orange-600 font-semibold uppercase">Tổng giờ</div>
                          <div className="text-sm font-bold text-gray-800">{duration.toFixed(1)}h</div>
                      </div>
                      <div className="col-span-2 bg-green-50/50 p-2 rounded border border-green-100 flex justify-between items-center">
                          <div className="text-[10px] text-green-600 font-semibold uppercase">Khung giờ</div>
                          <div className="text-sm font-bold text-gray-800">{dayjs(startTime).format("HH:mm")} - {dayjs(endTime).format("HH:mm")}</div>
                      </div>
                   </div>
                </div>
              </div>

              {/* TABLE DETAILS */}
              <div className="mb-6">
                 <div className="flex items-center gap-2 text-gray-600 font-bold text-xs uppercase border-b border-gray-200 pb-1 mb-2">
                    <GiftOutlined /> Chi tiết thanh toán
                 </div>
                 <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 text-gray-500 font-semibold">
                            <tr>
                                <th className="py-2 px-3 text-left">Hạng mục</th>
                                <th className="py-2 px-3 text-center w-12">SL</th>
                                <th className="py-2 px-3 text-right">Đơn giá</th>
                                <th className="py-2 px-3 text-right bg-gray-100/50">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="py-2 px-3 text-gray-800 font-medium">Thuê Studio</td>
                                <td className="py-2 px-3 text-center text-gray-500">{duration}h</td>
                                <td className="py-2 px-3 text-right text-gray-500">{studio.basePricePerHour?.toLocaleString()}đ</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800 bg-gray-50/30">{roomPrice?.toLocaleString()}đ</td>
                            </tr>
                            {equipment.map((item, i) => (
                                <tr key={i}>
                                    <td className="py-2 px-3 text-gray-600 pl-6 relative">
                                        <span className="absolute left-3 text-gray-300">•</span>
                                        {item.name}
                                    </td>
                                    <td className="py-2 px-3 text-center text-gray-500">{item.quantity}</td>
                                    <td className="py-2 px-3 text-right text-gray-500">{item.pricePerHour?.toLocaleString()}đ</td>
                                    <td className="py-2 px-3 text-right font-medium text-gray-800 bg-gray-50/30">
                                        {(item.pricePerHour * duration * item.quantity)?.toLocaleString()}đ
                                    </td>
                                </tr>
                            ))}
                             {services.map((item, i) => (
                                <tr key={i}>
                                    <td className="py-2 px-3 text-gray-600 pl-6 relative">
                                        <span className="absolute left-3 text-gray-300">•</span>
                                        {item.name}
                                    </td>
                                    <td className="py-2 px-3 text-center text-gray-500">{item.quantity}</td>
                                    <td className="py-2 px-3 text-right text-gray-500">{item.pricePerUse?.toLocaleString()}đ</td>
                                    <td className="py-2 px-3 text-right font-medium text-gray-800 bg-gray-50/30">
                                        {(item.pricePerUse * item.quantity)?.toLocaleString()}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
              </div>

              {/* TOTAL & FOOTER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
                 <div className="text-xs text-gray-400 italic sm:max-w-xs">
                    * Quý khách vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                 </div>
                 <div className="w-full sm:w-auto min-w-[200px] space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Tạm tính</span>
                        <span>{subtotal.toLocaleString()}đ</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-xs text-green-600 font-medium">
                            <span>Giảm giá</span>
                            <span>-{discount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                        <span className="text-sm font-bold text-gray-800 uppercase">Tổng thanh toán</span>
                        <span className="text-xl font-black text-purple-600">{totalPrice.toLocaleString()}đ</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS ACTION */}
        <div className="flex gap-3 mt-4 justify-end">
             <Button 
                icon={<PrinterOutlined />} 
                onClick={handlePrint}
                className="h-10 px-5 border-gray-300 hover:border-gray-400 text-gray-600"
            >
                In phiếu
            </Button>
            <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={bookingLoading}
                onClick={handleConfirm}
                className="h-10 px-6 bg-purple-600 hover:bg-purple-700 border-none font-bold shadow-md shadow-purple-200"
            >
                Xác nhận & Thanh toán
            </Button>
        </div>


        {/* Success Modal */}
        <Modal
          open={showSuccessModal}
          footer={null}
          closable={false}
          centered
          width={500}
          className="success-modal"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircleOutlined className="text-white text-5xl" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-gray-800 mb-3"
            >
              Đặt phòng thành công! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              Đang chuyển sang bước thanh toán...
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mt-6 mx-auto max-w-xs"
            />
          </motion.div>
        </Modal>
      </div>
    </div>
  );
}
