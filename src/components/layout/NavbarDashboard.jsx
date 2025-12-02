import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiLogOut,
  FiSettings,
  FiUser,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { logout } from "../../features/auth/authSlice";
import SPlusLogo from "../../assets/S+Logo.png";

const THEMES = {
  customer: {
    bg: "bg-gradient-to-r from-amber-50 via-white to-white",
    accent: "text-amber-600",
    pill: "bg-amber-100 text-amber-700",
  },
  staff: {
    bg: "bg-gradient-to-r from-emerald-50 via-white to-white",
    accent: "text-emerald-600",
    pill: "bg-emerald-100 text-emerald-700",
  },
  admin: {
    bg: "bg-gradient-to-r from-indigo-50 via-white to-white",
    accent: "text-indigo-600",
    pill: "bg-indigo-100 text-indigo-700",
  },
  default: {
    bg: "bg-white",
    accent: "text-gray-900",
    pill: "bg-gray-100 text-gray-700",
  },
};

const DashboardNavbar = ({ variant = "default" }) => {
  const theme = THEMES[variant] || THEMES.default;
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".dashboard-avatar")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "staff") return "/dashboard/staff";
    return "/dashboard/customer";
  };

  return (
    <header
      className={`fixed top-0 left-0 lg:left-64 xl:left-72 right-0 z-30 border-b border-white/40 shadow backdrop-blur-xl ${theme.bg}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        <button onClick={() => navigate(getDashboardPath())} className="group">
          <motion.img
            src={SPlusLogo}
            alt="S+ logo"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-xl"
            whileHover={{ rotate: [-4, 4, -2, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative dashboard-avatar">
          <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1.5 bg-white shadow-lg border border-gray-100"
          >
            <img
                src={
                  user?.avatar ||
                  "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-white shadow"
              />
              <span className="hidden sm:block text-sm font-semibold text-gray-800">
                {user?.fullName || user?.username || "User"}
              </span>
              <FiChevronDown className="text-gray-400" />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName || user?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                </div>

                  <nav className="flex flex-col py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(getDashboardPath());
                      }}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiMenu /> Tới dashboard
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`${getDashboardPath()}/profile`);
                      }}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser /> Hồ sơ
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`${getDashboardPath()}/settings`);
                      }}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiSettings /> Cài đặt
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <FiLogOut /> Đăng xuất
                    </button>
                  </nav>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
