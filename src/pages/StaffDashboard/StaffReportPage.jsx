import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Space,
  Tooltip,
  Input,
  Select,
  message,
  Typography,
  Descriptions,
  Dropdown,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  FiEye,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiDollarSign,
  FiMoreVertical,
} from "react-icons/fi";
import {
  getReports,
  getReportById,
  updateReport,
} from "../../features/report/reportSlice";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffReportPage = () => {
  const dispatch = useDispatch();
  const { reports, loading, pagination, currentReport } = useSelector(
    (state) => state.report
  );

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  // States for processing
  const [status, setStatus] = useState("");
  const [compensationAmount, setCompensationAmount] = useState(0);
  const [resolveNote, setResolveNote] = useState("");

  useEffect(() => {
    dispatch(getReports({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleViewDetail = (record) => {
    setSelectedReportId(record._id);
    dispatch(getReportById(record._id));
    setDetailModalOpen(true);
  };

  const handleOpenProcess = (record) => {
    setSelectedReportId(record._id);
    setStatus(record.status ? record.status.toLowerCase() : "pending");
    setCompensationAmount(record.compensationAmount || 0);
    setResolveNote(""); // Or existing note
    setProcessModalOpen(true);
  };

  const handleProcessSubmit = async () => {
    if (!status) {
      message.error("Vui lòng chọn trạng thái");
      return;
    }

    try {
      await dispatch(
        updateReport({
            reportId: selectedReportId,
            updateData: {
                status,
                compensationAmount,
                // note: resolveNote // Assuming API supports note
            }
        })
      ).unwrap();
      message.success("Cập nhật báo cáo thành công");
      setProcessModalOpen(false);
      dispatch(getReports());
      if (detailModalOpen) setDetailModalOpen(false);
    } catch (error) {
      message.error(error?.message || "Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: "Mã báo cáo",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id) => <Text copyable={{ text: id }}>#{id.slice(-6).toUpperCase()}</Text>,
    },
    {
      title: "Người tạo",
      dataIndex: "reporterId", 
      key: "reporterId",
      render: (user) => (
        <div className="flex flex-col">
          <Text strong>{user?.email || "Người dùng"}</Text>
          <Text type="secondary" className="text-xs">ID: {user?._id?.slice(-6).toUpperCase()}</Text>
        </div>
      ),
    },
    {
        title: "Đối tượng",
        key: "target",
        render: (_, r) => (
            <div className="flex flex-col">
                <Tag>{r.targetType || "Khác"}</Tag>
                <Text type="secondary" className="text-xs mt-1">
                    #{r.targetId?.slice(-6).toUpperCase()}
                </Text>
            </div>
        )
    },
    {
      title: "Vấn đề",
      dataIndex: "issueType",
      key: "issueType",
      render: (type) => {
         // Map issueType to friendly label if needed
         return <span className="capitalize">{type?.replace('_', ' ')}</span>
      }
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      render: (status) => {
        let color = "default";
        let label = status;
        const s = status?.toLowerCase();
        
        if (s === "pending") { color = "warning"; label="Chờ xử lý"; }
        else if (s === "resolved") { color = "success"; label="Đã giải quyết"; }
        else if (s === "rejected") { color = "error"; label="Đã từ chối"; }
        else if (s === "in_progress") { color = "processing"; label="Đang xử lý"; }
        
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
       title: "Mức ưu tiên",
       dataIndex: "priority",
       key: "priority",
       width: 120,
       align: "center",
       render: (p) => {
           let color = "blue";
           let label = "Thấp";
           const up = p?.toUpperCase();
           if(up === "HIGH") { color = "red"; label = "Cao"; }
           if(up === "MEDIUM") { color = "orange"; label = "Trung bình"; }
           if(up === "LOW") { color = "green"; label = "Thấp"; }
           return <Tag color={color}>{label}</Tag>
       }
    },
    {
      title: "Tác vụ",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 100,
      render: (_, record) => {
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

        if (
          record.status?.toLowerCase() === "pending" ||
          record.status?.toLowerCase() === "in_progress"
        ) {
          items.push({ type: "divider" });
          items.push({
            key: "process",
            label: (
              <div className="flex items-center gap-2 text-[#C5A267] font-medium">
                <FiCheck /> Xử lý
              </div>
            ),
            onClick: () => handleOpenProcess(record),
          });
        }

        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="text-gray-500 hover:text-[#C5A267] transition-colors p-2 rounded-full hover:bg-gray-100">
              <FiMoreVertical size={20} />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý báo cáo</h1>
        <p className="opacity-90">
          Theo dõi và xử lý các báo cáo, khiếu nại từ người dùng
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }} // Improve with server pagination if needed
          scroll={{ x: 1000 }}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        title="Chi tiết báo cáo"
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>,
          (currentReport?.status === "PENDING" || currentReport?.status === "PROCESSING") && (
             <Button key="process" type="primary" onClick={() => {
                 setDetailModalOpen(false);
                 handleOpenProcess(currentReport);
             }}>
                 Xử lý
             </Button>
          )
        ]}
        width={700}
      >
        {currentReport ? (
          <div className="space-y-4 pt-4">
             <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Mã báo cáo">
                    {currentReport._id}
                </Descriptions.Item>
                <Descriptions.Item label="Người tạo">
                    {currentReport.reporterId?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Đối tượng">
                    {currentReport.targetType === "Comment" ? "Bình luận" : 
                     currentReport.targetType === "Booking" ? "Booking" : 
                     currentReport.targetType} (#{currentReport.targetId})
                </Descriptions.Item>
                <Descriptions.Item label="Loại vấn đề">
                    {(() => {
                        const map = {
                            'inappropriate_content': 'Nội dung không phù hợp',
                            'complaint': 'Khiếu nại',
                            'missing_item': 'Mất đồ',
                            'other': 'Khác'
                        };
                        return map[currentReport.issueType] || currentReport.issueType;
                    })()}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                    <div className="whitespace-pre-wrap">{currentReport.description}</div>
                </Descriptions.Item>
                
                <Descriptions.Item label="Mức ưu tiên">
                    {(() => {
                       let color = "blue";
                       let label = "Thấp";
                       const up = currentReport.priority?.toUpperCase();
                       if(up === "HIGH") { color = "red"; label = "Cao"; }
                       if(up === "MEDIUM") { color = "orange"; label = "Trung bình"; }
                       if(up === "LOW") { color = "green"; label = "Thấp"; }
                       return <Tag color={color}>{label}</Tag>
                    })()}
                </Descriptions.Item>
                
                <Descriptions.Item label="Trạng thái">
                    {(() => {
                        let color = "default";
                        let label = currentReport.status;
                        const s = currentReport.status?.toLowerCase();
                        
                        if (s === "pending") { color = "warning"; label="Chờ xử lý"; }
                        else if (s === "resolved") { color = "success"; label="Đã giải quyết"; }
                        else if (s === "rejected") { color = "error"; label="Đã từ chối"; }
                        else if (s === "processing" || s === "in_progress") { color = "processing"; label="Đang xử lý"; }
                        else if (s === "closed") { color = "default"; label="Đã đóng"; }
                        
                        return <Tag color={color}>{label}</Tag>;
                    })()}
                </Descriptions.Item>
                {currentReport.compensationAmount > 0 && (
                    <Descriptions.Item label="Mức đền bù">
                        <span className="text-red-600 font-bold">{currentReport.compensationAmount.toLocaleString()}đ</span>
                    </Descriptions.Item>
                )}
             </Descriptions>
          </div>
        ) : (
            <div className="text-center py-10">Đang tải...</div>
        )}
      </Modal>

      {/* Process Modal */}
      <Modal
        open={processModalOpen}
        onCancel={() => setProcessModalOpen(false)}
        title="Cập nhật trạng thái báo cáo"
        onOk={handleProcessSubmit}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div className="space-y-4 pt-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái xử lý</label>
                 <Select 
                    className="w-full" 
                    value={status} 
                    onChange={setStatus}
                    placeholder="Chọn trạng thái"
                 >
                     <Option value="pending">Chờ xử lý</Option>
                     <Option value="in_progress">Đang xử lý</Option>
                     <Option value="resolved">Đã giải quyết</Option>
                     <Option value="closed">Đóng / Từ chối</Option>
                 </Select>
             </div>

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền đền bù (nếu có)
                    <Tooltip title="Nhập số tiền nếu cần đền bù cho người dùng">
                        <FiAlertCircle className="inline ml-1 text-gray-400" />
                    </Tooltip>
                 </label>
                 <Input 
                    type="number" 
                    prefix={<FiDollarSign />}
                    value={compensationAmount}
                    onChange={(e) => setCompensationAmount(Number(e.target.value))}
                    addonAfter="VND"
                 />
             </div>

             {/* <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú xử lý</label>
                 <TextArea 
                    rows={4} 
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                    placeholder="Nhập ghi chú về hướng giải quyết..."
                 />
             </div> */}
        </div>
      </Modal>
    </div>
  );
};

export default StaffReportPage;