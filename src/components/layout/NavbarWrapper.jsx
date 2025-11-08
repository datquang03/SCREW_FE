// components/NavbarWrapper.jsx
import React from "react";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  // Navbar mới đã có responsive built-in với mobile menu, không cần NavbarMobile riêng
  return <Navbar />;
};

export default NavbarWrapper;
