import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
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
  const [searchOpen, setSearchOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".avatar-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const headerClass = scrolled
    ? "fixed top-0 left-0 w-full bg-white/95 border-b border-white/60 shadow-xl backdrop-blur-xl"
    : "absolute top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900";

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
            style={{
              imageRendering: "crisp-edges",
              minWidth: "80px",
            }}
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
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <FiSearch className="text-lg text-gray-900" />
                </motion.button>
              ) : (
                <motion.div
                  key="search-bar"
                  initial={{
                    scaleX: 0,
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    scaleX: 1,
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    scaleX: 0,
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.3,
                  }}
                  className="origin-right w-64"
                  style={{ transformOrigin: "100% 50%" }}
                >
                  <motion.div
                    initial={{ borderRadius: "9999px" }}
                    animate={{ borderRadius: "9999px" }}
                    className="flex items-center gap-2 rounded-full px-4 py-2.5 bg-white shadow-xl shadow-gray-900/20 border border-gray-100"
                  >
                    <FiSearch className="text-base text-amber-500" />

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
                      <FiX />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER / AUTH */}
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
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/60 shadow-lg cursor-pointer"
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
                            const role = user.role;
                            let dashboardPath = "/dashboard";

                            if (role === "customer") dashboardPath = "/dashboard/customer";
                            if (role === "staff") dashboardPath = "/dashboard/staff";
                            if (role === "admin") dashboardPath = "/dashboard/admin";

                            navigate(dashboardPath);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <MdOutlineSpaceDashboard /> Dashboard
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
                          <FiUser /> Hồ sơ
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
                          <FiSettings /> Cài đặt
                        </button>
                      </li>

                      <li className="border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut /> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Nút đăng nhập */}
              <Button
                href="/login"
                className="border border-yellow-500 text-yellow-500 font-semibold text-xs px-3 rounded-md hover:bg-yellow-50 transition-all"
              >
                Đăng nhập
              </Button>

              {/* Nút đăng ký */}
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
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              {mobileMenuOpen ? (
                <FiX className="text-lg" />
              ) : (
                <FiMenu className="text-lg" />
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            />

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
                  icon={<FiX />}
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
                          `block px-4 py-3 rounded-lg text-base font-semibold ${
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
                      <div className="flex flex-col gap-2">
                        <Button
                          href="/login"
                          className="border border-yellow-500 text-yellow-600 font-semibold"
                          block
                        >
                          Đăng nhập
                        </Button>

                        <Button
                          type="primary"
                          block
                          href="/register"
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none"
                        >
                          Đăng ký
                        </Button>
                      </div>
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
