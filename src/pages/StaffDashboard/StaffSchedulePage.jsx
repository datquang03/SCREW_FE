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
} from "react-icons/fi";

import { getAllMyBookings } from "../../features/booking/bookingSlice";
import { getAllStudios } from "../../features/studio/studioSlice";
import { getScheduleById } from "../../features/schedule/scheduleSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

const toVNTime = (iso) => (iso ? dayjs(iso).tz("Asia/Ho_Chi_Minh") : null);

const StaffSchedulePage = () => {
  const dispatch = useDispatch();

  // ĐÚNG TÊN KEY: items chứ không phải bookings
  const { items: rawBookings = [], loading: bookingLoading } = useSelector(
    (state) => state.booking
  );
  const { studios = [] } = useSelector((state) => state.studio);
  const { items: fetchedSchedules = [] } = useSelector(
    (state) => state.schedule
  );

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchedScheduleIds = useRef(new Set());

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

  // Load lần đầu
  useEffect(() => {
    dispatch(getAllMyBookings());
    dispatch(getAllStudios({ page: 1, limit: 100 }));
  }, [dispatch]);

  const todayBookings = enrichedBookings
    .filter((b) => toVNTime(b.startTime).isSame(dayjs(), "day"))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedDateBookings = enrichedBookings
    .filter((b) => toVNTime(b.startTime).isSame(selectedDate, "day"))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dateCellRender = (date) => {
    const count = enrichedBookings.filter((b) =>
      toVNTime(b.startTime).isSame(date, "day")
    ).length;
    if (count === 0) return null;
    return (
      <div className="flex justify-center py-1">
        <Badge count={count} style={{ backgroundColor: "#f5222d" }} />
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Cột trái */}
        <div className="space-y-8">
          {/* Lịch tháng */}
          <Card className="shadow-2xl rounded-3xl overflow-hidden border-0">
            <Title
              level={4}
              className="text-center py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Lịch đặt trong tháng
            </Title>
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onSelect={setSelectedDate}
              dateCellRender={dateCellRender}
            />
          </Card>

          {/* Hôm nay */}
          <Card className="shadow-2xl rounded-3xl border-0">
            <div className="flex justify-between items-center mb-5">
              <Title level={4} className="m-0 text-purple-700">
                Hôm nay ({dayjs().format("DD/MM")})
              </Title>
              <Badge count={todayBookings.length} color="#f5222d" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {todayBookings.length === 0 ? (
                <Empty description="Hôm nay chưa có khách nào" />
              ) : (
                todayBookings.map((b) => (
                  <div
                    key={b._id}
                    onClick={() => openDetail(b)}
                    className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-all"
                  >
                    <div className="font-bold text-xl text-purple-800">
                      {toVNTime(b.startTime).format("HH:mm")} →{" "}
                      {toVNTime(b.endTime).format("HH:mm")}
                    </div>
                    <div className="mt-1 font-medium text-gray-800">
                      {b.customer?.fullName || "Khách"}
                    </div>
                    <div className="text-sm text-gray-600">{b.studioName}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Cột phải: Chi tiết ngày */}
        <div className="xl:col-span-2">
          <Card className="shadow-2xl rounded-3xl border-0 h-full">
            <div className="flex justify-between items-center mb-6">
              <Title level={3} className="m-0 text-purple-700">
                {selectedDate.format("dddd, DD/MM/YYYY")}
              </Title>
              <Badge
                count={selectedDateBookings.length}
                color="#f5222d"
                className="text-xl"
              />
            </div>

            {selectedDateBookings.length === 0 ? (
              <Empty description="Không có buổi đặt nào" className="py-24" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedDateBookings.map((booking) => {
                  const customer = booking.customer || {};
                  const vnStart = toVNTime(booking.startTime);
                  const vnEnd = toVNTime(booking.endTime);

                  return (
                    <div
                      key={booking._id}
                      onClick={() => openDetail(booking)}
                      className="bg-white rounded-3xl shadow-xl border hover:border-purple-400 transition-all cursor-pointer p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Avatar
                          size={60}
                          className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold"
                        >
                          {customer.fullName?.[0] || "K"}
                        </Avatar>
                        <div className="text-right">
                          <Tag
                            color={
                              booking.status === "completed"
                                ? "green"
                                : "volcano"
                            }
                            className="mb-2"
                          >
                            {booking.status === "completed"
                              ? "HOÀN TẤT"
                              : "ĐANG CHỜ"}
                          </Tag>
                          <div className="text-2xl font-bold text-purple-600">
                            {booking.finalAmount?.toLocaleString()}đ
                          </div>
                        </div>
                      </div>

                      <Divider className="my-4" />

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FiClock className="text-purple-600 text-xl" />
                          <span className="font-bold text-lg">
                            {vnStart.format("HH:mm")} → {vnEnd.format("HH:mm")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <FiUser className="text-pink-600" />
                          <span className="font-semibold text-gray-800">
                            {customer.fullName || "Chưa có tên"}
                          </span>
                        </div>

                        {customer.phone && (
                          <div className="flex items-center gap-3">
                            <FiPhone className="text-green-600" />
                            <span>{customer.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <FiMapPin className="text-blue-600" />
                          <span className="font-medium">
                            {booking.studioName}
                          </span>
                        </div>

                        {booking.payType === "deposit" && (
                          <div className="p-3 bg-orange-50 rounded-xl border border-orange-300 text-orange-700 font-semibold flex items-center gap-2">
                            <FiAlertCircle />
                            Còn nợ{" "}
                            {(
                              booking.totalBeforeDiscount - booking.finalAmount
                            ).toLocaleString()}
                            đ
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal chi tiết */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        centered
        title={null}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="text-center py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white">
              <Title level={2} className="text-white mb-2">
                {toVNTime(selectedBooking.startTime).format("HH:mm")} →{" "}
                {toVNTime(selectedBooking.endTime).format("HH:mm")}
              </Title>
              <Text className="text-xl opacity-90">
                {toVNTime(selectedBooking.startTime).format("dddd, DD/MM/YYYY")}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <Title level={4} className="text-purple-700 mb-4">
                  Khách hàng
                </Title>
                <div className="space-y-3 bg-gray-50 p-5 rounded-2xl">
                  <div>
                    <strong>Họ tên:</strong>{" "}
                    {selectedBooking.customer?.fullName || "Không có"}
                  </div>
                  <div>
                    <strong>SĐT:</strong>{" "}
                    {selectedBooking.customer?.phone || "Không có"}
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    {selectedBooking.customer?.email || "Không có"}
                  </div>
                </div>
              </div>

              <div>
                <Title level={4} className="text-pink-700 mb-4">
                  Studio & Slot
                </Title>
                <div className="space-y-3 bg-gray-50 p-5 rounded-2xl">
                  <div>
                    <strong>Tên studio:</strong> {selectedBooking.studioName}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong> {selectedBooking.studioLocation}
                  </div>
                  <div>
                    <strong>Slot ID:</strong>{" "}
                    {selectedBooking.scheduleId || "Không có"}
                  </div>
                  <div>
                    <strong>Trạng thái slot:</strong>
                    <Tag
                      color={
                        selectedBooking.slotStatus === "booked"
                          ? "red"
                          : "green"
                      }
                    >
                      {selectedBooking.slotStatus === "booked"
                        ? "ĐÃ ĐẶT"
                        : "TRỐNG"}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <Descriptions bordered title="Thanh toán" column={2}>
              <Descriptions.Item label="Tổng tiền">
                {selectedBooking.totalBeforeDiscount?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Đã thanh toán">
                <span className="text-xl font-bold text-green-600">
                  {selectedBooking.finalAmount?.toLocaleString()}đ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức">
                <Tag
                  color={
                    selectedBooking.payType === "full" ? "green" : "orange"
                  }
                >
                  {selectedBooking.payType === "full"
                    ? "Thanh toán đủ"
                    : "Chỉ đặt cọc"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedBooking.status === "completed" ? "green" : "volcano"
                  }
                >
                  {selectedBooking.status === "completed"
                    ? "Hoàn tất"
                    : "Chưa xong"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffSchedulePage;
