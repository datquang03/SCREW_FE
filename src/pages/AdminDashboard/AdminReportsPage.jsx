import React from "react";
import { Card, Typography, Timeline, Button, Tag } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminReportsPage = () => {
  const reports = [
    {
      title: "Hiệu suất studio Q3/2025",
      description: "Tổng hợp tỷ lệ lấp đầy và doanh thu theo studio",
      tag: "Studio",
    },
    {
      title: "Khách hàng thân thiết 2025",
      description: "Danh sách khách hàng VIP và lịch sử sử dụng",
      tag: "Khách hàng",
    },
    {
      title: "Hiệu quả chiến dịch Meta Ads",
      description: "Đánh giá chuyển đổi từ quảng cáo tháng 10-11",
      tag: "Marketing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-slate-100 via-white to-white shadow-lg border border-slate-200/50">
        <div className="absolute -top-10 -right-12 w-48 h-48 rounded-full bg-slate-300/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title level={2} className="mb-2 text-gray-900">
              Báo cáo & phân tích
            </Title>
            <Text className="text-base text-gray-700 font-medium">
              Tổng hợp dữ liệu vận hành, khách hàng và marketing
            </Text>
          </div>
          <Button type="primary" icon={<DownloadOutlined />} size="large" className="font-semibold shadow-lg">
            Xuất báo cáo tổng
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Báo cáo gần đây" className="shadow-lg border border-gray-100 rounded-2xl">
          <Timeline
            items={[
              {
                color: "green",
                children:
                  "12/11/2025 - Báo cáo tỷ lệ chuyển đổi booking/website",
              },
              {
                color: "blue",
                children: "05/11/2025 - Insight khách hàng mới theo ngành",
              },
              {
                color: "gray",
                children: "28/10/2025 - Báo cáo tổng hợp doanh thu Q3/2025",
              },
            ]}
          />
        </Card>
        <Card title="Báo cáo nổi bật" className="shadow-lg border border-gray-100 rounded-2xl">
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-3 border rounded-lg hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-indigo-500" />
                    <Text strong>{report.title}</Text>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.description}
                  </p>
                  <Tag color="purple" className="mt-2">
                    {report.tag}
                  </Tag>
                </div>
                <Button type="link" className="p-0">
                  Tải xuống
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportsPage;


