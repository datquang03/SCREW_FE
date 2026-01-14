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
} from "react-icons/fi";
import {
  getCustomerRefunds,
  approveCustomerRefund,
  rejectCustomerRefund,
  confirmRefundPayment,
} from "../../features/payment/paymentSlice";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CustomerRefundPage = () => {
  const dispatch = useDispatch();
  const { refundsList, loading } = useSelector((state) => state.payment);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(getCustomerRefunds());
  }, [dispatch]);

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
          dispatch(getCustomerRefunds()); // Refresh list
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
      dispatch(getCustomerRefunds()); // Refresh list
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra");
    } finally {
      setProcessingId(null);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      width: 140,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Space size={4}>
            <span className="text-xs text-gray-400">Refund:</span>
            <Text code className="!text-xs">#{record._id?.slice(-6)}</Text>
          </Space>
          <Space size={4}>
            <span className="text-xs text-gray-400">Booking:</span>
            <Text code className="!text-xs">#{record.bookingId?._id?.slice(-6) || "--"}</Text>
          </Space>
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
            <Text strong className="truncate block text-sm" title={record.requestedBy?.fullName}>
              {record.requestedBy?.fullName || "N/A"}
            </Text>
            <Text type="secondary" className="text-[11px] truncate block" title={record.requestedBy?.email}>
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
        if (!bank) return <span className="text-gray-400 italic text-xs">Không có dữ liệu</span>;
        
        return (
          <div className="flex flex-col text-sm">
             <div className="font-semibold text-gray-700">{bank.bankName}</div>
             <div className="font-mono text-emerald-600 text-xs">{bank.accountNumber}</div>
             <div className="text-xs text-gray-500 uppercase">{bank.accountName}</div>
             {record.reason && (
               <Tooltip title={record.reason}>
                 <div className="mt-1 text-xs text-amber-600 truncate max-w-[200px] bg-amber-50 px-1 rounded inline-block">
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
        
        switch(status) {
            case 'APPROVED': color = 'success'; label = "Đã duyệt"; break;
            case 'REJECTED': color = 'error'; label = "Đã từ chối"; break;
            case 'PENDING_APPROVAL': color = 'warning'; label = "Chờ duyệt"; break;
            default: label = status;
        }
        
        return <Tag color={color} className="m-0 border-0">{label}</Tag>;
      },
    },
    {
      title: "Tác vụ",
      width: 100,
      align: "right",
      fixed: 'right', 
      render: (_, record) => {
        if (record.status === "PENDING_APPROVAL") {
           return (
             <Space size={8}>
                <Tooltip title="Duyệt hoàn tiền">
                  <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<FiCheck />} 
                    size="small"
                    className="bg-emerald-500 hover:bg-emerald-600 border-none"
                    loading={processingId === record._id}
                    onClick={() => handleApprove(record)}
                  />
                </Tooltip>
                <Tooltip title="Từ chối hoàn tiền">
                  <Button 
                    danger 
                    shape="circle" 
                    icon={<FiX />} 
                    size="small"
                    disabled={processingId === record._id}
                    onClick={() => handleRejectClick(record)}
                  />
                </Tooltip>
             </Space>
           )
        }
        return (
            <span className="text-xs text-gray-400 italic">Đã xử lý</span>
        );
      },
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full max-w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={3} className="!mb-0 text-gray-800">
            Yêu cầu hoàn tiền
          </Title>
          <Text type="secondary" className="text-sm">
            Danh sách yêu cầu chờ xử lý
          </Text>
        </div>
        <div className="flex items-center gap-3">
            <Button icon={<FiAlertCircle />} onClick={() => dispatch(getCustomerRefunds())}>Làm mới</Button>
            <Card size="small" className="shadow-none border border-gray-100 bg-white" styles={{ body: { padding: '8px 16px' } }}>
              <Space>
                <span className="text-xs text-gray-500 uppercase font-bold">Tổng số:</span>
                <span className="text-lg font-bold text-gray-800">{refundsList?.length || 0}</span>
              </Space>
            </Card>
        </div>
      </div>

      <Card
        className="shadow-sm border-gray-200 overflow-hidden rounded-lg"
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={Array.isArray(refundsList) ? refundsList : []}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Không có dữ liệu hoàn tiền" }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

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
          <Text strong>#{selectedRefund?._id.slice(-6)}</Text>:
        </p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Ví dụ: Thông tin tài khoản sai, hoặc không đủ điều kiện hoàn tiền..."
        />
      </Modal>
    </div>
  );
};

export default CustomerRefundPage;
