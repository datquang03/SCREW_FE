import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Tag, Button, Modal, Descriptions, Divider, Spin, DatePicker, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";
import { getAllMyBookings, getBookingById, extendStudioSchedule, cancelBooking, getExtendStatus } from "../../features/booking/bookingSlice";
import { createRemainingPayment, refundPayment } from "../../features/payment/paymentSlice";
import { getStudioById } from '../../features/studio/studioSlice';

const { Title, Text } = Typography;

const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v || "-";

const mapStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Đang chờ";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn tất";
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

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const { myBookings, currentBooking, loading } = useSelector((state) => state.booking);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [studioDetail, setStudioDetail] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);

  // Extend Modal State
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [extendLoading, setExtendLoading] = useState(false);
  const [newEndTime, setNewEndTime] = useState(null);
  const [extensionOptions, setExtensionOptions] = useState(null);
  const [loadingExtensionOptions, setLoadingExtensionOptions] = useState(false);

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundForm] = Form.useForm();

  useEffect(() => {
    dispatch(getAllMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (detailModalOpen && currentBooking?.studio?._id) {
      setStudioLoading(true);
      dispatch(getStudioById(currentBooking.studio._id))
        .unwrap()
        .then((data) => setStudioDetail(data))
        .catch(() => setStudioDetail(null))
        .finally(() => setStudioLoading(false));
    }
  }, [detailModalOpen, currentBooking?.studio?._id, dispatch]);

  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      await dispatch(getBookingById(bookingId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      // lỗi đã được slice handle, ở đây chỉ đóng loading
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenExtend = async () => {
    if (!currentBooking?._id) return;
    
    try {
      setLoadingExtensionOptions(true);
      const result = await dispatch(getExtendStatus(currentBooking._id)).unwrap();
      setExtensionOptions(result);
      setExtendModalOpen(true);
      setNewEndTime(null);
    } catch (err) {
      Modal.error({ 
        title: "Không thể lấy thông tin gia hạn",
        content: err.message || "Vui lòng thử lại sau" 
      });
    } finally {
      setLoadingExtensionOptions(false);
    }
  };

  const submitExtend = async () => {
    if (!newEndTime) {
      Modal.error({ content: "Vui lòng chọn thời gian kết thúc mới" });
      return;
    }

    try {
      setExtendLoading(true);
      await dispatch(
        extendStudioSchedule({
          bookingId: currentBooking._id,
          newEndTime: newEndTime.toISOString(),
        })
      ).unwrap();

      Modal.success({ content: "Gia hạn thành công!" });
      setExtendModalOpen(false);
      setDetailModalOpen(false);
    } catch (err) {
      Modal.error({ content: err.message || "Gia hạn thất bại" });
    } finally {
      setExtendLoading(false);
    }
  };

  const handleRefund = () => {
    // Nếu status = cancelled -> Yêu cầu hoàn tiền
    // Nếu status = pending/confirmed -> Hủy & Hoàn tiền (nếu đã thanh toán)
    if (currentBooking?.status === "cancelled") {
        setRefundModalOpen(true);
    } else {
        Modal.confirm({
            title: "Xác nhận hủy đặt phòng",
            content: "Bạn có chắc chắn muốn hủy đơn này không?",
            okText: "Hủy phòng",
            okType: "danger",
            onOk: async () => {
                 try {
                     await dispatch(cancelBooking(currentBooking._id)).unwrap();
                     Modal.success({ content: "Đã hủy đặt phòng thành công." });
                     setDetailModalOpen(false);
                 } catch (err) {
                     Modal.error({ content: err.message || "Hủy thất bại" });
                 }
            }
        });
    }
  };

  // Nút mở modal Refund riêng (dành cho status cancelled hoặc manual refund)
  const openRefundModal = () => {
      setRefundModalOpen(true);
  };

  const submitRefund = async () => {
      try {
          const values = await refundForm.validateFields();
          setRefundLoading(true);
          
          await dispatch(refundPayment({
             bookingId: currentBooking._id,
             ...values
          })).unwrap();
          
          Modal.success({ content: "Đã gửi yêu cầu hoàn tiền thành công!" });
          setRefundModalOpen(false);
          setDetailModalOpen(false);
          refundForm.resetFields();
      } catch (err) {
          Modal.error({ content: err.message || "Gửi yêu cầu thất bại" });
      } finally {
          setRefundLoading(false);
      }
   };

   const handlePayRemaining = async () => {
    try {
      if (!currentBooking) return;
      
      const res = await dispatch(
        createRemainingPayment({ bookingId: currentBooking._id })
      ).unwrap();

      if (res?.qrCodeUrl) {
         window.location.href = res.qrCodeUrl;
      } else {
         Modal.success({ content: "Tạo thanh toán thành công!" });
         setDetailModalOpen(false);
         dispatch(getAllMyBookings());
      }
    } catch (err) {
       Modal.error({ content: err.message || "Không thể tạo thanh toán phần còn lại" });
    }
  };

  const bookingsColumns = useMemo(
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
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
      },
      {
        title: "Hình thức",
        dataIndex: "payType",
        render: (v) => {
          const label =
            v === "full"
              ? "Thanh toán toàn bộ"
              : v === "prepay_50"
              ? "Cọc 50%"
              : v === "prepay_30"
              ? "Cọc 30%"
              : v || "-";
          const color =
            v === "full" ? "green" : v === "prepay_50" ? "purple" : "orange";
          return (
            <Tag color={color} className="px-3 py-1 rounded-full">
              {label}
            </Tag>
          );
        },
      },
    {
      title: "Trạng thái",
      dataIndex: "status",
        render: (v) => {
          const label = mapStatusLabel(v);
          return (
            <Tag color={statusColor(v)} className="px-3 py-1 rounded-full">
              {label}
            </Tag>
          );
        },
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

  const totalCount = myBookings?.length || 0;
  const processingCount = myBookings?.filter((b) => b.status === "pending").length || 0;
  const completedCount = myBookings?.filter((b) => b.status === "completed").length || 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
          Đơn của tôi
        </Title>
          <Text className="text-base text-gray-700 font-medium">
          Quản lý và theo dõi tất cả các đơn đặt studio của bạn
        </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiCalendar className="text-4xl text-blue-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">
            {totalCount}
          </div>
          <div className="text-sm font-medium text-gray-600">Tổng đơn</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiClock className="text-4xl text-orange-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">
            {processingCount}
          </div>
          <div className="text-sm font-medium text-gray-600">Đang xử lý</div>
        </Card>
        <Card className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <FiCheckCircle className="text-4xl text-green-500 mb-3" />
          <div className="text-3xl font-extrabold text-gray-900 mb-1">
            {completedCount}
          </div>
          <div className="text-sm font-medium text-gray-600">Hoàn tất</div>
        </Card>
      </div>

      <DataTable
        title="Danh sách đơn đặt"
        columns={bookingsColumns}
        data={myBookings || []}
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
            {/* Studio Section + Thời gian (Highlight) */}
            <div className="flex flex-row items-center gap-6 border border-amber-100 rounded-2xl shadow bg-white/90 p-4">
              {studioLoading ? (
                <div className="w-20 h-20 bg-amber-50 rounded-xl animate-pulse" />
              ) : studioDetail?.images?.[0] ? (
                <img
                  src={studioDetail.images[0]}
                  alt={studioDetail.name}
                  className="w-20 h-20 object-cover rounded-xl border border-amber-100"
                />
              ) : (
                <div className="w-20 h-20 bg-amber-50 rounded-xl flex items-center justify-center font-bold text-amber-600">
                  {studioDetail?.name || currentBooking.studio?.name || 'Studio'}
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-lg font-bold text-gray-900 line-clamp-1">
                  {studioDetail?.name || currentBooking.studio?.name}
                </span>
                {/* Highlight thời gian booking */}
                <div className="mt-2">
                  <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-xl font-extrabold tracking-wide shadow border border-amber-200">
                    {currentBooking.schedule?.date ? dayjs(currentBooking.schedule.date).format("DD/MM/YYYY") : "-"}
                    {currentBooking.schedule?.timeRange ? (
                      <>
                        {" "}
                        <span className="text-base font-bold">{currentBooking.schedule.timeRange}</span>
                      </>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>

            <Card className="border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-br from-blue-50 to-white">
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
                <Descriptions.Item label="Studio">
                  <span className="font-semibold text-blue-700">
                    {currentBooking.studio?.name}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {currentBooking.createdAt
                    ? dayjs(currentBooking.createdAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  <span className="font-semibold text-gray-700">
                    {currentBooking.customer?.fullName}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Khuyến mãi">
                  {currentBooking.promotion?.name ? (
                    <Tag color="gold">{currentBooking.promotion.name}</Tag>
                  ) : (
                    <span className="text-gray-400">Không áp dụng</span>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card className="border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-br from-amber-50 to-white">
              <Title level={5} className="mb-3 text-amber-700">Tóm tắt thanh toán</Title>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Tổng phí (trước giảm):</div>
                  <div className="font-bold text-gray-900">{formatCurrency(currentBooking.totalBeforeDiscount)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Giảm giá:</div>
                  <div className="font-bold text-green-600">-{formatCurrency(currentBooking.discountAmount)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Thành tiền cần thanh toán:</div>
                  <div className="font-bold text-amber-600 text-lg">{formatCurrency(currentBooking.finalAmount)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Đã thanh toán:</div>
                  <div className="font-bold text-blue-600">
                    {formatCurrency(currentBooking.paymentSummary?.paidAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Còn lại phải trả:</div>
                  <div className="font-bold text-orange-600 text-xl">
                    {formatCurrency(currentBooking.paymentSummary?.remainingAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Tỷ lệ đã thanh toán:</div>
                  <div className="font-bold text-blue-500">
                    {currentBooking.paymentSummary?.paidPercentage != null
                      ? `${currentBooking.paymentSummary.paidPercentage}%`
                      : currentBooking.finalAmount && currentBooking.paymentSummary?.paidAmount
                        ? `${Math.round((currentBooking.paymentSummary.paidAmount / currentBooking.finalAmount) * 100)}%`
                        : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Hoàn tiền:</div>
                  <div className="font-bold text-green-600">{formatCurrency(currentBooking.financials?.refundAmount)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phí phát sinh/phạt:</div>
                  <div className="font-bold text-red-500">{formatCurrency(currentBooking.financials?.chargeAmount)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">Tiền tệ:</div>
                  <div className="font-bold text-gray-700">
                    {currentBooking.paymentSummary?.currency || 'VND'}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-200">
                {["pending", "confirmed"].includes(currentBooking.status) && (
                  <>
                    <Button 
                      onClick={handleOpenExtend}
                      loading={loadingExtensionOptions}
                    >
                      Gia hạn
                    </Button>
                    <Button danger onClick={handleRefund}>
                      Hủy đặt phòng
                    </Button>
                  </>
                )}
                {currentBooking.status === "cancelled" && (
                  <Button onClick={openRefundModal}>Yêu cầu hoàn tiền</Button>
                )}
                <Button 
                  type="primary"
                  danger
                  onClick={handlePayRemaining}
                  disabled={
                    (currentBooking.paymentSummary?.remainingAmount ?? currentBooking.financials?.netAmount) <= 0
                  }
                >
                  Tạo phí trả còn lại
                </Button>
              </div>
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

      {/* Extend Modal */}
      <Modal
        title="Gia hạn thời gian đặt"
        open={extendModalOpen}
        onCancel={() => setExtendModalOpen(false)}
        confirmLoading={extendLoading}
        onOk={submitExtend}
        okText="Xác nhận gia hạn"
        cancelText="Hủy"
      >
        <div className="py-4 space-y-6">
          {extensionOptions ? (
            <>
              {extensionOptions.canExtend ? (
                <>
                  {/* Thông tin hiện tại */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiClock className="text-blue-600" />
                      <span className="font-semibold text-blue-900">Thời gian hiện tại</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="flex justify-between py-1">
                        <span>Kết thúc hiện tại:</span>
                        <span className="font-bold">{dayjs(extensionOptions.currentEndTime).format("DD/MM/YYYY HH:mm")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin gia hạn */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiCheckCircle className="text-green-600" />
                      <span className="font-semibold text-green-900">Có thể gia hạn</span>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Thời gian tối đa:</span>
                        <span className="font-bold text-green-700">
                          {dayjs(extensionOptions.maxEndTime).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Số phút có thể gia hạn:</span>
                        <span className="font-bold text-green-700">
                          {extensionOptions.availableMinutes} phút 
                          <span className="text-xs text-gray-500 ml-1">
                            (~{Math.floor(extensionOptions.availableMinutes / 60)}h {extensionOptions.availableMinutes % 60}m)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chọn thời gian mới */}
                  <div>
                    <p className="mb-2 font-medium text-gray-700">Chọn thời gian kết thúc mới:</p>
                    <DatePicker
                      showTime
                      className="w-full"
                      placeholder="Chọn thời gian kết thúc mới"
                      format="DD/MM/YYYY HH:mm"
                      value={newEndTime}
                      onChange={(val) => setNewEndTime(val)}
                      disabledDate={(current) =>
                        current && (
                          current < dayjs(extensionOptions.currentEndTime) ||
                          current > dayjs(extensionOptions.maxEndTime)
                        )
                      }
                      minDate={dayjs(extensionOptions.currentEndTime)}
                      maxDate={dayjs(extensionOptions.maxEndTime)}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      * Chọn thời gian từ {dayjs(extensionOptions.currentEndTime).format("HH:mm DD/MM")} đến {dayjs(extensionOptions.maxEndTime).format("HH:mm DD/MM")}
                    </p>
                  </div>
                </>
              ) : (
                /* Không thể gia hạn */
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="text-red-600" />
                    <span className="font-semibold text-red-900">Không thể gia hạn</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {extensionOptions.reason || "Studio không khả dụng để gia hạn thêm"}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <Spin />
              <p className="mt-2 text-gray-500">Đang tải thông tin gia hạn...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal
         title="Yêu cầu hoàn tiền"
         open={refundModalOpen}
         onCancel={() => {
            setRefundModalOpen(false);
            refundForm.resetFields();
         }}
         footer={[
            <Button key="cancel" onClick={() => setRefundModalOpen(false)}>Thoát</Button>,
            <Button key="submit" type="primary" loading={refundLoading} onClick={submitRefund}>Đồng ý</Button>
         ]}
      >
         <Form form={refundForm} layout="vertical">
            <Form.Item
               name="bankName"
               label="Tên ngân hàng"
               rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng" }]}
            >
               <Input placeholder="Ví dụ: Vietcombank, Techcombank..." />
            </Form.Item>
            <Form.Item
               name="accountNumber"
               label="Số tài khoản"
               rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
            >
               <Input placeholder="0123456789" />
            </Form.Item>
            <Form.Item
               name="accountName"
               label="Tên chủ tài khoản"
               rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
            >
               <Input placeholder="NGUYEN VAN A" style={{ textTransform: 'uppercase'}} />
            </Form.Item>
            <Form.Item
               name="reason"
               label="Lý do (Tùy chọn)"
            >
               <Input.TextArea rows={3} placeholder="Lý do hoàn tiền..." />
            </Form.Item>
         </Form>
      </Modal>
    </div>
  );
};

export default UserBookingsPage;

