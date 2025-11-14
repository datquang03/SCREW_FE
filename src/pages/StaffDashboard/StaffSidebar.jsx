import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const getRoleText = (role) => {
  const roleMap = {
    customer: "Người dùng",
    staff: "Nhân viên",
    admin: "Quản trị viên",
  };
  return roleMap[role] || "Nhân viên";
};

const StaffSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const roleText = getRoleText(user?.role);

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

  const matchedItem = menuItems
    .filter((item) => {
      if (location.pathname === item.path) {
        return true;
      }
      return location.pathname.startsWith(`${item.path}/`);
    })
    .sort((a, b) => b.path.length - a.path.length)[0];

  const selectedKeys = matchedItem ? [matchedItem.key] : [menuItems[0].key];

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-xl font-bold text-white">S+</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">S+ Studio</h2>
            <p className="text-sm font-medium text-blue-400 mt-0.5">{roleText}</p>
          </div>
        </div>
      </div>

      {/* Role Badge - Above Menu */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-center">
          <span className="px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-500 text-white rounded-lg shadow-xl shadow-blue-500/60 border border-blue-300/40 backdrop-blur-sm transform transition-all duration-200 hover:scale-105 whitespace-nowrap">
            {roleText}
          </span>
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
        className="flex-1 bg-transparent border-0 pt-2"
        style={{ backgroundColor: "transparent" }}
        inlineIndent={16}
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
