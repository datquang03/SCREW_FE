import React from "react";
import { Card, Typography, Table, Tag, Progress, Button } from "antd";
import { FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminStudiosPage = () => {
  const navigate = useNavigate();

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
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · ADMIN</div>
        <h1 className="text-3xl font-bold mb-2">Hiệu suất studio</h1>
        <p className="opacity-90">
          Theo dõi tình trạng, hiệu suất và doanh thu từng không gian
        </p>
        
        <div className="absolute top-8 right-8">
          <button
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 backdrop-blur transition"
            onClick={() => navigate("/dashboard/staff/studios")}
          >
            <FiVideo /> Thêm studio mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Title level={4} className="text-gray-700 mb-3">Tổng số studio</Title>
          <div className="text-4xl font-extrabold text-gray-900 mb-2">4</div>
          <Text className="text-sm text-gray-600 font-medium">3 hoạt động, 1 bảo trì</Text>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Title level={4} className="text-gray-700 mb-3">Tỷ lệ lấp đầy</Title>
          <Progress percent={74} strokeColor="#f59e0b" className="mb-2" />
          <Text className="text-sm text-gray-600 font-medium">+6% so với tháng trước</Text>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Title level={4} className="text-gray-700 mb-3">Đánh giá</Title>
          <div className="text-4xl font-extrabold text-purple-600 mb-2">4.85/5</div>
          <Text className="text-sm text-gray-600 font-medium">Dựa trên 320 review</Text>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 8 }} 
          className="rounded-lg"
        />
      </Card>
    </div>
  );
};

export default AdminStudiosPage;


