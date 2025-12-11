import React from "react";
import NavbarWrapper from "./NavbarWrapper";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-indigo-50">
      {/* Soft glowing blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200 blur-3xl" />
        <div className="absolute right-[-10%] top-10 h-80 w-80 rounded-full bg-indigo-200 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-100 blur-3xl" />
      </div>

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_35%)] opacity-50" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <NavbarWrapper />
        <main className="relative flex-grow pt-24 md:pt-28 pb-16">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
            {children || <Outlet />}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
