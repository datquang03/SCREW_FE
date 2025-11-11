import React from "react";
import DashboardNavbar from "./NavbarDashboard";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ sidebar: SidebarComponent }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <div className="w-64 hidden md:block fixed left-0 top-16 bottom-0 z-50">
        {SidebarComponent && <SidebarComponent />}
      </div>

      {/* Main content - With margin for sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        <DashboardNavbar />
        <main className="pt-16 p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
