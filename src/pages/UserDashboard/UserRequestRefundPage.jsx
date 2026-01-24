import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Card, Typography, Space, Tooltip, Modal } from "antd";
import dayjs from "dayjs";
import { FiEye, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getMyRequestRefund } from "../../features/payment/paymentSlice";

const { Title, Text } = Typography;

const UserRequestRefundPage = () => {
  const dispatch = useDispatch();
  const { myRefundRequests, loading } = useSelector((state) => state.payment);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

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
        let label = "Chờ xử lý";

        if (status === "APPROVED") {
          color = "success";
          label = "Đã duyệt";
        } else if (status === "REJECTED") {
          color = "error";
          label = "Từ chối";
        } else if (status === "PENDING_APPROVAL") {
          color = "warning";
          label = "Chờ duyệt";
        } else if (status === "COMPLETED") {
          color = "processing";
          label = "Đã hoàn thành";
        }

        return (
          <Tag color={color} className="m-0 border-0 font-medium">
            {label}
          </Tag>
        );
      },
    },
    {
        title: "Lý do từ chối",
        dataIndex: "rejectionReason",
        key: "rejectionReason",
        render: (text) => text ? <span className="text-red-500">{text}</span> : "Không có lý do"
    },
    {
      title: "Chi tiết",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <button
          className="text-blue-600 hover:underline font-semibold"
          onClick={() => {
            setSelectedRefund(record);
            setDetailModalOpen(true);
          }}
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Lịch sử hoàn tiền</h1>
        <p className="opacity-90">
          Theo dõi trạng thái các yêu cầu hoàn tiền của bạn
        </p>
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
      {/* Modal chi tiết refund */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        title="Chi tiết yêu cầu hoàn tiền"
        centered
        width={600}
      >
        {selectedRefund && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">Mã yêu cầu:</span>
                <span className="ml-2 font-bold text-lg text-[#C5A267]">#{selectedRefund._id.slice(-6).toUpperCase()}</span>
              </div>
              <Tag color="blue" className="text-base">{selectedRefund.status}</Tag>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Số tiền hoàn</div>
                <div className="font-bold text-emerald-600 text-lg">{selectedRefund.amount?.toLocaleString()}đ</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Ngày yêu cầu</div>
                <div>{dayjs(selectedRefund.createdAt).format("DD/MM/YYYY HH:mm")}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Ngân hàng nhận</div>
                <div className="font-semibold">{selectedRefund.destinationBank?.bankName}</div>
                <div className="text-xs">{selectedRefund.destinationBank?.accountNumber}</div>
                <div className="text-xs text-gray-500">{selectedRefund.destinationBank?.accountName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Booking</div>
                {selectedRefund.bookingId ? (
                  <span className="font-mono text-indigo-600">#{selectedRefund.bookingId._id.slice(-6).toUpperCase()}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Lý do hoàn tiền</div>
              <div className="bg-gray-50 p-2 rounded text-gray-700">{selectedRefund.reason}</div>
            </div>
            {selectedRefund.rejectionReason && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Lý do từ chối</div>
                <div className="bg-red-50 p-2 rounded text-red-600">{selectedRefund.rejectionReason}</div>
              </div>
            )}
            {selectedRefund.transferDetails && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Mã giao dịch</div>
                  <div>{selectedRefund.transferDetails.transactionRef || <span className="text-gray-400">-</span>}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Ghi chú</div>
                  <div>{selectedRefund.transferDetails.note || <span className="text-gray-400">-</span>}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 mb-1">Ảnh xác nhận chuyển khoản</div>
                  {selectedRefund.transferDetails.proofImageUrl ? (
                    <img src={selectedRefund.transferDetails.proofImageUrl} alt="proof" className="w-40 h-32 object-cover rounded border" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserRequestRefundPage;