// src/pages/Booking/components/ScheduleTable.jsx (phiên bản đã tối ưu)
import React from "react";
import { Tag, Badge } from "antd";
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

    const hasBooking = bookings.length > 0;
    const status = isPast ? "past" : hasBooking ? "booked" : "available";

    return (
      <td
        key={key}
        onClick={() => handleDateClick(date)}
        className={`
          relative border border-gray-300 cursor-pointer transition-all duration-200
          hover:shadow-md hover:z-10
          ${!isCurrentMonth ? "opacity-40" : ""}
          ${isSelected ? "ring-2 ring-blue-500 ring-inset z-10" : ""}
          ${isToday ? "ring-2 ring-blue-400 ring-inset" : ""}
        `}
        style={{ height: "110px" }}
      >
        <div className="h-full flex flex-col p-2 text-xs">
          {/* Header: ngày + tag hôm nay */}
          <div className="flex items-start justify-between mb-1">
            <span
              className={`
                font-bold text-sm leading-none
                ${
                  isToday
                    ? "text-blue-700"
                    : isCurrentMonth
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              `}
            >
              {date.date()}
            </span>
            {isToday && (
              <Tag
                color="blue"
                className="text-[9px] px-1.5 py-0 leading-tight h-4"
              >
                Hôm nay
              </Tag>
            )}
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 flex flex-col justify-center items-center gap-1.5 text-center">
            {status === "past" && !isToday && (
              <span className="text-gray-500 text-xs font-medium">Đã qua</span>
            )}

            {status === "booked" && (
              <div className="space-y-1.5">
                {/* Badge hiển thị số lượng slot đã đặt */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] text-gray-500 font-medium">Số lịch</span>
                  <Badge
                    count={bookings.length}
                    style={{ backgroundColor: bookings.length > 0 ? "#f5222d" : "#d9d9d9" }}
                    className="custom-badge"
                  />
                </div>

                {/* Tên khách đầu tiên + số lượng còn lại */}
                {bookings.length > 0 && (
                  <div className="text-[10px] font-medium text-gray-700 leading-tight text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="truncate max-w-20">
                        {bookings[0]?.booking?.customer?.fullName
                          ?.split(" ")
                          .slice(-2)
                          .join(" ") || "Khách"}
                      </span>
                    </div>
                    {bookings.length > 1 && (
                      <span className="text-rose-600 font-bold text-xs">
                        +{bookings.length - 1} khác
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {status === "available" && !isPast && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-semibold">Trống</span>
              </div>
            )}
          </div>
        </div>

        {/* Background theo trạng thái */}
        <div
          className={`
            absolute inset-0 -z-10 transition-colors
            ${status === "booked" ? "bg-rose-50" : ""}
            ${status === "available" ? "bg-emerald-50" : ""}
            ${status === "past" ? "bg-gray-100" : ""}
            ${isToday && status !== "booked" ? "bg-blue-50" : ""}
          `}
        />
      </td>
    );
  };

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header tháng */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors border"
        >
          <LeftOutlined />
        </button>
        <h3 className="text-2xl font-bold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors border"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="py-4 text-sm font-bold text-gray-700 bg-gray-100 border-b border-gray-300"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i}>{week.map((date) => renderDateCell(date))}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
