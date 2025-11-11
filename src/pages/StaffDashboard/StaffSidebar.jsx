import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, ShoppingCartOutlined, SettingOutlined } from "@ant-design/icons";

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { key: "overview", icon: <AppstoreOutlined />, label: "Dashboard", path: "/dashboard/staff" },
    { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders", path: "/dashboard/staff/order" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings", path: "/dashboard/staff/settings" },
  ];

  const selectedKeys = menuItems
    .filter((item) => location.pathname.startsWith(item.path))
    .map((item) => item.key);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="text-white text-xl font-bold p-4 text-center border-b border-gray-700">
        Staff Panel
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <NavLink to={item.path}>{item.label}</NavLink>,
        }))}
        className="flex-1"
      />
    </div>
  );
};

export default StaffSidebar;
