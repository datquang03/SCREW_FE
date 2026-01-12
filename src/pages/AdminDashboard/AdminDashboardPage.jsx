// src/pages/AdminDashboard/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

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

  const { users, studios, equipment, promotions, notifications, revenue } =
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-white shadow-lg border border-indigo-200/50">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-300/30 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 w-60 h-60 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-medium">
            Quản trị Users, Studios, Equipment, Khuyến mãi, Thông báo và Doanh
            thu.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 ${
              activeTab === tab.key
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DROPDOWN FILTER */}
      <div className="mt-4">
        {activeTab === "users" && (
          <select
            className="border rounded-md px-3 py-2 text-gray-700"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        )}

        {activeTab === "studios" && (
          <select
            className="border rounded-md px-3 py-2 text-gray-700"
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="available">Có sẵn</option>
            <option value="in_use">Đang dùng</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        )}

        {activeTab === "promotions" && (
          <select
            className="border rounded-md px-3 py-2 text-gray-700"
            value={promoFilter}
            onChange={(e) => setPromoFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        )}
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
        {kpiGroups[activeTab].map((kpi) => (
          <KPIStat
            key={kpi.title}
            title={kpi.title}
            value={<CountUp end={kpi.value || 0} duration={1.5} />}
            icon={kpi.icon}
            gradient={kpi.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
