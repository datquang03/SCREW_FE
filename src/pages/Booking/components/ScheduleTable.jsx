// src/pages/Booking/components/ScheduleTable.jsx
import React from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ScheduleTable = ({
  value,
  onChange,
  scheduleByDate = {},
  disabledDate,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(
    value || dayjs().startOf("month")
  );

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days = [];
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleDateClick = (date) => {
    if (disabledDate && disabledDate(date)) return;
    if (date.isBefore(dayjs().startOf("day"), "day")) return;
    onChange(date);
  };

  const renderDateCell = (date) => {
    const key = date.format("YYYY-MM-DD");
    const bookings = scheduleByDate[key] || [];
    const isPast = date.isBefore(dayjs().startOf("day"), "day");
    const isToday = date.isSame(dayjs(), "day");
    const isCurrentMonth = date.month() === currentMonth.month();
    const isSelected = value && date.isSame(value, "day");
    const status = isPast
      ? "past"
      : bookings.length > 0
      ? "booked"
      : "available";

    const baseClass =
      "relative border border-gray-400 px-2 py-2 cursor-pointer transition-colors flex flex-col hover:bg-opacity-80";
    const colorClass =
      status === "booked"
        ? "bg-rose-50"
        : status === "available"
        ? "bg-emerald-50"
        : "bg-gray-50";
    const selectedClass = isSelected
      ? "bg-blue-100 border-blue-500 border-2"
      : "";
    const opacityClass = !isCurrentMonth ? "opacity-50 bg-gray-50" : "";
    const todayClass = isToday ? "bg-blue-50 border-blue-400 border-2" : "";

    return (
      <td
        key={key}
        className={`${baseClass} ${colorClass} ${selectedClass} ${opacityClass} ${todayClass}`}
        onClick={() => handleDateClick(date)}
        style={{ 
          width: "14.28%", 
          height: "100px",
          verticalAlign: "top",
          minHeight: "100px",
          display: "table-cell"
        }}
      >
        {/* Số ngày ở góc trên trái */}
        <div className="flex items-start justify-between mb-2">
          <span
            className={`text-base font-bold ${
              isToday
                ? "text-blue-700"
                : isCurrentMonth
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          >
            {date.date()}
          </span>
          {isToday && (
            <Tag color="blue" className="text-[8px] px-1 py-0 m-0">
              Hôm nay
            </Tag>
          )}
        </div>

        {/* Nội dung chính - căn giữa */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
          {status === "past" && !isToday && (
            <span className="text-[11px] text-gray-500 font-medium">Đã qua</span>
          )}
          {status !== "past" && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === "booked" ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    status === "booked" ? "text-rose-700" : "text-emerald-700"
                  }`}
                >
                  {status === "booked" ? `${bookings.length} lịch` : "Trống"}
                </span>
              </div>
              {bookings.length > 0 && (
                <div className="text-[9px] text-gray-600 truncate w-full text-center px-1">
                  {bookings[0]?.booking?.customer?.fullName || "Khách"}
                  {bookings.length > 1 && ` +${bookings.length - 1}`}
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    );
  };

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="w-full">
      {/* Header với nút điều hướng */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-200 rounded transition-colors border border-gray-300"
          aria-label="Tháng trước"
        >
          <LeftOutlined />
        </button>
        <h3 className="text-xl font-bold text-gray-800 uppercase">
          {currentMonth.format("MMMM YYYY")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-200 rounded transition-colors border border-gray-300"
          aria-label="Tháng sau"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Table - Lịch vuông góc giống lịch treo tường */}
      <div className="border-2 border-gray-500 bg-white shadow-lg overflow-x-auto">
        <table 
          className="w-full border-collapse" 
          style={{ 
            tableLayout: "fixed", 
            width: "100%",
            minWidth: "600px"
          }}
        >
          <colgroup>
            {weekDays.map((_, idx) => (
              <col key={idx} style={{ width: "14.28%" }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="py-3 px-1 text-center text-sm font-bold text-gray-800 bg-gray-200 border border-gray-400"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} style={{ height: "100px" }}>
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

