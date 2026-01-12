// src/pages/Payment/PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentStatus } from "../../features/payment/paymentSlice";
import { Card, Typography, Button, Tag } from "antd";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const { Title, Text } = Typography;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = searchParams.get("orderId") || searchParams.get("bookingId");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status") || "success";
  const amount = searchParams.get("amount");
  const paymentCode = searchParams.get("paymentCode");
  const isSetDesign = location.pathname.includes("set-design");

  const transactionColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "_id",
      render: (id) => <span>#{id?.slice(-6)}</span>,
    },
    {
      title: "Booking",
      dataIndex: ["bookingId", "_id"],
      key: "booking",
      render: (id) => <span>#{id?.slice(-6)}</span>,
    },
    {
      title: "Studio",
      dataIndex: ["bookingId", "scheduleId", "studioId", "name"],
      render: (name) => name || "N/A",
    },
    {
      title: "Loại thanh toán",
      dataIndex: "payType",
      render: (v) => {
        const label =
          v === "full"
            ? "Thanh toán toàn bộ"
            : v === "prepay_50"
            ? "Cọc 50%"
            : v === "prepay_30"
            ? "Cọc 30%"
            : v;
        const color =
          v === "full" ? "green" : v === "prepay_50" ? "purple" : "orange";
        return (
          <Tag color={color} className="px-3 py-1 rounded-full">
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (v) => (
        <span className="font-semibold text-gray-900">{formatCurrency(v)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => {
        const color =
          v === "success"
            ? "green"
            : v === "pending"
            ? "blue"
            : v === "failed"
            ? "red"
            : "gray";
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewTransactionDetail(record._id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Lấy trạng thái thanh toán khi vào trang
  useEffect(() => {
    if (orderId) {
      dispatch(getPaymentStatus({ paymentId: orderId }));
    }
  }, [orderId, dispatch]);

  const handleGoDashboard = () => {
    navigate(
      isSetDesign
        ? "/dashboard/customer/set-designs/bookings"
        : "/dashboard/customer/history"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="max-w-md w-full"
      >
        <Card
          className="bg-white rounded-3xl shadow-xl border border-green-200 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6 text-green-500"
          >
            <FiCheckCircle className="text-8xl" />
          </motion.div>

          <Title level={2} className="text-green-600 mb-2">
            Thanh toán thành công!
          </Title>
          <Text className="text-gray-700 mb-4 block">
            Đơn của bạn đã được thanh toán thành công.
          </Text>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <Text strong className="block mb-1">
              Mã đơn: <span className="text-green-700">{orderId || "—"}</span>
            </Text>
            <Text strong className="block">
              Mã giao dịch: <span className="text-green-700">{orderCode}</span>
            </Text>
            {paymentCode && (
              <Text className="block">
                Payment code: <span className="text-green-700">{paymentCode}</span>
              </Text>
            )}
            {amount && (
              <Text className="block">
                Số tiền:{" "}
                <span className="text-green-700">
                  {Number(amount).toLocaleString("vi-VN")}₫
                </span>
              </Text>
            )}
            <Text className="block mt-2">
              Trạng thái: <span className="text-green-600">{status}</span>
            </Text>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="primary"
              size="large"
              className="bg-green-600 border-green-600 hover:bg-green-700"
              onClick={handleGoDashboard}
            >
              Quay về trang đơn của tôi
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
