import React from "react";
import DashboardNavbar from "./NavbarDashboard";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ sidebar: SidebarComponent }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        {SidebarComponent && <SidebarComponent />}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="pt-16 p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
