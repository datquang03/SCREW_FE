import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import SPlusLogo from "../../assets/S+Logo.png";
import { NAV_LINKS } from "../../constants/navigation";
import { useScrollEffect } from "../../hooks/useScrollEffect";

const Navbar = () => {
  const scrolled = useScrollEffect(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".avatar-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-2">
        {/* ===== LOGO ===== */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={SPlusLogo}
            alt="S+ Studio Logo"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-lg"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          />
          <span
            className={`text-sm md:text-base font-bold transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            } group-hover:text-yellow-400`}
          >
            S+ Studio
          </span>
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        <nav className="hidden lg:flex items-center gap-2">
          {NAV_LINKS.map(({ path, label, key: linkKey }, i) => (
            <motion.div
              key={linkKey}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? scrolled
                        ? "text-yellow-600 bg-yellow-100"
                        : "text-yellow-400 bg-white/20"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* ===== RIGHT ACTIONS ===== */}
        <div className="flex items-center gap-2">
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined />}
            className={scrolled ? "text-gray-700" : "text-white"}
          />

          {/* Nếu đã đăng nhập */}
          {user ? (
            <div className="relative avatar-dropdown cursor-pointer">
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <img
                  src={
                    user.avatar ||
                    "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
                />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[110]"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/dashboard");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <MdOutlineSpaceDashboard  /> Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/profile");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <UserOutlined /> Hồ sơ
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/settings");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <SettingOutlined /> Cài đặt
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/settings");
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <SettingOutlined /> Cài đặt
                        </button>
                      </li>
                      <li className="border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogoutOutlined /> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              type="primary"
              href="/register"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none font-semibold text-xs px-3 shadow-md hover:shadow-yellow-500/40"
            >
              Đăng ký
            </Button>
          )}

          {/* ===== MOBILE MENU BUTTON ===== */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </motion.button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-[100] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Menu
                </span>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={closeMobileMenu}
                  className="text-gray-700"
                />
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map(({ path, label, key: linkKey }) => (
                    <li key={linkKey}>
                      <NavLink
                        to={path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg text-sm font-medium ${
                            isActive
                              ? "bg-yellow-100 text-yellow-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}

                  {!user && (
                    <li className="pt-3">
                      <Button
                        type="primary"
                        block
                        href="/register"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none"
                      >
                        Đăng ký
                      </Button>
                    </li>
                  )}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
