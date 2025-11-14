import React from "react";
import { Card, Typography, Row, Col, Statistic, Table, Tag } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import MiniLineChart from "../../components/dashboard/MiniLineChart";
import MiniBarChart from "../../components/dashboard/MiniBarChart";
import DonutChart from "../../components/dashboard/DonutChart";

const { Title, Text } = Typography;

const AdminRevenuePage = () => {
  const monthlyRevenue = [120, 150, 180, 210, 240, 260, 280, 320, 310, 340, 360, 390];
  const bookingSources = [
    { label: "Website", value: 65, color: "#6366f1" },
    { label: "Facebook", value: 22, color: "#10b981" },
    { label: "Hotline", value: 13, color: "#f59e0b" },
  ];

  const topCustomersColumns = [
    { title: "Khách hàng", dataIndex: "name" },
    { title: "Liên hệ", dataIndex: "contact" },
    { title: "Số lần thuê", dataIndex: "bookings" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Phân khúc",
      dataIndex: "segment",
      render: (segment) => <Tag color="purple">{segment}</Tag>,
    },
  ];

  const topCustomersData = [
    {
      key: "1",
      name: "Công ty Media A",
      contact: "mediaa@example.com",
      bookings: 18,
      revenue: "235 triệu",
      segment: "Agency",
    },
    {
      key: "2",
      name: "Studio Wedding B",
      contact: "weddingb@example.com",
      bookings: 12,
      revenue: "168 triệu",
      segment: "Studio",
    },
    {
      key: "3",
      name: "Nguyễn Anh H",
      contact: "anhh@example.com",
      bookings: 9,
      revenue: "112 triệu",
      segment: "Creator",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-100 via-white to-white shadow-lg border border-emerald-200/50">
        <div className="absolute -top-10 -right-12 w-52 h-52 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-2 text-gray-900">
            Doanh thu & Tăng trưởng
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Theo dõi doanh thu, nguồn đặt và khách hàng giá trị cao
          </Text>
        </div>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={12} lg={6}>
          <Card className="shadow-lg border border-gray-100 rounded-2xl">
            <Statistic
              title="Doanh thu tháng này"
              value={368}
              suffix="triệu"
              precision={1}
              valueStyle={{ color: "#16a34a" }}
              prefix={<DollarCircleOutlined />}
            />
            <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <ArrowUpOutlined />
              +12.4% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card className="shadow-lg border border-gray-100 rounded-2xl">
            <Statistic
              title="Tổng booking"
              value={142}
              suffix="đơn"
              valueStyle={{ color: "#2563eb" }}
            />
            <div className="text-sm text-gray-500 mt-2">
              Trung bình 4.6 đơn/ngày
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card className="shadow-lg border border-gray-100 rounded-2xl">
            <Statistic
              title="Tỷ lệ hủy"
              value={3.2}
              suffix="%"
              precision={1}
              valueStyle={{ color: "#dc2626" }}
            />
            <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <ArrowDownOutlined />
              -1.1% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card className="shadow-lg border border-gray-100 rounded-2xl">
            <Statistic
              title="Giá trị đơn TB"
              value={2.6}
              suffix=" triệu"
              precision={1}
              valueStyle={{ color: "#0ea5e9" }}
            />
            <div className="text-sm text-gray-500 mt-2">
              Studio Creative: 3.8 triệu/đơn
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} xl={16}>
          <Card title="Doanh thu theo tháng" className="shadow-lg border border-gray-100 rounded-2xl">
            <MiniLineChart
              data={monthlyRevenue}
              color="#10b981"
              height={140}
              gradient
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Nguồn booking" className="shadow-lg border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-center py-4">
              <DonutChart value={65} color="#6366f1" label="Website" />
            </div>
            <div className="space-y-2 text-sm mt-4">
              {bookingSources.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Dịch vụ có doanh thu cao" className="shadow-lg border border-gray-100 rounded-2xl">
            <MiniBarChart data={[45, 38, 32, 28, 22]} height={160} />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Livestream trọn gói</span>
                <strong>45 triệu</strong>
              </div>
              <div className="flex justify-between">
                <span>Chụp lookbook</span>
                <strong>38 triệu</strong>
              </div>
              <div className="flex justify-between">
                <span>Quay viral TikTok</span>
                <strong>32 triệu</strong>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Khách hàng giá trị cao" className="shadow-lg border border-gray-100 rounded-2xl">
            <Table
              columns={topCustomersColumns}
              dataSource={topCustomersData}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminRevenuePage;


