import React from "react";
import {
  HomeOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
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
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-amber-100 via-yellow-50 to-white">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-amber-300/30 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 w-60 h-60 rounded-full bg-yellow-400/30 blur-3xl" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          Bảng điều khiển của bạn
        </h1>
        <p className="mt-2 text-gray-700 font-medium">
          Theo dõi lịch thuê, trạng thái đơn và gợi ý studio tại S+ Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPIStat
          title="Đơn đã đặt"
          value="12"
          diffText="+2 so với tháng trước"
          icon={<HomeOutlined />}
          gradient="from-yellow-400 to-amber-500"
        />
        <KPIStat
          title="Sắp tới"
          value="3"
          diffText="Trong 7 ngày tới"
          icon={<CalendarOutlined />}
          gradient="from-rose-400 to-pink-500"
        />
        <KPIStat
          title="Tổng chi"
          value="12.700.000đ"
          diffText="Năm 2025"
          icon={<DollarCircleOutlined />}
          gradient="from-emerald-400 to-teal-500"
        />
        <KPIStat
          title="Giờ đã thuê"
          value="86h"
          diffText="Tổng tích lũy"
          icon={<VideoCameraOutlined />}
          gradient="from-indigo-400 to-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Tần suất đặt Studio</h3>
            <span className="text-xs text-gray-500">6 tháng gần đây</span>
          </div>
          <MiniLineChart data={[3, 6, 5, 9, 7, 10]} color="#f59e0b" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Chi tiêu theo hạng mục</h3>
            <span className="text-xs text-gray-500">Tháng này</span>
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
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Tỷ lệ hoàn thành</h3>
          <DonutChart value={82} color="#6366f1" label="Đơn/Hoàn tất" />
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex justify-between text-gray-700">
              <span>Đã xác nhận</span>
              <span className="font-semibold">6</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Đang xử lý</span>
              <span className="font-semibold">1</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Hoàn tất</span>
              <span className="font-semibold">5</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
