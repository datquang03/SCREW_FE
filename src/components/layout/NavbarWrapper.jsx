// components/NavbarWrapper.jsx
import React from "react";
import Navbar from "./Navbar";
import NavbarMobile from "./NavbarMobile";


const NavbarWrapper = () => {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:hidden">
        <NavbarMobile />
      </div>
    </>
  );
};

export default NavbarWrapper;