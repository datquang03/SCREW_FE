// src/pages/Booking/components/BookingConfirmPage.jsx
import React, { useRef } from "react";
import { Button, message, Spin } from "antd";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { createBooking } from "../../../features/booking/bookingSlice";

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

  const { currentStudio: studio, loading: studioLoading } = useSelector(
    (state) => state.studio
  );
  const { draft, loading: bookingLoading } = useSelector(
    (state) => state.booking
  );

  const { startTime, endTime, details = [], promoId } = draft || {};

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
  const discount = promoId ? 100000 : 0; // tạm giả lập
  const totalPrice = roomPrice + equipmentPrice + servicePrice - discount;

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

      message.success("Đặt phòng thành công! Đang chuyển sang thanh toán...");

      if (onSuccess) onSuccess(result); // trả kết quả cho StudioBookingPage
    } catch (err) {
      message.error(err?.message || "Đặt phòng thất bại, vui lòng thử lại!");
    }
  };

  if (studioLoading || !studio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang chuẩn bị hóa đơn..." />
      </div>
    );
  }

  return (
    <>
      {/* NÚT ĐIỀU KHIỂN */}
      <div className="max-w-4xl mx-auto my-8 px-4 no-print">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>
            Quay lại chỉnh sửa
          </Button>
          <div className="flex gap-3">
            <Button
              size="large"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              In hóa đơn
            </Button>
            <Button
              type="primary"
              size="large"
              loading={bookingLoading}
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none text-white font-bold"
            >
              Xác nhận & Thanh toán ngay
            </Button>
          </div>
        </div>
      </div>
      {/* HÓA ĐƠN IN */}
      <div ref={printRef} className="max-w-4xl mx-auto bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 text-white py-10 px-12 text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-bold text-purple-600">S</span>
          </div>
          <h1 className="text-5xl font-bold mb-2">HÓA ĐƠN ĐẶT PHÒNG</h1>
          <p className="text-2xl font-bold mt-4">{invoiceId}</p>
        </div>

        <div className="p-12">
          {/* THÔNG TIN STUDIO & THỜI GIAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <ShopOutlined className="text-purple-600" /> STUDIO
              </h3>
              <p className="text-xl font-semibold">{studio.name}</p>
              <p className="text-gray-600">
                {studio.address || "123 Đường Sáng Tạo, Q.1, TP.HCM"}
              </p>
              <p className="text-gray-600">Hotline: 0909 888 999</p>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold flex items-center justify-end gap-3 mb-4">
                <CalendarOutlined className="text-blue-600" /> THỜI GIAN
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4 inline-block">
                  <p className="text-3xl font-bold text-blue-600">
                    {dayjs(startTime).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 inline-block text-left">
                  <p className="text-gray-700">Từ</p>
                  <p className="text-3xl font-bold text-green-600">
                    {dayjs(startTime).format("HH:mm")} →{" "}
                    {dayjs(endTime).format("HH:mm")}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 inline-block">
                  <p className="text-4xl font-bold text-orange-600">
                    {duration.toFixed(1)} giờ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-4 border-dashed border-gray-300 my-10"></div>

          {/* BẢNG CHI TIẾT */}
          <h2 className="text-3xl font-bold text-center mb-8">
            CHI TIẾT ĐẶT PHÒNG
          </h2>
          <table className="w-full text-left border-collapse text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6">Hạng mục</th>
                <th className="py-4 px-6 text-center">SL</th>
                <th className="py-4 px-6 text-right">Đơn giá</th>
                <th className="py-4 px-6 text-right font-bold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-gray-200">
                <td className="py-5 px-6 font-medium text-lg">
                  Thuê phòng "{studio.name}"
                </td>
                <td className="py-5 px-6 text-center font-bold text-purple-600">
                  {duration.toFixed(1)} giờ
                </td>
                <td className="py-5 px-6 text-right">
                  {studio.basePricePerHour.toLocaleString()}₫/giờ
                </td>
                <td className="py-5 px-6 text-right text-xl font-bold text-purple-700">
                  {roomPrice.toLocaleString()}₫
                </td>
              </tr>
              {equipment.map((item, i) => (
                <tr key={i} className="border-b bg-gray-50">
                  <td className="py-4 px-6">→ {item.name}</td>
                  <td className="py-4 px-6 text-center">
                    {item.quantity || 1}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.pricePerHour.toLocaleString()}₫/giờ
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">
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
                  <td className="py-4 px-6">→ {item.name}</td>
                  <td className="py-4 px-6 text-center">
                    {item.quantity || 1}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.pricePerUse.toLocaleString()}₫
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">
                    {item.pricePerUse.toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TỔNG KẾT */}
          <div className="mt-10 flex justify-end">
            <div className="w-full max-w-md space-y-4 text-xl">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold">
                  {(roomPrice + equipmentPrice + servicePrice).toLocaleString()}
                  ₫
                </span>
              </div>
              {promoId && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span className="flex items-center gap-2">
                    <GiftOutlined /> Mã giảm giá ({promoId})
                  </span>
                  <span>-{discount.toLocaleString()}₫</span>
                </div>
              )}
              <div className="border-t-4 border-purple-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">TỔNG CỘNG</span>
                  <span className="text-5xl font-extrabold text-purple-700">
                    {totalPrice.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 text-gray-600">
            <p className="text-2xl font-bold">Cảm ơn quý khách đã tin tưởng!</p>
            <p className="text-lg">
              Hệ thống đặt phòng tự động • Hotline: 1900 9999
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
