import React from "react";
import { Card, Typography, Table, Tag, Button } from "antd";
import { VideoCameraOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffStudiosPage = () => {
  const studiosColumns = [
    { title: "Tên Studio", dataIndex: "name" },
    { title: "Vị trí", dataIndex: "location" },
    { title: "Diện tích", dataIndex: "area" },
    { title: "Sức chứa", dataIndex: "capacity" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Hoạt động" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      render: () => (
        <div className="flex gap-2">
          <Button type="link" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const studiosData = [
    {
      key: "1",
      name: "Studio A",
      location: "Quận 4, TP.HCM",
      area: "50m²",
      capacity: "10-15 người",
      status: "Hoạt động",
    },
    {
      key: "2",
      name: "Studio B",
      location: "Quận 4, TP.HCM",
      area: "60m²",
      capacity: "15-20 người",
      status: "Hoạt động",
    },
    {
      key: "3",
      name: "Studio C",
      location: "Quận 4, TP.HCM",
      area: "45m²",
      capacity: "8-12 người",
      status: "Bảo trì",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-2">
            Quản lý Studio
          </Title>
          <Text className="text-gray-600">
            Quản lý thông tin và trạng thái các studio
          </Text>
        </div>
        <Button type="primary" icon={<VideoCameraOutlined />}>
          Thêm Studio
        </Button>
      </div>

      <Card>
        <Table
          columns={studiosColumns}
          dataSource={studiosData}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default StaffStudiosPage;

