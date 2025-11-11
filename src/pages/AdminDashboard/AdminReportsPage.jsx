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
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-2">
            Báo cáo & phân tích
          </Title>
          <Text className="text-gray-600">
            Tổng hợp dữ liệu vận hành, khách hàng và marketing
          </Text>
        </div>
        <Button type="primary" icon={<DownloadOutlined />}>
          Xuất báo cáo tổng
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Báo cáo gần đây">
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
        <Card title="Báo cáo nổi bật">
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


