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
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-blue-100 via-cyan-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <Title level={2} className="mb-3 text-gray-900">
            Quản lý đơn đặt
          </Title>
            <Text className="text-base text-gray-700 font-medium">
            Theo dõi tiến độ setup và hỗ trợ khách hàng tại studio
          </Text>
          </div>
          <Button type="primary" size="large" className="font-semibold shadow-lg">
            Tạo đơn nội bộ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
            <ClockCircleOutlined className="text-3xl text-orange-500" />
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">Đang setup</Text>
              <div className="text-3xl font-extrabold text-gray-900">2 đơn</div>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircleOutlined className="text-3xl text-green-500" />
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">Hoàn tất hôm nay</Text>
              <div className="text-3xl font-extrabold text-gray-900">5 đơn</div>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
            <ExclamationCircleOutlined className="text-3xl text-red-500" />
            </div>
    <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">Cần lưu ý</Text>
              <div className="text-3xl font-extrabold text-gray-900">1 đơn</div>
            </div>
          </div>
        </Card>
      </div>

      <DataTable title="Danh sách đơn" columns={columns} data={data} />
    </div>
  );
};

export default StaffOrderPage;
