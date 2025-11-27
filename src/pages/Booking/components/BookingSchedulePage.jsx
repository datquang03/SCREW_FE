// src/pages/Booking/components/BookingSchedulePage.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  TimePicker,
  Button,
  Card,
  Typography,
  Image,
  Space,
  Tag,
  message,
  Spin,
} from "antd";
import { TeamOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { setBookingTime } from "../../../features/booking/bookingSlice";

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

const BookingSchedulePage = ({ onNext }) => {
  const dispatch = useDispatch();

  const studio = useSelector((state) => state.studio.currentStudio);
  const draft = useSelector((state) => state.booking.draft);
  const loading = useSelector((state) => state.studio.loading);

  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState([null, null]);

  useEffect(() => {
    if (draft.startTime && draft.endTime) {
      const start = dayjs(draft.startTime);
      const end = dayjs(draft.endTime);
      setSelectedDate(start);
      setTimeRange([start, end]);
    }
  }, [draft.startTime, draft.endTime]);

  const durationHours =
    selectedDate && timeRange[0] && timeRange[1]
      ? timeRange[1].diff(timeRange[0], "hour", true)
      : 0;

  const handleNext = () => {
    if (!selectedDate) return message.warning("Vui lòng chọn ngày đặt phòng!");
    if (!timeRange[0] || !timeRange[1])
      return message.warning("Vui lòng chọn khung giờ bắt đầu và kết thúc!");

    const startTime = selectedDate
      .hour(timeRange[0].hour())
      .minute(timeRange[0].minute())
      .second(0)
      .millisecond(0);

    const endTime = selectedDate
      .hour(timeRange[1].hour())
      .minute(timeRange[1].minute())
      .second(0)
      .millisecond(0);

    if (endTime.diff(startTime, "minute") < 60)
      return message.error("Thời gian thuê phải ít nhất 1 giờ!");
    if (endTime.isBefore(startTime))
      return message.error("Giờ kết thúc phải sau giờ bắt đầu!");

    dispatch(
      setBookingTime({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      })
    );

    message.success("Đã chọn khung giờ thành công!");
    onNext();
  };

  if (loading || !studio) {
    return (
      <div className="text-center py-20">
        <Spin size="large" />
        <Text className="block mt-4 text-lg">Đang tải thông tin studio...</Text>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-10 py-6"
    >
      {/* Thông tin Studio */}
      <Card className="shadow-2xl overflow-hidden border-0 rounded-3xl">
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-1">
            <Image
              src={studio.images?.[0]?.url || "/images/studio-default.jpg"}
              alt={studio.name}
              className="w-full h-64 md:h-full object-cover"
              preview={false}
              fallback="/images/studio-default.jpg"
            />
          </div>

          <div className="md:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <Title level={2} className="mb-4 text-3xl font-bold">
                {studio.name}
              </Title>
              <Text className="text-gray-600 text-lg leading-relaxed block mb-6">
                {studio.description ||
                  "Studio chuyên nghiệp với đầy đủ tiện nghi."}
              </Text>

              <Space size="large" className="mb-8">
                <Tag
                  icon={<TeamOutlined />}
                  color="blue"
                  className="text-base py-1 px-4"
                >
                  Sức chứa {studio.capacity} người
                </Tag>
              </Space>

              <div className="text-right">
                <Text className="text-xl text-gray-500 block">
                  Giá thuê mỗi giờ
                </Text>
                <Title
                  level={1}
                  className="m-0 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {(studio.basePricePerHour / 1_000_000).toFixed(1)} triệu
                </Title>
                <Text className="text-lg text-gray-600">VND / giờ</Text>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chọn ngày & giờ */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Lịch */}
        <Card
          title={
            <Title level={4} className="font-bold">
              Chọn ngày đặt phòng
            </Title>
          }
          className="shadow-xl"
        >
          <Calendar
            fullscreen={false}
            value={selectedDate}
            onChange={setSelectedDate}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            className="rounded-xl"
          />
        </Card>

        {/* Chọn giờ + Tóm tắt */}
        <div className="space-y-8">
          <Card
            title={
              <Title level={4} className="font-bold">
                Chọn khung giờ thuê
              </Title>
            }
            className="shadow-xl"
          >
            <RangePicker
              format="HH:mm"
              minuteStep={30}
              placeholder={["Giờ bắt đầu", "Giờ kết thúc"]}
              value={timeRange}
              onChange={setTimeRange}
              className="w-full text-lg"
              size="large"
              allowClear={false}
              disabled={!selectedDate}
              style={{ height: 56 }}
            />

            {/* Tóm tắt */}
            {selectedDate && timeRange[0] && timeRange[1] && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Ngày thuê:
                    </Text>
                    <Tag color="blue" className="text-base">
                      {selectedDate.format("dddd, DD/MM/YYYY")}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Khung giờ:
                    </Text>
                    <Tag color="green" className="text-base font-medium">
                      {timeRange[0].format("HH:mm")} →{" "}
                      {timeRange[1].format("HH:mm")}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Thời lượng:
                    </Text>
                    <Tag
                      color="purple"
                      className="text-base font-bold text-purple-700"
                    >
                      {durationHours.toFixed(1)} giờ
                    </Tag>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleNext}
            disabled={!selectedDate || !timeRange[0] || !timeRange[1]}
            className="h-16 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all"
            style={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
            icon={<ArrowRightOutlined />}
          >
            Tiếp theo → Chọn thiết bị & dịch vụ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSchedulePage;
