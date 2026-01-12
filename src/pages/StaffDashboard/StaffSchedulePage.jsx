// src/pages/StaffSchedulePage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import "./StaffSchedulePage.css";
import {
  Card,
  Typography,
  Tag,
  Calendar,
  Modal,
  Descriptions,
  Spin,
  Empty,
  Avatar,
  Badge,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  FiUser,
  FiClock,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiAlertCircle,
  FiMail,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import { getAllMyBookings } from "../../features/booking/bookingSlice";
import { getAllStudios } from "../../features/studio/studioSlice";
import { getScheduleById } from "../../features/schedule/scheduleSlice";
import axiosInstance from "../../api/axiosInstance";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

const toVNTime = (iso) => (iso ? dayjs(iso).tz("Asia/Ho_Chi_Minh") : null);

const StaffSchedulePage = () => {
  const dispatch = useDispatch();

  // Lấy danh sách booking của người dùng/staff
  const { myBookings: rawBookings = [], loading: bookingLoading } = useSelector(
    (state) => state.booking
  );
  const { studios = [] } = useSelector((state) => state.studio);
  const { items: fetchedSchedules = [] } = useSelector(
    (state) => state.schedule
  );

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [customers, setCustomers] = useState({});
  const [customerLoading, setCustomerLoading] = useState(false);

  const fetchedScheduleIds = useRef(new Set());

  // Lazy fetch customer info by userId, cached locally
  const fetchCustomers = async (ids) => {
    if (!ids || ids.length === 0) return;
    const uniqueIds = ids.filter((id) => id && !customers[id]);
    if (uniqueIds.length === 0) return;
    setCustomerLoading(true);
    try {
      const results = await Promise.all(
        uniqueIds.map((id) =>
          axiosInstance
            .get(`/admin/customers/${id}`)
            .then((res) => ({ id, data: res.data?.data || res.data }))
            .catch(() => null)
        )
      );
      const map = {};
      results.forEach((item) => {
        if (item?.id) map[item.id] = item.data;
      });
      setCustomers((prev) => ({ ...prev, ...map }));
    } finally {
      setCustomerLoading(false);
    }
  };

  // FETCH TỰ ĐỘNG SCHEDULE
  useEffect(() => {
    if (!rawBookings || rawBookings.length === 0) return;

    const scheduleIds = rawBookings.map((b) => b.scheduleId).filter(Boolean);

    const missingIds = scheduleIds.filter(
      (id) =>
        !fetchedScheduleIds.current.has(id) &&
        !fetchedSchedules.some((s) => s._id === id)
    );

    if (missingIds.length > 0) {
      missingIds.forEach((id) => {
        dispatch(getScheduleById(id));
        fetchedScheduleIds.current.add(id);
      });
    }
  }, [rawBookings, fetchedSchedules, dispatch]);

  // GỘP DỮ LIỆU
  const enrichedBookings = useMemo(() => {
    const scheduleMap = Object.fromEntries(
      fetchedSchedules.map((s) => [s._id, s])
    );
    const studioMap = Object.fromEntries(studios.map((s) => [s._id, s]));

    return rawBookings
      .map((booking) => {
        const schedule = booking.scheduleId
          ? scheduleMap[booking.scheduleId]
          : null;
        if (!schedule) {
          return null; // chưa fetch xong → ẩn tạm
        }

        const studio = schedule.studioId ? studioMap[schedule.studioId] : null;

        return {
          ...booking,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          studioId: schedule.studioId,
          studioName: studio?.name || "Chưa xác định",
          studioLocation: studio?.location || "Không có địa chỉ",
          slotStatus: schedule.status,
        };
      })
      .filter(Boolean);
  }, [rawBookings, fetchedSchedules, studios]);

  const todayBookings = enrichedBookings
    .filter((b) => toVNTime(b.startTime).isSame(dayjs(), "day"))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedDateBookings = enrichedBookings
    .filter((b) => toVNTime(b.startTime).isSame(selectedDate, "day"))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // fetch customers for selected date bookings
  useEffect(() => {
    const ids = selectedDateBookings
      .map((b) => b.userId || b.customer?._id)
      .filter(Boolean);
    fetchCustomers(ids);
  }, [selectedDateBookings]);

  // Load lần đầu
  useEffect(() => {
    dispatch(getAllMyBookings());
    dispatch(getAllStudios({ page: 1, limit: 100 }));
  }, [dispatch]);

  const renderMonthCell = (date) => {
    const count = enrichedBookings.filter((b) =>
      toVNTime(b.startTime).isSame(date, "day")
    ).length;
    const isSelected = date.isSame(selectedDate, "day");
    const isToday = date.isSame(dayjs(), "day");

    return (
      <div
        className={`h-24 w-full px-2 py-2 border-2 rounded-xl flex flex-col items-center justify-between text-sm transition-all cursor-pointer hover:shadow-md ${
          isSelected
            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg ring-2 ring-purple-300"
            : "border-gray-200 bg-white hover:border-purple-300"
        } ${isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      >
        <div className="flex w-full items-center justify-between">
          <span className={`font-bold text-base ${
            isSelected ? "text-purple-700" : isToday ? "text-blue-600" : "text-gray-800"
          }`}>
            {date.date()}
          </span>
          {isToday && (
            <Tag color="blue" className="!px-2 !py-0.5 !rounded-full !text-xs !font-semibold !border-blue-400">
              Hôm nay
            </Tag>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 mt-1">
          <span className={`text-[10px] font-medium ${
            isSelected ? "text-purple-600" : "text-gray-500"
          }`}>
            Số lịch
          </span>
          <Badge
            count={count}
            style={{ 
              backgroundColor: count > 0 ? "#ef4444" : "#9ca3af",
              boxShadow: count > 0 ? "0 2px 8px rgba(239, 68, 68, 0.3)" : "none"
            }}
            className="!min-w-[24px] !h-6 !flex !items-center !justify-center !rounded-full !font-bold !text-xs"
          />
        </div>
      </div>
    );
  };

  const openDetail = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl text-center overflow-hidden border-4 border-white/20">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <Title level={1} className="mb-4 !text-white drop-shadow-lg !text-4xl !font-bold">
              Chào mừng quay lại, Staff!
            </Title>
            <Text className="text-2xl font-semibold !text-white drop-shadow-md">
              Hôm nay bạn có{" "}
              <span className="inline-block mx-3 px-8 py-3 bg-white/95 rounded-2xl border-4 border-white/70 text-5xl font-extrabold booking-count-3d shadow-2xl">
                {todayBookings.length || 0}
              </span>{" "}
              <span className="!text-white">buổi đặt</span>
            </Text>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card
          className="shadow-xl rounded-3xl overflow-hidden border border-slate-200 bg-white"
          style={{ minHeight: 620 }}
          styles={{ body: { padding: 0 } }}
        >
          <Title level={4} className="text-center py-4 bg-slate-900 !text-white !font-bold !text-lg">
            Lịch đặt trong tháng
          </Title>
          <Calendar
            fullscreen={false}
            value={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setModalVisible(true);
            }}
            fullCellRender={renderMonthCell}
            className="px-4 pb-4 text-base"
          />
        </Card>
      </div>

      {/* Modal chi tiết */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        centered
        title={
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 -m-6 mb-0 p-4 rounded-t-lg border-b-2 border-purple-200">
            <div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                Ngày
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                {selectedDate.format("dddd, DD/MM/YYYY")}
              </div>
            </div>
            <Tag 
              color="purple" 
              className="!px-4 !py-2 !rounded-full !text-base !font-bold !border-2 !border-purple-400 !bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !shadow-lg"
            >
              {selectedDateBookings.length} lịch
            </Tag>
          </div>
        }
      >
        {selectedDateBookings.length === 0 ? (
          <Empty description="Không có buổi đặt nào" className="py-16" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedDateBookings.map((booking) => {
              const customer =
                booking.customer ||
                customers[booking.userId] ||
                customers[booking.customer?._id] ||
                {};
              const vnStart = toVNTime(booking.startTime);
              const vnEnd = toVNTime(booking.endTime);

              return (
                <Card
                  key={booking._id}
                  className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition"
                  onClick={() => openDetail(booking)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar
                      src={customer.avatar}
                      size={52}
                      className="bg-slate-200"
                    >
                      {customer.fullName?.[0] || "K"}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-xl text-slate-900 mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                            {vnStart.format("HH:mm")} → {vnEnd.format("HH:mm")}
                          </div>
                          <div className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md inline-block">
                            {vnStart.format("DD/MM/YYYY")}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Tag
                            color={
                              booking.status === "completed"
                                ? "green"
                                : "orange"
                            }
                            className="!rounded-full !px-3 !py-1 !font-semibold !text-xs !border-2 !shadow-sm"
                            style={{
                              borderColor: booking.status === "completed" ? "#10b981" : "#f97316"
                            }}
                          >
                            {booking.status === "completed"
                              ? "✓ Hoàn tất"
                              : "⏳ Đang chờ"}
                          </Tag>
                          <Tag 
                            color="blue" 
                            className="!rounded-full !px-3 !py-1 !font-semibold !text-xs !border-2 !border-blue-400 !shadow-sm"
                          >
                            {booking.payType === "full"
                              ? "💰 Thanh toán đủ"
                              : booking.payType === "prepay_50"
                              ? "💵 Cọc 50%"
                              : booking.payType === "prepay_30"
                              ? "💵 Cọc 30%"
                              : booking.payType || "❓ Không rõ"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-2" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg border border-blue-200">
                      <FiUser className="text-blue-600 text-lg" />
                      <span className="font-bold text-gray-900 text-base">
                        {customer.fullName || "Chưa có tên"}
                      </span>
                      {customer.isVerified && (
                        <Tag color="cyan" icon={<FiCheckCircle />} className="!ml-auto !font-semibold !border-2 !border-cyan-400">
                          ✓ Đã xác minh
                        </Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <FiPhone className="text-indigo-600 text-base" />
                      <span className="font-medium text-gray-800">{customer.phone || "Chưa có SĐT"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <FiMail className="text-indigo-600 text-base" />
                      <span className="truncate font-medium text-gray-800">
                        {customer.email || "Chưa có email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <FiShield className="text-indigo-600 text-base" />
                      <Tag color="purple" className="!rounded-full !px-2 !py-1 !font-semibold !text-xs !border !border-purple-400">
                        {customer.role || "customer"}
                      </Tag>
                      <Tag 
                        color={customer.isActive ? "green" : "red"} 
                        className="!rounded-full !px-2 !py-1 !font-semibold !text-xs !border-2"
                        style={{
                          borderColor: customer.isActive ? "#10b981" : "#ef4444"
                        }}
                      >
                        {customer.isActive ? "✓ Hoạt động" : "✗ Đã khóa"}
                      </Tag>
                    </div>
                    <div className="flex items-start gap-2 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-lg border border-amber-200">
                      <FiMapPin className="text-amber-600 text-base mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900 text-base">
                          {booking.studioName}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {booking.studioLocation || "Không có địa chỉ"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200">
                      <FiDollarSign className="text-green-600 text-lg" />
                      <span className="font-bold text-green-700 text-lg">
                        {booking.finalAmount?.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffSchedulePage;
