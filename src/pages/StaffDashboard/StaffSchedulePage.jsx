// src/pages/StaffSchedulePage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
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
        className={`h-24 w-full px-2 py-2 border rounded-xl flex flex-col items-center justify-between text-sm transition-all ${
          isSelected
            ? "border-purple-500 bg-purple-50 shadow-md"
            : "border-gray-200 bg-white"
        } ${isToday ? "ring-2 ring-blue-400" : ""}`}
      >
        <div className="flex w-full items-center justify-between text-xs text-gray-600">
          <span className="font-semibold text-gray-800">{date.date()}</span>
          {isToday && <Tag color="blue">Hôm nay</Tag>}
        </div>
        <div className="flex flex-col items-center gap-1 mt-1">
          <span className="text-[11px] text-gray-500">Số lịch</span>
          <Badge
            count={count}
            style={{ backgroundColor: count > 0 ? "#f5222d" : "#d9d9d9" }}
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
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl text-center">
          <Title level={1} className="mb-3 text-white">
            Chào mừng quay lại, Staff!
          </Title>
          <Text className="text-2xl opacity-95">
            Hôm nay bạn có{" "}
            <span className="text-5xl font-bold mx-3">
              {todayBookings.length}
            </span>{" "}
            buổi đặt
          </Text>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card
          className="shadow-xl rounded-3xl overflow-hidden border border-slate-200 bg-white"
          style={{ minHeight: 620 }}
          styles={{ body: { padding: 0 } }}
        >
          <Title
            level={4}
            className="text-center py-4 bg-slate-900 text-white"
          >
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
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Ngày</div>
              <div className="text-xl font-bold text-gray-800">
                {selectedDate.format("dddd, DD/MM/YYYY")}
              </div>
            </div>
            <Tag color="purple" className="px-3 py-1 rounded-full">
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
                          <div className="font-semibold text-lg text-slate-800">
                            {vnStart.format("HH:mm")} → {vnEnd.format("HH:mm")}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vnStart.format("DD/MM/YYYY")}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Tag
                            color={
                              booking.status === "completed" ? "green" : "orange"
                            }
                            className="rounded-full"
                          >
                            {booking.status === "completed"
                              ? "Hoàn tất"
                              : "Đang chờ"}
                          </Tag>
                          <Tag color="blue" className="rounded-full">
                            {booking.payType === "full"
                              ? "Thanh toán đủ"
                              : booking.payType === "prepay_50"
                              ? "Cọc 50%"
                              : booking.payType === "prepay_30"
                              ? "Cọc 30%"
                              : booking.payType || "Không rõ"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-2" />

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-slate-600" />
                      <span className="font-semibold">
                        {customer.fullName || "Chưa có tên"}
                      </span>
                      {customer.isVerified && (
                        <Tag color="cyan" icon={<FiCheckCircle />}>
                          Đã xác minh
                        </Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-slate-600" />
                      <span>{customer.phone || "Chưa có SĐT"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-slate-600" />
                      <span className="truncate">
                        {customer.email || "Chưa có email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiShield className="text-slate-600" />
                      <Tag color="purple" className="rounded-full">
                        {customer.role || "customer"}
                      </Tag>
                      <Tag color={customer.isActive ? "green" : "red"}>
                        {customer.isActive ? "Hoạt động" : "Đã khóa"}
                      </Tag>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-slate-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {booking.studioName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.studioLocation || "Không có địa chỉ"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-slate-600" />
                      <span className="font-semibold text-gray-900">
                        {booking.finalAmount?.toLocaleString()}đ
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
