// src/components/navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  LogoutOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { MdNotifications, MdOutlineSpaceDashboard } from "react-icons/md";

import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../features/notification/notificationSlice";
import { getConversations } from "../../features/message/messageSlice";
import SPlusLogo from "../../assets/S+Logo.png";
import notificationSound from "../../assets/notification.mp3";
import { NAV_LINKS } from "../../constants/navigation";
import { useScrollEffect } from "../../hooks/useScrollEffect";

const Navbar = () => {
  const scrolled = useScrollEffect(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [allNotificationsModalOpen, setAllNotificationsModalOpen] =
    useState(false);
  const [visibleDropdownCount, setVisibleDropdownCount] = useState(4);

  const headerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const notificationAudioRef = useRef(null);
  const previousUnreadCountRef = useRef(0);
  const dropdownPanelRef = useRef(null);
  const dropdownScrollRef = useRef(null);
  const modalBodyRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications, loading: notificationsLoading } = useSelector(
    (state) => state.notification || { notifications: [], loading: false }
  );
  const { messages = {}, conversations = [] } = useSelector(
    (state) => state.message || { messages: {}, conversations: [] }
  );

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  // Initialize audio
  useEffect(() => {
    if (notificationAudioRef.current) return;
    notificationAudioRef.current = new Audio(notificationSound);
    notificationAudioRef.current.volume = 0.5; // Set volume to 50%
  }, []);

  // Fetch notifications & conversations from Redux
  useEffect(() => {
    if (!user) return;
    dispatch(getNotifications());
    dispatch(getConversations());
  }, [user, dispatch]);

  // Helper function để lấy avatar URL từ object hoặc string
  const getAvatarUrl = (avatar) => {
    if (!avatar) return undefined;
    if (typeof avatar === "string") return avatar;
    if (typeof avatar === "object" && avatar.url) return avatar.url;
    return undefined;
  };

  const myId = user?._id || user?.id;
  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;
  const unreadMessagesFromMessages = Object.values(messages).reduce(
    (acc, list) => {
      if (!Array.isArray(list)) return acc;
      const unread = list.filter(
        (m) =>
          !m.isRead && !m.read && (m.fromUserId?._id || m.fromUserId) !== myId // only count messages from others
      );
      return acc + unread.length;
    },
    0
  );
  const unreadMessagesFromConvs = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );
  const unreadMessagesCount =
    unreadMessagesFromConvs > 0
      ? unreadMessagesFromConvs
      : unreadMessagesFromMessages;
  const dropdownNotifications = notifications.slice(0, visibleDropdownCount);

  // Play notification sound when new notification arrives
  useEffect(() => {
    if (!user || notificationsLoading) return;

    const currentUnreadCount = unreadCount;
    const previousUnreadCount = previousUnreadCountRef.current;

    // Play sound if there's a new unread notification (unread count increased)
    if (currentUnreadCount > previousUnreadCount && previousUnreadCount >= 0) {
      if (notificationAudioRef.current) {
        notificationAudioRef.current.play().catch((err) => {
          // Handle autoplay restrictions
          console.log("Could not play notification sound:", err);
        });
      }
    }

    // Update previous count
    previousUnreadCountRef.current = currentUnreadCount;
  }, [unreadCount, notifications, user, notificationsLoading]);

  // Reset dropdown count when toggling
  useEffect(() => {
    if (notifOpen) {
      setVisibleDropdownCount(4);
    }
  }, [notifOpen]);

  // Auto mark read when visible or hovered in dropdown
  useEffect(() => {
    if (!notifOpen) return;

    const root = dropdownScrollRef.current || dropdownPanelRef.current || null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notificationId = entry.target.dataset.id;
            const notification = notifications.find(
              (n) => n._id === notificationId
            );
            if (notification && !notification.isRead && !notification.read) {
              dispatch(markNotificationRead(notificationId));
            }
          }
        });
      },
      { root, threshold: 0.5 }
    );

    const elems = document.querySelectorAll(".notification-item");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [notifOpen, notifications, dispatch]);

  // Auto mark read when visible or hovered in modal
  useEffect(() => {
    if (!allNotificationsModalOpen) return;

    const root = modalBodyRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notificationId = entry.target.dataset.id;
            const notification = notifications.find(
              (n) => n._id === notificationId
            );
            if (notification && !notification.isRead && !notification.read) {
              dispatch(markNotificationRead(notificationId));
            }
          }
        });
      },
      {
        root,
        threshold: 0.5,
      }
    );

    const elems = document.querySelectorAll(".modal-notification-item");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [allNotificationsModalOpen, notifications, dispatch]);

  const handleDropdownScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      visibleDropdownCount < notifications.length
    ) {
      setVisibleDropdownCount((prev) =>
        Math.min(prev + 3, notifications.length)
      );
    }
  };

  const handleMessageClick = () => {
    if (!user) return navigate("/login");
    dispatch(getConversations());
    navigate("/message");
  };

  const handleDeleteNotification = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa thông báo này không?",
      onOk: () => {
        dispatch(deleteNotification(id));
      },
    });
  };

  const handleNotificationHover = (notificationId) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (notification && !notification.isRead && !notification.read) {
      dispatch(markNotificationRead(notificationId));
    }
  };

  const headerClass = `navbar-professional ${scrolled ? "scrolled" : "top"}`;

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* ===== LOGO ===== */}
        <Link to="/" className="navbar-logo">
          <motion.img
            src={SPlusLogo}
            alt="S+ Studio Logo"
            className="h-16 md:h-24 lg:h-28 w-auto object-contain"
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
            transition={{ duration: 0.45 }}
          />
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
                  `navbar-nav-link ${
                    scrolled
                      ? isActive
                        ? "active text-amber-600"
                        : "text-gray-700 hover:text-gray-900"
                      : isActive
                      ? "active text-amber-300"
                      : "text-gray-200 hover:text-white"
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
          {/* MESSAGE */}
          {user && (
            <div className="relative">
              <motion.button
                type="button"
                onClick={handleMessageClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className={`navbar-action-btn ${
                  scrolled ? "scrolled-light" : ""
                } ${scrolled ? "text-gray-900" : "text-white/80"}`}
              >
                <MessageOutlined className="text-lg" />
                {unreadMessagesCount > 0 && (
                  <span className="navbar-badge">
                    {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                  </span>
                )}
              </motion.button>
            </div>
          )}

          {/* SEARCH */}
          <div ref={searchContainerRef} className="relative flex items-center">
            <AnimatePresence mode="wait">
              {!searchOpen ? (
                <motion.button
                  key="search-button"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className={`navbar-action-btn ${
                    scrolled ? "scrolled-light" : ""
                  } ${scrolled ? "text-gray-900" : "text-white/80"}`}
                >
                  <SearchOutlined className="text-lg" />
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
                  <motion.div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-white shadow-lg border border-gray-200">
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
            <div className="relative notif-dropdown">
              <motion.button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className={`navbar-action-btn ${
                  scrolled ? "scrolled-light" : ""
                } ${scrolled ? "text-gray-900" : "text-white/80"}`}
              >
                <MdNotifications className="text-lg" />
                {unreadCount > 0 && (
                  <span className="navbar-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    ref={dropdownPanelRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="navbar-dropdown-panel absolute right-0 mt-3 w-96 max-h-[430px] z-[110] flex flex-col overflow-hidden"
                  >
                    <div className="navbar-dropdown-header flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Thông báo của bạn
                        </p>
                        <p className="text-xs text-gray-500">
                          Cập nhật mới nhất theo thời gian thực
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <div
                      ref={dropdownScrollRef}
                      onScroll={handleDropdownScroll}
                      className="flex-1 overflow-y-auto max-h-[330px] p-3 space-y-2 custom-scrollbar"
                    >
                      {notificationsLoading ? (
                        <div className="flex flex-col gap-3">
                          {[...Array(3)].map((_, idx) => (
                            <div
                              key={idx}
                              className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2"
                            >
                              <div className="h-3 w-24 bg-gray-200 rounded" />
                              <div className="h-3 w-40 bg-gray-200 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : dropdownNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                          <MdNotifications className="text-3xl text-gray-300 mb-2" />
                          <p>Chưa có thông báo</p>
                        </div>
                      ) : (
                        <>
                          {dropdownNotifications.map((n) => {
                            const isRead = n.isRead || n.read;
                            return (
                              <div
                                key={n._id}
                                data-id={n._id}
                                onMouseEnter={() =>
                                  handleNotificationHover(n._id)
                                }
                                className={`notification-item group relative flex items-start justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border ${
                                  isRead
                                    ? "bg-gray-50 border-gray-100 hover:bg-gray-100"
                                    : "bg-white border-blue-200 shadow-sm hover:shadow-md"
                                }`}
                              >
                                <div className="flex flex-col flex-1 pr-2">
                                  {!isRead && (
                                    <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full w-fit">
                                      Chưa đọc
                                    </span>
                                  )}
                                  <span className="font-semibold text-gray-800 text-sm">
                                    {n.title}
                                  </span>
                                  <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {n.message}
                                  </span>
                                  {n.createdAt && (
                                    <span className="text-[11px] text-gray-400 mt-1">
                                      {new Date(n.createdAt).toLocaleString(
                                        "vi-VN",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          day: "2-digit",
                                          month: "2-digit",
                                        }
                                      )}
                                    </span>
                                  )}
                                </div>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(n._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 p-1.5 hover:bg-red-100 rounded-full"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <DeleteOutlined className="text-red-500 text-base" />
                                </motion.button>
                              </div>
                            );
                          })}
                          {dropdownNotifications.length ===
                            notifications.length && (
                            <p className="text-center text-xs text-gray-400 py-2">
                              Hết thông báo
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="border-t border-gray-200 bg-white p-3">
                      <Button
                        type="link"
                        onClick={() => {
                          setNotifOpen(false);
                          setAllNotificationsModalOpen(true);
                        }}
                        className="w-full text-sm font-bold text-amber-600 hover:text-amber-700"
                      >
                        Xem tất cả →
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
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-all"
                >
                  <img
                    key={getAvatarUrl(user.avatar) || ""}
                    src={
                      getAvatarUrl(user.avatar) ||
                      "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                    }
                    alt="User Avatar"
                    className="navbar-avatar"
                    onError={(e) => {
                      e.target.src =
                        "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg";
                    }}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      className="navbar-dropdown-panel absolute right-0 mt-2 w-64 z-[110]"
                    >
                      <div className="navbar-dropdown-header">
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
                            className="navbar-dropdown-item w-full flex items-center gap-3 text-gray-800"
                          >
                            <MdOutlineSpaceDashboard className="text-lg" />{" "}
                            Dashboard
                          </button>
                        </li>

                        {/* Logout */}
                        <li className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="navbar-dropdown-item w-full flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="flex items-center gap-3">
              <Button
                href="/login"
                className="border border-amber-500/50 text-amber-600 font-bold text-sm px-5 py-2 rounded-lg hover:bg-amber-50 transition-all"
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                href="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-500 border-none font-bold text-sm px-5 py-2 shadow-lg hover:shadow-lg hover:opacity-95 text-white"
              >
                Đăng ký
              </Button>
            </div>
          )}


        </div>
      </div>

      {/* ===== ALL NOTIFICATIONS MODAL ===== */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              Tất cả thông báo
            </span>
            {unreadCount > 0 && (
              <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
        }
        open={allNotificationsModalOpen}
        onCancel={() => setAllNotificationsModalOpen(false)}
        footer={null}
        width={600}
        className="all-notifications-modal"
        styles={{
          body: { padding: 0, maxHeight: "70vh", overflow: "hidden" },
        }}
      >
        <div
          ref={modalBodyRef}
          className="overflow-y-auto max-h-[70vh] p-4 space-y-2 custom-scrollbar"
        >
          {notificationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-gray-500">Đang tải...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-gray-500">Chưa có thông báo</span>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => {
                const isRead = n.isRead || n.read;
                return (
                  <div
                    key={n._id}
                    data-id={n._id}
                    onMouseEnter={() => handleNotificationHover(n._id)}
                    className={`modal-notification-item group relative flex items-start justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      isRead
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-white hover:bg-gray-50 border-l-4 border-blue-500"
                    }`}
                  >
                    <div className="flex flex-col flex-1 pr-2">
                      {!isRead && (
                        <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full w-fit">
                          Chưa đọc
                        </span>
                      )}
                      <span className="font-semibold text-gray-800 text-sm">
                        {n.title}
                      </span>
                      <span className="text-xs text-gray-600 mt-1 line-clamp-3">
                        {n.message}
                      </span>
                      {n.createdAt && (
                        <span className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(n._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 p-1.5 hover:bg-red-100 rounded-full ml-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <DeleteOutlined className="text-red-500 text-base" />
                    </motion.button>
                  </div>
                );
              })}

              {/* End of notifications marker */}
              <p className="text-center text-xs text-gray-400 py-3">
                Hết thông báo
              </p>
            </div>
          )}
        </div>
      </Modal>
    </motion.header>
  );
};

export default Navbar;
