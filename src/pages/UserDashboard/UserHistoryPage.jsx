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

const UserHistoryPage = () => {
  const dispatch = useDispatch();

  // ========================== STORE ==========================
  const { myBookings, currentBooking, loading } = useSelector(
    (state) => state.booking
  );

  const {
    transactions,
    currentTransaction,
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
      title: "Mã booking",
      dataIndex: ["bookingId", "_id"],
      render: (id) => <span>#{id?.slice(-6)}</span>,
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
          v === "success"
            ? "green"
            : v === "pending"
            ? "blue"
            : v === "failed"
            ? "red"
            : "gray";
        return <Tag color={color}>{v}</Tag>;
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
        title="Lịch sử đặt studio"
        columns={historyColumns}
        data={completedBookings}
        loading={loading}
      />

      {/* ===================== BẢNG GIAO DỊCH ===================== */}
      <DataTable
        title="Lịch sử giao dịch"
        columns={transactionColumns}
        data={transactions}
        loading={transactionLoading}
      />

      {/* ===================== CHI TIẾT BOOKING ===================== */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={720}
      >
        {detailLoading || !currentBooking ? (
          <div className="flex justify-center py-10">
            <Spin tip="Đang tải chi tiết..." />
          </div>
        ) : (
          <Card>
            <Descriptions column={2} labelStyle={{ fontWeight: 600 }}>
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
                {currentBooking.scheduleId?.studioId?.name}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày đặt">
                {dayjs(currentBooking.scheduleId?.date).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Khung giờ">
                {`${dayjs(currentBooking.scheduleId?.timeRange[0]).format(
                  "HH:mm"
                )} - ${dayjs(currentBooking.scheduleId?.timeRange[1]).format(
                  "HH:mm"
                )}`}
              </Descriptions.Item>

              <Descriptions.Item label="Thành tiền">
                {formatCurrency(currentBooking.finalAmount)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>

      {/* ===================== CHI TIẾT GIAO DỊCH ===================== */}
      <Modal
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        footer={null}
        width={650}
      >
        {transactionDetailLoading || !currentTransaction ? (
          <div className="flex justify-center py-10">
            <Spin tip="Đang tải chi tiết..." />
          </div>
        ) : (
          <Card>
            <Descriptions column={2} labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Mã giao dịch">
                #{currentTransaction._id?.slice(-10)}
              </Descriptions.Item>

              <Descriptions.Item label="Mã booking">
                #{currentTransaction.bookingId?._id?.slice(-10)}
              </Descriptions.Item>

              <Descriptions.Item label="Số tiền">
                {formatCurrency(currentTransaction.amount)}
              </Descriptions.Item>

              <Descriptions.Item label="Phương thức">
                <Tag color="blue">{currentTransaction.payType}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    currentTransaction.status === "success"
                      ? "green"
                      : currentTransaction.status === "pending"
                      ? "blue"
                      : "red"
                  }
                >
                  {currentTransaction.status}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {dayjs(currentTransaction.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default UserHistoryPage;
