import React from "react";
import { Card, Typography, Tag, Calendar, Badge } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffSchedulePage = () => {
  const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "Studio A - 09:00-11:00" },
          { type: "success", content: "Studio B - 14:00-17:00" },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "Studio C - 10:00-12:00" },
        ];
        break;
      case 15:
        listData = [
          { type: "error", content: "Studio A - 18:00-21:00" },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type}
              text={item.content}
              className="text-xs"
            />
          </li>
        ))}
      </ul>
    );
  };

  const todaySchedule = [
    { time: "09:00 - 11:00", studio: "Studio A", status: "Đang diễn ra" },
    { time: "14:00 - 17:00", studio: "Studio B", status: "Sắp tới" },
    { time: "18:00 - 21:00", studio: "Studio C", status: "Sắp tới" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-100 via-teal-50 to-white shadow-lg border border-emerald-200/50">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
            Lịch làm việc
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Quản lý và theo dõi lịch làm việc của bạn
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4} className="mb-4 text-gray-900">
            Lịch tháng
          </Title>
          <Calendar dateCellRender={dateCellRender} />
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4} className="mb-4 text-gray-900">
            Hôm nay
          </Title>
          <div className="space-y-3">
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  <Tag
                    color={
                      item.status === "Đang diễn ra"
                        ? "green"
                        : item.status === "Sắp tới"
                        ? "orange"
                        : "default"
                    }
                  >
                    {item.status}
                  </Tag>
                </div>
                <div className="font-semibold">{item.time}</div>
                <div className="text-gray-600 text-sm">{item.studio}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffSchedulePage;

