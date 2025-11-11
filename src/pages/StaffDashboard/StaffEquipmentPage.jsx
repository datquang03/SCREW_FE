import React from "react";
import { Card, Typography, Table, Tag, Progress, Button } from "antd";
import {
  ToolOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffEquipmentPage = () => {
  const equipmentColumns = [
    { title: "Thiết bị", dataIndex: "name" },
    { title: "Mã", dataIndex: "code" },
    { title: "Tình trạng", dataIndex: "condition" },
    {
      title: "Hạn bảo trì",
      dataIndex: "maintenance",
      render: (maintenance) => (
        <Tag color={maintenance.status === "Cần bảo trì" ? "orange" : "green"}>
          {maintenance.label}
        </Tag>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "usage",
      render: (usage) => <Progress percent={usage} size="small" />,
    },
    {
      title: "Thao tác",
      render: () => (
        <Button type="link" icon={<ReloadOutlined />}>
          Lên lịch
        </Button>
      ),
    },
  ];

  const equipmentData = [
    {
      key: "1",
      name: "Máy ảnh Sony A7S III",
      code: "CAM-01",
      condition: "Tốt",
      maintenance: { status: "Đúng hạn", label: "15/12/2025" },
      usage: 65,
    },
    {
      key: "2",
      name: "Đèn LED Godox UL150",
      code: "LIGHT-03",
      condition: "Tốt",
      maintenance: { status: "Đúng hạn", label: "30/11/2025" },
      usage: 80,
    },
    {
      key: "3",
      name: "Micro Rode Wireless GO II",
      code: "MIC-05",
      condition: "Cần kiểm tra",
      maintenance: { status: "Cần bảo trì", label: "05/11/2025" },
      usage: 45,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-2">
            Quản lý thiết bị
          </Title>
          <Text className="text-gray-600">
            Theo dõi tình trạng và lịch bảo trì thiết bị
          </Text>
        </div>
        <Button type="primary" icon={<ToolOutlined />}>
          Thêm thiết bị
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Title level={4}>Thiết bị hoạt động</Title>
          <Text className="text-3xl font-bold text-green-500">38</Text>
          <div className="text-sm text-gray-500 mt-1">/ 42 thiết bị</div>
        </Card>
        <Card>
          <Title level={4}>Cần bảo trì</Title>
          <div className="flex items-center gap-2 text-orange-500 text-xl font-semibold">
            <ExclamationCircleOutlined />
            <span>4 thiết bị</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Ưu tiên trong tuần</div>
        </Card>
        <Card>
          <Title level={4}>Lịch bảo trì</Title>
          <Text className="text-sm text-gray-500">
            Bảo trì định kỳ vào thứ 6 hàng tuần
          </Text>
          <Button type="link" className="mt-2 p-0">
            Xem lịch chi tiết
          </Button>
        </Card>
      </div>

      <Card>
        <Table
          columns={equipmentColumns}
          dataSource={equipmentData}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default StaffEquipmentPage;


