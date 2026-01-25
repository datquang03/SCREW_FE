import React from "react";
import dayjs from "dayjs";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const ScheduleTable = ({
  value,
  onChange,
  scheduleByDate = {}, // chỉ nhận scheduleByDate
  disabledDate,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(
    value || dayjs().startOf("month")
  );

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  // ✅ FIX CHUẨN: CN = 0, Thứ 7 = 6 (KHÔNG PHỤ THUỘC LOCALE)
  const startDate = startOfMonth.subtract(startOfMonth.day(), "day");
  const endDate = endOfMonth.add(6 - endOfMonth.day(), "day");

  // Build days
  const days = [];
  let current = startDate.clone();
  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    days.push(current.clone());
    current = current.add(1, "day");
  }

  // Split weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const handleDateClick = (date) => {
    if (disabledDate?.(date)) return;
    if (date.isBefore(dayjs().startOf("day"), "day")) return;
    // Nếu đang chọn range (array), cho phép chọn từ ngày nào đến ngày nào
    if (Array.isArray(value)) {
      if (!value[0] || (value[0] && value[1])) {
        // Bắt đầu chọn mới
        onChange?.([date, null]);
      } else if (value[0] && !value[1]) {
        // Đang chọn ngày kết thúc
        if (date.isBefore(value[0], "day")) {
          // Nếu chọn ngày trước ngày bắt đầu, đảo ngược
          onChange?.([date, value[0]]);
        } else {
          onChange?.([value[0], date]);
        }
      }
    } else {
      onChange?.(date);
    }
  };

  // Tính duration cho nhiều ngày (nếu chọn range)
  let duration = 0;
  if (Array.isArray(value) && value[0] && value[1]) {
    // Nếu chọn từ 00:00 ngày A đến 00:00 ngày B thì duration = số ngày giữa 2 mốc (B - A)
    duration = dayjs(value[1]).diff(dayjs(value[0]), "day");
    // Nếu chọn cùng ngày thì vẫn là 1 ngày
    if (duration === 0) duration = 1;
  } else if (value) {
    duration = 1;
  }

  // Đảm bảo scheduleByDate là object, nếu null thì gán là {}
  const safeScheduleByDate = scheduleByDate && typeof scheduleByDate === 'object' ? scheduleByDate : {};
  console.log('scheduleByDate:', safeScheduleByDate);

  const renderDateCell = (date) => {
    // Lấy tất cả các slot booked mà ngày này nằm trong khoảng startTime - endTime
    let bookingsForThisDate = [];
    Object.entries(safeScheduleByDate).forEach(([dateKey, slotArr]) => {
      slotArr.forEach((b) => {
        if (b.startTime && b.endTime) {
          const start = dayjs(b.startTime).startOf("day");
          const end = dayjs(b.endTime).startOf("day");
          if (
            date.isSame(start, "day") ||
            date.isSame(end, "day") ||
            (date.isAfter(start, "day") && date.isBefore(end, "day"))
          ) {
            bookingsForThisDate.push(b);
          }
        }
      });
    });
    const isBooked = bookingsForThisDate.length > 0;

    const isPast = date.isBefore(dayjs().startOf("day"), "day");
    const isToday = date.isSame(dayjs(), "day");
    const isCurrentMonth = date.month() === currentMonth.month();
    // Hỗ trợ chọn nhiều ngày (range)
    let isSelected = false;
    if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
      isSelected = date.isSame(value[0], "day") || date.isSame(value[1], "day") || (date.isAfter(value[0], "day") && date.isBefore(value[1], "day"));
    } else {
      isSelected = value && date.isSame(value, "day");
    }

    const status = isPast
      ? "past"
      : isBooked
      ? "booked"
      : "available";

    return (
      <td
        key={date.format("YYYY-MM-DD")}
        onClick={() => handleDateClick(date)}
        className={`
          relative border-b border-gray-100 align-top transition-all duration-200
          ${isPast ? "bg-gray-50/50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50/30"}
          ${!isCurrentMonth ? "opacity-30 pointer-events-none" : ""}
          ${isSelected ? "ring-2 ring-blue-500 ring-inset bg-blue-50/20 z-10" : ""}
        `}
      >
        <div className="w-full aspect-square flex flex-col p-1">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div
              className={`
                w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${
                  isSelected
                    ? "bg-blue-600 text-white scale-110 shadow"
                    : isToday
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600"
                }
              `}
            >
              {date.date()}
            </div>

            {isToday && !isSelected && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-1" />
            )}
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center items-center">
            {status === "past" && !isToday && (
              <ClockCircleOutlined className="text-gray-400 opacity-40" />
            )}

            {status === "booked" && (
              <div className="flex flex-col items-center gap-0.5">
                <div className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {bookingsForThisDate.length} lịch
                </div>
                {/* Hiện tên studio nếu có */}
                {bookingsForThisDate[0]?.booking && (
                  <div className="hidden md:block text-[9px] text-gray-500 truncate max-w-full">
                    {bookingsForThisDate[0]?.booking?.studioName || bookingsForThisDate[0]?.booking?.studio?.name || ''}
                  </div>
                )}
              </div>
            )}

            {status === "available" && !isPast && (
              <div className="flex flex-col items-center gap-1">
                <CheckCircleOutlined className="text-emerald-500 text-lg" />
                <span className="hidden sm:block text-[10px] text-emerald-600 bg-emerald-50 px-1.5 rounded">
                  Trống
                </span>
              </div>
            )}

            {status === "available" && isToday && (
              <span className="text-[9px] text-blue-500 font-medium animate-pulse mt-1">
                Đặt ngay
              </span>
            )}
          </div>
        </div>
      </td>
    );
  };

  const weekDays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border shadow-sm">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <LeftOutlined />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-extrabold uppercase">
            Tháng {currentMonth.format("MM / YYYY")}
          </h3>
          <span className="text-xs text-gray-500">Lịch đặt studio</span>
        </div>

        <button
          onClick={handleNextMonth}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {weekDays.map((day, i) => (
                <th
                  key={day}
                  className={`
                    py-4 text-xs font-bold uppercase border-b
                    ${i === 0 || i === 6 ? "text-blue-600 bg-blue-50/50" : "text-gray-500 bg-gray-50/30"}
                  `}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i} className="divide-x">
                {week.map((date) => renderDateCell(date))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
