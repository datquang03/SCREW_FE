import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  message,
  Row,
  Col,
  Empty,
  Skeleton,
  Modal,
  Divider,
  Checkbox,
} from "antd";
import {
  ArrowLeftOutlined,
  GiftOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableEquipment } from "../../../features/equipment/equipmentSlice";
import { getActiveServices } from "../../../features/service/serviceSlice";
import {
  setBookingDetails,
  applyPromo,
  removePromo,
} from "../../../features/booking/bookingSlice";
import { applyPromotionCode } from "../../../features/promotion/promotionSlice";

const { Title, Text, Paragraph } = Typography;

export default function BookingStudioDetails({ onNext, onBack }) {
  const dispatch = useDispatch();
  const { currentStudio: studio } = useSelector((state) => state.studio);
  const draft = useSelector((state) => state.booking.draft);
  const { availableEquipments = [], loading: equipmentLoading } = useSelector(
    (state) => state.equipment
  );
  const { services = [], loading: serviceLoading } = useSelector(
    (state) => state.service
  );

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { startTime, endTime, details = [], promoId } = draft;

  const duration =
    startTime && endTime
      ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
      : 0;

  const roomPrice = (studio?.basePricePerHour || 0) * duration;

  const equipmentPrice = details.reduce((sum, item) => {
    const eq = availableEquipments.find((e) => e._id === item.equipmentId);
    return (
      sum +
      (eq?.pricePerHour || item.pricePerHour || 0) *
        duration *
        (item.quantity || 1)
    );
  }, 0);

  const servicePrice = details.reduce((sum, item) => {
    if (item.detailType === "extra_service") {
      const svc = services.find((s) => s._id === item.extraServiceId);
      return sum + (svc?.pricePerUse || item.pricePerUse || 0);
    }
    return sum;
  }, 0);

  useEffect(() => {
    if (studio?._id && startTime && endTime) {
      dispatch(
        getAvailableEquipment({ studioId: studio._id, startTime, endTime })
      );
    }
    dispatch(getActiveServices());
  }, [dispatch, studio?._id, startTime, endTime]);

  const handleSelectEquipment = (equipment) => {
    const exists = details.find((d) => d.equipmentId === equipment._id);
    if (exists) {
      const newDetails = details.filter((d) => d.equipmentId !== equipment._id);
      dispatch(setBookingDetails(newDetails));
      message.info(`Đã bỏ ${equipment.name}`);
    } else {
      const newDetails = [
        ...details.filter((d) => d.detailType !== "equipment"),
        {
          detailType: "equipment",
          equipmentId: equipment._id,
          name: equipment.name,
          pricePerHour: equipment.pricePerHour,
          quantity: 1,
        },
      ];
      dispatch(setBookingDetails(newDetails));
      message.success(`Đã chọn ${equipment.name}`);
    }
  };

  const handleServiceChange = (checked, service) => {
    let newDetails = [...details];
    if (checked) {
      newDetails.push({
        detailType: "extra_service",
        extraServiceId: service._id,
        name: service.name,
        pricePerUse: service.pricePerUse,
        quantity: 1,
      });
      message.success(`Đã chọn ${service.name}`);
    } else {
      newDetails = newDetails.filter((d) => d.extraServiceId !== service._id);
      message.info(`Đã bỏ ${service.name}`);
    }
    dispatch(setBookingDetails(newDetails));
  };

  const totalPrice = roomPrice + equipmentPrice + servicePrice;
  const finalPrice = totalPrice - discountAmount;

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return message.warning("Vui lòng nhập mã giảm giá!");
    if (totalPrice <= 0) return message.warning("Tổng tiền không hợp lệ!");

    try {
      setApplyingPromo(true);
      const result = await dispatch(
        applyPromotionCode({ code, subtotal: totalPrice })
      ).unwrap();

      const discount = result.discountAmount || result.discount || 0;
      setDiscountAmount(discount);
      setAppliedPromotion(result.promotion || result);

      dispatch(
        applyPromo({
          promoId: result._id || result.id || result.promotion?._id,
          promoCode: code,
          discountAmount: discount,
        })
      );

      message.success(`Áp dụng thành công!`);
      setPromoCode("");
    } catch (err) {
      message.error(err?.message || "Mã giảm giá không hợp lệ!");
      setDiscountAmount(0);
      setAppliedPromotion(null);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedPromotion(null);
    setPromoCode("");
    dispatch(removePromo());
    message.info("Đã xóa mã giảm giá");
  };

  const formatTime = (iso) =>
    iso ? dayjs(iso).format("HH:mm - DD/MM/YYYY") : "...";

  const scrollRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const gap = 32;

  const updateVisibleCount = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) setVisibleCount(1);
    else if (w < 1024) setVisibleCount(2);
    else setVisibleCount(3);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  const scrollByOne = (dir = "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.floor(el.clientWidth / visibleCount) + gap;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-12 py-10 px-4"
    >
      {/* HEADER: Midnight Navy Luxury */}
      <div className="bg-[#0F172A] border border-[#C5A267]/20 p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A267]/5 rounded-full -mr-32 -mt-32"></div>
        <Row align="middle" gutter={[32, 32]}>
          <Col xs={24} md={16}>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
              Lựa chọn dịch vụ
            </p>
            <Title
              level={2}
              className="!text-white !text-4xl !font-semibold !mb-6"
            >
              {studio?.name || "Studio không gian chuyên nghiệp"}
            </Title>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <ClockCircleOutlined className="text-[#C5A267]" />
                <span className="text-xs uppercase tracking-widest">
                  {formatTime(startTime)} → {formatTime(endTime)}
                </span>
              </div>
              <span className="bg-[#C5A267]/10 text-[#C5A267] px-4 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#C5A267]/20">
                {duration.toFixed(1)} GIỜ THUÊ
              </span>
            </div>
          </Col>
          <Col xs={24} md={8} className="md:text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2">
              Tiền thuê phòng
            </p>
            <p className="text-4xl font-semibold text-white">
              {roomPrice.toLocaleString()}₫
            </p>
          </Col>
        </Row>
      </div>

      {/* THIẾT BỊ SLIDER */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">
              Thiết bị bổ trợ
            </h3>
            <p className="text-2xl font-semibold text-[#0F172A]">
              Trang thiết bị chuyên nghiệp
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => scrollByOne("prev")}
              icon={<ArrowLeftOutlined />}
              className="!rounded-none !border-slate-100 hover:!border-[#C5A267]"
            />
            <Button
              onClick={() => scrollByOne("next")}
              icon={<ArrowRightOutlined />}
              className="!rounded-none !border-slate-100 hover:!border-[#C5A267]"
            />
          </div>
        </div>

        {equipmentLoading ? (
          <Skeleton active />
        ) : availableEquipments.length === 0 ? (
          <Empty description="Không có thiết bị" />
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide py-4 px-2"
          >
            {availableEquipments.map((eq) => {
              const isSelected = details.some((d) => d.equipmentId === eq._id);
              return (
                <div
                  key={eq._id}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`flex-shrink-0 w-[300px] bg-white border border-slate-100 group cursor-pointer transition-all duration-500 relative ${
                    isSelected
                      ? "shadow-2xl shadow-[#C5A267]/10 !border-[#C5A267]/50"
                      : "hover:shadow-xl"
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden transition-all duration-700">
                    <img
                      src={eq.image || "/placeholder.jpg"}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-[#C5A267] text-white p-2 shadow-xl">
                      <CheckOutlined />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <h4 className="font-semibold text-lg text-[#0F172A] leading-tight">
                      {eq.name}
                    </h4>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        {(eq.pricePerHour / 1000)}K / GIỜ
                      </span>
                      <span className="text-sm font-bold text-[#C5A267]">
                        {Math.round(eq.pricePerHour * duration).toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* DỊCH VỤ DẠNG GRID */}
      <section className="space-y-8">
        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">
          Dịch vụ đặc quyền
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => {
            const isSelected = details.some(
              (d) => d.extraServiceId === svc._id
            );
            return (
              <div
                key={svc._id}
                onClick={() => handleServiceChange(!isSelected, svc)}
                className={`p-8 bg-white border border-slate-100 transition-all duration-500 cursor-pointer flex justify-between items-center group ${
                  isSelected
                    ? "shadow-xl !border-[#C5A267]/30 bg-[#F8F6F3]"
                    : "hover:border-slate-300"
                }`}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold text-xl text-[#0F172A]">
                    {svc.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xs">
                    {svc.description}
                  </p>
                  <p className="text-[#C5A267] font-bold tracking-widest text-xs mt-4">
                    {svc.pricePerUse.toLocaleString()}₫ / LẦN
                  </p>
                </div>
                <div
                  className={`w-8 h-8 flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-[#0F172A] border-[#0F172A] text-[#C5A267]"
                      : "border-slate-200 group-hover:border-[#C5A267]"
                  }`}
                >
                  {isSelected && <CheckOutlined />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROMO & TOTAL */}
      <div className="grid lg:grid-cols-12 gap-12 pt-12 border-t border-slate-100">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
            Mã ưu đãi
          </h3>
          {!appliedPromotion ? (
            <div className="flex bg-[#F8F9FA] p-1">
              <Input
                placeholder="NHẬP MÃ GIẢM GIÁ..."
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="!bg-transparent !border-none !shadow-none !text-[10px] !tracking-[0.2em] !font-bold"
              />
              <Button
                onClick={handleApplyPromo}
                loading={applyingPromo}
                className="!bg-[#0F172A] !text-white !rounded-none !h-12 !px-8 !text-[10px] !uppercase !tracking-widest !border-none"
              >
                Áp dụng
              </Button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-1">
                  Mã đã áp dụng
                </p>
                <p className="font-semibold text-lg">
                  {appliedPromotion.code || promoId}
                </p>
              </div>
              <Button
                type="text"
                onClick={handleRemovePromo}
                className="!text-rose-500 !text-[10px] !uppercase !tracking-widest !font-bold"
              >
                Gỡ bỏ
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#0F172A] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
            <div className="space-y-6 text-white">
              <div className="flex justify-between items-center opacity-50">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Tổng cộng tạm tính
                </span>
                <span className="text-lg font-light tracking-tighter">
                  {totalPrice.toLocaleString()}₫
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Chiết khấu ưu đãi
                  </span>
                  <span className="text-lg font-semibold">
                    -{discountAmount.toLocaleString()}₫
                  </span>
                </div>
              )}
              <div className="h-px bg-white/10 my-6"></div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-2">
                    Thành tiền cuối cùng
                  </h3>
                  <p className="text-5xl font-semibold text-white">
                    {finalPrice.toLocaleString()}₫
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between pt-10">
        <Button
          onClick={onBack}
          className="!h-14 !px-10 !rounded-none !border-slate-200 !text-[10px] !uppercase !tracking-widest !font-bold hover:!border-[#C5A267]"
        >
          Quay lại
        </Button>
        <Button
          onClick={onNext}
          className="!h-16 !px-16 !bg-[#0F172A] hover:!bg-[#C5A267] !text-white !rounded-none !border-none !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
        >
          Tiếp tục thanh toán
          <ArrowRightOutlined className="ml-4 text-xs" />
        </Button>
      </div>

      {/* EQUIPMENT DETAIL MODAL */}
      <Modal
        open={!!selectedEquipment}
        onCancel={() => setSelectedEquipment(null)}
        footer={null}
        width={1000}
        centered
        className="executive-modal"
      >
        {selectedEquipment && (
          <div className="grid lg:grid-cols-2 gap-12 p-6">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={selectedEquipment.image || "/placeholder.jpg"}
                alt={selectedEquipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-8 flex flex-col justify-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
                  Chi tiết thiết bị
                </p>
                <Title
                  level={2}
                  className="!text-4xl !font-semibold"
                >
                  {selectedEquipment.name}
                </Title>
              </div>
              <Paragraph className="text-slate-400 font-light leading-relaxed">
                {selectedEquipment.description}
              </Paragraph>
              <div className="py-8 border-y border-slate-100 flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Chi phí thuê
                </span>
                <span className="text-3xl font-semibold text-[#0F172A]">
                  {(selectedEquipment.pricePerHour * duration).toLocaleString()}₫
                </span>
              </div>
              <Button
                block
                className={`!h-16 !rounded-none !text-[10px] !uppercase !tracking-[0.2em] !font-bold transition-all ${
                  details.some((d) => d.equipmentId === selectedEquipment._id)
                    ? "!bg-rose-500 !text-white !border-none"
                    : "!bg-[#0F172A] !text-white !border-none hover:!bg-[#C5A267]"
                }`}
                onClick={() => {
                  handleSelectEquipment(selectedEquipment);
                  setSelectedEquipment(null);
                }}
              >
                {details.some((d) => d.equipmentId === selectedEquipment._id)
                  ? "Bỏ chọn thiết bị"
                  : "Xác nhận chọn thiết bị"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
