import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Bảng điều khiển",
      path: "/dashboard/staff",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý đơn",
      path: "/dashboard/staff/order",
    },
    {
      key: "schedule",
      icon: <CalendarOutlined />,
      label: "Lịch làm việc",
      path: "/dashboard/staff/schedule",
    },
    {
      key: "studios",
      icon: <VideoCameraOutlined />,
      label: "Quản lý Studio",
      path: "/dashboard/staff/studios",
    },
    {
      key: "equipment",
      icon: <ClockCircleOutlined />,
      label: "Thiết bị",
      path: "/dashboard/staff/equipment",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
      path: "/dashboard/staff/profile",
    },
  ];

  const selectedKeys = menuItems
    .filter((item) => location.pathname.startsWith(item.path))
    .map((item) => item.key);

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-xl font-bold text-white">S+</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">S+ Studio</h2>
            <p className="text-xs text-gray-400">Nhân viên</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300 hover:text-white"
              }
            >
              {item.label}
            </NavLink>
          ),
        }))}
        className="flex-1 bg-transparent border-0 pt-4"
        style={{ backgroundColor: "transparent" }}
      />

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-400 text-center">
          <p>© 2025 S+ Studio</p>
          <p className="mt-1">Cho thuê studio chuyên nghiệp</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
