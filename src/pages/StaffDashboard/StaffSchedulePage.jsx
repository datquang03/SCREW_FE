import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Tag,
  Calendar,
  Badge,
  Modal,
  Descriptions,
  Spin,
  Button,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FiClock, FiCalendar, FiPlus } from "react-icons/fi";
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
} from "../../features/schedule/scheduleSlice";
import { getAllStudios } from "../../features/studio/studioSlice";

const { Title, Text } = Typography;
const { RangePicker: TimeRangePicker } = TimePicker;

const statusBadgeColor = (status) => {
  switch (status) {
    case "booked":
      return "error";
    case "available":
      return "success";
    default:
      return "default";
  }
};

const statusTagColor = (status) => {
  switch (status) {
    case "booked":
      return "red";
    case "available":
      return "green";
    default:
      return "default";
  }
};

const StaffSchedulePage = () => {
  const dispatch = useDispatch();
  const {
    items: schedules,
    current,
    loading: scheduleLoading,
  } = useSelector((state) => state.schedule);
  const { studios, loading: studiosLoading } = useSelector(
    (state) => state.studio
  );

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(getAllSchedules());
    dispatch(getAllStudios({ page: 1, limit: 100 }));
  }, [dispatch]);

  const getListData = (value) => {
    const daySchedules = (schedules || []).filter((s) =>
      dayjs(s.startTime).isSame(value, "day")
    );

    return daySchedules.map((s) => ({
      id: s._id,
      status: s.status,
      type: statusBadgeColor(s.status),
      timeRange: `${dayjs(s.startTime).format("HH:mm")}-${dayjs(
        s.endTime
      ).format("HH:mm")}`,
      studioShort: s.studioId ? s.studioId.slice(-4) : "",
    }));
  };

  const cellRender = (currentDate, info) => {
    if (info.type === "date") {
      const listData = getListData(currentDate);
      if (listData.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1 items-center justify-center">
        {listData.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={async () => {
                try {
                  setDetailLoading(true);
                  await dispatch(getScheduleById(item.id)).unwrap();
                  setDetailOpen(true);
                } finally {
                  setDetailLoading(false);
                }
              }}
              title={`${
                item.studioShort ? `Studio ${item.studioShort}` : "Studio"
              } - ${item.timeRange}`}
            >
              <FiCalendar
                className={`text-sm ${
                  item.status === "booked"
                    ? "text-red-500"
                    : item.status === "available"
                    ? "text-emerald-500"
                    : "text-gray-400"
                }`}
            />
            </div>
        ))}
        </div>
    );
    }
    return info.originNode;
  };

  const selectedDateSchedule = useMemo(() => {
    return (schedules || [])
      .filter((s) => dayjs(s.startTime).isSame(selectedDate, "day"))
      .map((s) => ({
        id: s._id,
        time: `${dayjs(s.startTime).format("HH:mm")} - ${dayjs(
          s.endTime
        ).format("HH:mm")}`,
        studio: s.studioId ? `Studio ${s.studioId.slice(-4)}` : "Studio",
        status: s.status === "booked" ? "Đã đặt" : "Trống",
        rawStatus: s.status,
      }));
  }, [schedules, selectedDate]);

  const handleCreateSchedule = async (values) => {
    try {
      setCreating(true);
      const { studioId, date, timeRange } = values;

      // Convert timeRange từ TimePicker.RangePicker sang format "HH:00-HH:00"
      if (!timeRange || timeRange.length !== 2) {
        message.error("Vui lòng chọn khung giờ!");
        return;
      }

      // TimePicker trả về dayjs object, format chỉ lấy giờ (chẵn, không có phút)
      const startHour = dayjs(timeRange[0]).format("HH");
      const endHour = dayjs(timeRange[1]).format("HH");
      const timeSlot = `${startHour}:00-${endHour}:00`;

      const payload = {
        studioId,
        date: dayjs(date).format("YYYY-MM-DD"),
        timeSlot,
      };

      console.log("Payload gửi lên API:", payload);

      await dispatch(createSchedule(payload)).unwrap();
      message.success("Tạo lịch mới thành công!");
      form.resetFields();
      setCreateModalOpen(false);
      // Refresh danh sách lịch
      dispatch(getAllSchedules());
    } catch (err) {
      message.error(err?.message || "Tạo lịch thất bại, vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-100 via-teal-50 to-white shadow-lg border border-emerald-200/50">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-300/30 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
            <Title level={2} className="mb-3 text-gray-900">
          Lịch làm việc
        </Title>
            <Text className="text-base text-gray-700 font-medium">
          Quản lý và theo dõi lịch làm việc của bạn
        </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FiPlus />}
            className="font-semibold shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 border-none hover:from-emerald-600 hover:to-teal-600"
            onClick={() => setCreateModalOpen(true)}
          >
            Tạo lịch mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4} className="mb-4 text-gray-900">
            Lịch tháng
          </Title>
          <Calendar
            cellRender={cellRender}
            className="staff-schedule-calendar"
            onSelect={(date) => setSelectedDate(date)}
            value={selectedDate}
          />
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4} className="mb-4 text-gray-900">
            {selectedDate.format("DD/MM/YYYY")}
          </Title>
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
            {selectedDateSchedule.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Không có lịch nào trong ngày này
              </div>
            ) : (
              selectedDateSchedule.map((item, idx) => (
              <div
                key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer"
                  onClick={async () => {
                    try {
                      setDetailLoading(true);
                      await dispatch(getScheduleById(item.id)).unwrap();
                      setDetailOpen(true);
                    } finally {
                      setDetailLoading(false);
                    }
                  }}
              >
                <div className="flex justify-between items-start mb-2">
                    <FiClock className="text-blue-500" />
                  <Tag
                    color={
                        item.rawStatus === "booked"
                          ? "red"
                          : item.rawStatus === "available"
                        ? "green"
                        : "default"
                    }
                  >
                    {item.status}
                  </Tag>
                </div>
                <div className="font-semibold">{item.time}</div>
                <div className="text-gray-600 text-sm">{item.studio}</div>
              </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        centered
        width={600}
        className="rounded-2xl"
        title={null}
      >
        {detailLoading || scheduleLoading || !current ? (
          <div className="flex items-center justify-center py-10">
            <Spin tip="Đang tải chi tiết lịch..." />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header gradient */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    Chi tiết lịch studio
                  </p>
                  <p className="text-lg font-semibold">
                    {current.studioId
                      ? `Studio ${current.studioId.slice(-6)}`
                      : "Studio"}
                  </p>
                </div>
                <Tag
                  color={statusTagColor(current.status)}
                  className="bg-white/10 border-none text-xs font-semibold"
                >
                  {current.status === "booked" ? "Đã đặt" : "Trống"}
                </Tag>
              </div>
              <p className="mt-2 text-[11px] opacity-80">
                ID: {current?._id || "--"}
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
              <Descriptions
                column={1}
                colon={false}
                size="small"
                styles={{ label: { fontWeight: 600 } }}
              >
                <Descriptions.Item label="Studio">
                  {current.studioId
                    ? `Studio ${current.studioId.slice(-6)}`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusTagColor(current.status)}>
                    {current.status === "booked" ? "Đã đặt" : "Trống"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian bắt đầu">
                  {current.startTime
                    ? dayjs(current.startTime).format("HH:mm DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc">
                  {current.endTime
                    ? dayjs(current.endTime).format("HH:mm DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {current.createdAt
                    ? dayjs(current.createdAt).format("HH:mm DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Booking liên kết">
                  {current.bookingId || "Không có / slot trống"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Schedule Modal */}
      <Modal
        open={createModalOpen}
        onCancel={() => {
          form.resetFields();
          setCreateModalOpen(false);
        }}
        footer={null}
        centered
        width={600}
        className="rounded-2xl"
        title={null}
      >
        <div className="space-y-4">
          {/* Header gradient */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white mb-4">
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <div>
                <p className="text-xs uppercase tracking-widest opacity-80">
                  Tạo lịch mới
                </p>
                <p className="text-lg font-semibold">Thêm slot lịch trống</p>
              </div>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSchedule}
            className="space-y-4"
          >
            <Form.Item
              label={
                <span className="text-gray-700 font-semibold">Chọn Studio</span>
              }
              name="studioId"
              rules={[{ required: true, message: "Vui lòng chọn studio!" }]}
            >
              <Select
                placeholder="Chọn studio"
                size="large"
                loading={studiosLoading}
                className="rounded-lg"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={studios.map((studio) => ({
                  value: studio._id,
                  label: `${studio.name}${
                    studio.location ? ` - ${studio.location}` : ""
                  }`,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-semibold">Chọn ngày</span>
              }
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker
                size="large"
                className="w-full rounded-lg"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-semibold">Khung giờ</span>
              }
              name="timeRange"
              rules={[{ required: true, message: "Vui lòng chọn khung giờ!" }]}
            >
              <TimeRangePicker
                size="large"
                format="HH"
                minuteStep={60}
                className="w-full rounded-lg"
                placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                suffixIcon={<FiClock />}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button
                  size="large"
                  onClick={() => {
                    form.resetFields();
                    setCreateModalOpen(false);
                  }}
                  disabled={creating}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={creating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 border-none hover:from-emerald-600 hover:to-teal-600 font-semibold"
                >
                  Tạo lịch
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default StaffSchedulePage;
