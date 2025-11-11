import React from "react";
import { Card, Typography, Tag, Button } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;

const StaffOrderPage = () => {
  const columns = [
    { title: "Mã đơn", dataIndex: "code" },
    { title: "Khách hàng", dataIndex: "customer" },
    { title: "Studio", dataIndex: "studio" },
    { title: "Ngày", dataIndex: "date" },
    { title: "Khung giờ", dataIndex: "slot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "Đang setup"
              ? "orange"
              : status === "Đã hoàn tất"
              ? "green"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
    },
    {
      title: "Thao tác",
      render: () => (
        <Button size="small" type="link">
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      code: "#ORD-2045",
      customer: "Trần Anh",
      studio: "Studio A",
      date: "12/11/2025",
      slot: "09:00 - 11:00",
      status: "Đang setup",
      phone: "0901 234 567",
    },
    {
      key: "2",
      code: "#ORD-2044",
      customer: "Công ty ABC",
      studio: "Studio C",
      date: "12/11/2025",
      slot: "14:00 - 17:00",
      status: "Đã hoàn tất",
      phone: "0908 765 432",
    },
    {
      key: "3",
      code: "#ORD-2039",
      customer: "Nguyễn Bình",
      studio: "Studio B",
      date: "11/11/2025",
      slot: "10:00 - 12:00",
      status: "Đang chuẩn bị",
      phone: "0912 334 455",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-2">
            Quản lý đơn đặt
          </Title>
          <Text className="text-gray-600">
            Theo dõi tiến độ setup và hỗ trợ khách hàng tại studio
          </Text>
        </div>
        <Button type="primary">Tạo đơn nội bộ</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-3xl text-orange-500" />
            <div>
              <Text className="text-sm text-gray-500">Đang setup</Text>
              <div className="text-2xl font-bold">2 đơn</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <CheckCircleOutlined className="text-3xl text-green-500" />
            <div>
              <Text className="text-sm text-gray-500">Hoàn tất hôm nay</Text>
              <div className="text-2xl font-bold">5 đơn</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <ExclamationCircleOutlined className="text-3xl text-red-500" />
    <div>
              <Text className="text-sm text-gray-500">Cần lưu ý</Text>
              <div className="text-2xl font-bold">1 đơn</div>
            </div>
          </div>
        </Card>
      </div>

      <DataTable title="Danh sách đơn" columns={columns} data={data} />
    </div>
  );
};

export default StaffOrderPage;
