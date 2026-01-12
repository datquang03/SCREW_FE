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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* NÚT QUAY LẠI - CHỈ MỘT NÚT Ở BÊN TRÁI */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
            <Button
              size="large"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mb-4"
            >
          Quay lại
            </Button>
      </div>

      {/* CONTAINER VỚI SCROLL */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-2xl">
      {/* HÓA ĐƠN IN */}
          <div ref={printRef} className="bg-white">
            <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 text-white py-6 md:py-10 px-4 md:px-12 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
                <span className="text-3xl md:text-5xl font-bold text-purple-600">
                  S
                </span>
          </div>
              <h1 className="text-2xl md:text-5xl font-bold mb-2">
                HÓA ĐƠN ĐẶT PHÒNG
              </h1>
              <p className="text-lg md:text-2xl font-bold mt-4">{invoiceId}</p>
        </div>

            <div className="p-4 md:p-12">
          {/* THÔNG TIN STUDIO & THỜI GIAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-6 md:mb-10">
            <div>
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <ShopOutlined className="text-purple-600" /> STUDIO
              </h3>
                  <p className="text-lg md:text-xl font-semibold">
                    {studio.name}
                  </p>
                  <p className="text-sm md:text-base text-gray-600">
                    {studio.location ||
                      studio.address ||
                      "123 Đường Sáng Tạo, Q.1, TP.HCM"}
              </p>
                  <p className="text-sm md:text-base text-gray-600">
                    Hotline: 0909 888 999
                  </p>
            </div>
                <div className="text-left md:text-right">
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3 mb-3 md:mb-4 md:justify-end">
                <CalendarOutlined className="text-blue-600" /> THỜI GIAN
              </h3>
                  <div className="space-y-2 md:space-y-3">
                    <div className="bg-blue-50 rounded-xl p-3 md:p-4 inline-block">
                      <p className="text-xl md:text-3xl font-bold text-blue-600">
                    {dayjs(startTime).format("DD/MM/YYYY")}
                  </p>
                </div>
                    <div className="bg-green-50 rounded-xl p-3 md:p-4 inline-block text-left">
                      <p className="text-sm md:text-base text-gray-700">Từ</p>
                      <p className="text-xl md:text-3xl font-bold text-green-600">
                    {dayjs(startTime).format("HH:mm")} →{" "}
                    {dayjs(endTime).format("HH:mm")}
                  </p>
                </div>
                    <div className="bg-orange-50 rounded-xl p-3 md:p-4 inline-block">
                      <p className="text-2xl md:text-4xl font-bold text-orange-600">
                    {duration.toFixed(1)} giờ
                  </p>
                </div>
              </div>
            </div>
          </div>

              <div className="border-t-4 border-dashed border-gray-300 my-6 md:my-10"></div>

          {/* BẢNG CHI TIẾT */}
              <h2 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8">
            CHI TIẾT ĐẶT PHÒNG
          </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm md:text-base min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                      <th className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-base">
                        Hạng mục
                      </th>
                      <th className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-base">
                        SL
                      </th>
                      <th className="py-3 md:py-4 px-3 md:px-6 text-right text-xs md:text-base">
                        Đơn giá
                      </th>
                      <th className="py-3 md:py-4 px-3 md:px-6 text-right font-bold text-xs md:text-base">
                        Thành tiền
                      </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-gray-200">
                      <td className="py-4 md:py-5 px-3 md:px-6 font-medium text-sm md:text-lg">
                  Thuê phòng "{studio.name}"
                </td>
                      <td className="py-4 md:py-5 px-3 md:px-6 text-center font-bold text-purple-600 text-sm md:text-base">
                  {duration.toFixed(1)} giờ
                </td>
                      <td className="py-4 md:py-5 px-3 md:px-6 text-right text-xs md:text-base">
                  {studio.basePricePerHour.toLocaleString()}₫/giờ
                </td>
                      <td className="py-4 md:py-5 px-3 md:px-6 text-right text-base md:text-xl font-bold text-purple-700">
                  {roomPrice.toLocaleString()}₫
                </td>
              </tr>
              {equipment.map((item, i) => (
                <tr key={i} className="border-b bg-gray-50">
                        <td className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-base">
                          → {item.name}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-base">
                    {item.quantity || 1}
                  </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-right text-xs md:text-base">
                    {item.pricePerHour.toLocaleString()}₫/giờ
                  </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-right font-semibold text-xs md:text-base">
                    {(
                      item.pricePerHour *
                      duration *
                      (item.quantity || 1)
                    ).toLocaleString()}
                    ₫
                  </td>
                </tr>
              ))}
              {services.map((item, i) => (
                <tr key={i} className="border-b bg-blue-50">
                        <td className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-base">
                          → {item.name}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-base">
                    {item.quantity || 1}
                  </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-right text-xs md:text-base">
                    {item.pricePerUse.toLocaleString()}₫
                  </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-right font-semibold text-xs md:text-base">
                    {item.pricePerUse.toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              </div>

          {/* TỔNG KẾT */}
              <div className="mt-6 md:mt-10 flex justify-end">
                <div className="w-full max-w-md space-y-3 md:space-y-4 text-base md:text-xl">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold">
                      {subtotal.toLocaleString()}₫
                </span>
              </div>
                  {promoId && discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold text-sm md:text-base">
                  <span className="flex items-center gap-2">
                        <GiftOutlined /> Mã giảm giá ({promoCode || promoId})
                  </span>
                  <span>-{discount.toLocaleString()}₫</span>
                </div>
              )}
                  <div className="border-t-4 border-purple-600 pt-3 md:pt-4">
                <div className="flex justify-between items-center">
                      <span className="text-xl md:text-3xl font-bold">
                        TỔNG CỘNG
                      </span>
                      <span className="text-3xl md:text-5xl font-extrabold text-purple-700">
                    {totalPrice.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

              <div className="text-center mt-8 md:mt-16 text-gray-600">
                <p className="text-lg md:text-2xl font-bold">
                  Cảm ơn quý khách đã tin tưởng!
                </p>
                <p className="text-sm md:text-lg">
              Hệ thống đặt phòng tự động • Hotline: 1900 9999
            </p>
              </div>

              {/* NÚT HÀNH ĐỘNG */}
              <div className="mt-8 mb-6 px-6 pb-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  size="large"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  className="no-print h-12"
                >
                  In hóa đơn
                </Button>
                <Button
                  type="primary"
                  size="large"
                  loading={bookingLoading}
                  icon={<CheckCircleOutlined />}
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none text-white font-bold no-print h-12 text-lg"
                >
                  Xác nhận & Thanh toán ngay
                </Button>
              </div>
            </div>
          </div>
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
