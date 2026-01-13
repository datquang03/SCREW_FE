import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Tag, Button, Modal, Descriptions, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FiBookOpen, FiClock, FiDollarSign } from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";

import {
  getAllMyBookings,
  getBookingById,
} from "../../features/booking/bookingSlice";

import {
  getMyTransactions,
  getTransactionById,
} from "../../features/transaction/transactionSlice";

const { Title, Text } = Typography;

// Định dạng tiền tệ
const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "₫" : v || "-";

const formatDateTime = (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-");

const getPayTypeText = (v) => {
  switch (v) {
    case "full":
      return "Thanh toán toàn bộ";
    case "prepay_50":
      return "Cọc 50%";
    case "prepay_30":
      return "Cọc 30%";
    default:
      return v || "-";
  }
};

// Hàm chuyển trạng thái sang tiếng Việt
const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Chờ thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "cancelled":
      return "Đã hủy";
    case "success":
      return "Thành công";
    case "failed":
      return "Thất bại";
    default:
      return status;
  }
};

const UserHistoryPage = () => {
  const dispatch = useDispatch();

  // ========================== STORE ==========================
  const { myBookings, currentBooking, loading } = useSelector(
    (state) => state.booking
  );

  const {
    transactions,
    transactionDetail,
    loading: transactionLoading,
  } = useSelector((state) => state.transaction);

  // ========================== STATE ==========================
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionDetailLoading, setTransactionDetailLoading] =
    useState(false);

  // ========================== LOAD DATA ==========================
  useEffect(() => {
    dispatch(getAllMyBookings());
    dispatch(getMyTransactions());
  }, [dispatch]);

  // ========================== CHỈ LẤY BOOKING ĐÃ HOÀN TẤT ==========================
  const completedBookings = useMemo(
    () => myBookings?.filter((b) => b.status === "completed") || [],
    [myBookings]
  );

  // ========================== XEM BOOKING ==========================
  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      await dispatch(getBookingById(bookingId)).unwrap();
      setDetailModalOpen(true);
    } finally {
      setDetailLoading(false);
    }
  };

  // ========================== XEM GIAO DỊCH ==========================
  const handleViewTransactionDetail = async (transactionId) => {
    try {
      setTransactionDetailLoading(true);
      await dispatch(getTransactionById(transactionId)).unwrap();
      setTransactionModalOpen(true);
    } finally {
      setTransactionDetailLoading(false);
    }
  };

  // ========================== CỘT BẢNG BOOKING ==========================
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
        render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "Khung giờ",
        dataIndex: ["scheduleId", "timeRange"],
        render: (range) => {
          if (!range || range.length < 2) return "-";
          return `${dayjs(range[0]).format("HH:mm")} - ${dayjs(range[1]).format(
            "HH:mm"
          )}`;
        },
    },
    {
      title: "Trạng thái",
        render: () => (
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
        render: (_, record) => (
          <Button type="link" onClick={() => handleViewDetail(record._id)}>
            Xem chi tiết
          </Button>
        ),
      },
    ],
    []
  );

  // ========================== CỘT BẢNG GIAO DỊCH ==========================
  const transactionColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "_id",
      render: (id) => <span>#{id?.slice(-6)}</span>,
    },
    {
      title: "Booking",
      dataIndex: ["bookingId", "_id"],
      key: "booking_short", // Thêm key khác biệt
      render: (id) => <span>#{id?.slice(-6)}</span>,
    },
    {
      title: "Studio",
      dataIndex: ["bookingId", "scheduleId", "studioId", "name"],
      render: (name) => name || "N/A",
    },
    {
      title: "Loại thanh toán",
      dataIndex: "payType",
      render: (v) => {
        const label =
          v === "full"
            ? "Thanh toán toàn bộ"
            : v === "prepay_50"
            ? "Cọc 50%"
            : v === "prepay_30"
            ? "Cọc 30%"
            : v;
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
      title: "Số tiền",
      dataIndex: "amount",
      render: (v) => (
        <span className="font-semibold text-gray-900">{formatCurrency(v)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => {
        const color =
          v === "paid" || v === "success"
            ? "green"
            : v === "pending"
            ? "blue"
            : v === "cancelled"
            ? "red"
            : v === "failed"
            ? "red"
            : "gray";
        return <Tag color={color}>{getStatusText(v)}</Tag>;
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewTransactionDetail(record._id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // ========================== TÍNH TOÁN ==========================
  const totalCount = completedBookings.length;

  const totalAmount = completedBookings.reduce(
    (sum, b) => sum + (b.finalAmount || 0),
    0
  );

  const totalHours = useMemo(() => {
    return completedBookings.reduce((sum, booking) => {
      const r = booking.scheduleId?.timeRange;
      if (r && r.length >= 2) {
        return sum + dayjs(r[1]).diff(dayjs(r[0]), "hour", true);
      }
      return sum;
    }, 0);
  }, [completedBookings]);

  return (
    <div className="space-y-6">
      {/* ===================== HEADER ===================== */}
      <div className="overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <Title level={2}>Lịch sử thuê & giao dịch</Title>
        <Text className="text-gray-700">
          Xem lại toàn bộ lịch sử đặt studio & thanh toán của bạn.
        </Text>
        </div>

      {/* ===================== THỐNG KÊ ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <FiBookOpen className="text-4xl text-blue-500 mx-auto mb-3" />
          <div className="text-3xl font-bold">{totalCount}</div>
          <div className="text-gray-600">Tổng số lần thuê</div>
        </Card>

        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <FiClock className="text-4xl text-purple-500 mx-auto mb-3" />
          <div className="text-3xl font-bold">{Math.round(totalHours)}h</div>
          <div className="text-gray-600">Tổng giờ thuê</div>
        </Card>

        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <FiDollarSign className="text-4xl text-green-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalAmount)}
          </div>
          <div className="text-gray-600">Tổng chi phí</div>
        </Card>
      </div>

      {/* ===================== BẢNG BOOKING ===================== */}
          <DataTable
        title="Lịch sử giao dịch"
        columns={transactionColumns}
        data={transactions}
        loading={transactionLoading}
          />

      {/* ===================== CHI TIẾT GIAO DỊCH ===================== */}
      <Modal
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        footer={null}
        width={800}
        className="custom-transaction-modal"
      >
        <Spin spinning={transactionDetailLoading || !transactionDetail} tip="Đang tải chi tiết...">
          {!(transactionDetailLoading || !transactionDetail) && (
            <div className="space-y-6">
              {/* ===== HEADER ===== */}
              <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase text-gray-500">Mã giao dịch</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">#{transactionDetail._id?.slice(-10)}</div>
                    <div className="text-sm text-gray-600">Mã thanh toán: <span className="font-mono">{transactionDetail.paymentCode}</span></div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag color="blue" className="px-3 py-1 text-sm rounded-full">
                      {getPayTypeText(transactionDetail.payType)}
                    </Tag>
                    <Tag
                      color={
                        transactionDetail.status === "paid" || transactionDetail.status === "success"
                          ? "green"
                          : transactionDetail.status === "pending"
                          ? "blue"
                          : transactionDetail.status === "cancelled"
                          ? "red"
                          : transactionDetail.status === "failed"
                          ? "red"
                          : "gray"
                      }
                      className="px-3 py-1 text-sm rounded-full font-semibold"
                    >
                      {getStatusText(transactionDetail.status)}
                    </Tag>
                    <span className="text-lg font-bold text-green-600 ml-2">{formatCurrency(transactionDetail.amount)}</span>
                  </div>
                </div>
              </Card>

              {/* ===== TRANSACTION INFO ===== */}
              <Card size="small" className="bg-white border border-blue-100">
                <Descriptions column={2} labelStyle={{ fontWeight: 600 }}>
                  <Descriptions.Item label="Transaction ID">
                    <span className="font-mono">{transactionDetail.transactionId}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã thanh toán">
                    <span className="font-mono">{transactionDetail.paymentCode}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {formatDateTime(transactionDetail.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thanh toán lúc">
                    {formatDateTime(transactionDetail.paidAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hết hạn link">
                    {formatDateTime(transactionDetail.expiresAt)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* ===== BOOKING INFO ===== */}
              <Card title="Thông tin booking" size="small" className="bg-white border border-blue-100">
                <Descriptions column={2} labelStyle={{ fontWeight: 600 }}>
                  <Descriptions.Item label="Mã booking">
                    #{transactionDetail.bookingId?._id?.slice(-10)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Studio">
                    {transactionDetail.bookingId?.scheduleId?.studioId?.name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt">
                    {transactionDetail.bookingId?.scheduleId?.startTime
                      ? formatDateTime(transactionDetail.bookingId.scheduleId.startTime).slice(0, 10)
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khung giờ">
                    {transactionDetail.bookingId?.scheduleId?.startTime
                      ? `${dayjs(transactionDetail.bookingId.scheduleId.startTime).format("HH:mm")} - ${dayjs(
                          transactionDetail.bookingId.scheduleId.endTime
                        ).format("HH:mm")}`
                      : "-"} 
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền booking">
                    {formatCurrency(transactionDetail.bookingId?.finalAmount)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái booking">
                    {getStatusText(transactionDetail.bookingId?.status)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default UserHistoryPage;
