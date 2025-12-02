// src/pages/Booking/components/BookingStudioDetails.jsx
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
  Spin,
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

const { Title, Text } = Typography;

export default function BookingStudioDetails({ onNext, onBack }) {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux
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

  // Lấy từ Redux draft
  const { startTime, endTime, details = [], promoId } = draft;

  const duration =
    startTime && endTime
      ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
      : 0;

  // Tính giá
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

  // Load dữ liệu khi vào bước này
  useEffect(() => {
    if (studio?._id && startTime && endTime) {
      dispatch(
        getAvailableEquipment({
          studioId: studio._id,
          startTime,
          endTime,
        })
      );
    }
    dispatch(getActiveServices());
  }, [dispatch, studio?._id, startTime, endTime]);

  // Khi chọn thiết bị
  const handleSelectEquipment = (equipment) => {
    const exists = details.find((d) => d.equipmentId === equipment._id);

    if (exists) {
      // Bỏ chọn
      const newDetails = details.filter((d) => d.equipmentId !== equipment._id);
      dispatch(setBookingDetails(newDetails));
      message.info(`Đã bỏ ${equipment.name}`);
    } else {
      // Thêm mới (ghi đè các thiết bị trước cùng loại)
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

  // Khi chọn dịch vụ
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
      message.success(`Đã chọn dịch vụ ${service.name}`);
    } else {
      newDetails = newDetails.filter((d) => d.extraServiceId !== service._id);
      message.info(`Đã bỏ dịch vụ ${service.name}`);
    }

    dispatch(setBookingDetails(newDetails));
  };

  // Tính lại totalPrice khi có thay đổi
  const totalPrice = roomPrice + equipmentPrice + servicePrice;
  const finalPrice = totalPrice - discountAmount;

  // Áp dụng mã giảm giá với API thật
  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      message.warning("Vui lòng nhập mã giảm giá!");
      return;
    }

    if (totalPrice <= 0) {
      message.warning("Tổng tiền phải lớn hơn 0 để áp dụng mã giảm giá!");
      return;
    }

    try {
      setApplyingPromo(true);
      const result = await dispatch(
        applyPromotionCode({ code, subtotal: totalPrice })
      ).unwrap();

      // result có thể chứa: { discountAmount, promotion, ... }
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
      message.success(`Áp dụng mã ${code} thành công! Giảm ${discount.toLocaleString()}₫`);
      setPromoCode("");
    } catch (err) {
      message.error(err?.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn!");
      setDiscountAmount(0);
      setAppliedPromotion(null);
    } finally {
      setApplyingPromo(false);
    }
  };

  // Xóa mã giảm giá
  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedPromotion(null);
    setPromoCode("");
    dispatch(removePromo());
    message.info("Đã xóa mã giảm giá");
  };

  const formatTime = (iso) =>
    iso ? dayjs(iso).format("HH:mm - dddd, DD/MM/YYYY") : "...";

  // ------------- Custom horizontal slider logic -------------
  const scrollRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const gap = 24; // px gap between cards
  const cardMinWidth = 260; // min width for each card

  const updateVisibleCount = useCallback(() => {
    const w = window.innerWidth;
    // breakpoints similar to previous behavior
    if (w < 640) setVisibleCount(1);
    else if (w < 768) setVisibleCount(2);
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
    // compute scroll amount by container width / visibleCount + gap
    const amount = Math.floor(el.clientWidth / visibleCount) + gap;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  // Optional: keyboard navigation for better accessibility
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") scrollByOne("next");
      if (e.key === "ArrowLeft") scrollByOne("prev");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visibleCount]);

  // ensure scroll snaps nicely on mouse up / touch end
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e) => {
      isDown = true;
      el.classList.add("grabbed");
      startX = e.pageX ?? e.touches?.[0]?.pageX;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = e.pageX ?? e.touches?.[0]?.pageX;
      const walk = startX - x;
      el.scrollLeft = scrollLeft + walk;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("grabbed");
      // snap to nearest card (approx)
      const cardWidth = Math.floor(el.clientWidth / visibleCount) + gap;
      const idx = Math.round(el.scrollLeft / cardWidth);
      el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [visibleCount, gap]);

  // -----------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8 py-6"
    >
      {/* HEADER */}
      <Card className="shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl overflow-hidden">
        <Row align="middle" justify="space-between" className="p-6">
          <Col xs={24} md={14}>
            <Title level={2} className="text-white mb-2">
              {studio?.name || "Studio"}
            </Title>
            <Space size="large" className="text-white">
              <Text strong className="text-lg">
                {formatTime(startTime)} → {formatTime(endTime)}
              </Text>
              <Tag
                color="white"
                className="text-purple-700 text-lg font-bold px-4 py-1"
              >
                {duration.toFixed(1)} giờ
              </Tag>
            </Space>
          </Col>
          <Col xs={24} md={10} className="text-right mt-4 md:mt-0">
            <Text className="block text-xl opacity-90">Tiền thuê phòng</Text>
            <Title level={1} className="m-0 text-white text-4xl">
              {roomPrice.toLocaleString()}₫
            </Title>
          </Col>
        </Row>
      </Card>

      {/* THIẾT BỊ - CUSTOM HORIZONTAL SLIDER */}
      <Card title="Chọn thiết bị bổ sung" className="shadow-xl border-0">
        {equipmentLoading ? (
          <div className="text-center py-20">
            <Spin size="large" />
          </div>
        ) : availableEquipments.length === 0 ? (
          <Empty description="Không có thiết bị nào khả dụng" />
        ) : (
          <div className="relative">
            {/* Prev button */}
            <button
              aria-label="Prev equipment"
              onClick={() => scrollByOne("prev")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftOutlined />
            </button>

            {/* scroll container */}
            <div
              ref={scrollRef}
              id="equipScroll"
              className="flex gap-6 overflow-x-auto px-14 py-4 scrollbar-hide touch-pan-x"
              style={{ scrollBehavior: "smooth" }}
            >
              {availableEquipments.map((eq) => {
                const isSelected = details.some(
                  (d) => d.equipmentId === eq._id
                );
                const priceForDuration = Math.round(eq.pricePerHour * duration);

                return (
                  <div
                    key={eq._id}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`min-w-[260px] max-w-[320px] h-full bg-white rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                      isSelected
                        ? "border-blue-500 shadow-2xl ring-4 ring-blue-100"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-xl"
                    }`}
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={eq.image || "/placeholder-equipment.jpg"}
                        alt={eq.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <div className="bg-white rounded-full p-4 shadow-2xl">
                            <CheckOutlined className="text-5xl text-blue-600" />
                          </div>
                        </div>
                      )}
                      <Tag
                        color={eq.availableQty > 0 ? "green" : "red"}
                        className="absolute bottom-3 left-3 font-bold"
                      >
                        Còn {eq.availableQty}
                      </Tag>
                    </div>

                    <div className="p-5">
                      <Text strong className="block text-center text-lg">
                        {eq.name}
                      </Text>
                      <div className="mt-4 flex justify-between items-center">
                        <Tag color="green" icon={<ClockCircleOutlined />}>
                          {(eq.pricePerHour / 1000).toLocaleString()}k/giờ
                        </Tag>
                        <Text strong className="text-blue-600 text-lg">
                          {priceForDuration.toLocaleString()}₫
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next button */}
            <button
              aria-label="Next equipment"
              onClick={() => scrollByOne("next")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100"
            >
              <ArrowRightOutlined />
            </button>
          </div>
        )}
      </Card>

      {/* DỊCH VỤ */}
      <Card title="Dịch vụ bổ sung" className="shadow-xl border-0">
        {serviceLoading ? (
          <Spin className="block my-10" />
        ) : services.length === 0 ? (
          <Empty description="Không có dịch vụ nào" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc) => {
              const isSelected = details.some(
                (d) => d.extraServiceId === svc._id
              );
              return (
                <div
                  key={svc._id}
                  onClick={() => handleServiceChange(!isSelected, svc)}
                  className={`border rounded-2xl p-5 bg-white cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? "border-blue-500 shadow-xl ring-2 ring-blue-100"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-bold">{svc.name}</h3>
                      <p className="text-gray-600 mt-1">{svc.description}</p>
                      <p className="mt-3 text-xl font-bold text-blue-600">
                        {svc.pricePerUse.toLocaleString()}₫
                      </p>
                    </div>
                    <Checkbox checked={isSelected} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODAL CHI TIẾT THIẾT BỊ */}
      <Modal
        open={!!selectedEquipment}
        onCancel={() => setSelectedEquipment(null)}
        footer={null}
        width={900}
        centered
      >
        {selectedEquipment && (
          <div className="grid lg:grid-cols-2 gap-10">
            <img
              src={selectedEquipment.image || "/placeholder.jpg"}
              alt={selectedEquipment.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
            <div className="space-y-6">
              <Title level={2}>{selectedEquipment.name}</Title>
              <Text className="text-lg block">
                {selectedEquipment.description}
              </Text>
              <Divider />
              <div className="text-lg">
                <Text>Giá thuê/giờ: </Text>
                <Text strong className="text-blue-600">
                  {selectedEquipment.pricePerHour.toLocaleString()}₫
                </Text>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                Tổng:{" "}
                {(selectedEquipment.pricePerHour * duration).toLocaleString()}₫
              </div>
              <Button
                type="primary"
                size="large"
                block
                className="h-16 text-xl"
                onClick={() => {
                  handleSelectEquipment(selectedEquipment);
                  setSelectedEquipment(null);
                }}
              >
                {details.some((d) => d.equipmentId === selectedEquipment._id)
                  ? "Bỏ chọn thiết bị"
                  : "Chọn thiết bị này"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MÃ GIẢM GIÁ */}
      <Card title="Mã giảm giá">
        {!appliedPromotion ? (
        <Space.Compact className="w-full">
          <Input
            placeholder="Nhập mã giảm giá..."
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            prefix={<GiftOutlined />}
            size="large"
            onPressEnter={handleApplyPromo}
              disabled={applyingPromo}
          />
            <Button
              type="primary"
              size="large"
              onClick={handleApplyPromo}
              loading={applyingPromo}
            >
            Áp dụng
          </Button>
        </Space.Compact>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div>
                <Tag color="green" className="text-lg px-3 py-1 mb-2">
                  {appliedPromotion.code || promoId}
          </Tag>
                <div className="text-green-700 font-semibold">
                  Giảm {discountAmount.toLocaleString()}₫
                </div>
              </div>
              <Button
                type="text"
                danger
                onClick={handleRemovePromo}
                size="small"
              >
                Xóa
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* TỔNG TIỀN */}
      <Card className="bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-3xl p-8">
        <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="text-white mb-0">
              Tổng thanh toán
            </Title>
              <Text className="opacity-90 block mt-2">
              {details.length > 0
                ? `${details.filter((d) => d.detailType === "equipment").length} thiết bị + ${details.filter(
                    (d) => d.detailType === "extra_service"
                  ).length} dịch vụ`
                : "Chưa chọn thêm"}
            </Text>
          </div>
          </div>

          <Divider className="bg-white/30 my-4" />

          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg">
              <Text className="opacity-90">Tổng tiền:</Text>
              <Text className="font-semibold">{totalPrice.toLocaleString()}₫</Text>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-lg">
                <Text className="opacity-90">Giảm giá:</Text>
                <Text className="font-semibold text-green-300">
                  -{discountAmount.toLocaleString()}₫
                </Text>
              </div>
            )}
          </div>

          <Divider className="bg-white/30 my-4" />

          <div className="flex justify-between items-center">
            <Text className="text-xl opacity-90">Thành tiền:</Text>
            <Title level={1} className="text-white text-5xl font-bold m-0">
              {finalPrice.toLocaleString()}₫
          </Title>
          </div>
        </div>
      </Card>

      {/* NÚT ĐIỀU HƯỚNG */}
      <div className="flex justify-between pt-6">
        <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>

        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          className="px-12 text-xl font-bold rounded-xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            border: "none",
          }}
          onClick={onNext}
        >
          Tiếp tục thanh toán
        </Button>
      </div>
    </motion.div>
  );
}
