import React, { useState } from "react";
import { Card, Button, Typography, Space, Tag, Divider, Spin, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import { createPaymentWebHook } from "../../../features/payment/paymentSlice";


const { Title, Text } = Typography;

export default function BookingPaymentPage({ onBack, onPaymentSuccess }) {
  const dispatch = useDispatch();

  const draft = useSelector((state) => state.booking.draft);
  const currentBooking = useSelector((state) => state.booking.currentBooking);
  const studio = useSelector((state) => state.studio.currentStudio);
  const loading = useSelector((state) => state.payment.loading);

  const [localLoading, setLocalLoading] = useState(false);

  if (!currentBooking) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Spin size="large" className="mx-auto block" />
      </div>
    );
  }

  const totalPrice = currentBooking.totalPrice || 0;
  const orderCode = currentBooking.bookingId || "UNKNOWN_ORDER";

  const qrPlaceholder = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=PAYMENT_${orderCode}`;

  const handlePayment = async () => {
    setLocalLoading(true);
    try {
      const payload = {
        orderCode,
        amount: totalPrice,
        code: "00",
        desc: "OK",
      };

      const resultAction = await dispatch(createPaymentWebHook(payload));

      if (createPaymentWebHook.fulfilled.match(resultAction)) {
        message.success("Thanh toán thành công!");
        dispatch(resetPayment());
        onPaymentSuccess();
      } else {
        message.error(resultAction.payload?.message || "Thanh toán thất bại");
      }
    } catch (err) {
      message.error(err.message || "Có lỗi xảy ra khi thanh toán");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-2xl rounded-3xl overflow-hidden border-0">
        {/* Header */}
        <div className="text-center py-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CheckCircleOutlined className="text-7xl mb-4" />
          <Title level={1} className="text-white text-4xl font-bold mb-2">
            Đặt phòng thành công!
          </Title>
          <Text className="text-xl opacity-90">
            Vui lòng thanh toán để hoàn tất đặt phòng
          </Text>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border-8 border-gray-50">
                <img
                  src={qrPlaceholder}
                  alt="QR Thanh toán"
                  className="w-72 h-72 object-contain"
                />
                <div className="text-center mt-6">
                  <Text className="block mt-3 text-lg font-medium text-gray-700">
                    Quét mã QR để thanh toán
                  </Text>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <Text strong className="text-lg block text-gray-600">
                  Studio
                </Text>
                <Title level={2} className="mt-1">
                  {studio?.name || "Loading..."}
                </Title>
              </div>

              <div>
                <Text strong className="text-lg block text-gray-600">
                  Thời gian thuê
                </Text>
                <Tag color="blue" className="text-lg mt-2 py-2 px-4">
                  {draft.startTime
                    ? dayjs(draft.startTime).format("DD/MM/YYYY HH:mm")
                    : "..."}{" "}
                  →{" "}
                  {draft.endTime
                    ? dayjs(draft.endTime).format("HH:mm")
                    : "..."}
                </Tag>
              </div>

              <div>
                <Text strong className="text-2xl block text-gray-700">
                  Số tiền cần thanh toán
                </Text>
                <Title
                  level={1}
                  className="text-6xl font-extrabold text-green-600 mt-3"
                >
                  {totalPrice.toLocaleString()}₫
                </Title>
              </div>

              <div className="pt-6 border-t-2 border-gray-200">
                <Text type="secondary" className="text-base">
                  Sau khi chuyển khoản thành công, vui lòng bấm nút bên dưới để
                  hoàn tất.
                </Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* Buttons */}
          <div className="flex justify-center gap-6">
            <Button size="large" onClick={onBack}>
              Quay lại
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-12"
              onClick={handlePayment}
              loading={localLoading || loading}
            >
              Tôi đã thanh toán
            </Button>
          </div>

          <div className="text-center mt-8 text-gray-500">
            <Text type="secondary">
              Hệ thống sẽ tự động xác nhận sau vài phút
              <br />
              Nếu quá 15 phút chưa thấy cập nhật, vui lòng liên hệ hotline{" "}
              <strong>0909 888 999</strong>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
