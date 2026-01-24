import React from "react";
import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiVideo,
} from "react-icons/fi";
import KPIStat from "../../components/dashboard/KPIStat";
import DataTable from "../../components/dashboard/DataTable";
import MiniLineChart from "../../components/dashboard/MiniLineChart";
import MiniBarChart from "../../components/dashboard/MiniBarChart";
import DonutChart from "../../components/dashboard/DonutChart";

const UserDashboardPage = () => {
  const bookingsColumns = [
    { title: "Mã đơn", dataIndex: "code" },
    { title: "Studio", dataIndex: "studio" },
    { title: "Ngày", dataIndex: "date" },
    { title: "Khung giờ", dataIndex: "slot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            v === "Đã xác nhận"
              ? "bg-green-100 text-green-700"
              : v === "Đang xử lý"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {v}
        </span>
      ),
    },
    { title: "Tổng phí", dataIndex: "total" },
  ];

  const bookingsData = [
    {
      code: "#BK-1032",
      studio: "Studio A",
      date: "12/11/2025",
      slot: "09:00 - 11:00",
      status: "Đã xác nhận",
      total: "1.200.000đ",
    },
    {
      code: "#BK-1031",
      studio: "Studio C",
      date: "09/11/2025",
      slot: "14:00 - 17:00",
      status: "Đang xử lý",
      total: "1.800.000đ",
    },
    {
      code: "#BK-1029",
      studio: "Studio B",
      date: "02/11/2025",
      slot: "18:00 - 21:00",
      status: "Hoàn tất",
      total: "2.200.000đ",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển của bạn</h1>
        <p className="opacity-90">
          Theo dõi lịch thuê, trạng thái đơn và gợi ý studio tại S+ Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPIStat
          title="Đơn đã đặt"
          value="12"
          diffText="+2 so với tháng trước"
          icon={<FiHome />}
          gradient="from-[#C5A267] to-[#A0826D]"
        />
        <KPIStat
          title="Sắp tới"
          value="3"
          diffText="Trong 7 ngày tới"
          icon={<FiCalendar />}
          gradient="from-[#A0826D] to-[#8B7355]"
        />
        <KPIStat
          title="Tổng chi"
          value="12.700.000đ"
          diffText="Năm 2025"
          icon={<FiDollarSign />}
          gradient="from-[#10b981] to-[#059669]"
        />
        <KPIStat
          title="Giờ đã thuê"
          value="86h"
          diffText="Tổng tích lũy"
          icon={<FiVideo />}
          gradient="from-[#0F172A] to-[#334155]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Tần suất đặt Studio</h3>
            <span className="text-xs font-medium text-slate-600 bg-[#FCFBFA] px-3 py-1 border border-slate-200">6 tháng gần đây</span>
          </div>
          <MiniLineChart data={[3, 6, 5, 9, 7, 10]} color="#C5A267" />
        </div>
        <div className="bg-white shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Chi tiêu theo hạng mục</h3>
            <span className="text-xs font-medium text-slate-600 bg-[#FCFBFA] px-3 py-1 border border-slate-200">Tháng này</span>
          </div>
          <MiniBarChart data={[6, 9, 4, 8, 7, 5]} color="#10b981" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            title="Đơn gần đây"
            columns={bookingsColumns}
            data={bookingsData}
          />
        </div>
        <div className="bg-white shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-bold text-[#0F172A] mb-5">Tỷ lệ hoàn thành</h3>
          <DonutChart value={82} color="#C5A267" label="Đơn/Hoàn tất" />
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-100 last:border-0">
              <span className="font-medium">Đã xác nhận</span>
              <span className="font-bold text-[#0F172A] bg-green-50 text-green-700 px-3 py-1">6</span>
            </li>
            <li className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-100 last:border-0">
              <span className="font-medium">Đang xử lý</span>
              <span className="font-bold text-[#0F172A] bg-yellow-50 text-yellow-700 px-3 py-1">1</span>
            </li>
            <li className="flex justify-between items-center text-slate-700 py-2 border-b border-slate-100 last:border-0">
              <span className="font-medium">Hoàn tất</span>
              <span className="font-bold text-[#0F172A] bg-blue-50 text-blue-700 px-3 py-1">5</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
