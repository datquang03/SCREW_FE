import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const UserSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Bảng điều khiển",
      path: "/dashboard/customer",
    },
    {
      key: "bookings",
      icon: <CalendarOutlined />,
      label: "Đơn của tôi",
      path: "/dashboard/customer/bookings",
    },
    {
      key: "studios",
      icon: <VideoCameraOutlined />,
      label: "Studio yêu thích",
      path: "/dashboard/customer/studios",
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "Lịch sử thuê",
      path: "/dashboard/customer/history",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
      path: "/dashboard/customer/profile",
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
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <span className="text-xl font-bold text-gray-900">S+</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">S+ Studio</h2>
            <p className="text-xs text-gray-400">Người dùng</p>
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
                  ? "text-yellow-400 font-semibold"
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

export default UserSidebar;

