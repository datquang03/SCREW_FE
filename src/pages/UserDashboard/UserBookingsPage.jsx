import React from "react";
import { Card, Typography, Tag, Button } from "antd";
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;

const UserBookingsPage = () => {
  const bookingsColumns = [
    { title: "Mã đơn", dataIndex: "code" },
    { title: "Studio", dataIndex: "studio" },
    { title: "Ngày", dataIndex: "date" },
    { title: "Khung giờ", dataIndex: "slot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => (
        <Tag
          color={
            v === "Đã xác nhận"
              ? "green"
              : v === "Đang xử lý"
              ? "orange"
              : v === "Hoàn tất"
              ? "blue"
              : "default"
          }
        >
          {v}
        </Tag>
      ),
    },
    { title: "Tổng phí", dataIndex: "total" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button type="link" size="small">
          Chi tiết
        </Button>
      ),
    },
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
    {
      code: "#BK-1025",
      studio: "Studio A",
      date: "28/10/2025",
      slot: "10:00 - 12:00",
      status: "Hoàn tất",
      total: "1.000.000đ",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
            Đơn của tôi
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Quản lý và theo dõi tất cả các đơn đặt studio của bạn
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CalendarOutlined className="text-4xl text-blue-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">12</div>
          <div className="text-sm font-medium text-gray-600">Tổng đơn</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <ClockCircleOutlined className="text-4xl text-orange-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">3</div>
          <div className="text-sm font-medium text-gray-600">Đang xử lý</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CheckCircleOutlined className="text-4xl text-green-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">9</div>
          <div className="text-sm font-medium text-gray-600">Hoàn tất</div>
        </Card>
      </div>

      <DataTable
        title="Danh sách đơn đặt"
        columns={bookingsColumns}
        data={bookingsData}
      />
    </div>
  );
};

export default UserBookingsPage;

