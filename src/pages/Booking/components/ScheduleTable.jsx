// src/pages/Booking/components/ScheduleTable.jsx (phiên bản đã tối ưu)
import React from "react";
import { Tag, Badge, Empty } from "antd";
import dayjs from "dayjs";
import { LeftOutlined, RightOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

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
          relative border border-gray-200 cursor-pointer transition-all duration-300
          ${isPast ? "cursor-not-allowed" : "hover:shadow-lg hover:border-blue-400"}
          ${!isCurrentMonth ? "opacity-30 bg-gray-50" : "bg-white"}
          ${isSelected ? "ring-4 ring-blue-500 ring-inset z-10 shadow-xl" : ""}
          ${isToday && !isSelected ? "ring-2 ring-blue-300 ring-inset" : ""}
        `}
        style={{ 
          height: "130px",
          cursor: isPast ? "not-allowed" : "pointer"
        }}
      >
        <div className="h-full flex flex-col p-2.5 text-xs relative">
          {/* Header: ngày + tag hôm nay */}
          <div className="flex items-start justify-between mb-2">
            <span
              className={`
                font-bold text-base leading-none transition-colors
                ${
                  isSelected
                    ? "text-white bg-blue-500 rounded-lg px-2 py-1"
                    : isToday
                    ? "text-blue-700"
                    : isCurrentMonth
                    ? "text-gray-800"
                    : "text-gray-400"
                }
              `}
            >
              {date.date()}
            </span>
            {isSelected && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            {isToday && !isSelected && (
              <Tag
                color="cyan"
                className="text-[9px] px-1.5 py-0 leading-tight h-5 font-semibold"
              >
                Hôm nay
              </Tag>
            )}
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 flex flex-col justify-between items-center gap-1">
            {status === "past" && !isToday && (
              <div className="flex flex-col items-center gap-1">
                <ClockCircleOutlined className="text-gray-400 text-lg" />
                <span className="text-gray-500 text-[10px] font-semibold">Đã qua</span>
              </div>
            )}

            {status === "booked" && (
              <div className="space-y-1.5 w-full text-center">
                {/* Badge hiển thị số lượng slot đã đặt */}
                <div className="flex flex-col items-center gap-1">
                  <Badge
                    count={bookings.length}
                    style={{ 
                      backgroundColor: "#ef4444",
                      boxShadow: "0 0 0 2px white",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                    className="custom-badge"
                  />
                  <span className="text-[10px] text-gray-600 font-medium">Slot đặt</span>
                </div>

                {/* Thông tin booking */}
                {bookings[0] && (
                  <div className="text-[10px] font-medium text-gray-700 space-y-0.5">
                    {/* Tên khách hàng */}
                    {bookings[0]?.booking?.customer?.fullName && (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="truncate max-w-[85px] font-bold text-rose-600">
                          {bookings[0].booking.customer.fullName
                            .split(" ")
                            .slice(-2)
                            .join(" ")}
                        </span>
                      </div>
                    )}
                    
                    {/* Time range */}
                    {bookings[0]?.timeRange && (
                      <div className="text-[9px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                        {bookings[0].timeRange}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {status === "available" && !isPast && (
              <div className="flex flex-col items-center gap-1.5">
                <CheckCircleOutlined className="text-emerald-500 text-lg" />
                <span className="text-emerald-700 font-bold text-[11px]">Có sẵn</span>
              </div>
            )}
          </div>
        </div>

        {/* Background theo trạng thái */}
        <div
          className={`
            absolute inset-0 -z-10 transition-colors duration-200
            ${isSelected ? "bg-gradient-to-br from-blue-100 to-blue-50" : ""}
            ${status === "booked" && !isSelected ? "bg-rose-50/70" : ""}
            ${status === "available" && !isSelected ? "bg-emerald-50/50" : ""}
            ${status === "past" && !isSelected ? "bg-gray-100/60" : ""}
            ${isToday && status !== "booked" && !isSelected ? "bg-blue-50/50" : ""}
          `}
        />
      </td>
    );
  };

  const weekDays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return (
    <div className="w-full">
      {/* Header tháng */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors border border-gray-200"
        >
          <LeftOutlined className="text-lg" />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 min-w-fit">
          {currentMonth.format("MMMM YYYY")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors border border-gray-200"
        >
          <RightOutlined className="text-lg" />
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="py-4 text-sm font-bold text-gray-700 bg-gradient-to-b from-gray-100 to-gray-50 border-b-2 border-gray-200"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i} className="divide-x divide-gray-200">
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
