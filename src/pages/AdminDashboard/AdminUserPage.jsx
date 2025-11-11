import React from "react";
import { Card, Typography, Button, Tag } from "antd";
import { UserAddOutlined, CheckCircleOutlined } from "@ant-design/icons";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;

const AdminUserPage = () => {
  const columns = [
    { title: "Họ và tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Loại tài khoản", dataIndex: "role" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    { title: "Ngày tham gia", dataIndex: "joinedAt" },
    {
      title: "Thao tác",
      render: () => <Button type="link">Chi tiết</Button>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "Khách hàng",
      status: "Active",
      joinedAt: "01/02/2025",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranb@example.com",
      role: "Khách hàng",
      status: "Active",
      joinedAt: "11/03/2025",
    },
    {
      key: "3",
      name: "Lý Quốc C",
      email: "lyqc@example.com",
      role: "Khách hàng",
      status: "Inactive",
      joinedAt: "20/04/2025",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    <div>
          <Title level={2} className="mb-2">
            Quản lý khách hàng
          </Title>
          <Text className="text-gray-600">
            Xem, quản lý và chăm sóc khách thuê tại S+ Studio
          </Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />}>
          Thêm khách hàng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Title level={4}>Tổng khách hàng</Title>
          <div className="text-3xl font-bold">1.240</div>
          <Text type="secondary">+48 trong 30 ngày</Text>
        </Card>
        <Card>
          <Title level={4}>Khách hàng hoạt động</Title>
          <div className="flex items-center gap-2 text-green-500 text-xl font-semibold">
            <CheckCircleOutlined />
            <span>86%</span>
          </div>
          <Text type="secondary">Đặt lịch ít nhất 2 lần/năm</Text>
        </Card>
        <Card>
          <Title level={4}>Khách hàng VIP</Title>
          <div className="text-3xl font-bold">128</div>
          <Text type="secondary">Loyalty >= 100 điểm</Text>
        </Card>
      </div>

      <DataTable title="Danh sách khách hàng" columns={columns} data={data} />
    </div>
  );
};

export default AdminUserPage;

