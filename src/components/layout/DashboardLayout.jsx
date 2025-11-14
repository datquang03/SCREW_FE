import React, { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import DashboardNavbar from "./NavbarDashboard";

const VARIANTS = {
  customer: {
    accent: "from-amber-50 via-white to-white",
  },
  staff: {
    accent: "from-emerald-50 via-white to-white",
  },
  admin: {
    accent: "from-indigo-50 via-white to-white",
  },
  default: {
    accent: "from-slate-50 via-white to-white",
  },
};

const DashboardLayout = ({ sidebar: SidebarComponent, variant = "default" }) => {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  useLayoutEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [location.pathname]);

  const theme = VARIANTS[variant] || VARIANTS.default;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        ref={sidebarRef}
        className="hidden lg:flex lg:w-64 xl:w-72 fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-950 via-gray-900 to-black shadow-2xl"
      >
        {SidebarComponent && <SidebarComponent variant={variant} />}
      </aside>

      <div className="flex-1 flex flex-col w-full lg:ml-64 xl:ml-72">
        <DashboardNavbar variant={variant} />
        <main
          ref={contentRef}
          className="px-4 sm:px-6 lg:px-10 py-8 min-h-screen pt-20 md:pt-24"
        >
          <div
            className={`rounded-3xl bg-gradient-to-br ${theme.accent} shadow-[0_30px_90px_rgba(15,23,42,0.12)] border border-white/60 min-h-[calc(100vh-8rem)]`}
          >
            <div className="p-4 sm:p-8 lg:p-10">
          <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
