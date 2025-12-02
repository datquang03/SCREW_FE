// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Homepage from "./pages/Homepage/Homepage";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import ContactPage from "./pages/Contact/ContactPage";
import LoginPage from "./pages/Authentication/Login/LoginPage";
import RegisterPage from "./pages/Authentication/Register/RegisterPage";
import StudioPage from "./pages/Studio/StudioPage";
import StudioBookingPage from "./pages/Booking/StudioBookingPage";
import ForgotPasswordPage from "./pages/Authentication/Forgot/ForgotPassword";
import VerifyEmailPage from "./pages/Authentication/Verify/Email";

import DashboardLayout from "./components/layout/DashboardLayout";
import StaffSidebar from "./pages/StaffDashboard/StaffSidebar";
import AdminSidebar from "./pages/AdminDashboard/AdminSidebar";
import UserSidebar from "./pages/UserDashboard/UserSidebar";
import UserDashboardPage from "./pages/UserDashboard/UserDashboardPage";
import UserBookingsPage from "./pages/UserDashboard/UserBookingsPage";
import UserStudiosPage from "./pages/UserDashboard/UserStudiosPage";
import UserHistoryPage from "./pages/UserDashboard/UserHistoryPage";
import UserProfilePage from "./pages/UserDashboard/UserProfilePage";
import StaffDashboardPage from "./pages/StaffDashboard/StaffDashboardPage";
import StaffOrderPage from "./pages/StaffDashboard/StaffOrderPage";
import StaffSchedulePage from "./pages/StaffDashboard/StaffSchedulePage";
import StaffStudiosPage from "./pages/StaffDashboard/StaffStudiosPage";
import StaffEquipmentPage from "./pages/StaffDashboard/StaffEquipmentPage";
import StaffProfilePage from "./pages/StaffDashboard/StaffProfilePage";
import AdminDashboardPage from "./pages/AdminDashboard/AdminDashboardPage";
import AdminUserPage from "./pages/AdminDashboard/AdminUserPage";
import AdminStaffPage from "./pages/AdminDashboard/AdminStaffPage";
import AdminStudiosPage from "./pages/AdminDashboard/AdminStudiosPage";
import AdminRevenuePage from "./pages/AdminDashboard/AdminRevenuePage";
import AdminReportsPage from "./pages/AdminDashboard/AdminReportsPage";
import AdminSettingsPage from "./pages/AdminDashboard/AdminSettingsPage";
import ScrollToTop from "./components/ScrollToTop";
import StudioDetailPage from "./pages/Studio/StudioDetailPage";

// === IMPORT PROTECTED ROUTES ===
import {
  ProtectedRouteForCustomer,
  ProtectedRouteForStaff,
  ProtectedRouteForAdmin,
} from "./middlewares/AuthProtector";
import StaffServicePage from "./pages/StaffDashboard/StaffServicePage";
import StaffPromotionPage from "./pages/StaffDashboard/StaffPromotionPage";
import StudioReviewsRecord from "./pages/Studio/StudioReviewsRecord";
import StudioLikedPage from "./pages/Studio/StudioLikedPage";
import EquipmentListPage from "./pages/Equipment/EquipmentList";
import StaffUserPage from "./pages/StaffDashboard/StaffUserPage";
import StaffSetDesignPage from "./pages/StaffDashboard/StaffSetDesignPage";
import PaymentSuccessPage from "./pages/Payment/PaymentSuccessPage";
import PaymentCancelPage from "./pages/Payment/PaymentCancelPage";
import NotFoundPage from "./pages/Notfound/NotFoundPage";
import SetDesignSection from "./pages/SetDesign/SetDesignDetailPage";
import StaffTransactionPage from "./pages/StaffDashboard/StaffTransactionPage";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.2 };

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={isAuthPage ? "initial" : false}
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ width: "100%" }}
        >
          <Routes location={location}>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/equipment" element={<EquipmentListPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/studio/:id" element={<StudioDetailPage />} />
            <Route path="/booking/:id" element={<StudioBookingPage />} />
            <Route path="/set-design/:id" element={<SetDesignSection />} />
            <Route
              path="/payment/success"
              element={<PaymentSuccessPage />}
            />  
            <Route
              path="/payment/cancel"
              element={<PaymentCancelPage />}
            />  

            {/* CUSTOMER DASHBOARD */}
            <Route
              path="/dashboard/customer/*"
              element={
                <ProtectedRouteForCustomer>
                  <DashboardLayout sidebar={UserSidebar} variant="customer" />
                </ProtectedRouteForCustomer>
              }
            >
              <Route index element={<UserDashboardPage />} />
              <Route path="bookings" element={<UserBookingsPage />} />
              <Route path="studios" element={<UserStudiosPage />} />
              <Route path="history" element={<UserHistoryPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>
            {/* CUSTOMER ONLY PAGES */}
            <Route
              path="/studio/customer/liked"
              element={
                <ProtectedRouteForCustomer>
                  <StudioLikedPage />
                </ProtectedRouteForCustomer>
              }
            />
            <Route
              path="/studio/customer/reviews"
              element={
                <ProtectedRouteForCustomer>
                  <StudioReviewsRecord />
                </ProtectedRouteForCustomer>
              }
            />

            {/* STAFF DASHBOARD */}
            <Route
              path="/dashboard/staff/*"
              element={
                <ProtectedRouteForStaff>
                  <DashboardLayout sidebar={StaffSidebar} variant="staff" />
                </ProtectedRouteForStaff>
              }
            >
              <Route index element={<StaffDashboardPage />} />
              <Route path="order" element={<StaffOrderPage />} />
              <Route path="schedule" element={<StaffSchedulePage />} />
              <Route path="studios" element={<StaffStudiosPage />} />
              <Route path="setdesign" element={<StaffSetDesignPage />} />
              <Route path="user" element={<StaffUserPage />} />
              <Route path="equipment" element={<StaffEquipmentPage />} />
              <Route path="profile" element={<StaffProfilePage />} />
              <Route path="service" element={<StaffServicePage />} />
              <Route path="promotion" element={<StaffPromotionPage />} />
              <Route path="transaction" element={<StaffTransactionPage />} />
            </Route>

            {/* ADMIN DASHBOARD */}
            <Route
              path="/dashboard/admin/*"
              element={
                //<ProtectedRouteForAdmin>
                <DashboardLayout sidebar={AdminSidebar} variant="admin" />
                //</ProtectedRouteForAdmin>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUserPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="studios" element={<AdminStudiosPage />} />
              <Route path="revenue" element={<AdminRevenuePage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
