// src/pages/Booking/components/BookingPaymentPage.jsx

import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tag,
  Divider,
  Spin,
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
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải hóa đơn...">
          <div className="w-0 h-0" />
        </Spin>
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
        result?.paymentUrl ||
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
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Card className="shadow-2xl rounded-3xl overflow-hidden border-0">
        {/* Header */}
        <div className="text-center py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CheckCircleOutlined className="text-8xl mb-4" />
          <Title level={1} className="text-white text-5xl font-bold mb-2">
            ĐẶT PHÒNG THÀNH CÔNG
          </Title>
          <Text className="text-xl opacity-90">
            Mã đặt phòng: <strong>{bookingId}</strong>
          </Text>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-10">
            {/* Thông tin chính */}
            <div className="space-y-8 md:col-span-2">
              <div>
                <Text strong className="text-lg text-gray-600">
                  Studio
                </Text>
                <Title level={2} className="mt-1 text-purple-700">
                  {currentStudio?.name || "Studio"}
                </Title>
              </div>

              {/* Bảng giá */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <Space direction="vertical" size="middle" className="w-full">
                  <div className="flex justify-between text-lg">
                    <span>Tạm tính</span>
                    <strong>{formatted(totalBeforeDiscount)}</strong>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-lg text-green-600 font-bold">
                      <span>Giảm giá</span>
                      <span>-{formatted(discountAmount)}</span>
                    </div>
                  )}
                  <Divider className="my-3" />
                  <div className="flex justify-between items-baseline">
                    <Title level={3} className="m-0 text-gray-700">
                      TỔNG CỘNG
                    </Title>
                    <Title
                      level={1}
                      className="m-0 text-purple-700 font-extrabold"
                    >
                      {formatted(finalAmount)}
                    </Title>
                  </div>
                </Space>
              </div>
            </div>
          </div>

          {/* Chính sách hủy & No-Show */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Hủy phòng */}
            <Card
              title={
                <>
                  <InfoCircleOutlined /> Chính sách hủy phòng
                </>
              }
              bordered={false}
              className="shadow-lg"
            >
              <Table
                dataSource={cancellationTiers}
                pagination={false}
                rowKey="_id"
                size="small"
                columns={[
                  {
                    title: "Thời gian hủy",
                    dataIndex: "hoursBeforeBooking",
                    render: (hours) =>
                      hours === 0 ? "Dưới 24 giờ" : `Trước ${hours} giờ`,
                  },
                  {
                    title: "Hoàn tiền",
                    dataIndex: "refundPercentage",
                    render: (pct) => (
                      <Tag
                        color={
                          pct === 100 ? "green" : pct === 50 ? "orange" : "red"
                        }
                      >
                        {pct}%
                      </Tag>
                    ),
                  },
                ]}
              />
            </Card>

            {/* No-Show */}
            <Card
              title={
                <>
                  <InfoCircleOutlined /> Chính sách không đến (No-Show)
                </>
              }
              bordered={false}
              className="shadow-lg"
            >
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Phạt:</strong> {noShowRules.chargePercentage || 100}%
                  tổng tiền
                </p>
                <p>
                  <strong>Thời gian ân hạn:</strong>{" "}
                  {noShowRules.graceMinutes || 15} phút
                </p>
                <p>
                  <strong>Số lần tha thứ tối đa:</strong>{" "}
                  {noShowRules.maxForgivenessCount || 1} lần
                </p>
              </div>
            </Card>
          </div>

          <Divider className="my-12" />

          {/* Nút hành động */}
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Button size="large" onClick={onBack}>
              Quay lại
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-12"
              loading={localLoading || paymentLoading}
              disabled={!bookingId}
              onClick={() => setIsModalVisible(true)}
            >
              Chọn mức thanh toán
            </Button>
          </div>

          <div className="text-center mt-8 text-gray-500">
            <Text type="secondary">
              Hệ thống tự động xác nhận sau vài phút • Hotline:{" "}
              <strong>0909 888 999</strong>
            </Text>
          </div>
        </div>
      </Card>

      {/* Modal chọn % */}
      <Modal
        title={
          <div className="text-center space-y-1">
            <Title level={4} className="mb-0">
              Chọn mức thanh toán trước
            </Title>
            <Text className="text-gray-500 text-sm">
              Số tiền sẽ được tính trên tổng giá trị đơn hiện tại.
            </Text>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          handlePayPercent(selectedPercent);
          setIsModalVisible(false);
        }}
        okText="Xác nhận thanh toán"
        cancelText="Hủy"
        width={560}
        bodyStyle={{ paddingTop: 8, paddingBottom: 16 }}
      >
        <Radio.Group
          value={selectedPercent}
          onChange={(e) => setSelectedPercent(e.target.value)}
          className="w-full"
        >
          {[30, 50, 100].map((p) => {
            const isActive = selectedPercent === p;
            const amount = (finalAmount * p) / 100;
            return (
              <Radio
                key={p}
                value={p}
                className={`flex justify-between items-center py-5 px-6 border-2 rounded-xl my-3 transition-all bg-white ${
                  isActive
                    ? "border-slate-900 shadow-md"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base text-slate-600">
                    Thanh toán trước
                  </span>
                  <span className="text-xl font-semibold text-slate-900">
                    {p}% giá trị đơn
                  </span>
                  {p === 30 && (
                    <Tag color="blue" className="w-fit mt-1">
                      Phổ biến
                    </Tag>
                  )}
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500">
                    Số tiền tạm tính
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatted(amount)}
                  </span>
                </div>
              </Radio>
            );
          })}
        </Radio.Group>
      </Modal>
    </div>
  );
}
