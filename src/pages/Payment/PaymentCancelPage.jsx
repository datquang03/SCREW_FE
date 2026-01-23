// src/pages/Payment/PaymentCancelPage.jsx
import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import { motion } from "framer-motion";
import { FiXCircle } from "react-icons/fi";

const { Title, Text } = Typography;

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // PayOS trả về cho set-design: orderId, orderCode, status, cancel, code, id
  const orderId = searchParams.get("orderId") || searchParams.get("bookingId");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status") || "cancelled";
  const cancel = searchParams.get("cancel");
  const code = searchParams.get("code");
  const txId = searchParams.get("id");
  const amount = searchParams.get("amount");
  const isSetDesign = location.pathname.includes("set-design");

  const handleGoDashboard = () => {
    navigate(
      isSetDesign
        ? "/dashboard/customer/set-designs/bookings"
        : "/dashboard/customer/history"
    ); // redirect về trang booking của user
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFBFA] p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="max-w-md w-full"
      >
        <Card
          className="bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6 text-slate-400"
          >
            <FiXCircle className="text-8xl" />
          </motion.div>

          <Title level={2} className="!text-[#0F172A] !mb-2 !font-semibold">
            Thanh toán bị hủy
          </Title>
          <Text className="text-slate-600 mb-4 block">
            Đơn của bạn chưa được thanh toán hoặc đã bị hủy.
          </Text>

          <div className="bg-white border border-slate-100 p-6 mb-6">
            <Text strong className="block mb-2 text-slate-700">
              Mã đơn: <span className="text-slate-500 font-semibold">{orderId || "—"}</span>
            </Text>
            <Text strong className="block mb-2 text-slate-700">
              Mã giao dịch: <span className="text-slate-500 font-semibold">{orderCode}</span>
            </Text>
            {txId && (
              <Text className="block mb-2 text-slate-700">
                Transaction ID: <span className="text-slate-500 font-semibold">{txId}</span>
              </Text>
            )}
            {code && (
              <Text className="block mb-2 text-slate-700">
                Code: <span className="text-slate-500 font-semibold">{code}</span>
              </Text>
            )}
            {amount && (
              <Text className="block mb-2 text-slate-700">
                Số tiền:{" "}
                <span className="text-slate-500 font-semibold">
                  {Number(amount).toLocaleString("vi-VN")}₫
                </span>
              </Text>
            )}
            <Text className="block mt-3 text-slate-700">
              Trạng thái:{" "}
              <span className="text-slate-500 font-semibold uppercase tracking-wider">{status || (cancel && "cancelled")}</span>
            </Text>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="primary"
              size="large"
              className="!bg-[#0F172A] !border-[#0F172A] hover:!bg-slate-700 !text-white !font-semibold !h-12 !uppercase !tracking-[0.2em]"
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

export default PaymentCancelPage;
