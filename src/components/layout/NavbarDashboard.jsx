import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import SPlusLogo from "../../assets/S+Logo.png";

const DashboardNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".avatar-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <header className="w-full md:w-[calc(100%-16rem)] fixed top-0 md:left-64 left-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div onClick={() => navigate("/dashboard/staff")} className="flex items-center gap-2 cursor-pointer">
          <motion.img
            src={SPlusLogo}
            alt="S+ Logo"
            className="h-9 w-auto object-contain"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          />
          <span className="text-gray-800 font-semibold text-base">S+ Dashboard</span>
        </div>

        {/* USER DROPDOWN */}
        <div className="relative avatar-dropdown">
          <motion.button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <img
              src={user?.avatar || "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
            />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-[110]"
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button onClick={() => { setDropdownOpen(false); navigate("/dashboard/staff/profile"); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <UserOutlined /> Hồ sơ
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setDropdownOpen(false); navigate("/dashboard/staff/settings"); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <SettingOutlined /> Cài đặt
                    </button>
                  </li>
                  <li className="border-t border-gray-200">
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogoutOutlined /> Đăng xuất
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
