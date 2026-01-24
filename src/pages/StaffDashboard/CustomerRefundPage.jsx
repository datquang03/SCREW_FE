import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Modal,
  Tag,
  message,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Descriptions,
  Dropdown,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  FiCheck,
  FiX,
  FiFileText,
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";
import {
  approveCustomerRefund,
  rejectCustomerRefund,
  confirmRefundPayment,
} from "../../features/payment/paymentSlice";
import { getAllRefunds } from "../../features/booking/bookingSlice";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CustomerRefundPage = () => {
  const dispatch = useDispatch();
  const { refunds, loading } = useSelector((state) => state.booking);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(getAllRefunds(filterStatus ? { status: filterStatus } : {}));
  }, [dispatch, filterStatus]);

  const handleViewDetail = (refund) => {
    setSelectedRefund(refund);
    setDetailModalOpen(true);
  };

  const handleApprove = async (refund) => {
    Modal.confirm({
      title: "Duyệt yêu cầu hoàn tiền",
      content: (
        <div>
          <p>Bạn có chắc muốn duyệt yêu cầu hoàn tiền cho đơn này?</p>
          <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-200 text-sm">
            <p className="font-semibold">Chi tiết hoàn tiền:</p>
            <p>Ngân hàng: {refund.destinationBank?.bankName}</p>
            <p>Số tài khoản: {refund.destinationBank?.accountNumber}</p>
            <p>Chủ tài khoản: {refund.destinationBank?.accountName}</p>
            <p>Số tiền: {refund.amount?.toLocaleString()}đ</p>
          </div>
        </div>
      ),
      okText: "Duyệt ngay",
      cancelText: "Hủy",
      okButtonProps: { className: "bg-green-600 hover:bg-green-700" },
      onOk: async () => {
        setProcessingId(refund._id);
        try {
          await dispatch(approveCustomerRefund(refund._id)).unwrap();
          message.success("Đã duyệt yêu cầu hoàn tiền thành công!");
          dispatch(getAllRefunds()); // Refresh list
        } catch (error) {
          message.error(error.message || "Có lỗi xảy ra");
        } finally {
          setProcessingId(null);
        }
      },
    });
  };

  const handleRejectClick = (refund) => {
    setSelectedRefund(refund);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setProcessingId(selectedRefund._id);
    try {
      await dispatch(
        rejectCustomerRefund({ refundId: selectedRefund._id, reason: rejectReason })
      ).unwrap();
      message.success("Đã từ chối yêu cầu hoàn tiền!");
      setRejectModalOpen(false);
      dispatch(getAllRefunds()); // Refresh list
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra");
    } finally {
      setProcessingId(null);
    }
  };

  const getDropdownMenu = (record) => {
    const items = [
      {
        key: "view",
        label: (
          <div className="flex items-center gap-2">
            <FiEye className="text-gray-500" /> Xem chi tiết
          </div>
        ),
        onClick: () => handleViewDetail(record),
      },
    ];

    if (record.status === "PENDING_APPROVAL") {
      items.push({ type: "divider" });
      items.push({
        key: "approve",
        label: (
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <FiCheck /> Duyệt hoàn tiền
          </div>
        ),
        onClick: () => handleApprove(record),
      });
      items.push({
        key: "reject",
        label: (
          <div className="flex items-center gap-2 text-red-600 font-medium">
            <FiX /> Từ chối hoàn tiền
          </div>
        ),
        onClick: () => handleRejectClick(record),
      });
    }

    return { items };
  };

  const columns = [
    {
      title: "Mã đơn",
      width: 140,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Space size={4}>
            <span className="text-xs text-gray-400">Refund:</span>
            <Text code className="!text-xs">
              #{record._id?.slice(-6).toUpperCase()}
            </Text>
          </Space>
          {record.bookingId && (
            <Space size={4}>
              <span className="text-xs text-gray-400">Booking:</span>
              <Text code className="!text-xs">
                #{record.bookingId?._id?.slice(-6).toUpperCase()}
              </Text>
            </Space>
          )}
        </div>
      ),
    },
    {
      title: "Người yêu cầu",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={record.requestedBy?.avatar}
            icon={<FiCreditCard />}
            size="small"
            className="flex-shrink-0 bg-gray-200"
          />
          <div className="overflow-hidden">
            <Text
              strong
              className="truncate block text-sm"
              title={record.requestedBy?.fullName}
            >
              {record.requestedBy?.fullName || "Không có người dùng"}
            </Text>
            <Text
              type="secondary"
              className="text-[11px] truncate block"
              title={record.requestedBy?.email}
            >
              {record.requestedBy?.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin hoàn tiền",
      minWidth: 200,
      render: (_, record) => {
        const bank = record.destinationBank;
        if (!bank)
          return (
            <span className="text-gray-400 italic text-xs">
              Không có dữ liệu
            </span>
          );

        return (
          <div className="flex flex-col text-sm">
            <div className="font-semibold text-gray-700">{bank.bankName}</div>
            <div className="font-mono text-emerald-600 text-xs">
              {bank.accountNumber}
            </div>
            <div className="text-xs text-gray-500 uppercase">
              {bank.accountName}
            </div>
            {record.reason && (
              <Tooltip title={record.reason}>
                <div className="mt-1 text-xs text-[#C5A267] truncate max-w-[200px] bg-[#FCFBFA] px-1 inline-block">
                  Lý do: {record.reason}
                </div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      width: 120,
      align: "right",
      render: (amount) => (
        <span className="font-bold text-emerald-600">
          {amount?.toLocaleString()}đ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) => {
        let color = "processing";
        let label = "Chờ xử lý";

        switch (status) {
          case "APPROVED":
            color = "success";
            label = "Đã duyệt";
            break;
          case "REJECTED":
            color = "error";
            label = "Đã từ chối";
            break;
          case "PENDING_APPROVAL":
            color = "warning";
            label = "Chờ duyệt";
            break;
          default:
            label = status;
        }

        return (
          <Tag color={color} className="m-0 border-0 font-medium">
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Tác vụ",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Dropdown menu={getDropdownMenu(record)} trigger={['click']} placement="bottomRight">
           <button className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiMoreVertical size={20} />
          </button>
        </Dropdown>
      ),
    },
  ];

  // Lọc dữ liệu theo trạng thái
  const filteredRefunds = (refunds?.refunds || []).filter(r => {
    if (!filterStatus) return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý hoàn tiền</h1>
        <p className="opacity-90">
          Xử lý các yêu cầu hoàn tiền từ khách hàng
        </p>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="flex items-center gap-4 mb-4">
        <span className="font-bold text-sm">Lọc trạng thái:</span>
        <Select
          value={filterStatus}
          style={{ width: 180 }}
          onChange={setFilterStatus}
          options={[
            { value: "", label: "Tất cả" },
            { value: "PENDING_APPROVAL", label: "Chờ duyệt" },
            { value: "APPROVED", label: "Đã duyệt" },
            { value: "REJECTED", label: "Đã từ chối" },
          ]}
        />
      </div>

      {/* Table */}
      <DataTable
        title="Danh sách yêu cầu hoàn tiền"
        columns={columns}
        data={filteredRefunds}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 1200 }}
      />

      {/* Modal từ chối */}
      <Modal
        title={
          <Space>
            <FiAlertCircle className="text-red-500 text-xl" />
            <span>Từ chối hoàn tiền</span>
          </Space>
        }
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleConfirmReject}
        okText="Xác nhận từ chối"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true, loading: processingId === selectedRefund?._id }}
      >
        <p className="mb-3 text-gray-600">
          Vui lòng nhập lý do từ chối hoàn tiền cho đơn hàng{" "}
          <Text strong>
             #{selectedRefund?._id?.slice(-6).toUpperCase()}
          </Text>
          :
        </p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Ví dụ: Thông tin tài khoản sai, hoặc không đủ điều kiện hoàn tiền..."
          className="rounded-lg"
        />
      </Modal>

      {/* Modal Chi tiết */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={600}
        title="Chi tiết yêu cầu hoàn tiền"
        centered
      >
        {selectedRefund && (
          <div className="space-y-6 pt-2">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Mã yêu cầu">
                  <Text copyable strong>
                    {selectedRefund._id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Mã Booking">
                  <Text copyable>
                    {selectedRefund.bookingId?._id || "N/A"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {dayjs(selectedRefund.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền yêu cầu">
                  <span className="text-lg font-bold text-emerald-600">
                    {selectedRefund.amount?.toLocaleString()}đ
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={
                      selectedRefund.status === "APPROVED"
                        ? "success"
                        : selectedRefund.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                  >
                    {selectedRefund.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold border-b pb-2">
                  <FiCreditCard /> Thông tin thụ hưởng
               </div>
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                     <span className="text-gray-500">Ngân hàng:</span>
                     <span className="font-medium">{selectedRefund.destinationBank?.bankName}</span>
                  </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Số tài khoản:</span>
                     <span className="font-mono bg-gray-100 px-2 rounded text-emerald-700 font-bold">
                        {selectedRefund.destinationBank?.accountNumber}
                     </span>
                  </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Chủ tài khoản:</span>
                     <span className="font-medium uppercase">{selectedRefund.destinationBank?.accountName}</span>
                  </div>
               </div>
            </div>
            
            {(selectedRefund.reason || selectedRefund.rejectReason) && (
               <div className="bg-[#FCFBFA] p-4 border border-slate-200 text-sm">
                  {selectedRefund.reason && (
                    <div className="mb-2">
                       <span className="font-semibold text-[#0F172A] block">Lý do yêu cầu:</span>
                       <span className="text-gray-700">{selectedRefund.reason}</span>
                    </div>
                  )}
                  {selectedRefund.rejectReason && (
                     <div className="mt-2 pt-2 border-t border-slate-200">
                        <span className="font-semibold text-red-800 block">Lý do từ chối:</span>
                        <span className="text-red-700">{selectedRefund.rejectReason}</span>
                     </div>
                  )}
               </div>
            )}

            <div className="flex justify-end pt-2">
                <Button onClick={() => setDetailModalOpen(false)}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerRefundPage;
