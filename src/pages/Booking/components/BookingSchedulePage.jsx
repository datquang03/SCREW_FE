import React, { useState, useEffect, useMemo } from "react";
import {
  TimePicker,
  Button,
  Card,
  Typography,
  Tag,
  message,
  Skeleton,
  Radio,
  DatePicker,
} from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { setBookingTime } from "../../../features/booking/bookingSlice";
import { getStudioSchedule } from "../../../features/studio/studioSlice";
import ScheduleTable from "./ScheduleTable";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = TimePicker;

const BookingSchedulePage = ({ onNext }) => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.booking.draft);
  const { studioSchedule, loading: scheduleLoading } = useSelector(
    (state) => state.studio
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRangeMode, setDateRangeMode] = useState("single");
  const [dateRange, setDateRange] = useState([null, null]);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [now, setNow] = useState(dayjs());

  const studioId = draft?.studioId;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (studioId) {
      dispatch(getStudioSchedule({ studioId }));
    }
  }, [studioId, dispatch]);

  useEffect(() => {
    setTimeRange([null, null]);
  }, [selectedDate?.format("YYYY-MM-DD")]);

  useEffect(() => {
    setTimeRange([null, null]);
  }, [dateRangeMode, dateRange[0]?.format("YYYY-MM-DD"), dateRange[1]?.format("YYYY-MM-DD")]);

  useEffect(() => {
    if (draft.startTime && draft.endTime) {
      const start = dayjs(draft.startTime);
      const end = dayjs(draft.endTime);
      setSelectedDate(start);
      setTimeRange([start, end]);
    }
  }, [draft.startTime, draft.endTime]);

  const currentStudioSchedule = useMemo(() => {
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios))
      return null;
    return studioSchedule.studios.find((s) => s._id === studioId) || null;
  }, [studioSchedule, studioId]);

  const selectedDateKey = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

  const bookedSlots = useMemo(() => {
    if (dateRangeMode === "single" && selectedDate) {
      return currentStudioSchedule?.scheduleByDate?.[selectedDateKey] || [];
    } else if (dateRangeMode === "range" && dateRange[0] && dateRange[1]) {
      let slots = [];
      let current = dateRange[0];
      while (current.isBefore(dateRange[1]) || current.isSame(dateRange[1], "day")) {
        const key = current.format("YYYY-MM-DD");
        const daySlots = currentStudioSchedule?.scheduleByDate?.[key] || [];
        slots = [...slots, ...daySlots];
        current = current.add(1, "day");
      }
      return slots;
    }
    return [];
  }, [currentStudioSchedule, selectedDate, dateRange, dateRangeMode, selectedDateKey]);

  const durationHours =
    timeRange[0] && timeRange[1]
      ? timeRange[1].diff(timeRange[0], "hour", true)
      : 0;

  const handleNext = () => {
    const hasDateSelection =
      dateRangeMode === "single"
        ? selectedDate
        : (dateRange[0] && dateRange[1]);

    if (!hasDateSelection)
      return message.warning("Vui lòng chọn ngày đặt phòng!");

    if (!timeRange[0] || !timeRange[1])
      return message.warning("Vui lòng chọn khung giờ!");

    let startTime, endTime;

    if (dateRangeMode === "single") {
      startTime = selectedDate
        .hour(timeRange[0].hour())
        .minute(timeRange[0].minute())
        .second(0)
        .millisecond(0);
      endTime = selectedDate
        .hour(timeRange[1].hour())
        .minute(timeRange[1].minute())
        .second(0)
        .millisecond(0);
    } else {
      startTime = dateRange[0]
        .hour(timeRange[0].hour())
        .minute(timeRange[0].minute())
        .second(0)
        .millisecond(0);
      endTime = dateRange[1]
        .hour(timeRange[1].hour())
        .minute(timeRange[1].minute())
        .second(0)
        .millisecond(0);
    }

    if (endTime.diff(startTime, "minute") < 60)
      return message.error("Thời gian thuê phải ít nhất 1 giờ!");

    if (endTime.isBefore(startTime))
      return message.error("Giờ kết thúc phải sau giờ bắt đầu!");

    if (dateRangeMode === "single" && endTime.diff(startTime, "hour", true) < 4)
      return message.error("Đặt phòng 1 ngày phải tối thiểu 4 giờ!");

    const hasOverlap = bookedSlots.some((slot) => {
      const slotStart = dayjs(slot.startTime);
      const slotEnd = dayjs(slot.endTime);
      return startTime.isBefore(slotEnd) && endTime.isAfter(slotStart);
    });

    if (hasOverlap)
      return message.error("Khung giờ đã có lịch đặt trước!");

    if (startTime.isBefore(now))
      return message.error("Giờ bắt đầu phải sau hiện tại!");

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
      className="max-w-7xl mx-auto space-y-12 py-10 px-4"
    >
      {/* LUXURY HEADER */}
      <div className="text-center space-y-4 mb-16">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">
          Bước 02
        </p>
        <Title
          level={2}
          className="!text-4xl md:!text-5xl !font-semibold !text-[#0F172A] !mb-0"
        >
          Thời gian & Lịch trình
        </Title>
        <div className="h-px w-24 bg-[#C5A267] mx-auto mt-6"></div>
        <Paragraph className="text-slate-400 text-sm uppercase tracking-widest pt-2">
          Xác định thời điểm cho những dự án nghệ thuật của bạn
        </Paragraph>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* LEFT: CALENDAR AREA */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-2 border border-slate-100 shadow-sm">
            <Radio.Group
              value={dateRangeMode}
              onChange={(e) => {
                setDateRangeMode(e.target.value);
                setSelectedDate(null);
                setDateRange([null, null]);
              }}
              className="w-full flex"
            >
              <Radio.Button
                value="single"
                className="flex-1 !h-14 !leading-[54px] !text-center !rounded-none !border-gray-100 !text-[10px] !uppercase !tracking-[0.2em] !font-bold"
              >
                📅 Đặt lẻ ngày
              </Radio.Button>
              <Radio.Button
                value="range"
                className="flex-1 !h-14 !leading-[54px] !text-center !rounded-none !border-gray-100 !text-[10px] !uppercase !tracking-[0.2em] !font-bold"
              >
                📆 Đặt theo khoảng
              </Radio.Button>
            </Radio.Group>
          </div>

          <Card
            title={
              <div className="flex items-center gap-4 py-2">
                <CalendarOutlined className="text-[#C5A267]" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                  {dateRangeMode === "single"
                    ? "Chọn ngày làm việc"
                    : "Chọn khoảng thời gian"}
                </span>
              </div>
            }
            className="!shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] !border-slate-100 !rounded-sm overflow-hidden"
          >
            {dateRangeMode === "single" ? (
              <ScheduleTable
                value={selectedDate}
                onChange={setSelectedDate}
                scheduleByDate={currentStudioSchedule?.scheduleByDate || {}}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            ) : (
              <div className="space-y-6">
                <DatePicker.RangePicker
                  format="DD/MM/YYYY"
                  value={dateRange[0] && dateRange[1] ? dateRange : null}
                  onChange={(dates) =>
                    dates && dates[0] && dates[1]
                      ? setDateRange([dates[0], dates[1]])
                      : setDateRange([null, null])
                  }
                  className="!w-full !h-16 !rounded-none !border-slate-100 !bg-[#F8F9FA]"
                  size="large"
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
                {dateRange[0] && dateRange[1] && (
                  <div className="p-8 border border-[#C5A267]/20 bg-[#F8F6F3] relative group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#C5A267]/5 rounded-bl-full"></div>
                    <Text className="text-sm font-light">
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A267] font-bold block mb-2">
                        Khoảng thời gian xác định
                      </span>
                      <strong className="text-[#0F172A] text-lg font-semibold">
                        {dateRange[0].format("DD/MM/YYYY")} —{" "}
                        {dateRange[1].format("DD/MM/YYYY")}
                      </strong>
                      <br />
                      <span className="text-[#C5A267] font-bold uppercase text-[10px] tracking-widest mt-2 block">
                        Tổng cộng {dateRange[1].diff(dateRange[0], "day") + 1}{" "}
                        ngày làm việc
                      </span>
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT: TIME & SUMMARY AREA */}
        <div className="lg:col-span-5 space-y-8">
          <Card
            title={
              <div className="flex items-center gap-4 py-2">
                <ClockCircleOutlined className="text-[#C5A267]" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                  Thiết lập giờ thuê
                </span>
              </div>
            }
            className="!shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] !border-slate-100 !rounded-sm"
          >
            {scheduleLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <div className="space-y-8">
                {dateRangeMode === "single" && selectedDate && (
                  <div className="bg-[#F8F6F3] border-l-2 border-[#C5A267] p-6">
                    <div className="flex items-start gap-4">
                      <InfoCircleOutlined className="text-[#C5A267] mt-1" />
                      <div>
                        <Text className="text-[10px] uppercase tracking-widest font-bold text-[#0F172A] block mb-1">
                          Quy định Studio
                        </Text>
                        <Text className="text-xs text-slate-500 font-light leading-relaxed">
                          Đặt phòng đơn lẻ yêu cầu tối thiểu 04 giờ làm việc liên tục.
                        </Text>
                      </div>
                    </div>
                  </div>
                )}

                {(dateRangeMode === "single" ? selectedDate : (dateRange[0] && dateRange[1])) ? (
                  <RangePicker
                    format="HH:mm"
                    minuteStep={30}
                    placeholder={["Bắt đầu", "Kết thúc"]}
                    value={timeRange[0] && timeRange[1] ? timeRange : undefined}
                    className="!w-full !h-16 !rounded-none !border-slate-100 !bg-[#F8F9FA] !text-lg"
                    size="large"
                    allowClear={false}
                    needConfirm={false}
                    onChange={(times) =>
                      times &&
                      times[0] &&
                      times[1] &&
                      setTimeRange([times[0], times[1]])
                    }
                    disabledTime={(dateInfo, type) => {
                      const isToday =
                        dateRangeMode === "single"
                          ? selectedDate?.isSame(dayjs(), "day")
                          : dateRange[0]?.isSame(dayjs(), "day");
                      const currentHour = now.hour();
                      const currentMinute = now.minute();
                      let startHour = timeRange[0] ? timeRange[0].hour() : null;

                      if (type === "start") {
                        const disabledHours = isToday
                          ? Array.from({ length: currentHour + 1 }, (_, i) => i)
                          : [];

                        return {
                          disabledHours: () => disabledHours,
                          disabledMinutes: (selectedHour) =>
                            isToday && selectedHour === currentHour
                              ? Array.from({ length: currentMinute }, (_, i) => i)
                              : [],
                        };
                      } else {
                        let minEndHour =
                          startHour !== null
                            ? startHour + 4
                            : isToday
                            ? currentHour + 4
                            : 0;

                        return {
                          disabledHours: () =>
                            Array.from({ length: minEndHour }, (_, i) => i),
                          disabledMinutes: (selectedHour) =>
                            startHour !== null && selectedHour === startHour + 4
                              ? Array.from(
                                  { length: timeRange[0].minute() },
                                  (_, i) => i
                                )
                              : [],
                        };
                      }
                    }}
                  />
                ) : (
                  <div className="p-8 border border-dashed border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
                    Vui lòng xác định ngày làm việc
                  </div>
                )}

                {/* DURATION BOX */}
                {timeRange[0] && timeRange[1] && (
                  <div className="bg-[#0F172A] p-8 -mx-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#C5A267] font-bold mb-2">
                          Tổng thời lượng
                        </p>
                        <p className="text-3xl font-semibold text-white">
                          {durationHours.toFixed(1)}{" "}
                          <span className="text-sm text-[#C5A267]">
                            giờ
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                          Khung giờ
                        </p>
                        <p className="text-sm text-slate-300 font-medium tracking-widest uppercase">
                          {timeRange[0].format("HH:mm")} —{" "}
                          {timeRange[1].format("HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BOOKED SLOTS SECTION */}
            {bookedSlots.length > 0 &&
              (dateRangeMode === "single"
                ? selectedDate
                : (dateRange[0] && dateRange[1])) && (
                <div className="mt-10 pt-10 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-rose-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></div>
                      Lịch đã xác nhận ({bookedSlots.length})
                    </h4>
                  </div>
                  <div className="grid gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {bookedSlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex justify-between items-center p-4 bg-rose-50/30 border border-rose-100/50 group hover:bg-rose-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-rose-700 tracking-tighter">
                            {dayjs(slot.startTime).format("HH:mm")} -{" "}
                            {dayjs(slot.endTime).format("HH:mm")}
                          </span>
                          {dateRangeMode === "range" && (
                            <span className="text-[9px] uppercase tracking-widest font-bold text-rose-300">
                              {dayjs(slot.startTime).format("DD/MM")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] uppercase tracking-widest text-rose-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Không khả dụng
                          </span>
                          <CheckCircleFilled className="text-rose-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </Card>

          {/* DATE TILE SUMMARY */}
          {(selectedDate || (dateRange[0] && dateRange[1])) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-[#0F172A] p-8 border border-[#C5A267]/20 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A267]/5 rounded-bl-full transition-all duration-700 group-hover:scale-150"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 bg-white flex items-center justify-center shrink-0 shadow-2xl">
                    <span className="text-[#0F172A] text-2xl font-bold">
                      {dateRangeMode === "single"
                        ? selectedDate?.date()
                        : dateRange[0]?.date()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A267] font-bold block mb-1">
                      Thời gian xác định
                    </span>
                    <span className="text-sm font-bold tracking-widest text-white uppercase">
                      {dateRangeMode === "single"
                        ? selectedDate?.format("DD MMMM, YYYY")
                        : `${dateRange[0]?.format("DD/MM")} → ${dateRange[1]?.format(
                            "DD/MM/YYYY"
                          )}`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            type="primary"
            size="large"
            block
            onClick={handleNext}
            disabled={
              dateRangeMode === "single"
                ? !selectedDate ||
                  !timeRange[0] ||
                  !timeRange[1] ||
                  durationHours < 4
                : !dateRange[0] ||
                  !dateRange[1] ||
                  !timeRange[0] ||
                  !timeRange[1]
            }
            className="!h-16 !mt-6 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !font-bold !rounded-none !shadow-2xl transition-all duration-500 !flex !items-center !justify-center !gap-4 !text-[10px] !uppercase !tracking-[0.3em]"
            icon={<ArrowRightOutlined className="text-xs" />}
          >
            Tiếp theo: Thiết bị & Dịch vụ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSchedulePage;
