import React from "react";
import DataTable from "../../components/dashboard/DataTable";
import KPIStat from "../../components/dashboard/KPIStat";
import { FiCalendar, FiTool, FiUsers } from "react-icons/fi";

const StaffDashboardPage = () => {
  const todayColumns = [
    { title: "Mã đơn", dataIndex: "code" },
    { title: "Khách hàng", dataIndex: "customer" },
    { title: "Studio", dataIndex: "studio" },
    { title: "Khung giờ", dataIndex: "slot" },
    { title: "Ghi chú", dataIndex: "note" },
  ];
  const todayData = [
    { code: "#BK-1040", customer: "Minh K.", studio: "Studio A", slot: "09:00 - 11:00", note: "Set ánh sáng High-key" },
    { code: "#BK-1039", customer: "Lan P.", studio: "Studio C", slot: "13:00 - 16:00", note: "Chuẩn bị backdrop trắng" },
    { code: "#BK-1038", customer: "Team V.", studio: "Studio B", slot: "18:00 - 21:00", note: "Kiểm tra mic & mixer" },
  ];

  const equipmentColumns = [
    { title: "Thiết bị", dataIndex: "name" },
    { title: "Số lượng", dataIndex: "qty" },
    { title: "Tình trạng", dataIndex: "status", render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v === "Sẵn sàng" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>{v}</span>
    ) },
  ];
  const equipmentData = [
    { name: "Đèn Godox SL-60W", qty: 6, status: "Sẵn sàng" },
    { name: "Softbox 60x90", qty: 4, status: "Sẵn sàng" },
    { name: "Mic không dây", qty: 2, status: "Bảo trì" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden p-6 md:p-8 bg-[#FCFBFA] shadow-md border border-slate-200">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C5A267]/20 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 w-60 h-60 bg-[#A0826D]/20 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-3">
            Bảng điều khiển nhân viên
        </h1>
          <p className="text-base md:text-lg text-slate-600 font-medium">
          Lịch hôm nay, thiết bị và khách hàng đang phụ trách.
        </p>
        </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPIStat title="Đơn hôm nay" value="3" icon={<FiCalendar />} gradient="from-[#10b981] to-[#059669]" />
        <KPIStat title="Thiết bị cần chuẩn bị" value="5" icon={<FiTool />} gradient="from-[#C5A267] to-[#A0826D]" />
        <KPIStat title="Khách đang phục vụ" value="3" icon={<FiUsers />} gradient="from-[#A0826D] to-[#8B7355]" />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable title="Lịch hôm nay" columns={todayColumns} data={todayData} />
        <DataTable title="Tình trạng thiết bị" columns={equipmentColumns} data={equipmentData} />
      </div>
    </div>
  );
};

export default StaffDashboardPage;
