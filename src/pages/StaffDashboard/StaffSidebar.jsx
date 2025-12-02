import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import {
  FiHome,
  FiShoppingBag,
  FiCalendar,
  FiVideo,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import { MdDesignServices, MdMiscellaneousServices, MdOutlineDiscount } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { AiOutlineProfile } from "react-icons/ai";

const StaffSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const roleText = user?.role === "staff" ? "Nhân viên" : "Thành viên";

  const menuItems = useMemo(
    () => [
      { key: "dashboard", icon: <FiHome />, label: "Bảng điều khiển", path: "/dashboard/staff" },
      { key: "orders", icon: <FiShoppingBag />, label: "Quản lý đơn", path: "/dashboard/staff/order" },
      { key: "schedule", icon: <FiCalendar />, label: "Lịch làm việc", path: "/dashboard/staff/schedule" },
      { key: "studios", icon: <FiVideo />, label: "Quản lý Studio", path: "/dashboard/staff/studios" },
      { key: "setdesign", icon: <MdDesignServices />, label: "Quản lý Set Design", path: "/dashboard/staff/setdesign" },
      { key: "equipment", icon: <FiTool />, label: "Thiết bị", path: "/dashboard/staff/equipment" },
      { key: "service", icon: <MdMiscellaneousServices />, label: "Dịch vụ", path: "/dashboard/staff/service" },
      { key: "promotion", icon: <MdOutlineDiscount />, label: "Phiếu giảm", path: "/dashboard/staff/promotion" },
      { key: "transaction", icon: <GiMoneyStack />, label: "Quản lý giao dịch", path: "/dashboard/staff/transaction" },
      { key: "profile", icon: <AiOutlineProfile  />, label: "Hồ sơ", path: "/dashboard/staff/profile" },
    ],
    []
  );

  const matchedItem = menuItems
    .filter((item) => {
      if (location.pathname === item.path) return true;
      return location.pathname.startsWith(`${item.path}/`);
    })
    .sort((a, b) => b.path.length - a.path.length)[0];

  const selectedKeys = matchedItem ? [matchedItem.key] : [menuItems[0].key];

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="px-5 pb-8 pt-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 px-4 py-3 shadow-lg shadow-teal-500/30">
            <span className="text-2xl font-black text-white">S+</span>
          </div>
          <div>
            <p className="text-base uppercase tracking-[0.3em] text-white/60">
              Staff
            </p>
            <p className="text-lg font-semibold text-white">{roleText}</p>
          </div>
        </div>
      </div>

  <div className="px-5 py-4">
        <span className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-200">
          {roleText}
        </span>
      </div>

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
                [
                  "flex items-center justify-between w-full text-sm",
                  isActive
                    ? "text-cyan-300 font-semibold"
                    : "text-white/70 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ),
        }))}
        className="flex-1 bg-transparent border-0 px-4 [&_.ant-menu-item]:rounded-2xl [&_.ant-menu-item]:py-2"
        inlineIndent={16}
      />
    </div>
  );
};

export default StaffSidebar;

