import React from "react";
import { Card, Typography, Timeline, Button, Tag } from "antd";
import { FiDownload, FiFileText } from "react-icons/fi";

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
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · ADMIN</div>
        <h1 className="text-3xl font-bold mb-2">Báo cáo & phân tích</h1>
        <p className="opacity-90">
          Tổng hợp dữ liệu vận hành, khách hàng và marketing
        </p>
        
        <div className="absolute top-8 right-8">
          <Button type="primary" icon={<FiDownload />} size="large" className="font-semibold shadow-lg bg-white/20 hover:bg-white/30 border-white/30">
            Xuất báo cáo tổng
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Báo cáo gần đây" className="shadow-lg border border-slate-200">
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
        <Card title="Báo cáo nổi bật" className="shadow-lg border border-slate-200">
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-3 border rounded-lg hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-indigo-500" />
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


