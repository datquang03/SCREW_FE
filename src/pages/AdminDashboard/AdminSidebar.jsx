// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "overview",
      icon: <AppstoreOutlined />,
      label: <NavLink to="/dashboard/admin">Dashboard</NavLink>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <NavLink to="/dashboard/admin/users">Users</NavLink>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <NavLink to="/dashboard/admin/settings">Settings</NavLink>,
    },
  ];

  const selectedKeys = menuItems
    .filter((item) => location.pathname.startsWith(item.label.props.to))
    .map((item) => item.key);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="text-white text-xl font-bold p-4 text-center border-b border-gray-700">
        Admin Panel
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        className="flex-1"
      />
    </div>
  );
};

export default AdminSidebar;
