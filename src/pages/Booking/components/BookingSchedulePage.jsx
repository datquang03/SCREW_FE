// src/pages/Booking/components/BookingSchedulePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { TimePicker, Button, Card, Typography, Tag, message, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { setBookingTime } from "../../../features/booking/bookingSlice";
import { getStudioSchedule } from "../../../features/studio/studioSlice";
import ScheduleTable from "./ScheduleTable";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-10 py-6"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center space-y-2">
        <Title level={2} className="text-gray-900 mb-0">
          Chọn ngày và giờ đặt phòng
        </Title>
        <Text className="text-gray-600 text-base">
          Lịch trực quan: ô đỏ là đã đặt, xanh là còn trống, xám là đã qua.
        </Text>
      </div>

      {/* Chọn ngày & giờ */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lịch - chiếm 3/5 không gian */}
        <div className="lg:col-span-3">
        <Card
          title={
              <Title level={4} className="font-bold mb-0">
              Chọn ngày đặt phòng
            </Title>
          }
            className="shadow-sm border border-slate-200 rounded-2xl"
        >
            <ScheduleTable
            value={selectedDate}
            onChange={setSelectedDate}
              scheduleByDate={currentStudioSchedule?.scheduleByDate || {}}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Card>
        </div>

        {/* Chọn giờ + Tóm tắt - chiếm 2/5 không gian */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={
              <Title level={4} className="font-bold mb-0">
                Chọn khung giờ thuê
              </Title>
            }
            className="shadow-sm border border-slate-200 rounded-2xl"
            bodyStyle={{ padding: "16px" }}
          >
            <Spin spinning={scheduleLoading} tip="Đang tải lịch...">
              <div>
                <RangePicker
                  format="HH:mm"
                  minuteStep={30}
                  placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                  value={timeRange[0] && timeRange[1] ? timeRange : null}
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
              <div className="mt-6 p-5 rounded-2xl border border-rose-200 bg-white shadow-inner">
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
              <div className="mt-6 p-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm md:text-base">
                <strong>Ngày này hiện chưa có lịch đặt trước.</strong> Bạn có
                thể chọn khung giờ phù hợp.
              </div>
            )}
          </Card>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleNext}
            disabled={!selectedDate || !timeRange[0] || !timeRange[1]}
            className="h-14 text-lg font-semibold rounded-2xl shadow-sm"
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
