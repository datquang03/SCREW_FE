// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Homepage from "./pages/Homepage/Homepage";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import EquipmentPage from "./pages/Equipment/EquipmentPage";
import ContactPage from "./pages/Contact/ContactPage";
import LoginPage from "./pages/Authentication/Login/LoginPage";
import RegisterPage from "./pages/Authentication/Register/RegisterPage";
import StudioPage from "./pages/Studio/StudioPage";
import ForgotPasswordPage from "./pages/Authentication/Forgot/ForgotPassword";
import VerifyEmailPage from "./pages/Authentication/Verify/Email";

import DashboardLayout from "./components/layout/DashboardLayout";
import StaffSidebar from "./pages/StaffDashboard/StaffSidebar";
import AdminSidebar from "./pages/AdminDashboard/AdminSidebar";
import UserDashboardPage from "./pages/UserDashboard/UserDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboard/StaffDashboardPage";
import StaffOrderPage from "./pages/StaffDashboard/StaffOrderPage";
import StaffProfilePage from "./pages/StaffDashboard/StaffProfilePage";
import AdminDashboardPage from "./pages/AdminDashboard/AdminDashboardPage";
import AdminUserPage from "./pages/AdminDashboard/AdminUserPage";
import UserProfilePage from "./pages/Profile/UserProfilePage";
import ScrollToTop from "./components/ScrollToTop";

// === IMPORT PROTECTED ROUTES ===
import {
  ProtectedRouteForAdmin,
  ProtectedRouteForStaff,
  ProtectedRouteForAll,
} from "./middlewares/AuthProtector";

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
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/studio" element={<StudioPage />} />

            {/* USER DASHBOARD */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRouteForAll>
                  <DashboardLayout />
                </ProtectedRouteForAll>
              }
            >
              <Route index element={<UserDashboardPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            {/* STAFF DASHBOARD */}
            <Route
              path="/dashboard/staff/*"
              element={
                <ProtectedRouteForStaff>
                  <DashboardLayout sidebar={StaffSidebar} />
                </ProtectedRouteForStaff>
              }
            >
              <Route index element={<StaffDashboardPage />} />
              <Route path="order" element={<StaffOrderPage />} />
              <Route path="profile" element={<StaffProfilePage />} />
            </Route>

            {/* ADMIN DASHBOARD */}
            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRouteForAdmin>
                  <DashboardLayout sidebar={AdminSidebar} />
                </ProtectedRouteForAdmin>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUserPage />} />
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
