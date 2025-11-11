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
      <div>
        <Title level={2} className="mb-2">
          Đơn của tôi
        </Title>
        <Text className="text-gray-600">
          Quản lý và theo dõi tất cả các đơn đặt studio của bạn
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <CalendarOutlined className="text-3xl text-blue-500 mb-2" />
          <div className="text-2xl font-bold">12</div>
          <div className="text-gray-600">Tổng đơn</div>
        </Card>
        <Card className="text-center">
          <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
          <div className="text-2xl font-bold">3</div>
          <div className="text-gray-600">Đang xử lý</div>
        </Card>
        <Card className="text-center">
          <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
          <div className="text-2xl font-bold">9</div>
          <div className="text-gray-600">Hoàn tất</div>
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

