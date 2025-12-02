// src/pages/Booking/components/BookingPaymentPercentage.jsx

import React from "react";
import { Card, Typography, Tag, Button, Space, Divider } from "antd";
import dayjs from "dayjs";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import CreditCardOutlined from "@ant-design/icons/CreditCardOutlined";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";
import LinkOutlined from "@ant-design/icons/LinkOutlined";

const { Title, Text } = Typography;

/**
 * Hiển thị màn hình thanh toán theo % với QR PayOS + thông tin thanh toán
 * props:
 *  - booking: object booking hiện tại
 *  - payment: object payment trả về từ BE (data trong response createSinglePayment)
 *  - onBack: quay lại trang trước
 *  - onDone: sau khi user bấm "Đã thanh toán xong"
 */
export default function BookingPaymentPercentage({ booking, payment, onBack, onDone }) {
  if (!booking || !payment) return null;

  const {
    finalAmount = 0,
    _id: bookingId,
  } = booking || {};

  const {
    paymentCode,
    amount,
    payType,
    status,
    transactionId,
    qrCodeUrl,
    expiresAt,
    gatewayResponse,
  } = payment || {};

  const formatted = (num) => num?.toLocaleString("vi-VN") + "₫";

  const statusColor =
    status === "success"
      ? "green"
      : status === "pending"
      ? "orange"
      : "red";

  const percentText =
    payType === "prepay_30"
      ? "30%"
      : payType === "prepay_50"
      ? "50%"
      : payType === "full"
      ? "100%"
      : "";

  // Tạo QR image từ link PayOS để user có thể quét trực tiếp
  const qrImage = qrCodeUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=380x380&data=${encodeURIComponent(
        qrCodeUrl
      )}`
    : null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Card className="shadow-2xl rounded-3xl overflow-hidden border-0">
        {/* HEADER */}
        <div className="text-center py-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
              <CreditCardOutlined className="text-4xl text-emerald-500" />
            </div>
          </div>
          <Title level={1} className="text-white text-4xl md:text-5xl font-bold mb-2">
            THANH TOÁN ĐẶT PHÒNG
          </Title>
          <Text className="text-base md:text-lg opacity-90">
            Mã booking: <strong>{bookingId}</strong>
          </Text>
          <div className="mt-4 space-x-3">
            {percentText && (
              <Tag color="gold" className="px-4 py-1 text-sm md:text-base font-semibold">
                Thanh toán trước {percentText}
              </Tag>
            )}
            <Tag color={statusColor} className="px-4 py-1 text-sm md:text-base font-semibold">
              Trạng thái: {status?.toUpperCase()}
            </Tag>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-start mb-8">
            {/* QR + HƯỚNG DẪN */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 w-full flex flex-col items-center">
                {qrImage ? (
                  <img
                    src={qrImage}
                    alt="QR Thanh toán PayOS"
                    className="w-72 h-72 md:w-80 md:h-80"
                  />
                ) : (
                  <div className="w-72 h-72 md:w-80 md:h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl">
                    <Text className="text-gray-500 text-center px-4">
                      Không tìm thấy QR. Vui lòng dùng nút bên dưới để mở trang PayOS.
                    </Text>
                  </div>
                )}
                <Text className="block text-center mt-5 text-base md:text-lg font-semibold text-gray-700">
                  Quét QR bằng ứng dụng ngân hàng để thanh toán
                </Text>
                {expiresAt && (
                  <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
                    <ClockCircleOutlined />
                    <span>
                      Hết hạn lúc{" "}
                      <strong>{dayjs(expiresAt).format("HH:mm DD/MM/YYYY")}</strong>
                    </span>
                  </div>
                )}
                {qrCodeUrl && (
                  <Button
                    type="primary"
                    size="large"
                    className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold px-7"
                    icon={<LinkOutlined />}
                    onClick={() => window.open(qrCodeUrl, "_blank", "noopener,noreferrer")}
                  >
                    MỞ TRANG THANH TOÁN PAYOS
                  </Button>
                )}
              </div>

              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 w-full">
                <div className="flex items-start gap-3">
                  <CheckCircleOutlined className="text-emerald-500 mt-1" />
                  <div>
                    <Text className="font-semibold text-emerald-700">
                      Lưu ý khi thanh toán
                    </Text>
                    <ul className="mt-2 text-sm text-emerald-800 space-y-1 list-disc list-inside">
                      <li>Không chỉnh sửa nội dung chuyển khoản.</li>
                      <li>Thanh toán trong thời gian cho phép để tránh hết hạn link.</li>
                      <li>
                        Sau khi thanh toán thành công, quay lại đây và chọn{" "}
                        <strong>“Tôi đã thanh toán xong”</strong>.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* THÔNG TIN THANH TOÁN */}
            <div className="space-y-8">
              <Card
                className="rounded-2xl border border-gray-100 shadow-md"
                title={
                  <span className="font-semibold text-gray-800">
                    Thông tin thanh toán
                  </span>
                }
              >
                <Space direction="vertical" className="w-full" size="middle">
                  <div className="flex justify-between text-base md:text-lg">
                    <span className="text-gray-600">Số tiền cần thanh toán</span>
                    <span className="font-bold text-emerald-600">
                      {formatted(amount || finalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-500">Tổng giá trị booking</span>
                    <span className="font-semibold text-gray-800">
                      {formatted(finalAmount)}
                    </span>
                  </div>
                  {percentText && (
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-500">Tỷ lệ thanh toán</span>
                      <span className="font-semibold text-gray-800">
                        {percentText} giá trị đơn
                      </span>
                    </div>
                  )}
                  <Divider className="my-3" />
                  {paymentCode && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-500">Mã thanh toán</span>
                      <span className="font-mono text-gray-800">{paymentCode}</span>
                    </div>
                  )}
                  {transactionId && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-500">Mã giao dịch</span>
                      <span className="font-mono text-gray-800">{transactionId}</span>
                    </div>
                  )}
                  {gatewayResponse?.orderCode && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-500">OrderCode PayOS</span>
                      <span className="font-mono text-gray-800">
                        {gatewayResponse.orderCode}
                      </span>
                    </div>
                  )}
                </Space>
              </Card>

              <Card
                className="rounded-2xl border border-gray-100 shadow-md"
                title={
                  <span className="font-semibold text-gray-800">
                    Trạng thái & hỗ trợ
                  </span>
                }
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <div className="flex items-center gap-3">
                    <ExclamationCircleOutlined className="text-amber-500 text-lg" />
                    <Text className="text-gray-700">
                      Nếu sau {"3-5"} phút bạn vẫn chưa thấy cập nhật trạng thái thanh toán,
                      vui lòng liên hệ hotline để được hỗ trợ.
                    </Text>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-700">
                    <span>Hotline:</span>
                    <span className="font-semibold">0909 888 999</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-700">
                    <span>Email hỗ trợ:</span>
                    <span className="font-semibold">support@splusstudio.vn</span>
                  </div>
                </Space>
              </Card>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                  className="sm:flex-1"
                >
                  Quay lại hóa đơn
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold sm:flex-1"
                  icon={<CheckCircleOutlined />}
                  onClick={onDone}
                >
                  Tôi đã thanh toán xong
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


