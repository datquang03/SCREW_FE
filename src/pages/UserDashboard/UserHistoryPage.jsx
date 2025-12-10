import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Tag, Button, Modal, Descriptions, Divider, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FiBookOpen, FiClock, FiDollarSign } from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";
import { getAllMyBookings, getBookingById } from "../../features/booking/bookingSlice";

const { Title, Text } = Typography;

const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v || "-";

const UserHistoryPage = () => {
  const dispatch = useDispatch();
  const { myBookings, currentBooking, loading } = useSelector((state) => state.booking);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filter chỉ lấy các booking đã hoàn tất
  const completedBookings = useMemo(
    () => myBookings?.filter((b) => b.status === "completed") || [],
    [myBookings]
  );

  useEffect(() => {
    dispatch(getAllMyBookings());
  }, [dispatch]);

  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      await dispatch(getBookingById(bookingId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      // lỗi đã được slice handle
    } finally {
      setDetailLoading(false);
    }
  };

  const historyColumns = useMemo(
    () => [
      {
        title: "Mã đơn",
        dataIndex: "_id",
        render: (id) => (
          <span className="font-mono font-semibold text-gray-800">
            #{id?.slice(-6) || "--"}
          </span>
        ),
      },
      {
        title: "Studio",
        dataIndex: ["scheduleId", "studioId", "name"],
        render: (name) => name || "N/A",
      },
      {
        title: "Ngày đặt",
        dataIndex: ["scheduleId", "date"],
        render: (date) =>
          date ? dayjs(date).format("DD/MM/YYYY") : "-",
      },
      {
        title: "Khung giờ",
        dataIndex: ["scheduleId", "timeRange"],
        render: (timeRange) => {
          if (!timeRange || !Array.isArray(timeRange) || timeRange.length < 2) return "-";
          const start = dayjs(timeRange[0]).format("HH:mm");
          const end = dayjs(timeRange[1]).format("HH:mm");
          return `${start} - ${end}`;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (v) => (
          <Tag color="green" className="px-3 py-1 rounded-full">
            Hoàn tất
          </Tag>
        ),
      },
      {
        title: "Tổng phí",
        dataIndex: "finalAmount",
        render: (v) => (
          <span className="font-semibold text-gray-900">
            {formatCurrency(v)}
          </span>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record._id)}
          >
            Xem chi tiết
          </Button>
        ),
      },
    ],
    []
  );

  // Tính toán thống kê
  const totalCount = completedBookings.length;
  const totalAmount = completedBookings.reduce(
    (sum, b) => sum + (b.finalAmount || 0),
    0
  );
  
  // Tính tổng giờ (giả sử mỗi booking có timeRange)
  const totalHours = useMemo(() => {
    return completedBookings.reduce((sum, booking) => {
      const timeRange = booking.scheduleId?.timeRange;
      if (timeRange && Array.isArray(timeRange) && timeRange.length >= 2) {
        const start = dayjs(timeRange[0]);
        const end = dayjs(timeRange[1]);
        const hours = end.diff(start, "hour", true);
        return sum + hours;
      }
      return sum;
    }, 0);
  }, [completedBookings]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
            Lịch sử thuê
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Xem lại tất cả các lần bạn đã thuê studio tại S+ Studio
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiBookOpen className="text-4xl text-blue-500 mb-3 mx-auto" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">
            {totalCount}
          </div>
          <div className="text-sm font-medium text-gray-600">Tổng số lần thuê</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiClock className="text-4xl text-purple-500 mb-3 mx-auto" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">
            {Math.round(totalHours)}h
          </div>
          <div className="text-sm font-medium text-gray-600">Tổng giờ đã thuê</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiDollarSign className="text-4xl text-green-500 mb-3 mx-auto" />
          <div className="text-3xl font-extrabold text-green-600 mb-1">
            {formatCurrency(totalAmount)}
          </div>
          <div className="text-sm font-medium text-gray-600">Tổng chi phí</div>
        </Card>
      </div>

      <DataTable
        title="Lịch sử đặt studio"
        columns={historyColumns}
        data={completedBookings}
        loading={loading}
      />

      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={720}
        centered
        title={
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-gray-700">
              Chi tiết booking
            </span>
            <span className="text-xs text-gray-400">
              Mã: #{currentBooking?._id?.slice(-10) || "--"}
            </span>
          </div>
        }
      >
        {detailLoading || !currentBooking ? (
          <div className="flex items-center justify-center py-10">
            <Spin tip="Đang tải chi tiết booking..." />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <Descriptions
                column={2}
                colon={false}
                labelStyle={{ fontWeight: 600 }}
                size="small"
              >
                <Descriptions.Item label="Trạng thái">
                  <Tag color="green">Hoàn tất</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hình thức thanh toán">
                  <Tag color="blue">
                    {currentBooking.payType === "full"
                      ? "Thanh toán toàn bộ"
                      : currentBooking.payType}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Studio">
                  {currentBooking.scheduleId?.studioId?.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {currentBooking.scheduleId?.date
                    ? dayjs(currentBooking.scheduleId.date).format("DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Khung giờ">
                  {currentBooking.scheduleId?.timeRange &&
                  Array.isArray(currentBooking.scheduleId.timeRange) &&
                  currentBooking.scheduleId.timeRange.length >= 2
                    ? `${dayjs(currentBooking.scheduleId.timeRange[0]).format("HH:mm")} - ${dayjs(currentBooking.scheduleId.timeRange[1]).format("HH:mm")}`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng trước giảm">
                  {formatCurrency(currentBooking.totalBeforeDiscount)}
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá">
                  {formatCurrency(currentBooking.discountAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Thành tiền">
                  <span className="font-semibold text-lg text-gray-900">
                    {formatCurrency(currentBooking.finalAmount)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {currentBooking.createdAt
                    ? dayjs(currentBooking.createdAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider className="my-2" />

            <div>
              <Title level={5} className="mb-3">
                Chi tiết dịch vụ / thiết bị
              </Title>
              {currentBooking.details && currentBooking.details.length > 0 ? (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600">
                          Hạng mục
                        </th>
                        <th className="px-4 py-3 text-center text-gray-600">
                          Loại
                        </th>
                        <th className="px-4 py-3 text-center text-gray-600">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-gray-600">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-gray-600">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBooking.details.map((d) => (
                        <tr key={d._id} className="border-t border-gray-100">
                          <td className="px-4 py-3">
                            {d.description || d.extraServiceName || d.equipmentName}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Tag size="small">
                              {d.detailType === "extra_service"
                                ? "Dịch vụ thêm"
                                : d.detailType === "equipment"
                                ? "Thiết bị"
                                : d.detailType}
                            </Tag>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {d.quantity || 1}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(d.pricePerUnit)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatCurrency(d.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Không có chi tiết dịch vụ/thiết bị.
                </div>
              )}
            </div>

            <div>
              <Title level={5} className="mb-3">
                Chính sách áp dụng
              </Title>
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  size="small"
                  className="border border-gray-100 rounded-2xl shadow-sm"
                  title="Chính sách hủy"
                >
                  {currentBooking.policySnapshots?.cancellation ? (
                    <ul className="text-xs text-gray-700 space-y-1">
                      {currentBooking.policySnapshots.cancellation.refundTiers?.map(
                        (tier) => (
                          <li key={tier._id}>
                            Trước {tier.hoursBeforeBooking}h: hoàn{" "}
                            <strong>{tier.refundPercentage}%</strong>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Không có thông tin chính sách hủy.
                    </span>
                  )}
                </Card>
                <Card
                  size="small"
                  className="border border-gray-100 rounded-2xl shadow-sm"
                  title="Chính sách không đến (No-Show)"
                >
                  {currentBooking.policySnapshots?.noShow ? (
                    <div className="text-xs text-gray-700 space-y-1">
                      <div>
                        Phạt:{" "}
                        <strong>
                          {
                            currentBooking.policySnapshots.noShow.noShowRules
                              ?.chargePercentage
                          }
                          %
                        </strong>{" "}
                        tổng tiền
                      </div>
                      <div>
                        Thời gian ân hạn:{" "}
                        <strong>
                          {
                            currentBooking.policySnapshots.noShow.noShowRules
                              ?.graceMinutes
                          }
                          {" phút"}
                        </strong>
                      </div>
                      <div>
                        Số lần tha thứ tối đa:{" "}
                        <strong>
                          {
                            currentBooking.policySnapshots.noShow.noShowRules
                              ?.maxForgivenessCount
                          }{" "}
                          lần
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Không có thông tin chính sách No-Show.
                    </span>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserHistoryPage;

