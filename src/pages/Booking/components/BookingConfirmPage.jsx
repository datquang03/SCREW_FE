import React, { useRef, useState } from "react";
import { Button, message, Skeleton, Card, Modal, Typography, Divider } from "antd";
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
import SafetyCertificateOutlined from "@ant-design/icons/SafetyCertificateOutlined";
import ArrowRightOutlined from "@ant-design/icons/ArrowRightOutlined";

const { Title, Text, Paragraph } = Typography;

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
  const discount = discountAmount || 0;
  const totalPrice = subtotal - discount;

  const invoiceId = `INV-${dayjs().format("YYMMDD")}-${String(
    Math.floor(Math.random() * 1000)
  ).padStart(3, "0")}`;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `HoaDon_${(studio?.name || "studio").replace(/\s/g, "_")}`,
    pageStyle: "@page { size: A4; margin: 15mm; }",
  });

  const handleConfirm = async () => {
    if (!draft) return message.error("Không có thông tin booking.");

    const payload = {
      studioId: draft.studioId,
      startTime: draft.startTime,
      endTime: draft.endTime,
      ...(details.length > 0 && { details }),
      ...(promoId && { promoId }),
    };

    try {
      const result = await dispatch(createBooking(payload)).unwrap();
      try {
        localStorage.setItem("latestBooking", JSON.stringify(result));
      } catch (e) {}

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        if (onSuccess) onSuccess(result);
      }, 2000);
    } catch (err) {
      message.error(err?.message || "Đặt phòng thất bại!");
    }
  };

  if (studioLoading || !studio) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton active title={{ width: 300 }} paragraph={{ rows: 1 }} />
          <Skeleton.Button active block style={{ height: 600 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA] flex flex-col items-center py-12 px-4 selection:bg-[#C5A267]/20">
      {/* EXECUTIVE HEADER */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="!text-slate-400 hover:!text-[#0F172A] !text-[10px] !uppercase !tracking-widest !font-bold"
        >
          Quay lại
        </Button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-2">
            Bước 04
          </p>
          <h2 className="text-2xl font-semibold text-[#0F172A] m-0">
            Xác nhận chi tiết
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      {/* INVOICE CONTAINER */}
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden rounded-sm"
        >
          <div ref={printRef} className="bg-white p-12 md:p-16">
            {/* INVOICE TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-slate-50 pb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F172A] flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">S+</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#0F172A]">
                    Studio
                  </span>
                </div>
                <Title
                  level={1}
                  className="!text-4xl !font-semibold !m-0 !text-[#0F172A]"
                >
                  Hóa đơn dịch vụ
                </Title>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-2">
                  Mã vận đơn: {invoiceId}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold mb-1">
                  Ngày khởi tạo
                </p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {dayjs().format("DD MMMM, YYYY")}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {dayjs().format("HH:mm")}
                </p>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-2 gap-16 mb-16">
              {/* STUDIO INFO */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ShopOutlined className="text-[#C5A267]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    Địa điểm thực hiện
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                    {studio.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    {studio.location || studio.address || "TP. Hồ Chí Minh, Vietnam"}
                  </p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      Hotline:
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      0909 888 999
                    </span>
                  </div>
                </div>
              </div>

              {/* SCHEDULE INFO */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-[#C5A267]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    Lịch trình sử dụng
                  </span>
                </div>
                <div className="bg-[#F8F6F3] p-8 border border-[#C5A267]/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold block mb-1">
                        Ngày nhận phòng
                      </span>
                      <span className="text-base font-bold text-[#0F172A]">
                        {dayjs(startTime).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold block mb-1">
                        Thời lượng
                      </span>
                      <span className="text-base font-bold text-[#0F172A]">
                        {duration.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#C5A267]/10">
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold block mb-1">
                      Khung giờ vàng
                    </span>
                    <span className="text-lg font-bold text-[#0F172A] tracking-widest">
                      {dayjs(startTime).format("HH:mm")} —{" "}
                      {dayjs(endTime).format("HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ITEM TABLE */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <SafetyCertificateOutlined className="text-[#C5A267]" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Chi tiết chi phí niêm yết
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        Mô tả hạng mục
                      </th>
                      <th className="pb-4 text-center text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        Đơn vị
                      </th>
                      <th className="pb-4 text-right text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        Đơn giá
                      </th>
                      <th className="pb-4 text-right text-[9px] uppercase tracking-widest font-bold text-[#0F172A]">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-6">
                        <span className="text-sm font-bold text-[#0F172A]">
                          Thuê Không gian Studio
                        </span>
                      </td>
                      <td className="py-6 text-center text-xs text-slate-500">
                        {duration}h
                      </td>
                      <td className="py-6 text-right text-xs text-slate-500">
                        {studio.basePricePerHour?.toLocaleString()}₫
                      </td>
                      <td className="py-6 text-right text-sm font-bold text-[#0F172A]">
                        {roomPrice?.toLocaleString()}₫
                      </td>
                    </tr>
                    {[...equipment, ...services].map((item, i) => (
                      <tr key={i}>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-[#C5A267] rounded-full"></div>
                            <span className="text-xs text-slate-500 font-light">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 text-center text-xs text-slate-400">
                          {item.quantity}
                        </td>
                        <td className="py-5 text-right text-xs text-slate-400">
                          {(item.pricePerHour || item.pricePerUse)?.toLocaleString()}₫
                        </td>
                        <td className="py-5 text-right text-xs font-bold text-slate-700">
                          {(item.detailType === "equipment"
                            ? item.pricePerHour * duration * item.quantity
                            : item.pricePerUse * item.quantity
                          )?.toLocaleString()}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUMMARY AREA */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-slate-100">
              <div className="max-w-xs">
                <p className="text-[10px] italic text-slate-400 leading-relaxed font-light">
                  * Quý khách vui lòng xác nhận các thông tin trên là chính xác
                  trước khi chuyển sang bước thanh toán. Mọi thay đổi sau khi xác
                  nhận sẽ áp dụng theo chính sách của Studio.
                </p>
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between text-xs text-slate-400 uppercase tracking-widest">
                  <span>Giá tạm tính</span>
                  <span className="font-bold">{subtotal.toLocaleString()}₫</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-[#C5A267] uppercase tracking-widest font-bold">
                    <span>Chiết khấu (Promo)</span>
                    <span>-{discount.toLocaleString()}₫</span>
                  </div>
                )}
                <div className="h-px bg-slate-100 my-6"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#0F172A]">
                    Tổng thanh toán
                  </span>
                  <span className="text-4xl font-semibold text-[#C5A267]">
                    {totalPrice.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-12 justify-center">
          <Button
            onClick={handlePrint}
            className="!h-16 !px-12 !rounded-none !border-slate-200 !text-[10px] !uppercase !tracking-widest !font-bold hover:!border-[#0F172A] !transition-all"
          >
            <PrinterOutlined className="mr-2" />
            Trích xuất hóa đơn
          </Button>
          <Button
            type="primary"
            loading={bookingLoading}
            onClick={handleConfirm}
            className="!h-16 !px-16 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !rounded-none !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
          >
            Xác nhận & Thanh toán
            <ArrowRightOutlined className="ml-4 text-xs" />
          </Button>
        </div>

        {/* REFINED SUCCESS MODAL */}
        <Modal
          open={showSuccessModal}
          footer={null}
          closable={false}
          centered
          width={500}
          className="executive-modal"
        >
          <div className="text-center py-12 px-8">
            <div className="w-20 h-20 mx-auto mb-8 bg-[#0F172A] flex items-center justify-center rounded-full shadow-2xl">
              <CheckCircleOutlined className="text-[#C5A267] text-3xl" />
            </div>
            <h2 className="text-3xl font-semibold text-[#0F172A] mb-4">
              Hoàn tất xác nhận
            </h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              Hệ thống đang chuyển hướng bạn đến cổng thanh toán...
            </p>
            <div className="h-0.5 bg-slate-100 w-full mt-10 relative overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[#C5A267]"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
