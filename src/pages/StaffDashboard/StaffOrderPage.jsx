// src/pages/StaffDashboard/StaffOrderPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Modal,
  Divider,
  Spin,
  message,
  Dropdown,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  FiMoreVertical,
  FiLogIn,
  FiLogOut,
  FiUserX,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiCheckCircle, // ĐÃ THÊM ICON NÀY ĐỂ FIX LỖI!
} from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";
import {
  getAllMyBookings as getAllBookingForStaff,
  getBookingById,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
} from "../../features/booking/bookingSlice";

const { Title, Text } = Typography;

const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v || "-";

// Tính số tiền đã trả và còn lại cho prepay
const calculatePaymentInfo = (booking) => {
  const finalAmount = booking.finalAmount || 0;
  const payType = booking.payType || "";

  if (payType === "full") {
    return {
      paidAmount: finalAmount,
      remainingAmount: 0,
      paidPercentage: 100,
      remainingPercentage: 0,
    };
  }

  if (payType.startsWith("prepay_")) {
    const percentage = parseInt(payType.split("_")[1]) || 0;
    const paidAmount = Math.round((finalAmount * percentage) / 100);
    const remainingAmount = finalAmount - paidAmount;

    return {
      paidAmount,
      remainingAmount,
      paidPercentage: percentage,
      remainingPercentage: 100 - percentage,
    };
  }

  return {
    paidAmount: 0,
    remainingAmount: finalAmount,
    paidPercentage: 0,
    remainingPercentage: 100,
  };
};

// Xác định trạng thái hiển thị
const getStatusDisplay = (booking) => {
  const hasNoShow = booking.events?.some((e) => e.type === "NO_SHOW");
  if (hasNoShow)
    return { label: "Không đến (No-Show)", color: "red", icon: <FiUserX /> };
  if (booking.checkOutAt)
    return { label: "Đã check-out", color: "green", icon: <FiLogOut /> };

  // Kiểm tra status "checked_in" hoặc có event CHECK_IN
  const hasCheckIn =
    booking.status === "checked_in" ||
    booking.events?.some((e) => e.type === "CHECK_IN") ||
    booking.checkInAt;
  if (hasCheckIn)
    return { label: "Đã check-in", color: "purple", icon: <FiLogIn /> };

  if (booking.status === "pending")
    return { label: "Đang chờ", color: "orange" };
  if (booking.status === "confirmed")
    return { label: "Đã xác nhận", color: "blue" };
  if (booking.status === "completed")
    return { label: "Hoàn tất", color: "green" };
  if (booking.status === "cancelled") return { label: "Đã hủy", color: "gray" };
  return { label: "Không rõ", color: "default" };
};

