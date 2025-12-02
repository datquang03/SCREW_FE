// src/pages/Payment/PaymentSuccessPage.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Result } from "antd";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const { Title, Text } = Typography;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");

  const handleGoDashboard = () => {
    navigate("/dashboard/customer/history");
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
              Mã đơn: <span className="text-green-700">{bookingId}</span>
            </Text>
            <Text strong className="block">
              Mã giao dịch: <span className="text-green-700">{orderCode}</span>
            </Text>
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
