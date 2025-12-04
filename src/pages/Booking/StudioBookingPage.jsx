// src/pages/Booking/StudioBookingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Button, message, Spin } from "antd";
import {
  CalendarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

import { motion, AnimatePresence } from "framer-motion";

import Layout from "../../components/layout/Layout";
import BookingStudioInfo from "./components/BookingStudioInfo";
import BookingSchedulePage from "./components/BookingSchedulePage";
import BookingStudioDetails from "./components/BookingStudioDetails";
import BookingConfirmPage from "./components/BookingConfirmPage";
import BookingPaymentPage from "./components/BookingPaymentPage";

import { getStudioById } from "../../features/studio/studioSlice";
import {
  startNewBooking,
  resetBooking,
} from "../../features/booking/bookingSlice";

// Các animation variants ngẫu nhiên
const animationVariants = [
  // Fade + Slide Up
  {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Slide Down
  {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Scale
  {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Slide Left
  {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Slide Right
  {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Rotate
  {
    initial: { opacity: 0, rotateY: -15 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 15 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  // Fade + Zoom
  {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
];

const StudioBookingPage = () => {
  const { id: studioId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const draft = useSelector((state) => state.booking.draft);
  const loading = useSelector((state) => state.booking.loading);

  const [localStep, setLocalStep] = useState(0);
  const [bookingResult, setBookingResult] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(
    animationVariants[0]
  );
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(startNewBooking({ studioId }));
    dispatch(getStudioById(studioId));

    return () => {
      dispatch(resetBooking());
    };
  }, [dispatch, studioId]);

  // Scroll to top mượt mà khi chuyển step
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Delay nhẹ để animation bắt đầu trước
    const timer = setTimeout(scrollToTop, 100);
    return () => clearTimeout(timer);
  }, [localStep]);

  // Chọn animation ngẫu nhiên khi chuyển step
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * animationVariants.length);
    setCurrentAnimation(animationVariants[randomIndex]);
  }, [localStep]);

  const handleNext = () => {
    setLocalStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setLocalStep((prev) => prev - 1);
  };

  const steps = [
    { title: "Thông tin studio", icon: <CameraOutlined /> },
    { title: "Chọn ngày giờ", icon: <CalendarOutlined /> },
    { title: "Thiết bị & dịch vụ", icon: <CameraOutlined /> },
    { title: "Xác nhận", icon: <CheckCircleOutlined /> },
    { title: "Thanh toán", icon: <QrcodeOutlined /> },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Nút quay lại */}
        {localStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Button
              type="text"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              Quay lại
            </Button>
          </motion.div>
        )}

        <Steps current={localStep} items={steps} className="mb-12" />

        <div ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={localStep}
              initial={currentAnimation.initial}
              animate={currentAnimation.animate}
              exit={currentAnimation.exit}
              transition={currentAnimation.transition}
            >
              {localStep === 0 && <BookingStudioInfo onNext={handleNext} />}

              {localStep === 1 && <BookingSchedulePage onNext={handleNext} />}

              {localStep === 2 && (
                <BookingStudioDetails onNext={handleNext} onBack={handleBack} />
              )}

              {localStep === 3 && (
                <BookingConfirmPage
                  onBack={handleBack}
                  onSuccess={(result) => {
                    message.success(
                      "Đặt phòng thành công! Chuyển sang thanh toán..."
                    );
                    setBookingResult(result); // lưu kết quả booking
                    setLocalStep(4); // chuyển sang step thanh toán
                  }}
                />
              )}

              {localStep === 4 && (
                <BookingPaymentPage
                  bookingResult={bookingResult} // truyền dữ liệu booking sang step 5
                  onBack={handleBack}
                  onPaymentSuccess={() => {
                    message.success("Thanh toán thành công!");
                    setTimeout(
                      () => navigate("/dashboard/customer/history"),
                      2000
                    );
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center">
            <Spin size="large" />
            <p className="mt-6 text-xl font-medium">Đang xử lý đặt phòng...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudioBookingPage;
