// src/pages/Booking/components/BookingSchedulePage.jsx
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
import { ArrowRightOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { motion } from "framer-motion";
import { setBookingTime } from "../../../features/booking/bookingSlice";
import { getStudioSchedule } from "../../../features/studio/studioSlice";
import ScheduleTable from "./ScheduleTable";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

const BookingSchedulePage = ({ onNext }) => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.booking.draft);
  const { studioSchedule, loading: scheduleLoading } = useSelector(
    (state) => state.studio
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRangeMode, setDateRangeMode] = useState("single"); // "single" hoặc "range"
  const [dateRange, setDateRange] = useState([null, null]); // Lưu [startDate, endDate] khi chọn khoảng
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
      dispatch(getStudioSchedule());
    }
  }, [studioId, dispatch]);

  // Reset timeRange khi đổi ngày
  useEffect(() => {
    setTimeRange([null, null]);
  }, [selectedDate?.format("YYYY-MM-DD")]);

  // Reset timeRange khi đổi chế độ hoặc dateRange
  useEffect(() => {
    setTimeRange([null, null]);
  }, [
    dateRangeMode,
    dateRange[0]?.format("YYYY-MM-DD"),
    dateRange[1]?.format("YYYY-MM-DD"),
  ]);

  useEffect(() => {
    if (draft.startTime && draft.endTime) {
      const start = dayjs(draft.startTime);
      const end = dayjs(draft.endTime);
      setSelectedDate(start);
      setTimeRange([start, end]);
    }
  }, [draft.startTime, draft.endTime]);

  // Tìm studio hiện tại trong danh sách
  const currentStudioAvailability = useMemo(() => {
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios))
      return null;
    return studioSchedule.studios.find((s) => s._id === studioId) || null;
  }, [studioSchedule, studioId]);

  // Tổng hợp scheduleByDate của tất cả studio
  const scheduleByDateAllStudios = useMemo(() => {
    const result = {};
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios)) return result;
    studioSchedule.studios.forEach((studio) => {
      Object.entries(studio.scheduleByDate || {}).forEach(([dateKey, slotArr]) => {
        if (!result[dateKey]) result[dateKey] = [];
        result[dateKey] = result[dateKey].concat(slotArr);
      });
    });
    return result;
  }, [studioSchedule]);

  // Debug log
  console.log("studioId:", studioId);
  console.log(
    "studios _id:",
    (studioSchedule?.studios || []).map((s) => s._id)
  );
  console.log("currentStudioAvailability:", currentStudioAvailability);
  console.log("studioSchedule.studios:", studioSchedule?.studios);
  console.log("scheduleByDate:", currentStudioAvailability?.scheduleByDate);

  // selectedDateKey cho bookedSlots
  const selectedDateKey = selectedDate
    ? selectedDate.format("YYYY-MM-DD")
    : null;

  // Lấy tất cả các slot đã đặt của mọi studio, lọc theo ngày hoặc khoảng ngày đã chọn
  const bookedSlots = useMemo(() => {
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios))
      return [];
    let slots = [];
    studioSchedule.studios.forEach((studio) => {
      Object.entries(studio.scheduleByDate || {}).forEach(
        ([dateKey, slotArr]) => {
          slotArr.forEach((slot) => {
            if (slot.status === "booked") {
              slots.push({
                ...slot,
                studioId: studio._id,
                studioName: studio.name,
                date: dateKey,
              });
            }
          });
        }
      );
    });
    if (dateRangeMode === "single" && selectedDate) {
      const key = selectedDate.format("YYYY-MM-DD");
      return slots.filter((slot) => slot.date === key);
    }
    if (dateRangeMode === "range" && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf("day");
      const end = dateRange[1].endOf("day");
      return slots.filter((slot) => {
        const slotDate = dayjs(slot.date);
        return slotDate.isValid() && slotDate.isSameOrAfter(start, "day") && slotDate.isSameOrBefore(end, "day");
      });
    }
    return slots;
  }, [studioSchedule, dateRangeMode, selectedDate, dateRange]);

  // Tính số lịch đã đặt cho từng ngày
  const bookedCountByDate = useMemo(() => {
    const result = {};
    if (!studioSchedule?.studios || !Array.isArray(studioSchedule.studios))
      return result;
    studioSchedule.studios.forEach((studio) => {  
      const byDate = studio.scheduleByDate || {};
      Object.keys(byDate).forEach((dateKey) => {
        const count = byDate[dateKey].filter(
          (slot) => slot.status === "booked"
        ).length;
        if (count > 0) {
          result[dateKey] = (result[dateKey] || 0) + count;
        }
      });
    });
    return result;
  }, [studioSchedule]);

  const durationHours =
    timeRange[0] && timeRange[1]
      ? timeRange[1].diff(timeRange[0], "hour", true)
      : 0;

  const handleNext = () => {
    // Kiểm tra đã chọn ngày
    const hasDateSelection =
      dateRangeMode === "single" ? selectedDate : dateRange[0] && dateRange[1];
    if (!hasDateSelection) {
      return message.warning("Vui lòng chọn ngày đặt phòng!");
    }

    if (!timeRange[0] || !timeRange[1])
      return message.warning("Vui lòng chọn khung giờ bắt đầu và kết thúc!");

    // Tính toán startTime và endTime
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

      // Đảm bảo là dayjs object
      startTime = dayjs(startTime);
      endTime = dayjs(endTime);

      // Nếu endTime <= startTime thì cộng thêm 1 ngày cho endTime (qua đêm)
      if (
        typeof endTime.isSameOrBefore === "function" &&
        endTime.isSameOrBefore(startTime)
      ) {
        endTime = endTime.add(1, "day");
      }
    } else {
      // Chế độ range: giờ bắt đầu từ ngày đầu, giờ kết thúc đến ngày cuối
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

    // Kiểm tra tối thiểu 4 giờ cho chế độ 1 ngày
    if (dateRangeMode === "single") {
      const durationInHours = endTime.diff(startTime, "hour", true);
      if (durationInHours < 4) {
        return message.error("Đặt phòng 1 ngày phải tối thiểu 4 giờ!");
      }
    }

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
          {/* Nút chọn chế độ */}
          <Card
            className="shadow-sm border border-slate-200 rounded-2xl mb-6"
            styles={{ body: { padding: "12px" } }}
          >
            <Radio.Group
              value={dateRangeMode}
              onChange={(e) => {
                setDateRangeMode(e.target.value);
                setSelectedDate(null);
                setDateRange([null, null]);
              }}
              className="w-full flex gap-4"
            >
              <Radio.Button value="single" className="flex-1">
                <span className="font-semibold">📅 Chọn 1 ngày (1 slot)</span>
              </Radio.Button>
              <Radio.Button value="range" className="flex-1">
                <span className="font-semibold">
                  📆 Chọn khoảng (nhiều ngày)
                </span>
              </Radio.Button>
            </Radio.Group>
          </Card>

          <Card
            title={
              <Title level={4} className="font-bold mb-0">
                {dateRangeMode === "single"
                  ? "Chọn ngày đặt phòng"
                  : "Chọn khoảng ngày đặt phòng"}
              </Title>
            }
            className="shadow-sm border border-slate-200 rounded-2xl"
          >
            <ScheduleTable
              value={dateRangeMode === "single" ? selectedDate : dateRange}
              onChange={dateRangeMode === "single" ? setSelectedDate : setDateRange}
              scheduleByDate={scheduleByDateAllStudios}
              bookedCountByDate={bookedCountByDate}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              isRange={dateRangeMode === "range"}
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
            styles={{ body: { padding: "16px" } }}
          >
            {scheduleLoading ? (
              <div className="space-y-4">
                <Skeleton.Input
                  active
                  size="large"
                  block
                  style={{ height: 56 }}
                />
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Hint thông báo tối thiểu giờ */}
                {dateRangeMode === "single" && selectedDate && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-amber-600 text-xl" />
                      <div>
                        <Text className="text-sm font-bold text-amber-800 block">
                          Lưu ý: Đặt phòng 1 ngày tối thiểu 4 giờ
                        </Text>
                        <Text className="text-xs text-amber-700">
                          Ví dụ: {now.add(1, "hour").format("HH:00")} →{" "}
                          {now.add(5, "hour").format("HH:00")}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chỉ render RangePicker khi đã chọn ngày */}
                {(
                  dateRangeMode === "single"
                    ? selectedDate
                    : dateRange[0] && dateRange[1]
                ) ? (
                  <RangePicker
                    format="HH:mm"
                    minuteStep={30}
                    placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
                    value={timeRange[0] && timeRange[1] ? timeRange : undefined}
                    className="w-full text-lg"
                    size="large"
                    allowClear={false}
                    needConfirm={false}
                    style={{ height: 56 }}
                    onChange={(times) => {
                      if (times && times[0] && times[1]) {
                        setTimeRange([times[0], times[1]]);
                      }
                    }}
                    disabledTime={(dateInfo, type) => {
                      const isToday =
                        dateRangeMode === "single"
                          ? selectedDate?.isSame(dayjs(), "day")
                          : dateRange[0]?.isSame(dayjs(), "day");

                      const currentHour = now.hour();
                      const currentMinute = now.minute();

                      // Lấy start hour nếu user đã chọn
                      let startHour = null;
                      if (timeRange[0]) {
                        startHour = timeRange[0].hour();
                      }

                      if (type === "start") {
                        // Disable start time: tất cả giờ < giờ hiện tại nếu hôm nay
                        const disabledHours = isToday
                          ? Array.from({ length: currentHour + 1 }, (_, i) => i)
                          : [];
                        return {
                          disabledHours: () => disabledHours,
                          disabledMinutes: (selectedHour) => {
                            // Nếu chọn giờ = giờ hiện tại, disable các phút < phút hiện tại
                            if (isToday && selectedHour === currentHour) {
                              return Array.from(
                                { length: currentMinute },
                                (_, i) => i
                              );
                            }
                            return [];
                          },
                        };
                      } else {
                        // Disable end time: phải >= start time + 4 giờ
                        let minEndHour = 0;
                        if (startHour !== null) {
                          minEndHour = startHour + 4;
                        } else if (isToday) {
                          minEndHour = currentHour + 4;
                        }

                        const disabledHours = Array.from(
                          { length: minEndHour },
                          (_, i) => i
                        );
                        return {
                          disabledHours: () => disabledHours,
                          disabledMinutes: (selectedHour) => {
                            // Nếu chọn giờ = minEndHour, disable các phút < phút bắt đầu
                            if (
                              startHour !== null &&
                              selectedHour === startHour + 4
                            ) {
                              const startMinute = timeRange[0].minute();
                              return Array.from(
                                { length: startMinute },
                                (_, i) => i
                              );
                            }
                            return [];
                          },
                        };
                      }
                    }}
                  />
                ) : (
                  <div className="p-4 bg-gray-100 rounded-xl border border-gray-300 text-center text-gray-600">
                    Vui lòng chọn ngày trước
                  </div>
                )}

                {/* Hiển thị số giờ đã chọn */}
                {timeRange[0] && timeRange[1] && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <ClockCircleOutlined className="text-white text-lg" />
                        </div>
                        <div>
                          <Text className="text-xs text-gray-600 block">
                            Thời lượng thuê
                          </Text>
                          <Text className="text-xl font-bold text-blue-700">
                            {durationHours.toFixed(1)} giờ
                          </Text>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className="text-xs text-gray-600 block">
                          Khung giờ
                        </Text>
                        <Text className="text-sm font-bold text-gray-800">
                          {timeRange[0].format("HH:mm")} -{" "}
                          {timeRange[1].format("HH:mm")}
                        </Text>
                      </div>
                    </div>
                    {dateRangeMode === "single" && durationHours < 4 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <Text className="text-xs text-red-600 font-semibold">
                          ⚠️ Cần thêm {(4 - durationHours).toFixed(1)} giờ nữa
                          (tối thiểu 4 giờ)
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Các khung giờ đã được đặt */}
            {bookedSlots.length > 0 &&
              (dateRangeMode === "single"
                ? selectedDate
                : dateRange[0] && dateRange[1]) && (
                <div className="mt-6 p-5 rounded-2xl border border-rose-200 bg-white shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <Text
                        strong
                        className="text-red-600 text-base md:text-lg"
                      >
                        {dateRangeMode === "single"
                          ? "Khung giờ đã được đặt trong ngày"
                          : `Khung giờ đã được đặt từ ${dateRange[0]?.format(
                              "DD/MM"
                            )} đến ${dateRange[1]?.format("DD/MM")}`}
                      </Text>
                      <p className="text-xs text-gray-500 mt-1">
                        Khi chọn khung giờ, tránh các khoảng thời gian dưới đây
                      </p>
                    </div>
                    <Tag
                      color="red"
                      className="font-semibold text-sm px-4 py-1"
                    >
                      {bookedSlots.length} khung giờ
                    </Tag>
                  </div>
                  <div
                    className={`grid gap-3 ${
                      bookedSlots.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {bookedSlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="rounded-2xl border border-red-200 bg-white/90 px-4 py-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Header của thẻ */}
                          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                            <Text className="text-xl font-extrabold text-red-600 tracking-tight">
                              {slot.timeRange ||
                                `${dayjs(slot.startTime).format(
                                  "HH:mm"
                                )} - ${dayjs(slot.endTime).format("HH:mm")}`}
                            </Text>
                            <Tag
                              color="red"
                              className="text-[10px] font-bold uppercase m-0"
                            >
                              ĐÃ ĐẶT
                            </Tag>
                          </div>

                          {/* Thân thẻ - dùng grid nếu full width */}
                          <div
                            className={`${
                              bookedSlots.length === 1
                                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                                : "space-y-3"
                            }`}
                          >
                            {/* Cột trái (hoặc hàng trên) */}
                            <div className="space-y-3">
                              {/* Ngày nếu chế độ range */}
                              {dateRangeMode === "range" && (
                                <div className="text-sm text-gray-700 font-semibold bg-gray-50 p-2 rounded-lg inline-block">
                                  📅{" "}
                                  {dayjs(slot.startTime).format("DD/MM/YYYY")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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

            {dateRange[0] && dateRange[1] && bookedSlots.length === 0 && (
              <div className="mt-6 p-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm md:text-base">
                <strong>
                  Khoảng thời gian này hiện chưa có lịch đặt trước.
                </strong>{" "}
                Bạn có thể chọn khung giờ phù hợp.
              </div>
            )}
          </Card>

          {/* Hiển thị ngày đã chọn */}
          {(selectedDate || (dateRange[0] && dateRange[1])) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl px-6 py-5 shadow-xl border-2 border-blue-400 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-blue-600 font-black text-2xl">
                      {dateRangeMode === "single"
                        ? selectedDate?.date()
                        : dateRange[0]?.date()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs !text-blue-100 block mb-1 font-semibold">
                      📅 Ngày đặt phòng
                    </span>
                    {dateRangeMode === "single" ? (
                      <>
                        <span className="text-lg md:text-xl font-black !text-white block">
                          {selectedDate?.format("DD/MM/YYYY")}
                        </span>
                        <span className="text-xs !text-blue-100 block mt-1 capitalize">
                          {selectedDate?.format("dddd")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg md:text-xl font-black !text-white block">
                          {dateRange[0]?.format("DD/MM")} →{" "}
                          {dateRange[1]?.format("DD/MM/YYYY")}
                        </span>
                        <span className="text-xs !text-blue-100 block mt-1">
                          {dateRange[1]?.diff(dateRange[0], "day") + 1} ngày
                        </span>
                      </>
                    )}
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
            className="h-16 text-xl font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
            icon={<ArrowRightOutlined className="text-2xl" />}
          >
            Tiếp theo → Chọn thiết bị & dịch vụ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSchedulePage;
