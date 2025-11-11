import React from "react";
import { Card, Typography, Table, Tag, Progress, Button } from "antd";
import { VideoCameraAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminStudiosPage = () => {
  const columns = [
    { title: "Studio", dataIndex: "name" },
    { title: "Loại hình", dataIndex: "type" },
    { title: "Sức chứa", dataIndex: "capacity" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Sẵn sàng" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Tỷ lệ lấp đầy",
      dataIndex: "occupancy",
      render: (value) => <Progress percent={value} size="small" />,
    },
    {
      title: "Doanh thu tháng",
      dataIndex: "revenue",
    },
    {
      title: "Thao tác",
      render: () => <Button type="link">Báo cáo</Button>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "Studio A - Livestream",
      type: "Livestream/Podcast",
      capacity: "10 người",
      status: "Sẵn sàng",
      occupancy: 82,
      revenue: "45.2 triệu",
    },
    {
      key: "2",
      name: "Studio B - Photo",
      type: "Chụp sản phẩm",
      capacity: "15 người",
      status: "Sẵn sàng",
      occupancy: 68,
      revenue: "37.5 triệu",
    },
    {
      key: "3",
      name: "Studio C - Creative",
      type: "Quay TVC / Viral",
      capacity: "20 người",
      status: "Đang bảo trì",
      occupancy: 55,
      revenue: "29.1 triệu",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-2">
            Hiệu suất studio
          </Title>
          <Text className="text-gray-600">
            Theo dõi tình trạng, hiệu suất và doanh thu từng không gian
          </Text>
        </div>
        <Button type="primary" icon={<VideoCameraAddOutlined />}>
          Thêm studio mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Title level={4}>Tổng số studio</Title>
          <div className="text-3xl font-bold">4</div>
          <Text type="secondary">3 hoạt động, 1 bảo trì</Text>
        </Card>
        <Card>
          <Title level={4}>Tỷ lệ lấp đầy</Title>
          <Progress percent={74} strokeColor="#f59e0b" />
          <Text type="secondary">+6% so với tháng trước</Text>
        </Card>
        <Card>
          <Title level={4}>Đánh giá</Title>
          <div className="text-3xl font-bold text-purple-500">4.85/5</div>
          <Text type="secondary">Dựa trên 320 review</Text>
        </Card>
      </div>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
    </div>
  );
};

export default AdminStudiosPage;


