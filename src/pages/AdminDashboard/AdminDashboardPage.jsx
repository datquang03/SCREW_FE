// src/pages/AdminDashboard/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

import KPIStat from "../../components/dashboard/KPIStat";
import {
  FiUser,
  FiUsers,
  FiGift,
  FiBell,
  FiHardDrive,
  FiHome,
  FiTrendingUp,
} from "react-icons/fi";
import { getAdminAnalytics } from "../../features/admin/admin.analyticSlice";

// Đăng ký các thành phần cần thiết cho chartjs
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.adminAnalytics);
  const [activeTab, setActiveTab] = useState("users");
  const [userFilter, setUserFilter] = useState("all");
  const [promoFilter, setPromoFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");

  useEffect(() => {
    dispatch(getAdminAnalytics());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-lg font-semibold">
        Đang tải dữ liệu Dashboard...
      </div>
    );
  }

  const { users, studios, equipment, promotions, notifications, revenue, bookings } =
    data;

  // === Helpers filter ===
  const filteredUsers = {
    total:
      userFilter === "all"
        ? users.total
        : userFilter === "active"
        ? users.active
        : users.inactive,
    staff:
      userFilter === "all"
        ? users.byRole.staff.total
        : userFilter === "active"
        ? users.byRole.staff.active
        : users.byRole.staff.inactive,
    customers:
      userFilter === "all"
        ? users.byRole.customers.total
        : userFilter === "active"
        ? users.byRole.customers.active
        : users.byRole.customers.inactive,
    admins:
      userFilter === "all"
        ? users.byRole.admins.total
        : userFilter === "active"
        ? users.byRole.admins.active
        : users.byRole.admins.inactive,
  };

  const filteredPromotions = {
    total:
      promoFilter === "all"
        ? promotions.total
        : promoFilter === "active"
        ? promotions.active
        : promotions.inactive,
  };

  const filteredEquipment = {
    total:
      equipmentFilter === "all"
        ? equipment.total
        : equipment.byStatus[equipmentFilter] || 0,
  };

  // Chart data
  const equipmentStatusData = {
    labels: ['Có sẵn', 'Đang dùng', 'Bảo trì'],
    datasets: [
      {
        data: [equipment.byStatus.available, equipment.byStatus.in_use, equipment.byStatus.maintenance],
        backgroundColor: ['#22c55e', '#f59e42', '#ef4444'],
      },
    ],
  };

  const studioStatusData = {
    labels: ['Hoạt động', 'Bảo trì'],
    datasets: [
      {
        data: [studios.byStatus.active, studios.byStatus.maintenance],
        backgroundColor: ['#6366f1', '#f43f5e'],
      },
    ],
  };

  const bookingStatusData = {
    labels: ['Đã xác nhận', 'Hoàn thành', 'Đã hủy'],
    datasets: [
      {
        data: [bookings.byStatus.confirmed, bookings.byStatus.completed, bookings.byStatus.cancelled],
        backgroundColor: ['#3b82f6', '#22c55e', '#ef4444'],
      },
    ],
  };

  const revenueBarData = {
    labels: ['Tháng này', 'Tháng trước', 'Năm nay'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [revenue.monthly, revenue.lastMonth, revenue.yearly],
        backgroundColor: ['#6366f1', '#f59e42', '#22c55e'],
      },
    ],
  };

  // === KPI Groups ===
  const kpiGroups = {
    users: [
      {
        title: "Tổng Users",
        value: filteredUsers.total,
        icon: <FiUser />,
        gradient: "from-indigo-400 to-violet-500",
      },
      {
        title: "Staff",
        value: filteredUsers.staff,
        icon: <FiUsers />,
        gradient: "from-sky-400 to-cyan-500",
      },
      {
        title: "Khách hàng",
        value: filteredUsers.customers,
        icon: <FiUsers />,
        gradient: "from-emerald-400 to-lime-500",
      },
      {
        title: "Admin",
        value: filteredUsers.admins,
        icon: <FiUsers />,
        gradient: "from-rose-400 to-pink-500",
      },
    ],
    studios: [
      {
        title: "Studios",
        value: studios.total,
        icon: <FiHome />,
        gradient: "from-yellow-400 to-orange-500",
      },
      {
        title: "Dụng cụ",
        value: filteredEquipment.total,
        icon: <FiHardDrive />,
        gradient: "from-purple-400 to-indigo-500",
      },
    ],
    promotions: [
      {
        title: "Khuyến mãi",
        value: filteredPromotions.total,
        icon: <FiGift />,
        gradient: "from-green-400 to-teal-500",
      },
      {
        title: "Thông báo",
        value: notifications.total,
        icon: <FiBell />,
        gradient: "from-blue-400 to-indigo-500",
      },
    ],
    revenue: [
      {
        title: "Doanh thu tháng",
        value: revenue.monthly,
        icon: <FiTrendingUp />,
        gradient: "from-pink-400 to-red-500",
      },
    ],
  };

  const tabs = [
    { key: "users", label: "Users" },
    { key: "studios", label: "Studios & Equipment" },
    { key: "promotions", label: "Promotions & Notifications" },
    { key: "revenue", label: "Revenue" },
  ];

  // Thay đổi layout, card, chart, bảng, badge, màu sắc, spacing cho giống UI mẫu hiện đại
  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow flex flex-col items-start p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 p-2 rounded-full text-blue-600 text-xl"><FiTrendingUp /></span>
            <span className="text-green-500 font-bold text-xs">+{revenue.growth}%</span>
          </div>
          <div className="text-gray-500 text-xs mb-1">Tổng Doanh Thu</div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{revenue.total.toLocaleString()} VND</div>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col items-start p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 p-2 rounded-full text-blue-600 text-xl"><FiBell /></span>
          </div>
          <div className="text-gray-500 text-xs mb-1">Tổng Đơn Đặt</div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{bookings.total}</div>
          <div className="text-xs text-gray-400">Tháng này</div>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col items-start p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 p-2 rounded-full text-blue-600 text-xl"><FiUser /></span>
          </div>
          <div className="text-gray-500 text-xs mb-1">Người Dùng Hoạt Động</div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{users.active}/{users.total}</div>
          <div className="text-xs text-gray-400">Hôm nay</div>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col items-start p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 p-2 rounded-full text-blue-600 text-xl"><FiHardDrive /></span>
          </div>
          <div className="text-gray-500 text-xs mb-1">Tỉ Lệ Sử Dụng Thiết Bị</div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{equipment.byStatus.in_use} / {equipment.byStatus.available} thiết bị</div>
        </div>
      </div>

      {/* CHARTS & TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-2">Doanh Thu</h3>
          <Bar data={revenueBarData} options={{ plugins: { legend: { display: false } } }} height={220} />
        </div>
        {/* Booking Status Doughnut Chart */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-2">Trạng Thái Đơn Hàng</h3>
          <Doughnut data={bookingStatusData} options={{ cutout: '80%', plugins: { legend: { display: false } } }} width={160} height={160} />
          <div className="mt-4 text-center">
            <div className="font-bold text-xl text-gray-900">{bookings.total} Đơn Hàng</div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <span className="text-green-600">Hoàn thành: {bookings.byStatus.completed}</span>
              <span className="text-blue-600">Xác nhận: {bookings.byStatus.confirmed}</span>
              <span className="text-red-500">Đã hủy: {bookings.byStatus.cancelled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-lg mb-2">Phân Bố Người Dùng</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-24 text-gray-700">Khách hàng</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${users.byRole.customers.total / users.total * 100}%` }}></div>
              </div>
              <span className="text-xs text-gray-700 font-bold ml-2">{users.byRole.customers.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-gray-700">Nhân viên</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${users.byRole.staff.total / users.total * 100}%` }}></div>
              </div>
              <span className="text-xs text-gray-700 font-bold ml-2">{users.byRole.staff.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-gray-700">Quản trị viên</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div className="bg-gray-500 h-3 rounded-full" style={{ width: `${users.byRole.admins.total / users.total * 100}%` }}></div>
              </div>
              <span className="text-xs text-gray-700 font-bold ml-2">{users.byRole.admins.total}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2"><span className="text-blue-500 font-bold">i</span> Tỉ lệ người dùng hoạt động trong 24h qua là {((users.active / users.total) * 100).toFixed(1)}%.</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
