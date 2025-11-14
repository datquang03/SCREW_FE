import React from "react";
import { Card, Typography, Table, Tag, Button, Avatar } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminStaffPage = () => {
  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} />
          <div>
            <div className="font-semibold">{name}</div>
            <Text type="secondary" className="text-xs">
              {record.position}
            </Text>
          </div>
        </div>
      ),
    },
    { title: "Ca trực", dataIndex: "shift" },
    { title: "Liên hệ", dataIndex: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Đang làm" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    { title: "Studio phụ trách", dataIndex: "studio" },
    {
      title: "Thao tác",
      render: () => <Button type="link">Chi tiết</Button>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "Lê Minh Quân",
      position: "Quản lý Studio A",
      shift: "Sáng, Chiều",
      phone: "0902 556 678",
      status: "Đang làm",
      studio: "Studio A",
      avatar:
        "https://ui-avatars.com/api/?background=2563eb&color=fff&name=Le+Minh+Quan",
    },
    {
      key: "2",
      name: "Trần Gia Hân",
      position: "Lighting Specialist",
      shift: "Chiều, Tối",
      phone: "0909 889 123",
      status: "Đang làm",
      studio: "Studio C",
      avatar:
        "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Tran+Gia+Han",
    },
    {
      key: "3",
      name: "Nguyễn Minh Dũng",
      position: "Kỹ thuật viên",
      shift: "Tối",
      phone: "0907 334 221",
      status: "Nghỉ phép",
      studio: "Studio B",
      avatar:
        "https://ui-avatars.com/api/?background=f59e0b&color=fff&name=Nguyen+Minh+Dung",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-pink-100 via-rose-50 to-white shadow-lg border border-pink-200/50">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title level={2} className="mb-2 text-gray-900">
              Quản lý nhân sự
            </Title>
            <Text className="text-base text-gray-700 font-medium">
              Phân ca, theo dõi nhiệm vụ và hiệu suất nhân viên
            </Text>
          </div>
          <Button type="primary" icon={<UserAddOutlined />} size="large" className="font-semibold shadow-lg">
            Thêm nhân viên
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Tổng nhân sự</Title>
          <div className="text-3xl font-bold">26</div>
          <Text type="secondary">+3 trong tháng này</Text>
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Đang trực</Title>
          <div className="text-3xl font-bold text-green-500">12</div>
          <Text type="secondary">Ca sáng & chiều</Text>
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Đào tạo</Title>
          <Text>2 khóa đào tạo sắp diễn ra (Lighting & Camera)</Text>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-100 rounded-2xl">
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </Card>
    </div>
  );
};

export default AdminStaffPage;


