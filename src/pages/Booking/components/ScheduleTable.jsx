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
          relative border-b border-gray-100 cursor-pointer transition-all duration-200 align-top group
          ${isPast ? "cursor-not-allowed bg-gray-50/50" : "hover:bg-blue-50/30"}
          ${!isCurrentMonth ? "opacity-30 pointer-events-none" : ""}
          ${isSelected ? "ring-2 ring-blue-500 ring-inset z-10 bg-blue-50/20" : ""}
        `}
        style={{ 
          cursor: isPast ? "not-allowed" : "pointer"
        }}
      >
        <div className="w-full aspect-square flex flex-col p-1">
          {/* Header: Date Number */}
          <div className="flex justify-between items-start">
            <div className={`
              w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-colors
              ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md scale-110"
                  : isToday
                  ? "bg-blue-100 text-blue-700 font-bold"
                  : "text-gray-600"
              }
            `}>
              {date.date()}
            </div>
            
            {isToday && !isSelected && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-1" title="Hôm nay" />
            )}
          </div>

          {/* Body: Status Content */}
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            {status === "past" && !isToday && (
              <div className="flex flex-col items-center opacity-40">
                <ClockCircleOutlined className="text-gray-400 text-base" />
              </div>
            )}

            {status === "booked" && (
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="bg-red-50 text-red-600 rounded px-1.5 py-0.5 text-[10px] font-bold border border-red-100 flex items-center gap-1">
                  <div className="w-1 h-1 bg-current rounded-full" />
                  {bookings.length} lịch
                </div>
                {/* Chỉ hiện tên khách trên màn hình đủ lớn, hoặc rút gọn */}
                 {bookings[0]?.booking?.customer?.fullName && (
                    <div className="hidden md:block w-full text-[9px] text-gray-500 text-center truncate px-1">
                       {bookings[0].booking.customer.fullName.split(' ').pop()}
                    </div>
                 )}
              </div>
            )}

            {status === "available" && !isPast && (
              <div className="flex flex-col items-center gap-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                <CheckCircleOutlined className="text-emerald-500 text-lg sm:text-xl" />
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 rounded-md hidden sm:block">
                  Trống
                </span>
              </div>
            )}
            
            {status === "available" && isToday && (
              <div className="text-[9px] text-blue-500 font-medium mt-1 animate-pulse">
                Đặt ngay
              </div>
            )}
          </div>
        </div>
      </td>
    );
  };

  const weekDays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return (
    <div className="w-full select-none">
      {/* Header Month Navigation */}
      <div className="flex items-center justify-between mb-6 px-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-full transition-all active:scale-95"
        >
          <LeftOutlined />
        </button>
        
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-extrabold text-gray-800 m-0 uppercase">
            Tháng {currentMonth.format("MM / YYYY")}
          </h3>
          <span className="text-xs text-gray-500 font-medium mt-0.5">Lịch đặt studio</span>
        </div>

        <button
          onClick={handleNextMonth}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-full transition-all active:scale-95"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th
                  key={day}
                  className={`
                    py-4 text-xs font-bold uppercase tracking-wider border-b-2 border-gray-100
                    ${index === 0 || index === 6 ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 bg-gray-50/30'}
                  `}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {weeks.map((week, i) => (
              <tr key={i} className="divide-x divide-gray-100">
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
