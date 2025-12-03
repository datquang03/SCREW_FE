// src/components/navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined,
  HeartOutlined,
  FileTextOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MdNotifications, MdOutlineSpaceDashboard } from "react-icons/md";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const headerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user._id}`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.notifications);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Auto mark read when visible
  useEffect(() => {
    if (!notifOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            setNotifications((prev) =>
              prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
          }
        });
      },
      { root: document.querySelector(".notif-dropdown"), threshold: 0.5 }
    );

    const elems = document.querySelectorAll(".notification-item");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [notifOpen, notifications]);

  const handleDeleteNotification = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa thông báo này không?",
      onOk: () => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      },
    });
  };

  const headerClass = scrolled
    ? "fixed top-0 left-0 w-full bg-white/95 border-b border-white/60 shadow-xl backdrop-blur-xl"
    : "absolute top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900";

  // Click outside dropdown/search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".avatar-dropdown"))
        setDropdownOpen(false);
      if (
        searchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      )
        setSearchOpen(false);
      if (notifOpen && !e.target.closest(".notif-dropdown"))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, searchOpen, notifOpen]);

  // Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${headerClass} z-[100] transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* ===== LOGO ===== */}
        <Link to="/" className="flex items-center group">
          <motion.img
            src={SPlusLogo}
            alt="S+ Studio Logo"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_20px_45px_rgba(248,197,89,0.5)]"
            style={{ imageRendering: "crisp-edges", minWidth: "80px" }}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
            transition={{ duration: 0.45 }}
          />
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        <nav className="hidden lg:flex items-center gap-1">
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
                  `px-4 py-2 rounded-md text-base font-semibold transition-all duration-300 ${
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
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div ref={searchContainerRef} className="relative flex items-center">
            <AnimatePresence mode="wait">
              {!searchOpen ? (
                <motion.button
                  key="search-button"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <SearchOutlined className="text-lg text-gray-900" />
                </motion.button>
              ) : (
                <motion.div
                  key="search-bar"
                  initial={{ scaleX: 0, opacity: 0, x: -20 }}
                  animate={{ scaleX: 1, opacity: 1, x: 0 }}
                  exit={{ scaleX: 0, opacity: 0, x: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.3,
                  }}
                  className="origin-right w-64"
                  style={{ transformOrigin: "100% 50%" }}
                >
                  <motion.div className="flex items-center gap-2 rounded-full px-4 py-2.5 bg-white shadow-xl shadow-gray-900/20 border border-gray-100">
                    <SearchOutlined className="text-base text-amber-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm studio..."
                      className="w-full bg-transparent text-sm outline-none placeholder-gray-400 text-gray-900"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <CloseOutlined />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== NOTIFICATION ICON ===== */}
          {user && (
            <div className="relative">
              <Button
                type="text"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative text-gray-700 hover:text-gray-900"
                icon={<MdNotifications className="text-2xl" />}
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="notif-dropdown absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[110] flex flex-col"
                  >
                    <div className="flex-1 overflow-y-auto max-h-72 p-2">
                      {notifications.slice(0, 4).map((n) => (
                        <div
                          key={n._id}
                          data-id={n._id}
                          className={`notification-item flex items-center justify-between px-4 py-3 mb-1 rounded-lg cursor-pointer ${
                            n.isRead ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {n.title}
                            </span>
                            <span className="text-sm text-gray-600">
                              {n.message}
                            </span>
                          </div>
                          <DeleteOutlined
                            className="text-red-500 text-base opacity-0 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(n._id);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 p-2 text-center">
                      <Button
                        type="link"
                        onClick={() => navigate("/notifications")}
                        className="text-sm font-semibold"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* USER / AUTH */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="relative avatar-dropdown">
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
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/60 shadow-lg cursor-pointer"
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl shadow-2xl border border-yellow-200 z-[110]"
                    >
                      <div className="p-4 border-b border-yellow-200">
                        <p className="text-sm font-bold text-gray-900">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>

                      <ul className="py-2">
                        {/* Dashboard */}
                        <li>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              let dashboardPath = "/dashboard";
                              if (user.role === "customer")
                                dashboardPath = "/dashboard/customer";
                              if (user.role === "staff")
                                dashboardPath = "/dashboard/staff";
                              if (user.role === "admin")
                                dashboardPath = "/dashboard/admin";
                              navigate(dashboardPath);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-800 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-all cursor-pointer"
                          >
                            <MdOutlineSpaceDashboard className="text-lg" />{" "}
                            Dashboard
                          </button>
                        </li>

                        {/* Customer only */}
                        {user.role === "customer" && (
                          <>
                            <li>
                              <button
                                onClick={() => {
                                  setDropdownOpen(false);
                                  navigate("/studio/customer/liked");
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-800 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-all cursor-pointer"
                              >
                                <HeartOutlined className="text-lg" /> Studio đã
                                thích
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  setDropdownOpen(false);
                                  navigate("/studio/customer/reviews");
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-800 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-all cursor-pointer"
                              >
                                <FileTextOutlined className="text-lg" /> Reviews
                                đã thích
                              </button>
                            </li>
                          </>
                        )}

                        {/* Settings */}
                        <li>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              navigate("/settings");
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-800 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-all"
                          >
                            <SettingOutlined className="text-lg" /> Cài đặt
                          </button>
                        </li>

                        {/* Logout */}
                        <li className="border-t border-yellow-200">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all cursor-pointer"
                          >
                            <LogoutOutlined className="text-lg" /> Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                href="/login"
                className="border border-yellow-500 text-yellow-500 font-semibold text-xs px-3 rounded-md hover:bg-yellow-50 transition-all"
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                href="/register"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none font-semibold text-xs px-3 shadow-md hover:shadow-yellow-500/40"
              >
                Đăng ký
              </Button>
            </div>
          )}

          {/* ===== MOBILE MENU BUTTON ===== */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: mobileMenuOpen ? 90 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-3 rounded-full transition-all duration-300 ease-in-out ${
              scrolled
                ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
          >
            <motion.div
              animate={{
                rotate: mobileMenuOpen ? 180 : 0,
                scale: mobileMenuOpen ? 1.1 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {mobileMenuOpen ? (
                <CloseOutlined className="text-lg" />
              ) : (
                <MenuOutlined className="text-lg" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black z-[50]"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-72 h-screen bg-white shadow-2xl z-[60] flex flex-col p-6"
            >
              {NAV_LINKS.map(({ path, label, key: linkKey }) => (
                <NavLink
                  key={linkKey}
                  to={path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all ${
                      isActive ? "bg-yellow-100 text-yellow-600" : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
