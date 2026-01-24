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
        className={`h-24 w-full px-2 py-2 border-2 flex flex-col items-center justify-between text-sm transition-all cursor-pointer hover:shadow-md ${
          isSelected
            ? "border-[#C5A267] bg-[#FCFBFA] shadow-md ring-2 ring-[#C5A267]"
            : "border-slate-200 bg-white hover:border-[#A0826D]"
        } ${isToday ? "ring-2 ring-[#10b981] ring-offset-2" : ""}`}
      >
        <div className="flex w-full items-center justify-between">
          <span className={`font-bold text-base ${
            isSelected ? "text-[#C5A267]" : isToday ? "text-[#10b981]" : "text-[#0F172A]"
          }`}>
            {date.date()}
          </span>
          {isToday && (
            <Tag color="green" className="!px-2 !py-0.5 !text-xs !font-semibold !border-[#10b981]">
              Hôm nay
            </Tag>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 mt-1">
          <span className={`text-[10px] font-medium ${
            isSelected ? "text-[#C5A267]" : "text-slate-500"
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
    <div className="min-h-screen bg-[#FCFBFA] py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="relative bg-[#C5A267] p-10 text-white shadow-md text-center">
          <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
          <h1 className="text-4xl font-bold mb-2">Chào mừng quay lại, Staff!</h1>
          <div className="text-2xl font-semibold">
            Hôm nay bạn có{" "}
            <span className="inline-block mx-3 px-8 py-3 bg-white/20 border-2 border-white/30 text-5xl font-extrabold">
              {todayBookings.length || 0}
            </span>{" "}
            <span>buổi đặt</span>
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
          <div className="flex items-center justify-between bg-[#FCFBFA] -m-6 mb-0 p-4 border-b-2 border-slate-200">
            <div>
              <div className="text-xs font-semibold text-[#C5A267] uppercase tracking-wide mb-1">
                Ngày
              </div>
              <div className="text-2xl font-bold text-[#0F172A]">
                {selectedDate.format("dddd, DD/MM/YYYY")}
              </div>
            </div>
            <Tag 
              color="default" 
              className="!px-4 !py-2 !text-base !font-bold !border-2 !border-[#C5A267] !bg-[#C5A267] !text-white !shadow-md"
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
                          <div className="font-bold text-xl text-[#0F172A] mb-1">
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
                    <div className="flex items-center gap-2 bg-[#FCFBFA] p-2 border border-slate-200">
                      <FiUser className="text-[#C5A267] text-lg" />
                      <span className="font-bold text-[#0F172A] text-base">
                        {customer.fullName || "Chưa có tên"}
                      </span>
                      {customer.isVerified && (
                        <Tag color="green" icon={<FiCheckCircle />} className="!ml-auto !font-semibold !border-2 !border-[#10b981]">
                          ✓ Đã xác minh
                        </Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-[#FCFBFA] p-2 border border-slate-200">
                      <FiPhone className="text-[#C5A267] text-base" />
                      <span className="font-medium text-[#0F172A]">{customer.phone || "Chưa có SĐT"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FCFBFA] p-2 border border-slate-200">
                      <FiMail className="text-[#C5A267] text-base" />
                      <span className="truncate font-medium text-[#0F172A]">
                        {customer.email || "Chưa có email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FCFBFA] p-2 border border-slate-200">
                      <FiShield className="text-[#C5A267] text-base" />
                      <Tag color="default" className="!px-2 !py-1 !font-semibold !text-xs !border !border-slate-300 bg-slate-100">
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
                    <div className="flex items-start gap-2 bg-[#FCFBFA] p-2 border border-slate-200">
                      <FiMapPin className="text-[#C5A267] text-base mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900 text-base">
                          {booking.studioName}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {booking.studioLocation || "Không có địa chỉ"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#10b981]/10 p-2 border border-[#10b981]/30">
                      <FiDollarSign className="text-[#10b981] text-lg" />
                      <span className="font-bold text-[#10b981] text-lg">
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
