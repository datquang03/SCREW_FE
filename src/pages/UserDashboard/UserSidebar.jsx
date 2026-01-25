import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import { FiHome, FiCalendar, FiVideo, FiClock, FiUser, FiDollarSign } from "react-icons/fi";
import { FaRepeat } from "react-icons/fa6";
import { AiOutlineAudit } from "react-icons/ai";
import { GoBookmark } from "react-icons/go";
import { TbFileReport } from "react-icons/tb";
import { MdOutlinePreview } from "react-icons/md";


const roleTextMap = {
  customer: "Người dùng",
  staff: "Nhân viên",
  admin: "Quản trị viên",
};

const UserSidebar = ({ variant = "customer" }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const roleText = roleTextMap[user?.role] || "Người dùng";

  const menuItems = useMemo(
    () => [
      {
        key: "bookings",
        icon: <FiCalendar />,
        label: "Đơn của tôi",
        path: "/dashboard/customer/bookings",
      },
      {
        key: "history",
        icon: <FiClock />,
        label: "Lịch sử giao dịch",
        path: "/dashboard/customer/history",
      },
       {
        key: "reports",
        icon: <TbFileReport />,
        label: "Đơn báo cáo",
        path: "/dashboard/customer/reports",
      },
      

        {
        key: "custom-requests",
        icon: <AiOutlineAudit />,
        label: "Yêu cầu Set Design",
        path: "/dashboard/customer/custom-requests",
      },
      {
        key: "refund-requests",
        icon: <FaRepeat />,
        label: "Yêu cầu hoàn tiền",
        path: "/dashboard/customer/refund-requests",
      },
      {
        key: "/reviews",
        icon: <MdOutlinePreview />,
        label: "Đánh giá",
        path: "/dashboard/customer/reviews",
      },
       {
        key: "/set-designs/bookings",
        icon: <GoBookmark />,
        label: "Lịch sử giao dịch Set Design",
        path: "/dashboard/customer/set-designs/bookings",
      },  
      {
        key: "profile",
        icon: <FiUser />,
        label: "Hồ sơ",
        path: "/dashboard/customer/profile",
      },
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
    <div className="flex h-full w-full flex-col bg-[#0F172A] text-white">
      <div className="px-5 pb-8 pt-10 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-[#C5A267] px-4 py-3 shadow-md">
            <span className="text-2xl font-black text-white">S+</span>
          </div>
          <div>
            <p className="text-base uppercase tracking-[0.4em] text-slate-400">
              S+ Studio
            </p>
            <p className="text-lg font-semibold text-white">{roleText}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <span className="inline-flex w-full items-center justify-center bg-[#C5A267] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white border border-[#C5A267]">
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
                  "flex items-center justify-between w-full",
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
        className="flex-1 bg-transparent border-0 px-4 [&_.ant-menu-item]:py-2"
        style={{ backgroundColor: "transparent" }}
        inlineIndent={16}
      />
    </div>
  );
};

export default UserSidebar;
