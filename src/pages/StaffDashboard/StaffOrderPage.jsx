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
  FiCheckCircle,
  FiBox,
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

  // Kiểm tra đã check-out
  const hasCheckOut =
    booking.checkOutAt ||
    booking.status === "completed" ||
    booking.events?.some((e) => e.type === "CHECK_OUT");

  if (hasCheckOut)
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

    // Kiểm tra đã check-out
    const hasCheckOut =
      status === "completed" ||
      record.events?.some((e) => e.type === "CHECK_OUT") ||
      checkOutAt;

    const items = [
      {
        key: "view",
        label: "Xem chi tiết",
        onClick: () => handleViewDetail(_id),
      },
      status === "pending" && {
        key: "confirm",
        label: <span className="text-[#C5A267] font-medium">Xác nhận đơn</span>,
        onClick: () => handleAction(confirmBooking, _id),
      },
      // (status === "confirmed" || status === "checked_in") &&
      //   !hasCheckIn && {
      //     key: "checkin",
      //     label: (
      //       <div className="flex items-center gap-2 text-green-600 font-medium">
      //         <FiLogIn /> Check-in khách
      //       </div>
      //     ),
      //     onClick: () => handleAction(checkInBooking, _id),
      //   },
      (status === "confirmed" ||
        status === "checked_in" ||
        (hasCheckIn && !hasCheckOut)) && {
        key: "checkout",
        label: (
          <div className="flex items-center gap-2 text-[#C5A267] font-medium">
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
                      className="absolute top-0 left-0 h-full bg-[#10b981] transition-all duration-300"
                      style={{ width: `${paymentInfo.paidPercentage}%` }}
                    />
                    <div
                      className="absolute top-0 right-0 h-full bg-[#f59e0b] transition-all duration-300"
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
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý đơn đặt chỗ</h1>
        <p className="opacity-90">
          Check-in, Check-out & theo dõi khách tại studio
        </p>

        <div className="absolute top-8 right-8">
          <Button
            type="primary"
            size="large"
            className="bg-white text-[#C5A267] font-bold"
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

      {/* ==================== MODAL CHI TIẾT TỐI ƯU ==================== */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={700}
        closeIcon={
          <div className="text-2xl text-white/80 hover:text-white transition-colors">×</div>
        }
        title={null}
        className="top-4 compact-modal"
        styles={{ content: { padding: 0, borderRadius: "16px", overflow: "hidden" } }}
      >
        {detailLoading || !currentBooking ? (
          <div className="py-12 text-center">
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gray-50">
            {/* HEADER COMPACT */}
            <div className="bg-[#0F172A] p-5 text-white relative">
              <div className="flex justify-between items-center z-10 relative">
                <div>
                  <h2 className="text-xl font-extrabold m-0">
                    ĐƠN ĐẶT CHỖ
                  </h2>
                  <p className="text-sm font-mono opacity-90 m-0">
                    #{currentBooking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right pr-6">
                  <div className="text-2xl font-extrabold">
                    {formatCurrency(currentBooking.finalAmount)}
                  </div>
                  <div className="mt-1">
                    {currentBooking.events?.some((e) => e.type === "NO_SHOW") ? (
                      <Tag className="text-xs font-bold px-2 py-0.5 bg-red-600 border-0 text-white">
                        NO-SHOW
                      </Tag>
                    ) : (
                      <Tag className="text-xs font-bold px-2 py-0.5 bg-white/20 border-0 text-white backdrop-blur-sm">
                        {getStatusDisplay(currentBooking).label}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* NO-SHOW ALERT */}
              {currentBooking.events?.some((e) => e.type === "NO_SHOW") && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-center gap-3">
                  <FiUserX className="text-3xl text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800 m-0">
                      KHÁCH KHÔNG ĐẾN
                    </h3>
                    <p className="text-xs text-red-700 m-0">
                      Phạt:{" "}
                      <span className="font-bold">
                        {formatCurrency(currentBooking.finalAmount)}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LEFT COL */}
                <div className="space-y-4">
                   {/* CUSTOMER */}
                   <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                         <FiUser className="text-[#C5A267]" />
                         <span className="font-bold text-gray-700 text-sm">Thông tin khách hàng</span>
                      </div>
                      <div className="space-y-2">
                         <div>
                            <div className="font-bold text-gray-900 text-base">{currentBooking.customer?.fullName || "Khách lẻ"}</div>
                            <div className="text-xs text-gray-500">@{currentBooking.customer?.username || "unknown"}</div>
                         </div>
                         <div className="space-y-1 mt-2">
                            {currentBooking.customer?.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiPhone className="text-green-500" /> {currentBooking.customer.phone}
                              </div>
                            )}
                            {currentBooking.customer?.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-700 truncate" title={currentBooking.customer.email}>
                                <FiMail className="text-[#C5A267]" /> {currentBooking.customer.email}
                              </div>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* STUDIO */}
                    <div className="bg-white p-4 shadow-sm border border-slate-200">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                         <FiCalendar className="text-[#C5A267]" />
                         <span className="font-bold text-gray-700 text-sm">Studio & Lịch đặt</span>
                      </div>
                      <div>
                          <div className="font-bold text-gray-900">{currentBooking.studio?.name}</div>
                          <div className="text-xs text-gray-500 mb-2 truncate">{currentBooking.studio?.location}</div>
                          
                          <div className="bg-[#FCFBFA] p-2 text-center border border-slate-200">
                             <div className="text-xl font-bold text-[#C5A267]">{currentBooking.schedule?.timeRange}</div>
                             <div className="text-xs font-medium text-gray-600">{dayjs(currentBooking.schedule?.date).format("dddd, DD/MM/YYYY")}</div>
                          </div>
                      </div>
                   </div>

                   {/* EVENTS TIMELINE (Moved from Right Col to Left Col) */}
                   <div className="bg-white p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                      <FiClock className="text-[#C5A267]" />
                      <span className="font-bold text-gray-700 text-sm">
                        Lịch sử sự kiện
                      </span>
                    </div>
                    {currentBooking.events &&
                    currentBooking.events.length > 0 ? (
                      <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 pl-1">
                        {currentBooking.events.map((event, idx) => (
                          <div key={idx} className="relative pl-6">
                            <div
                              className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-white z-10 ${
                                event.type === "CHECK_IN"
                                  ? "border-[#C5A267]"
                                  : event.type === "CHECK_OUT"
                                  ? "border-green-500"
                                  : event.type === "NO_SHOW"
                                  ? "border-red-500"
                                  : "border-gray-400"
                              }`}
                            />
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-bold text-gray-800 uppercase">
                                  {event.type.replace("_", " ")}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {dayjs(event.timestamp).format(
                                    "HH:mm:ss DD/MM/YYYY"
                                  )}
                                </div>
                              </div>
                              {event.amount > 0 && (
                                <div className="text-[10px] font-mono text-gray-600 bg-gray-50 px-1 rounded">
                                  {formatCurrency(event.amount)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 text-center py-2">
                        Chưa có sự kiện nào
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COL */}
                <div className="space-y-4">
                  {/* FINANCE & PAYMENT SUMMARY */}
                  <div className="bg-[#10b981]/5 p-4 shadow-sm border border-[#10b981]/20">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
                      <span className="font-bold text-emerald-800 text-sm">
                        Tài chính & Thanh toán
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {/* Financials (nếu có) hoặc Fallback */}
                      {currentBooking.financials ? (
                        <>
                          <div className="flex justify-between text-gray-600">
                            <span>Giá gốc</span>
                            <span>
                              {formatCurrency(
                                currentBooking.financials.originalAmount ||
                                  currentBooking.totalBeforeDiscount
                              )}
                            </span>
                          </div>
                          {currentBooking.financials.chargeAmount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Phạt phát sinh</span>
                              <span>
                                +
                                {formatCurrency(
                                  currentBooking.financials.chargeAmount
                                )}
                              </span>
                            </div>
                          )}
                          {currentBooking.financials.refundAmount > 0 && (
                            <div className="flex justify-between text-orange-600">
                              <span>Hoàn tiền</span>
                              <span>
                                -
                                {formatCurrency(
                                  currentBooking.financials.refundAmount
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-emerald-100">
                            <span>Thực thu (Net)</span>
                            <span>
                              {formatCurrency(
                                currentBooking.financials.netAmount ??
                                  currentBooking.finalAmount
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Fallback cũ
                        <>
                          <div className="flex justify-between text-gray-500">
                            <span>Trước giảm giá</span>
                            <span className="line-through">
                              {formatCurrency(
                                currentBooking.totalBeforeDiscount
                              )}
                            </span>
                          </div>
                          {currentBooking.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Giảm giá</span>
                              <span>
                                -{formatCurrency(currentBooking.discountAmount)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-end pt-1 border-t border-emerald-100">
                            <span className="font-bold text-gray-800">
                              Thành tiền
                            </span>
                            <span className="text-xl font-extrabold text-emerald-600">
                              {formatCurrency(currentBooking.finalAmount)}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Payment Summary */}
                      {currentBooking.paymentSummary && (
                        <div className="mt-3 pt-3 border-t border-dashed border-[#10b981]/30 bg-white/60 p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-emerald-800">
                              Thanh toán (
                              {currentBooking.paymentSummary.paidPercentage}%)
                            </span>
                            <Tag
                              className={`m-0 text-[10px] border-0 font-bold ${
                                currentBooking.paymentSummary.isPaidFully
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {currentBooking.paymentSummary.isPaidFully
                                ? "ĐỦ"
                                : "THIẾU"}
                            </Tag>
                          </div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Đã trả:</span>
                            <span className="font-bold text-green-600">
                              {formatCurrency(
                                currentBooking.paymentSummary.paidAmount
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Còn lại:</span>
                            <span className="font-bold text-orange-600">
                              {formatCurrency(
                                currentBooking.paymentSummary.remainingAmount
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DETAILS LIST - SERVICES & EQUIPMENT */}
                  {currentBooking.details && currentBooking.details.length > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                        <FiBox className="text-[#C5A267]" />
                        <span className="font-bold text-gray-700 text-sm">
                          Dịch vụ & Thiết bị
                        </span>
                      </div>
                      <div className="space-y-3">
                        {currentBooking.details.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-start text-sm"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                {item.detailType === "extra_service"
                                  ? item.service?.name || item.description
                                  : item.equipment?.name || item.description}
                              </div>
                              <div className="text-xs text-gray-500">
                                SL: {item.quantity} x{" "}
                                {formatCurrency(item.pricePerUnit)}
                              </div>
                            </div>
                            <div className="font-bold text-gray-700">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* FOOTER ACTIONS - IF NEEDED */}
               {currentBooking.status === 'pending' && (
                 <div className="pt-2">
                    <Button type="primary" block onClick={() => {
                        handleAction(confirmBooking, currentBooking._id);
                        setDetailModalOpen(false);
                    }}>Xác nhận đơn này</Button>
                 </div>
               )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffOrderPage;
