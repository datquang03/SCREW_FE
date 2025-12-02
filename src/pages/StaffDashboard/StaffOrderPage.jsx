import React from "react";
import { Card, Typography, Tag, Button } from "antd";
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
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
            <FiClock className="text-3xl text-orange-500" />
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
            <FiCheckCircle className="text-3xl text-green-500" />
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
            <FiAlertTriangle className="text-3xl text-red-500" />
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

  Card,
  Typography,
  Tag,
  Button,
  Modal,
  Descriptions,
  Divider,
  Spin,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";
import {
  getAllMyBookings,
  getBookingById,
  confirmBooking,
  updateBooking,
} from "../../features/booking/bookingSlice";

const { Title, Text } = Typography;

const mapStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Đang chờ";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Đã hoàn tất";
    case "cancelled":
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "orange";
    case "confirmed":
      return "blue";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "default";
  }
};

const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v || "-";

const StaffOrderPage = () => {
  const dispatch = useDispatch();
  const { myBookings, currentBooking, loading } = useSelector(
    (state) => state.booking
  );

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    dispatch(getAllMyBookings());
  }, [dispatch]);

  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      await dispatch(getBookingById(bookingId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      message.error(
        err?.message || "Không thể tải chi tiết đơn, vui lòng thử lại."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      setUpdatingStatus(true);
      await dispatch(confirmBooking(bookingId)).unwrap();
      message.success("Đã xác nhận booking thành công.");
    } catch (err) {
      message.error(
        err?.message || "Không thể xác nhận booking, vui lòng thử lại."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleChangeStatus = async (bookingId, status) => {
    try {
      setUpdatingStatus(true);
      await dispatch(
        updateBooking({ bookingId, payload: { status } })
      ).unwrap();
      message.success("Cập nhật trạng thái booking thành công.");
    } catch (err) {
      message.error(
        err?.message || "Không thể cập nhật trạng thái, vui lòng thử lại."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = useMemo(
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
        title: "Khách hàng",
        dataIndex: "userId",
        render: (uid) =>
          uid ? (
            <span className="text-gray-800">KH-{String(uid).slice(-6)}</span>
          ) : (
            "-"
          ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => (
          <Tag color={statusColor(status)} className="px-3 py-1 rounded-full">
            {mapStatusLabel(status)}
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
          <div className="flex gap-2">
            <Button
              size="small"
              type="link"
              onClick={() => handleViewDetail(record._id)}
            >
              Xem chi tiết
            </Button>
            {record.status === "pending" && (
              <Button
                size="small"
                type="primary"
                loading={updatingStatus}
                onClick={() => handleConfirm(record._id)}
              >
                Xác nhận
              </Button>
            )}
          </div>
        ),
      },
    ],
    [updatingStatus]
  );

  const totalCount = myBookings?.length || 0;
  const pendingCount =
    myBookings?.filter((b) => b.status === "pending").length || 0;
  const completedCount =
    myBookings?.filter((b) => b.status === "completed").length || 0;

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
          <Button
            type="primary"
            size="large"
            className="font-semibold shadow-lg"
          >
            Tạo đơn nội bộ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FiClock className="text-3xl text-orange-500" />
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">
                Đang chờ xử lý
              </Text>
              <div className="text-3xl font-extrabold text-gray-900">
                {pendingCount} đơn
              </div>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiCheckCircle className="text-3xl text-green-500" />
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">
                Đã hoàn tất
              </Text>
              <div className="text-3xl font-extrabold text-gray-900">
                {completedCount} đơn
              </div>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <FiAlertTriangle className="text-3xl text-red-500" />
            </div>
            <div>
              <Text className="text-sm font-medium text-gray-600 block mb-1">
                Tổng số đơn
              </Text>
              <div className="text-3xl font-extrabold text-gray-900">
                {totalCount} đơn
              </div>
            </div>
          </div>
        </Card>
      </div>

      <DataTable
        title="Danh sách đơn"
        columns={columns}
        data={myBookings || []}
      />

      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={760}
        centered
        title={
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-gray-700">
              Chi tiết booking (Staff view)
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
            <Card className="border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-br from-cyan-50 to-white">
              <Descriptions
                column={2}
                colon={false}
                labelStyle={{ fontWeight: 600 }}
                size="small"
              >
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor(currentBooking.status)}>
                    {mapStatusLabel(currentBooking.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hình thức thanh toán">
                  <Tag color="blue">
                    {currentBooking.payType === "full"
                      ? "Thanh toán toàn bộ"
                      : currentBooking.payType}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {currentBooking.userId ? (
                    <span className="text-gray-800">
                      KH-{String(currentBooking.userId).slice(-6)}
                    </span>
                  ) : (
                    "-"
                  )}
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
                <Descriptions.Item label="Cập nhật cuối">
                  {currentBooking.updatedAt
                    ? dayjs(currentBooking.updatedAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Text className="text-sm text-gray-600 mt-1">
                Cập nhật trạng thái:
              </Text>
              <Button
                size="small"
                onClick={() =>
                  handleChangeStatus(currentBooking._id, "pending")
                }
                loading={updatingStatus}
              >
                Đang chờ
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  handleChangeStatus(currentBooking._id, "confirmed")
                }
                loading={updatingStatus}
              >
                Đã xác nhận
              </Button>
              <Button
                size="small"
                type="dashed"
                onClick={() =>
                  handleChangeStatus(currentBooking._id, "completed")
                }
                loading={updatingStatus}
              >
                Đã hoàn tất
              </Button>
              <Button
                size="small"
                danger
                onClick={() =>
                  handleChangeStatus(currentBooking._id, "cancelled")
                }
                loading={updatingStatus}
              >
                Hủy đơn
              </Button>
            </div>

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
                            {d.description ||
                              d.extraServiceName ||
                              d.equipmentName}
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

export default StaffOrderPage;
