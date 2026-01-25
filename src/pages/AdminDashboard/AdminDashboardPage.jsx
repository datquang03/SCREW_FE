// src/pages/AdminDashboard/AdminDashboardPage.jsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  FiUser,
  FiUsers,
  FiBell,
  FiHardDrive,
  FiHome,
  FiTrendingUp,
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiPercent,
  FiDownload,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

import { getAdminAnalytics } from "../../features/admin/admin.analyticSlice";

// Đăng ký Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.adminAnalytics);
  const dashboardRef = useRef(null);

  useEffect(() => {
    dispatch(getAdminAnalytics());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  const {
    users,
    studios,
    equipment,
    bookings,
    revenue,
    reports,
    rankings,
    operations,
    charts,
  } = data;

  // Chart data
  const revenueLineData = {
    labels: charts?.revenue?.map((item) => item.date.slice(5)) || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: charts?.revenue?.map((item) => item.value) || [],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.12)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const bookingsLineData = {
    labels: charts?.bookings?.map((item) => item.date.slice(5)) || [],
    datasets: [
      {
        label: "Số booking",
        data: charts?.bookings?.map((item) => item.count) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 13 } } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString("vi-VN") } },
      x: { grid: { display: false } },
    },
  };

  // Export PDF
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Export PDF error:", err);
      alert("Không thể xuất PDF. Vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header + Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Cập nhật lần cuối: {new Date(data.generatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium"
          >
            <FiDownload size={18} />
            Export PDF
          </button>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  {Number(revenue.total).toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiDollarSign className="text-indigo-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-green-600 font-medium">+{revenue.growth}%</span>{" "}
              <span className="text-gray-500">so với tháng trước</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng Booking</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {bookings.total.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <FiCalendar className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-emerald-600 font-medium">{bookings.thisMonth}</span>{" "}
              <span className="text-gray-500">tháng này</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Người Dùng</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {users.total} <span className="text-lg font-normal">({users.active} active)</span>
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUsers className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-blue-600 font-medium">{users.recent}</span>{" "}
              <span className="text-gray-500">người mới</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tỉ Lệ Hủy</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {Number(operations.cancellationRate).toFixed(1)}%
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FiAlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {bookings.byStatus.cancelled} / {bookings.total} đơn
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh Thu Theo Ngày</h3>
            <div className="h-80">
              <Line data={revenueLineData} options={lineOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Theo Ngày</h3>
            <div className="h-80">
              <Line data={bookingsLineData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Rankings & Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Top Studios */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Studio Doanh Thu</h3>
            <div className="space-y-4">
              {rankings.topStudios.map((studio, idx) => (
                <div
                  key={studio._id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    idx === 0 ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? "bg-indigo-600" : "bg-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{studio.name}</p>
                      <p className="text-sm text-gray-500">{studio.bookingsCount} booking</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-indigo-700">
                    {Number(studio.revenue).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reports by Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Báo Cáo Theo Loại</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(reports.byType).map(([type, count]) => (
                <div key={type} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{type.replace(/_/g, " ")}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tỉ lệ giải quyết</span>
                <span className="text-xl font-bold text-green-600">
                  {Number(reports.resolutionRate).toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${reports.resolutionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution & Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phân bố người dùng */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Phân Bố Người Dùng</h3>
            <div className="space-y-5">
              {[
                { label: "Khách hàng", value: users.byRole.customers.total, color: "bg-blue-500" },
                { label: "Nhân viên", value: users.byRole.staff.total, color: "bg-emerald-500" },
                { label: "Quản trị viên", value: users.byRole.admins.total, color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-800">
                      {item.value} ({((item.value / users.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(item.value / users.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <span className="font-medium text-indigo-600">{users.active}</span> /{" "}
              {users.total} người dùng đang hoạt động
            </div>
          </div>

          {/* Operations Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Hoạt Động Vận Hành</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-700">Tỉ lệ lấp đầy (Occupancy)</span>
                  <span className="font-bold text-emerald-600">
                    {Number(operations.occupancyRate).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{ width: `${operations.occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-700">Tỉ lệ sử dụng thiết bị</span>
                  <span className="font-bold text-blue-600">
                    {Number((equipment.byStatus.in_use / equipment.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(equipment.byStatus.in_use / equipment.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Tổng giờ đã đặt</p>
                  <p className="text-xl font-bold text-gray-900">{operations.totalBookedHours}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng dung lượng</p>
                  <p className="text-xl font-bold text-gray-900">{operations.totalCapacityHours}h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;