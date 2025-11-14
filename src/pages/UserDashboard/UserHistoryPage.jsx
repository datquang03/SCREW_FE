import React from "react";
import { Card, Typography, Tag } from "antd";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;

const UserHistoryPage = () => {
  const historyColumns = [
    { title: "Mã đơn", dataIndex: "code" },
    { title: "Studio", dataIndex: "studio" },
    { title: "Ngày", dataIndex: "date" },
    { title: "Khung giờ", dataIndex: "slot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => (
        <Tag color={v === "Hoàn tất" ? "green" : "default"}>{v}</Tag>
      ),
    },
    { title: "Tổng phí", dataIndex: "total" },
  ];

  const historyData = [
    {
      code: "#BK-1029",
      studio: "Studio B",
      date: "02/11/2025",
      slot: "18:00 - 21:00",
      status: "Hoàn tất",
      total: "2.200.000đ",
    },
    {
      code: "#BK-1025",
      studio: "Studio A",
      date: "28/10/2025",
      slot: "10:00 - 12:00",
      status: "Hoàn tất",
      total: "1.000.000đ",
    },
    {
      code: "#BK-1020",
      studio: "Studio C",
      date: "20/10/2025",
      slot: "14:00 - 16:00",
      status: "Hoàn tất",
      total: "1.400.000đ",
    },
    {
      code: "#BK-1015",
      studio: "Studio A",
      date: "15/10/2025",
      slot: "09:00 - 11:00",
      status: "Hoàn tất",
      total: "1.200.000đ",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-purple-100 via-violet-50 to-white shadow-lg border border-purple-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
            Lịch sử thuê
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Xem lại tất cả các lần bạn đã thuê studio tại S+ Studio
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border border-gray-100">
          <DataTable
            title="Lịch sử đặt studio"
            columns={historyColumns}
            data={historyData}
          />
        </Card>
        <Card className="shadow-lg border border-gray-100">
          <Title level={4} className="mb-6 text-gray-900">
            Thống kê
          </Title>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Text className="text-sm font-medium text-gray-600 block mb-2">Tổng số lần thuê</Text>
              <div className="text-3xl font-extrabold text-gray-900">24</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <Text className="text-sm font-medium text-gray-600 block mb-2">Tổng giờ đã thuê</Text>
              <div className="text-3xl font-extrabold text-gray-900">86h</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <Text className="text-sm font-medium text-gray-600 block mb-2">Tổng chi phí</Text>
              <div className="text-3xl font-extrabold text-green-600">
                12.700.000đ
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserHistoryPage;

