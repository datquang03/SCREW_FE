import React from "react";
import { Card, Typography, Tag, Timeline } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
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
      <div>
        <Title level={2} className="mb-2">
          Lịch sử thuê
        </Title>
        <Text className="text-gray-600">
          Xem lại tất cả các lần bạn đã thuê studio tại S+ Studio
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <DataTable
            title="Lịch sử đặt studio"
            columns={historyColumns}
            data={historyData}
          />
        </Card>
        <Card>
          <Title level={4} className="mb-4">
            Thống kê
          </Title>
          <div className="space-y-4">
            <div>
              <Text className="text-gray-600">Tổng số lần thuê</Text>
              <div className="text-2xl font-bold mt-1">24</div>
            </div>
            <div>
              <Text className="text-gray-600">Tổng giờ đã thuê</Text>
              <div className="text-2xl font-bold mt-1">86h</div>
            </div>
            <div>
              <Text className="text-gray-600">Tổng chi phí</Text>
              <div className="text-2xl font-bold mt-1 text-green-600">
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

