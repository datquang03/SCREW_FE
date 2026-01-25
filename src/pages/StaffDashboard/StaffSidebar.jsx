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
} from "react-icons/fi";
import { MdDesignServices, MdMiscellaneousServices, MdOutlineDiscount } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { AiOutlineProfile } from "react-icons/ai";
import { RiCustomerService2Fill, RiRefund2Line } from "react-icons/ri";
import { LuNotebookPen } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";

const StaffSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const roleText = user?.role === "staff" ? "Nhân viên" : "Thành viên";

  const menuItems = useMemo(
    () => [
      { key: "dashboard", icon: <FiHome />, label: "Bảng điều khiển", path: "/dashboard/staff" },
      { key: "orders", icon: <FiShoppingBag />, label: "Quản lý đơn", path: "/dashboard/staff/order" },
      { key: "users", icon: <FaUsers />, label: "Quản lý người dùng", path: "/dashboard/staff/user" },
      { key: "schedule", icon: <FiCalendar />, label: "Lịch làm việc", path: "/dashboard/staff/schedule" },
      { key: "studios", icon: <FiVideo />, label: "Quản lý Studio", path: "/dashboard/staff/studios" },
      { key: "setdesign", icon: <MdDesignServices />, label: "Quản lý Set Design", path: "/dashboard/staff/setdesign" },
      { key: "custom-request", icon: <RiCustomerService2Fill />, label: "Đơn yêu cầu Set tùy chọn", path: "/dashboard/staff/custom-request" },
      { key: "equipment", icon: <FiTool />, label: "Thiết bị", path: "/dashboard/staff/equipment" },
      { key: "service", icon: <MdMiscellaneousServices />, label: "Dịch vụ", path: "/dashboard/staff/service" },
      { key: "reviews", icon: <MdMiscellaneousServices />, label: "Đánh giá", path: "/dashboard/staff/reviews" },
      { key: "promotion", icon: <MdOutlineDiscount />, label: "Mã giảm giá", path: "/dashboard/staff/promotion" },
      { key: "transaction", icon: <GiMoneyStack />, label: "Quản lý giao dịch", path: "/dashboard/staff/transaction" },
      { key: "refunds", icon: <RiRefund2Line />, label: "Yêu cầu hoàn tiền", path: "/dashboard/staff/refunds" },
      { key: "report", icon: <LuNotebookPen />, label: "Báo cáo", path: "/dashboard/staff/report" },
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
    <div className="flex h-full w-full flex-col bg-[#0F172A] text-white overflow-hidden">
      <div className="px-5 pb-5 pt-10 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#C5A267] px-3 py-2 shadow-md">
            <span className="text-xl font-black text-white">S+</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Staff
            </p>
            <p className="text-base font-semibold text-white">{roleText}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 flex-shrink-0">
        <span className="inline-flex w-full items-center justify-center border border-[#C5A267] bg-[#C5A267] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
          {roleText}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C5A267 transparent' }}>
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
                      ? "text-[#C5A267] font-semibold"
                      : "text-slate-300 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ),
          }))}
          className="bg-transparent border-0 [&_.ant-menu-item]:py-2"
          style={{ backgroundColor: "transparent" }}
          inlineIndent={16}
        />
      </div>
    </div>
  );
};

export default StaffSidebar;

