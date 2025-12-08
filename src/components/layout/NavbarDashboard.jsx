import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Modal } from "antd";
import {
  FiLogOut,
  FiSettings,
  FiUser,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { MdNotifications } from "react-icons/md";
import { DeleteOutlined } from "@ant-design/icons";
import { logout } from "../../features/auth/authSlice";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../features/notification/notificationSlice";
import SPlusLogo from "../../assets/S+Logo.png";
import notificationSound from "../../assets/notification.mp3";

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

// Helper function để lấy dashboard path
const getDashboardPath = (user) => {
  if (!user) return "/dashboard";
  if (user.role === "customer") return "/dashboard/customer";
  if (user.role === "staff") return "/dashboard/staff";
  if (user.role === "admin") return "/dashboard/admin";
  return "/dashboard";
};

const DashboardNavbar = ({ variant = "default" }) => {
  const theme = THEMES[variant] || THEMES.default;
  const { user } = useSelector((state) => state.auth);
  const { notifications, loading: notificationsLoading } = useSelector(
    (state) => state.notification || { notifications: [], loading: false }
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [allNotificationsModalOpen, setAllNotificationsModalOpen] =
    useState(false);
  const [visibleDropdownCount, setVisibleDropdownCount] = useState(4);

  const notificationAudioRef = useRef(null);
  const previousUnreadCountRef = useRef(0);
  const dropdownPanelRef = useRef(null);
  const dropdownScrollRef = useRef(null);
  const modalBodyRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize audio
  useEffect(() => {
    if (notificationAudioRef.current) return;
    notificationAudioRef.current = new Audio(notificationSound);
    notificationAudioRef.current.volume = 0.5;
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    dispatch(getNotifications());
  }, [user, dispatch]);

  // Helper function để lấy avatar URL từ object hoặc string
  const getAvatarUrl = (avatar) => {
    if (!avatar) return undefined;
    if (typeof avatar === "string") return avatar;
    if (typeof avatar === "object" && avatar.url) return avatar.url;
    return undefined;
  };

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;
  const dropdownNotifications = notifications.slice(0, visibleDropdownCount);

  // Play notification sound when new notification arrives
  useEffect(() => {
    if (!user || notificationsLoading) return;

    const currentUnreadCount = unreadCount;
    const previousUnreadCount = previousUnreadCountRef.current;

    if (
      currentUnreadCount > previousUnreadCount &&
      previousUnreadCount >= 0
    ) {
      if (notificationAudioRef.current) {
        notificationAudioRef.current.play().catch((err) => {
          console.log("Could not play notification sound:", err);
        });
      }
    }

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

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  // Click outside handlers
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".dashboard-avatar")) setDropdownOpen(false);
      if (notifOpen && !e.target.closest(".notif-dropdown"))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen, notifOpen]);

  return (
    <header
      className={`fixed top-0 left-0 lg:left-64 xl:left-72 right-0 z-30 border-b border-white/40 shadow backdrop-blur-xl ${theme.bg}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        <button onClick={() => navigate("/")} className="group cursor-pointer">
          <motion.img
            src={SPlusLogo}
            alt="S+ logo"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-xl"
            whileHover={{ rotate: [-4, 4, -2, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </button>

        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          {user && (
            <div className="relative notif-dropdown">
              <motion.button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                initial={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <MdNotifications className="text-lg text-gray-900" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
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
                    className="notif-dropdown-panel absolute left-1/2 -translate-x-1/2 mt-3 w-80 max-h-[430px] bg-white rounded-2xl shadow-[0_20px_45px_rgba(15,23,42,0.25)] border border-gray-200 z-[110] flex flex-col overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Thông báo của bạn
                        </p>
                        <p className="text-xs text-gray-500">
                          Cập nhật mới nhất theo thời gian thực
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <div
                      ref={dropdownScrollRef}
                      onScroll={handleDropdownScroll}
                      className="notif-scroll-container flex-1 overflow-y-auto max-h-[330px] p-3 space-y-2 custom-scrollbar"
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
                    <div className="border-t border-gray-100 bg-gray-50 p-3">
                      <Button
                        type="link"
                        onClick={() => {
                          setNotifOpen(false);
                          setAllNotificationsModalOpen(true);
                        }}
                        className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="relative dashboard-avatar">
          <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1.5 bg-white shadow-lg border border-gray-100"
          >
            <img
                key={getAvatarUrl(user?.avatar) || ""}
                src={
                  getAvatarUrl(user?.avatar) ||
                  "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-white shadow"
                onError={(e) => {
                  e.target.src = "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg";
                }}
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
                        navigate(getDashboardPath(user));
                      }}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiMenu /> Tới dashboard
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`${getDashboardPath(user)}/profile`);
                      }}
                      className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser /> Hồ sơ
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`${getDashboardPath(user)}/settings`);
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

      {/* All Notifications Modal */}
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
    </header>
  );
};

export default DashboardNavbar;
