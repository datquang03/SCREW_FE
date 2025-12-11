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
          ${isSelected ? "ring-4 ring-blue-500 ring-inset z-10 shadow-lg" : ""}
          ${isToday && !isSelected ? "ring-2 ring-blue-400 ring-inset" : ""}
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
                  isSelected
                    ? "text-blue-700 font-extrabold"
                    : isToday
                    ? "text-blue-700"
                    : isCurrentMonth
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              `}
            >
              {date.date()}
            </span>
            {isSelected && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            )}
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
              <div className="space-y-1.5 w-full">
                {/* Badge hiển thị số lượng slot đã đặt */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] text-gray-500 font-medium">Số lịch</span>
                  <Badge
                    count={bookings.length}
                    style={{ backgroundColor: bookings.length > 0 ? "#f5222d" : "#d9d9d9" }}
                    className="custom-badge"
                  />
                </div>

                {/* Thông tin booking */}
                {bookings.length > 0 && (
                  <div className="text-[10px] font-medium text-gray-700 leading-tight text-center space-y-0.5">
                    {/* Tên khách hàng */}
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                      <span className="truncate max-w-[90px] font-semibold">
                        {bookings[0]?.booking?.customer?.fullName
                          ?.split(" ")
                          .slice(-2)
                          .join(" ") || "Khách"}
                      </span>
                    </div>
                    
                    {/* Time range của booking đầu tiên */}
                    {bookings[0]?.timeRange && (
                      <div className="text-[9px] text-rose-600 font-bold">
                        {bookings[0].timeRange}
                      </div>
                    )}
                    
                    {/* Status của booking đầu tiên */}
                    {bookings[0]?.booking?.status && (
                      <Tag 
                        color={
                          bookings[0].booking.status === "completed" ? "green" :
                          bookings[0].booking.status === "confirmed" ? "blue" :
                          bookings[0].booking.status === "pending" ? "orange" : "default"
                        }
                        className="text-[8px] px-1 py-0 h-4 leading-tight"
                      >
                        {bookings[0].booking.status === "completed" ? "Hoàn thành" :
                         bookings[0].booking.status === "confirmed" ? "Đã xác nhận" :
                         bookings[0].booking.status === "pending" ? "Chờ xác nhận" :
                         bookings[0].booking.status}
                      </Tag>
                    )}
                    
                    {/* Số lượng booking còn lại */}
                    {bookings.length > 1 && (
                      <span className="text-rose-600 font-bold text-xs block">
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
            ${isSelected ? "bg-blue-100/80 backdrop-blur-sm" : ""}
            ${status === "booked" && !isSelected ? "bg-rose-50" : ""}
            ${status === "available" && !isSelected ? "bg-emerald-50" : ""}
            ${status === "past" && !isSelected ? "bg-gray-100" : ""}
            ${isToday && status !== "booked" && !isSelected ? "bg-blue-50" : ""}
          `}
        />
        
        {/* Overlay khi được chọn */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 pointer-events-none" />
        )}
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
