// src/pages/AdminDashboard/AdminDashboardPage.jsx
import React from "react";
import KPIStat from "../../components/dashboard/KPIStat";
import DataTable from "../../components/dashboard/DataTable";
import MiniLineChart from "../../components/dashboard/MiniLineChart";
import MiniBarChart from "../../components/dashboard/MiniBarChart";
import DonutChart from "../../components/dashboard/DonutChart";
import {
  UserOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const AdminDashboardPage = () => {
  const usersColumns = [
    { title: "User", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Vai trò", dataIndex: "role" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            v === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {v}
        </span>
      ),
    },
  ];

  const usersData = [
    { name: "Nguyễn A", email: "a@splus.vn", role: "User", status: "Active" },
    { name: "Trần B", email: "b@splus.vn", role: "Staff", status: "Active" },
    { name: "Lê C", email: "c@splus.vn", role: "User", status: "Disabled" },
  ];

  const revenueColumns = [
    { title: "Tháng", dataIndex: "month" },
    { title: "Booking", dataIndex: "booking" },
    { title: "Doanh thu", dataIndex: "revenue" },
  ];
  const revenueData = [
    { month: "07/2025", booking: 120, revenue: "92.000.000đ" },
    { month: "08/2025", booking: 132, revenue: "101.000.000đ" },
    { month: "09/2025", booking: 155, revenue: "118.000.000đ" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-white">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-300/30 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 w-60 h-60 rounded-full bg-purple-400/30 blur-3xl" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-700 font-medium">
          Quản trị dữ liệu studio, người dùng và doanh thu S+ Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPIStat
          title="Tổng User"
          value="1.240"
          icon={<UserOutlined />}
          gradient="from-indigo-400 to-violet-500"
        />
        <KPIStat
          title="Nhân sự"
          value="26"
          icon={<TeamOutlined />}
          gradient="from-sky-400 to-cyan-500"
        />
        <KPIStat
          title="Doanh thu (tháng)"
          value="118.0tr"
          icon={<DollarCircleOutlined />}
          gradient="from-emerald-400 to-teal-500"
        />
        <KPIStat
          title="Tỉ lệ tăng trưởng"
          value="+12%"
          icon={<BarChartOutlined />}
          gradient="from-rose-400 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Doanh thu theo tháng</h3>
            <span className="text-xs text-gray-500">6 tháng gần đây</span>
          </div>
          <MiniLineChart data={[72, 81, 95, 110, 118, 121]} color="#6366f1" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-3">Kênh đặt chỗ</h3>
          <DonutChart value={64} color="#10b981" label="Website / Tất cả" />
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Website</span>
              <span className="font-semibold">64%</span>
            </div>
            <div className="flex justify-between">
              <span>Facebook</span>
              <span className="font-semibold">22%</span>
            </div>
            <div className="flex justify-between">
              <span>Hotline</span>
              <span className="font-semibold">14%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Người dùng gần đây"
          columns={usersColumns}
          data={usersData}
        />
        <DataTable
          title="Tổng hợp doanh thu"
          columns={revenueColumns}
          data={revenueData}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
