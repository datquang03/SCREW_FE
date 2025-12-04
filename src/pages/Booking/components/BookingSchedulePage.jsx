// src/pages/Booking/components/BookingSchedulePage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  TimePicker,
  Button,
  Card,
  Typography,
  Tag,
  message,
  Spin,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { setBookingTime } from "../../../features/booking/bookingSlice";
import { getStudioSchedule } from "../../../features/studio/studioSlice";

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

const BookingSchedulePage = ({ onNext }) => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.booking.draft);
  const { studioSchedule, loading: scheduleLoading } = useSelector(
    (state) => state.studio
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [now, setNow] = useState(dayjs());

  const studioId = draft?.studioId;

  // Cập nhật thời gian hiện tại mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Lấy lịch studio khi có studioId
  useEffect(() => {
    if (studioId) {
      dispatch(getStudioSchedule({ studioId }));
    }
  }, [studioId, dispatch]);

  // Reset timeRange khi đổi ngày
  useEffect(() => {
    setTimeRange([null, null]);
  }, [selectedDate?.format("YYYY-MM-DD")]);

  useEffect(() => {
    if (draft.startTime && draft.endTime) {
      const start = dayjs(draft.startTime);
      const end = dayjs(draft.endTime);
      setSelectedDate(start);
      setTimeRange([start, end]);
    }
  }, [draft.startTime, draft.endTime]);

  // Tìm studio hiện tại trong danh sách
  const currentStudioSchedule = useMemo(() => {
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios))
      return null;
    return studioSchedule.studios.find((s) => s._id === studioId) || null;
  }, [studioSchedule, studioId]);

  const selectedDateKey = selectedDate
    ? selectedDate.format("YYYY-MM-DD")
    : null;

  const bookedSlots =
    currentStudioSchedule?.scheduleByDate?.[selectedDateKey] || [];

  const durationHours =
    selectedDate && timeRange[0] && timeRange[1]
      ? timeRange[1].diff(timeRange[0], "hour", true)
      : 0;

  const handleNext = () => {
    if (!selectedDate) return message.warning("Vui lòng chọn ngày đặt phòng!");
    if (!timeRange[0] || !timeRange[1])
      return message.warning("Vui lòng chọn khung giờ bắt đầu và kết thúc!");

    const startTime = selectedDate
      .hour(timeRange[0].hour())
      .minute(timeRange[0].minute())
      .second(0)
      .millisecond(0);

    const endTime = selectedDate
      .hour(timeRange[1].hour())
      .minute(timeRange[1].minute())
      .second(0)
      .millisecond(0);

    if (endTime.diff(startTime, "minute") < 60)
      return message.error("Thời gian thuê phải ít nhất 1 giờ!");
    if (endTime.isBefore(startTime))
      return message.error("Giờ kết thúc phải sau giờ bắt đầu!");

    // Kiểm tra trùng với các khung giờ đã được đặt
    const hasOverlap = bookedSlots.some((slot) => {
      const slotStart = dayjs(slot.startTime);
      const slotEnd = dayjs(slot.endTime);
      return startTime.isBefore(slotEnd) && endTime.isAfter(slotStart);
    });

    if (hasOverlap) {
      return message.error(
        "Khung giờ bạn chọn đã có lịch đặt trước, vui lòng chọn khung giờ khác!"
      );
    }

    // Kiểm tra thời gian đã qua
    if (startTime.isBefore(now)) {
      return message.error(
        "Giờ bắt đầu phải sau thời điểm hiện tại, vui lòng chọn lại!"
      );
    }

    dispatch(
      setBookingTime({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      })
    );

    message.success("Đã chọn khung giờ thành công!");
    onNext();
  };

  // Render cell cho calendar
  const renderDateCell = useCallback(
    (date) => {
      const key = date.format("YYYY-MM-DD");
      const hasBookings =
        currentStudioSchedule?.scheduleByDate?.[key]?.length > 0;
      const isPast = date.isBefore(dayjs().startOf("day"), "day");
      if (!hasBookings && !isPast) return <div className="h-6" />;

      return (
        <div className="mt-1 flex justify-center">
          {hasBookings && (
            <Tag
              color="red"
              className="text-[10px] px-1 py-0 rounded-full border-none"
            >
              Đã đặt
            </Tag>
          )}
          {!hasBookings && isPast && (
            <Tag
              color="default"
              className="text-[10px] px-1 py-0 rounded-full border-none"
            >
              Đã qua
            </Tag>
          )}
        </div>
      );
    },
    [currentStudioSchedule]
  );

  const calendarCellRender = (current, info) => {
    if (info.type === "date") {
      return renderDateCell(current);
    }
    return info.originNode;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-10 py-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <Title level={2} className="text-gray-900 mb-0">
          Chọn ngày và giờ đặt phòng
        </Title>
        <Text className="text-gray-600 text-lg">
          Vui lòng chọn ngày và khung giờ bạn muốn thuê studio
        </Text>
      </div>

      {/* Chọn ngày & giờ */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Lịch */}
        <Card
          title={
            <Title level={4} className="font-bold">
              Chọn ngày đặt phòng
            </Title>
          }
          className="shadow-xl"
        >
          <Calendar
            fullscreen={false}
            value={selectedDate}
            onChange={setSelectedDate}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            cellRender={calendarCellRender}
            className="rounded-xl"
          />
        </Card>

        {/* Chọn giờ + Tóm tắt */}
        <div className="space-y-8">
          <Card
            title={
              <Title level={4} className="font-bold">
                Chọn khung giờ thuê
              </Title>
            }
            className="shadow-xl"
          >
            <Spin spinning={scheduleLoading} tip="Đang tải lịch...">
              <div>
                <RangePicker
                  format="HH:mm"
                  minuteStep={30}
                  placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-full text-lg"
                  size="large"
                  allowClear={false}
                  disabled={!selectedDate}
                  style={{ height: 56 }}
                />
              </div>
            </Spin>

            {/* Các khung giờ đã được đặt trong ngày */}
            {selectedDate && bookedSlots.length > 0 && (
              <div className="mt-6 p-5 rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <Text strong className="text-red-600 text-base md:text-lg">
                      Khung giờ đã được đặt trong ngày
                    </Text>
                    <p className="text-xs text-gray-500 mt-1">
                      Khi chọn khung giờ, tránh các khoảng thời gian dưới đây
                    </p>
                  </div>
                  <Tag color="red" className="font-semibold text-sm px-4 py-1">
                    {bookedSlots.length} khung giờ
                  </Tag>
                </div>
                <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {bookedSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className="rounded-2xl border border-red-200 bg-white/90 px-4 py-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Text className="text-lg font-bold text-red-600">
                          {slot.timeRange}
                        </Text>
                        <Tag color="red" className="text-[10px] font-semibold">
                          ĐÃ ĐẶT
                        </Tag>
                      </div>
                      {slot.booking?.customer?.fullName && (
                        <div className="mb-1">
                          <Text className="text-xs text-gray-600 font-medium">
                            Khách hàng:
                          </Text>
                          <Text className="text-xs text-gray-700 ml-1">
                            {slot.booking.customer.fullName}
                          </Text>
                        </div>
                      )}
                      {slot.booking?.status && (
                        <div className="flex items-center gap-2">
                          <Text className="text-xs text-gray-500">
                            Trạng thái:
                          </Text>
                          <Tag
                            color={
                              slot.booking.status === "confirmed"
                                ? "green"
                                : slot.booking.status === "completed"
                                ? "blue"
                                : "orange"
                            }
                            className="text-[10px]"
                          >
                            {slot.booking.status === "confirmed"
                              ? "Đã xác nhận"
                              : slot.booking.status === "completed"
                              ? "Hoàn thành"
                              : "Chờ xác nhận"}
                          </Tag>
                        </div>
                      )}
                      {slot.duration && (
                        <div className="mt-1">
                          <Text className="text-xs text-gray-500">
                            Thời lượng: {slot.duration} giờ
                          </Text>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && bookedSlots.length === 0 && (
              <div className="mt-6 p-5 rounded-3xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm md:text-base">
                <strong>Ngày này hiện chưa có lịch đặt trước.</strong> Bạn có
                thể thoải mái chọn bất kỳ khung giờ nào phù hợp.
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
                <span>Ngày / khung giờ đã được đặt</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
                <span>Ngày / giờ đã qua</span>
              </div>
            </div>

            {/* Tóm tắt */}
            {selectedDate && timeRange[0] && timeRange[1] && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Ngày thuê:
                    </Text>
                    <Tag color="blue" className="text-base">
                      {selectedDate.format("dddd, DD/MM/YYYY")}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Khung giờ:
                    </Text>
                    <Tag color="green" className="text-base font-medium">
                      {timeRange[0].format("HH:mm")} →{" "}
                      {timeRange[1].format("HH:mm")}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Thời lượng:
                    </Text>
                    <Tag
                      color="purple"
                      className="text-base font-bold text-purple-700"
                    >
                      {durationHours.toFixed(1)} giờ
                    </Tag>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleNext}
            disabled={!selectedDate || !timeRange[0] || !timeRange[1]}
            className="h-16 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all"
            style={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
            icon={<ArrowRightOutlined />}
          >
            Tiếp theo → Chọn thiết bị & dịch vụ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSchedulePage;