const StaffOrderPage = () => {
  const dispatch = useDispatch();
  const {
    myBookings: staffBookings = [],
    currentBooking,
    loading,
  } = useSelector((state) => state.booking);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    dispatch(getAllBookingForStaff());
  }, [dispatch]);

  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      await dispatch(getBookingById(bookingId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      message.error(err?.message || "Không thể tải chi tiết");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (action, bookingId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
      await dispatch(action(bookingId)).unwrap();
      message.success("Thao tác thành công!");
      dispatch(getAllBookingForStaff());
      if (detailModalOpen && currentBooking?._id === bookingId) {
        await dispatch(getBookingById(bookingId)).unwrap();
      }
    } catch (err) {
      message.error(err?.message || "Thao tác thất bại");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Dropdown menu
  const getDropdownMenu = (record) => {
    const { _id, status, checkInAt, checkOutAt } = record;
    // Kiểm tra đã check-in: status === "checked_in" hoặc có event CHECK_IN hoặc có checkInAt
    const hasCheckIn =
      status === "checked_in" ||
      record.events?.some((e) => e.type === "CHECK_IN") ||
      checkInAt;

    const items = [
      {
        key: "view",
        label: "Xem chi tiết",
        onClick: () => handleViewDetail(_id),
      },
      status === "pending" && {
        key: "confirm",
        label: <span className="text-blue-600 font-medium">Xác nhận đơn</span>,
        onClick: () => handleAction(confirmBooking, _id),
      },
      (status === "confirmed" || status === "checked_in") &&
        !hasCheckIn && {
          key: "checkin",
          label: (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <FiLogIn /> Check-in khách
            </div>
          ),
          onClick: () => handleAction(checkInBooking, _id),
        },
      hasCheckIn &&
        !checkOutAt && {
          key: "checkout",
          label: (
            <div className="flex items-center gap-2 text-purple-600 font-medium">
              <FiLogOut /> Check-out hoàn tất
            </div>
          ),
          onClick: () => handleAction(checkOutBooking, _id),
        },
    ].filter(Boolean);

    return { items };
  };

  const columns = useMemo(
    () => [
      {
        title: "Mã đơn",
        width: 110,
        render: (_, r) => (
          <span className="font-mono font-bold text-gray-800">
            #{r._id?.slice(-6).toUpperCase()}
          </span>
        ),
      },
      {
        title: "Khách hàng",
        width: 160,
        render: (_, r) => r.customer?.fullName || "Khách lẻ",
      },
      {
        title: "Lịch đặt",
        width: 180,
        render: (_, r) => (
          <div className="text-sm">
            <div className="font-medium">
              {r.schedule?.date
                ? dayjs(r.schedule.date).format("DD/MM/YYYY")
                : r.createdAt
                ? dayjs(r.createdAt).format("DD/MM/YYYY")
                : r.scheduleId
                ? `#${r.scheduleId.slice(-6).toUpperCase()}`
                : "-"}
            </div>
            <div className="text-xs text-gray-500">
              {r.schedule?.timeRange || "-"}
            </div>
          </div>
        ),
      },
      {
        title: "Tổng tiền",
        width: 130,
        render: (_, r) => (
          <span className="font-bold text-green-600">
            {formatCurrency(r.finalAmount)}
          </span>
        ),
      },
      {
        title: "Giảm giá",
        width: 120,
        render: (_, r) =>
          r.discountAmount > 0 ? (
            <span className="text-orange-600 font-semibold">
              -{formatCurrency(r.discountAmount)}
            </span>
          ) : (
            <span className="text-gray-500">0₫</span>
          ),
      },
      {
        title: "Thanh toán",
        width: 200,
        render: (_, r) => {
          const paymentInfo = calculatePaymentInfo(r);
          const isPrepay = r.payType?.startsWith("prepay_");

          return (
            <div className="text-sm space-y-2">
              <div className="font-medium">
                {r.payType === "full"
                  ? "Thanh toán đủ"
                  : r.payType === "prepay_50"
                  ? "Cọc 50%"
                  : r.payType === "prepay_30"
                  ? "Cọc 30%"
                  : r.payType || "-"}
              </div>
              {isPrepay ? (
                <div className="space-y-1">
                  {/* Progress bar */}
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                      style={{ width: `${paymentInfo.paidPercentage}%` }}
                    />
                    <div
                      className="absolute top-0 right-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                      style={{ width: `${paymentInfo.remainingPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 font-semibold">
                      {paymentInfo.paidPercentage}%
                    </span>
                    <span className="text-orange-600 font-semibold">
                      {paymentInfo.remainingPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatCurrency(paymentInfo.paidAmount)}</span>
                    <span>{formatCurrency(paymentInfo.remainingAmount)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs">
                  {formatCurrency(r.finalAmount)}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Sự kiện",
        width: 170,
        render: (_, r) => {
          if (!r.events || r.events.length === 0)
            return <span className="text-gray-500">Không có</span>;
          const latest = r.events[r.events.length - 1];
          return (
            <div className="text-sm space-y-1">
              <span className="font-semibold">{latest.type}</span>
              {latest.timestamp && (
                <div className="text-gray-500 text-xs">
                  {dayjs(latest.timestamp).format("HH:mm DD/MM/YYYY")}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Trạng thái",
        width: 140,
        render: (_, r) => {
          const { label, color, icon } = getStatusDisplay(r);
          return (
            <Tag color={color} icon={icon} className="font-medium">
              {label}
            </Tag>
          );
        },
      },
      {
        title: "",
        width: 70,
        fixed: "right",
        render: (_, r) => (
          <Dropdown
            menu={getDropdownMenu(r)}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              loading={actionLoading[r._id]}
              icon={<FiMoreVertical className="text-xl text-gray-600" />}
              className="hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            />
          </Dropdown>
        ),
      },
    ],
    [actionLoading]
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="mb-2 text-white">
              Quản lý đơn đặt chỗ
            </Title>
            <Text className="text-indigo-100">
              Check-in, Check-out & theo dõi khách tại studio
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-white text-indigo-600 font-bold"
          >
            Tạo đơn nội bộ
          </Button>
        </div>
      </div>

      {/* Bảng */}
      <DataTable
        title="Danh sách đơn đặt chỗ"
        columns={columns}
        data={staffBookings}
        loading={loading}
        scroll={{ x: 1400 }}
        rowKey="_id"
      />

      {/* ==================== MODAL CHI TIẾT SIÊU ĐẸP - HIỂN THỊ 100% DATA THỰC TẾ ==================== */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={1100}
        closeIcon={
          <div className="text-3xl text-gray-400 hover:text-gray-700">×</div>
        }
        title={null}
        className="top-6"
      >
        {detailLoading || !currentBooking ? (
          <div className="py-24 text-center">
            <Spin size="large" tip="Đang tải chi tiết đơn..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* HEADER GRADIENT - MÃ + TIỀN + TRẠNG THÁI */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl -m-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight">
                    ĐƠN ĐẶT CHỖ
                  </h2>
                  <p className="text-2xl font-mono mt-2 opacity-95">
                    #{currentBooking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-extrabold tracking-wider drop-shadow-lg">
                    {formatCurrency(currentBooking.finalAmount)}
                  </div>
                  <div className="mt-4">
                    {currentBooking.events?.some(
                      (e) => e.type === "NO_SHOW"
                    ) ? (
                      <Tag className="text-2xl px-8 py-3 bg-red-600 border-0 font-bold shadow-lg">
                        KHÔNG ĐẾN – ĐÃ PHẠT
                      </Tag>
                    ) : (
                      <Tag className="text-xl px-6 py-3 bg-white/20 backdrop-blur border-0 font-bold">
                        {getStatusDisplay(currentBooking).label}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* NO-SHOW ALERT - ƯU TIÊN CAO NHẤT */}
            {currentBooking.events?.some((e) => e.type === "NO_SHOW") && (
              <div className="bg-red-50 border-4 border-red-500 rounded-3xl p-8 text-center shadow-2xl transform hover:scale-[1.01] transition-all">
                <FiUserX className="text-9xl text-red-600 mx-auto mb-5" />
                <h3 className="text-4xl font-extrabold text-red-800 mb-4">
                  KHÁCH KHÔNG ĐẾN (NO-SHOW)
                </h3>
                <p className="text-2xl font-bold text-red-700">
                  Đã bị phạt{" "}
                  <span className="text-3xl">
                    {formatCurrency(currentBooking.finalAmount)}
                  </span>
                </p>
                <p className="text-lg text-red-600 mt-4 font-medium">
                  Ghi nhận lúc:{" "}
                  {dayjs(
                    currentBooking.events.find((e) => e.type === "NO_SHOW")
                      ?.timestamp
                  ).format("HH:mm, dddd DD/MM/YYYY")}
                </p>
              </div>
            )}

            {/* CHECK-IN / CHECK-OUT STATUS */}
            {(() => {
              // Lấy thông tin check-in từ checkInAt hoặc từ event CHECK_IN
              const checkInEvent = currentBooking.events?.find(
                (e) => e.type === "CHECK_IN"
              );
              const checkInTime =
                currentBooking.checkInAt || checkInEvent?.timestamp;
              const hasCheckIn =
                checkInTime || currentBooking.status === "checked_in";
              const hasCheckOut = currentBooking.checkOutAt;

              if (hasCheckIn || hasCheckOut) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {hasCheckIn && (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-emerald-300 rounded-3xl p-10 text-center shadow-2xl">
                        <FiLogIn className="text-8xl text-emerald-600 mx-auto mb-5" />
                        <h4 className="text-3xl font-extrabold text-emerald-800">
                          ĐÃ CHECK-IN
                        </h4>
                        <p className="text-5xl font-black text-emerald-700 mt-4">
                          {dayjs(checkInTime).format("HH:mm")}
                        </p>
                        <p className="text-xl text-gray-700 mt-2">
                          {dayjs(checkInTime).format("dddd, DD/MM/YYYY")}
                        </p>
                      </div>
                    )}
                    {hasCheckOut && (
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-4 border-purple-300 rounded-3xl p-10 text-center shadow-2xl">
                        <FiLogOut className="text-8xl text-purple-600 mx-auto mb-5" />
                        <h4 className="text-3xl font-extrabold text-purple-800">
                          ĐÃ CHECK-OUT
                        </h4>
                        <p className="text-5xl font-black text-purple-700 mt-4">
                          {dayjs(currentBooking.checkOutAt).format("HH:mm")}
                        </p>
                        <p className="text-xl text-gray-700 mt-2">
                          {dayjs(currentBooking.checkOutAt).format(
                            "dddd, DD/MM/YYYY"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            {/* THÔNG TIN CHÍNH - 2 CỘT */}
            <div className="grid lg:grid-cols-2 gap-10">
              {/* CỘT TRÁI: KHÁCH HÀNG + STUDIO + LỊCH */}
              <div className="space-y-8">
                {/* Khách hàng */}
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiUser className="text-3xl text-blue-600" /> Thông tin
                    khách hàng
                  </h3>
                  <div className="space-y-5 text-lg">
                    <div className="text-2xl font-extrabold text-gray-900">
                      {currentBooking.customer?.fullName || "Khách lẻ"}
                    </div>
                    {currentBooking.customer?.username && (
                      <div className="text-gray-600">
                        @{currentBooking.customer.username}
                      </div>
                    )}
                    {currentBooking.customer?.phone && (
                      <div className="flex items-center gap-4">
                        <FiPhone className="text-2xl text-green-600" />
                        <span className="font-semibold">
                          {currentBooking.customer.phone}
                        </span>
                      </div>
                    )}
                    {currentBooking.customer?.email && (
                      <div className="flex items-center gap-4">
                        <FiMail className="text-2xl text-blue-600" />
                        <span>{currentBooking.customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Studio & Lịch đặt */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiCalendar className="text-3xl text-cyan-600" /> Studio &
                    Lịch đặt
                  </h3>
                  <div className="space-y-6">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentBooking.studio?.name}
                    </div>
                    <div className="text-lg text-gray-700">
                      {currentBooking.studio?.location}
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg text-center border-2 border-cyan-200">
                      <div className="text-6xl font-extrabold text-cyan-700 mb-4">
                        {currentBooking.schedule?.timeRange}
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {dayjs(currentBooking.schedule?.date).format(
                          "dddd, DD/MM/YYYY"
                        )}
                      </div>
                      <div className="text-lg text-gray-600 mt-4">
                        Thời lượng:{" "}
                        <strong>
                          {currentBooking.schedule?.duration || 1} giờ
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: TIỀN + CHÍNH SÁCH + SỰ KIỆN */}
              <div className="space-y-8">
                {/* Tiền */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Chi tiết tài chính
                  </h3>
                  <div className="space-y-5 text-xl">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Trước giảm giá</span>
                      <span className="line-through text-gray-500">
                        {formatCurrency(currentBooking.totalBeforeDiscount)}
                      </span>
                    </div>
                    {currentBooking.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Giảm giá</span>
                        <span>
                          -{formatCurrency(currentBooking.discountAmount)}
                        </span>
                      </div>
                    )}
                    <Divider className="my-4 border-green-300" />
                    <div className="flex justify-between text-3xl font-extrabold">
                      <span className="text-gray-800">Thành tiền</span>
                      <span className="text-green-600">
                        {formatCurrency(currentBooking.finalAmount)}
                      </span>
                    </div>

                    {/* Hiển thị progress bar cho prepay */}
                    {(() => {
                      const paymentInfo = calculatePaymentInfo(currentBooking);
                      const isPrepay =
                        currentBooking.payType?.startsWith("prepay_");

                      if (isPrepay) {
                        return (
                          <>
                            <Divider className="my-4 border-green-300" />
                            <div className="space-y-3">
                              <div className="text-center">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                  Tiến độ thanh toán
                                </div>
                                {/* Progress bar lớn */}
                                <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-green-500 to-green-600 transition-all duration-500 flex items-center justify-end pr-2"
                                    style={{
                                      width: `${paymentInfo.paidPercentage}%`,
                                    }}
                                  >
                                    {paymentInfo.paidPercentage > 15 && (
                                      <span className="text-white text-xs font-bold">
                                        {paymentInfo.paidPercentage}%
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className="absolute top-0 right-0 h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-500 flex items-center justify-start pl-2"
                                    style={{
                                      width: `${paymentInfo.remainingPercentage}%`,
                                    }}
                                  >
                                    {paymentInfo.remainingPercentage > 15 && (
                                      <span className="text-white text-xs font-bold">
                                        {paymentInfo.remainingPercentage}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-between mt-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-gray-700">
                                      Đã trả:
                                    </span>
                                    <span className="text-green-600 font-bold">
                                      {formatCurrency(paymentInfo.paidAmount)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    <span className="text-gray-700">
                                      Còn lại:
                                    </span>
                                    <span className="text-orange-600 font-bold">
                                      {formatCurrency(
                                        paymentInfo.remainingAmount
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                      return null;
                    })()}

                    <div className="text-center mt-6">
                      <Tag color="blue" className="text-lg px-6 py-2 font-bold">
                        Thanh toán:{" "}
                        {currentBooking.payType === "full"
                          ? "Toàn bộ"
                          : currentBooking.payType === "prepay_50"
                          ? "Cọc 50%"
                          : currentBooking.payType === "prepay_30"
                          ? "Cọc 30%"
                          : currentBooking.payType || "Không rõ"}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Chính sách hủy & No-Show */}
                <div className="grid grid-cols-2 gap-6">
                  <Card
                    title="Chính sách hủy"
                    className="border-orange-300 shadow-lg"
                  >
                    <ul className="text-sm space-y-2">
                      {currentBooking.policySnapshots?.cancellation?.refundTiers?.map(
                        (tier) => (
                          <li key={tier._id}>
                            <strong>{tier.hoursBeforeBooking}h trước</strong>:
                            hoàn <strong>{tier.refundPercentage}%</strong>
                          </li>
                        )
                      )}
                    </ul>
                  </Card>
                  <Card title="No-Show" className="border-red-300 shadow-lg">
                    <div className="text-sm space-y-2">
                      <div>
                        Phạt: <strong>100%</strong>
                      </div>
                      <div>
                        Ân hạn: <strong>15 phút</strong>
                      </div>
                      <div>
                        Tha thứ tối đa: <strong>1 lần</strong>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* NÚT HÀNH ĐỘNG */}
            <div className="flex justify-center gap-8 pt-10 border-t-4 border-gray-200">
              {(() => {
                // Kiểm tra đã check-in: status === "checked_in" hoặc có event CHECK_IN hoặc có checkInAt
                const hasCheckIn =
                  currentBooking.status === "checked_in" ||
                  currentBooking.events?.some((e) => e.type === "CHECK_IN") ||
                  currentBooking.checkInAt;
                const hasCheckOut = currentBooking.checkOutAt;
                const hasNoShow = currentBooking.events?.some(
                  (e) => e.type === "NO_SHOW"
                );

                if (currentBooking.status === "pending") {
                  return (
                    <Button
                      type="primary"
                      size="large"
                      className="px-20 py-8 text-2xl font-bold"
                      onClick={() =>
                        handleAction(confirmBooking, currentBooking._id)
                      }
                    >
                      XÁC NHẬN ĐƠN
                    </Button>
                  );
                }

                if (
                  (currentBooking.status === "confirmed" ||
                    currentBooking.status === "checked_in") &&
                  !hasCheckIn
                ) {
                  return (
                    <Button
                      type="primary"
                      size="large"
                      className="bg-emerald-600 px-24 py-10 text-3xl font-extrabold flex items-center gap-5"
                      icon={<FiLogIn className="text-5xl" />}
                      onClick={() =>
                        handleAction(checkInBooking, currentBooking._id)
                      }
                    >
                      CHECK-IN NGAY
                    </Button>
                  );
                }

                if (hasCheckIn && !hasCheckOut) {
                  return (
                    <Button
                      type="primary"
                      danger
                      size="large"
                      className="bg-purple-600 px-24 py-10 text-3xl font-extrabold flex items-center gap-5"
                      icon={<FiLogOut className="text-5xl" />}
                      onClick={() =>
                        handleAction(checkOutBooking, currentBooking._id)
                      }
                    >
                      CHECK-OUT HOÀN TẤT
                    </Button>
                  );
                }

                if (hasCheckOut || hasNoShow) {
                  return (
                    <div className="flex items-center gap-6 text-4xl font-extrabold text-green-600">
                      <FiCheckCircle className="text-8xl" />
                      ĐÃ XỬ LÝ XONG ĐƠN
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* Footer */}
            <div className="text-center py-6 border-t-2 border-gray-200 text-gray-500">
              <div className="flex items-center justify-center gap-3 text-lg">
                <FiClock />
                <span>
                  Đặt lúc:{" "}
                  {dayjs(currentBooking.createdAt).format(
                    "HH:mm, dddd DD/MM/YYYY"
                  )}
                </span>
              </div>
              <div className="text-sm mt-2">
                Cập nhật:{" "}
                {dayjs(currentBooking.updatedAt).format("HH:mm, DD/MM/YYYY")}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffOrderPage;
