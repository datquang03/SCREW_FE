import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import EquipmentPage from "./pages/Equipment/EquipmentPage";
import ContactPage from "./pages/Contact/ContactPage";
import LoginPage from "./pages/Authentication/Login/LoginPage";
import RegisterPage from "./pages/Authentication/Register/RegisterPage";
import StudioPage from "./pages/Studio/StudioPage";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/studio" element={<StudioPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
