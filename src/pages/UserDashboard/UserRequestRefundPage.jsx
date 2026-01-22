import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Card, Typography, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { FiEye, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getMyRequestRefund } from "../../features/payment/paymentSlice";
// import DashboardLayout from "../../components/layout/DashboardLayout"; // Assuming layout is handled in parent or router

const { Title, Text } = Typography;

const UserRequestRefundPage = () => {
  const dispatch = useDispatch();
  const { myRefundRequests, loading } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(getMyRequestRefund());
  }, [dispatch]);

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id) => (
        <Text copyable={{ text: id }}>#{id.slice(-6).toUpperCase()}</Text>
      ),
    },
    {
      title: "Booking",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 120,
      render: (booking) =>
        booking ? (
          <Text code>#{booking._id?.slice(-6).toUpperCase()}</Text>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount) => (
        <span className="font-bold text-emerald-600">
          {amount?.toLocaleString()}đ
        </span>
      ),
    },
    {
      title: "Ngân hàng nhận",
      key: "bank",
      render: (_, record) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700">
            {record.destinationBank?.bankName}
          </div>
          <div className="text-gray-500">
            {record.destinationBank?.accountNumber}
          </div>
        </div>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: {
        showTitle: false,
      },
      render: (reason) => (
        <Tooltip placement="topLeft" title={reason}>
          {reason}
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "default";
        let icon = <FiClock />;
        let label = "Chờ xử lý";

        if (status === "APPROVED") {
          color = "success";
          icon = <FiCheckCircle />;
          label = "Đã duyệt";
        } else if (status === "REJECTED") {
          color = "error";
          icon = <FiXCircle />;
          label = "Từ chối";
        } else if (status === "PENDING_APPROVAL") {
          color = "warning";
          icon = <FiClock />;
          label = "Chờ duyệt";
        }

        return (
          <Tag icon={icon} color={color}>
            {label}
          </Tag>
        );
      },
    },
    {
        title: "Lý do từ chối",
        dataIndex: "rejectReason",
        key: "rejectReason",
        render: (text) => text ? <span className="text-red-500">{text}</span> : "-"
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <Title
          level={2}
          className="mb-2 !text-white"
          style={{ color: "white" }}
        >
          Lịch sử hoàn tiền
        </Title>
        <Text
          className="text-white/90"
          style={{ color: "rgba(255, 255, 255, 0.9)" }}
        >
          Theo dõi trạng thái các yêu cầu hoàn tiền của bạn
        </Text>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Table
          columns={columns}
          dataSource={Array.isArray(myRefundRequests) ? myRefundRequests : []}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default UserRequestRefundPage;