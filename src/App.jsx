// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Homepage from "./pages/Homepage/Homepage";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import EquipmentPage from "./pages/Equipment/EquipmentPage";
import ContactPage from "./pages/Contact/ContactPage";
import LoginPage from "./pages/Authentication/Login/LoginPage";
import StudioPage from "./pages/Studio/StudioPage";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPasswordPage from "./pages/Authentication/Forgot/ForgotPassword";
import RegisterPage from "./pages/Authentication/Register/RegisterPage";

const pageVariants = {
  initial: { opacity: 0, x: 100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -100 }
};

const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 };

const AppContent = () => {
  const location = useLocation();
  const isAuth = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={isAuth ? "initial" : false}
          animate={isAuth ? "in" : "in"}
          exit={isAuth ? "out" : "out"}
          variants={pageVariants}
          transition={pageTransition}
          style={{ width: "100%" }}
        >
          <Routes location={location}>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/studio" element={<StudioPage />} />
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