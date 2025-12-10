// src/pages/Staff/StaffCustomRequestPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Modal,
  Tag,
  Button,
  Table,
  Badge,
  Avatar,
} from "antd";
import {
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiSearch,
  FiEye,
  FiEdit3,
  FiPackage,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../components/ToastNotification";
import { gsap } from "gsap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  getCustomRequestSetDesign,
  getCustomRequestSetDesignById,
  updateCustomRequestStatus,
} from "../../features/setDesign/setDesignSlice";
import { createMessage } from "../../features/message/messageSlice";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

const statusConfig = {
  pending: { color: "orange", label: "Chờ xử lý", icon: FiClock },
  processing: { color: "blue", label: "Đang xử lý", icon: FiEdit3 },
  completed: { color: "green", label: "Hoàn thành", icon: FiCheckCircle },
  rejected: { color: "red", label: "Từ chối", icon: FiXCircle },
};

const StaffCustomRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customRequests = [], loading: setDesignLoading } = useSelector(
    (state) => state.setDesign || {}
  );
  const { loading: msgLoading } = useSelector((state) => state.message || {});
  const loading = setDesignLoading || msgLoading;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(getCustomRequestSetDesign());
  }, [dispatch]);

  const showToast = (type, msg) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredRequests = useMemo(() => {
    let result = [...customRequests];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(lower) ||
          r.email?.toLowerCase().includes(lower) ||
          r.phoneNumber?.includes(search) ||
          r.description?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [customRequests, search, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredRequests.slice(start, start + 10);
  }, [filteredRequests, currentPage]);

  const handleViewDetail = async (id) => {
    try {
      const result = await dispatch(getCustomRequestSetDesignById(id)).unwrap();
      setSelectedRequest(result);
      setDetailModalVisible(true);
    } catch (err) {
      showToast("error", "Không thể tải chi tiết yêu cầu");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;
    try {
      await dispatch(
        updateCustomRequestStatus({
          requestId: selectedRequest._id,
          status: newStatus,
        })
      ).unwrap();

      dispatch(getCustomRequestSetDesign());
      const updated = await dispatch(
        getCustomRequestSetDesignById(selectedRequest._id)
      ).unwrap();
      setSelectedRequest(updated);

      const msgMap = {
        processing: "đã nhận xử lý",
        rejected: "đã từ chối",
        completed: "đánh dấu hoàn thành",
      };
      showToast("success", `Yêu cầu đã được ${msgMap[newStatus]}!`);
    } catch (err) {
      showToast("error", err?.message || "Cập nhật thất bại");
    }
  };

  // Gửi tin nhắn + chuyển sang trang message và tự động mở đúng người
  const handleSendMessage = async () => {
    if (!selectedRequest?.userId) {
      showToast("error", "Không tìm thấy ID khách hàng");
      return;
    }

    try {
      const greeting = `Chào bạn ${
        selectedRequest.customerName
      }!\nMình là staff phụ trách yêu cầu thiết kế tùy chỉnh (mã #${selectedRequest._id
        .slice(-8)
        .toUpperCase()}).\nMình đã nhận yêu cầu và sẽ hỗ trợ bạn ngay nhé!`;

      await dispatch(
        createMessage({
          toUserId: selectedRequest.userId,
          content: greeting,
        })
      ).unwrap();

      showToast("success", "Đã mở cuộc trò chuyện với khách!");
      setDetailModalVisible(false);
      navigate(`/message?user=${selectedRequest.userId}`);
    } catch (err) {
      showToast("error", err?.message || "Gửi tin nhắn thất bại");
    }
  };

  const getStatusTag = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Tag
        color={config.color}
        className="flex items-center gap-1 text-xs font-medium px-3 py-1"
      >
        <Icon className="text-base" />
        {config.label}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {record.customerName?.charAt(0).toUpperCase() || "C"}
          </Avatar>
          <div>
            <Text strong>{record.customerName || "Khách vãng lai"}</Text>
            <br />
            <Text type="secondary" className="text-xs">
              {dayjs(record.createdAt).fromNow()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          {record.email && (
            <div className="flex items-center gap-2 text-xs">
              <FiMail className="text-gray-400" />
              <Text className="text-gray-600">{record.email}</Text>
            </div>
          )}
          {record.phoneNumber && (
            <div className="flex items-center gap-2 text-xs">
              <FiPhone className="text-gray-400" />
              <Text className="text-gray-600">{record.phoneNumber}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Yêu cầu",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2 }}
          className="text-sm max-w-xs m-0"
        >
          {text || "Không có mô tả"}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<FiEye />}
          onClick={() => handleViewDetail(record._id)}
          className="text-indigo-600 hover:bg-indigo-50"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-100 via-pink-50 to-white px-6 py-8 shadow-xl">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-300 blur-3xl opacity-40" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={2} className="mb-1 text-gray-900">
              Yêu cầu thiết kế tùy chỉnh
            </Title>
            <Text className="text-base text-gray-600">
              Quản lý và xử lý yêu cầu thiết kế riêng từ khách hàng
            </Text>
          </div>
          <Badge
            count={customRequests.filter((r) => r.status === "pending").length}
          >
            <Tag color="orange" className="px-4 py-2 text-sm font-medium">
              Chờ xử lý
            </Tag>
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-white/60 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm uppercase text-gray-500">
                Tổng yêu cầu
              </Text>
              <Title level={3} className="mt-1 !mb-0 text-purple-600">
                {customRequests.length}
              </Title>
            </div>
            <FiPackage className="text-4xl text-purple-200" />
          </div>
        </Card>
        <Card className="rounded-2xl border border-white/60 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm uppercase text-gray-500">Chờ xử lý</Text>
              <Title level={3} className="mt-1 !mb-0 text-orange-600">
                {customRequests.filter((r) => r.status === "pending").length}
              </Title>
            </div>
            <FiClock className="text-4xl text-orange-200" />
          </div>
        </Card>
        <Card className="rounded-2xl border border-white/60 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm uppercase text-gray-500">
                Đang xử lý
              </Text>
              <Title level={3} className="mt-1 !mb-0 text-blue-600">
                {customRequests.filter((r) => r.status === "processing").length}
              </Title>
            </div>
            <FiEdit3 className="text-4xl text-blue-200" />
          </div>
        </Card>
        <Card className="rounded-2xl border border-white/60 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm uppercase text-gray-500">
                Hoàn thành
              </Text>
              <Title level={3} className="mt-1 !mb-0 text-green-600">
                {customRequests.filter((r) => r.status === "completed").length}
              </Title>
            </div>
            <FiCheckCircle className="text-4xl text-green-200" />
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Tìm khách hàng, email, điện thoại..."
          prefix={<FiSearch className="text-gray-400" />}
          allowClear
          className="w-full rounded-2xl border border-gray-200 bg-white/80 shadow-inner sm:w-96"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          className="w-full rounded-2xl sm:w-64"
          value={statusFilter || undefined}
          onChange={(val) => {
            setStatusFilter(val ?? "");
            setCurrentPage(1);
          }}
        >
          <Select.Option value="pending">Chờ xử lý</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="completed">Hoàn thành</Select.Option>
          <Select.Option value="rejected">Từ chối</Select.Option>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="rounded-3xl border border-white/60 bg-white shadow-xl overflow-hidden">
          <Table
            columns={columns}
            dataSource={paginatedData.map((r) => ({ key: r._id, ...r }))}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: filteredRequests.length,
              showSizeChanger: false,
            }}
            onChange={(p) => setCurrentPage(p.current)}
            scroll={{ x: "max-content" }}
          />
        </Card>
      )}

      {/* MODAL CHI TIẾT */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
        centered
        maskClosable={false}
        closeIcon={null}
        className="custom-request-detail-modal"
        afterOpenChange={(open) => {
          if (open) {
            gsap.fromTo(
              ".detail-content",
              { y: -60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power4.out",
                stagger: 0.1,
              }
            );
          }
        }}
      >
        {selectedRequest && (
          <div className="detail-content">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-1 shadow-2xl">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600">
                    {selectedRequest.customerName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  MỚI
                </div>
              </div>

              <Title level={2} className="mt-4 !mb-1 text-gray-800">
                {selectedRequest.customerName}
              </Title>
              <Text type="secondary" className="text-lg">
                Yêu cầu thiết kế #{selectedRequest._id.slice(-8).toUpperCase()}
              </Text>
              <div className="mt-3">{getStatusTag(selectedRequest.status)}</div>
            </div>

            {/* Grid thông tin */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
              {/* Cột 1 */}
              <Card className="rounded-2xl border-purple-100 bg-gradient-to-br from-purple-50 to-white shadow-md">
                <Title
                  level={5}
                  className="mb-4 flex items-center gap-2 text-purple-700"
                >
                  <FiUser /> Thông tin khách hàng
                </Title>
                <div className="space-y-4">
                  <div>
                    <Text type="secondary" className="text-xs">
                      Họ tên
                    </Text>
                    <Text strong className="block">
                      {selectedRequest.customerName}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Email
                    </Text>
                    <Text strong className="flex items-center gap-2">
                      <FiMail className="text-purple-500" />
                      {selectedRequest.email}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Số điện thoại
                    </Text>
                    <Text strong className="flex items-center gap-2">
                      <FiPhone className="text-purple-500" />
                      {selectedRequest.phoneNumber}
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Cột 2 */}
              <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-md">
                <Title
                  level={5}
                  className="mb-4 flex items-center gap-2 text-indigo-700"
                >
                  <FiClock /> Thời gian & AI
                </Title>
                <div className="space-y-4">
                  <div>
                    <Text type="secondary" className="text-xs">
                      Thời gian gửi
                    </Text>
                    <Text strong className="block">
                      {dayjs(selectedRequest.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                    <Text type="success" className="text-sm">
                      {dayjs(selectedRequest.createdAt).fromNow()}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Mô hình AI
                    </Text>
                    <Tag color="purple" className="mt-1">
                      {selectedRequest.aiModel || "gemini-1.5-flash"}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Số lần thử
                    </Text>
                    <Text strong>
                      {selectedRequest.aiGenerationAttempts || 0} lần
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Cột 3 */}
              <Card className="rounded-2xl border-green-100 bg-gradient-to-br from-emerald-50 to-white shadow-md">
                <Title
                  level={5}
                  className="mb-4 flex items-center gap-2 text-emerald-700"
                >
                  <FiPackage /> Tình trạng xử lý
                </Title>
                {selectedRequest.processedBy ? (
                  <>
                    <div>
                      <Text type="secondary" className="text-xs">
                        Đang xử lý bởi
                      </Text>
                      <Text strong className="block text-emerald-600">
                        {selectedRequest.processedBy.email}
                      </Text>
                    </div>
                    {selectedRequest.staffNotes && (
                      <div>
                        <Text type="secondary" className="text-xs">
                          Ghi chú
                        </Text>
                        <Text italic className="block text-gray-700">
                          "{selectedRequest.staffNotes}"
                        </Text>
                      </div>
                    )}
                  </>
                ) : (
                  <Text type="warning" strong>
                    Chưa có nhân viên xử lý
                  </Text>
                )}

                {selectedRequest.convertedToDesignId ? (
                  <div className="mt-4 rounded-lg bg-green-100 p-3 text-center">
                    <FiCheckCircle className="mx-auto text-2xl text-green-600 mb-2" />
                    <Text strong className="block text-green-700">
                      ĐÃ CHUYỂN THÀNH SẢN PHẨM
                    </Text>
                    <Tag color="success" className="mt-2">
                      {selectedRequest.convertedToDesignId.name}
                    </Tag>
                  </div>
                ) : (
                  <Text type="secondary">Chưa chuyển thành thiết kế</Text>
                )}
              </Card>
            </div>

            {/* Mô tả yêu cầu */}
            <Card
              title={
                <span className="flex items-center gap-3 text-lg font-semibold">
                  <FiMessageSquare className="text-purple-600" />
                  Mô tả yêu cầu từ khách
                </span>
              }
              className="mb-6 rounded-2xl border-purple-200 bg-purple-50/50"
            >
              <Typography.Paragraph className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                {selectedRequest.description || "Không có nội dung mô tả"}
              </Typography.Paragraph>
            </Card>

            {/* Hình ảnh tham khảo */}
            {selectedRequest.referenceImages &&
              selectedRequest.referenceImages.length > 0 && (
                <Card
                  title={
                    <span className="flex items-center gap-2">
                      <FiImage /> Hình ảnh tham khảo (
                      {selectedRequest.referenceImages.length})
                    </span>
                  }
                  className="mb-6"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {selectedRequest.referenceImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Tham khảo ${idx + 1}`}
                        className="rounded-lg border-2 border-dashed border-purple-200 object-cover w-full h-32 hover:border-purple-400 transition-all"
                      />
                    ))}
                  </div>
                </Card>
              )}

            {/* Hình ảnh AI tạo */}
            {selectedRequest.generatedImage && (
              <Card title="Kết quả AI đã tạo" className="mb-6">
                <img
                  src={selectedRequest.generatedImage}
                  alt="AI Generated"
                  className="rounded-xl shadow-lg max-w-full mx-auto"
                />
              </Card>
            )}

            {/* Ngân sách */}
            {(selectedRequest.budgetRange?.min ||
              selectedRequest.budgetRange?.max) && (
              <Card className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <Title
                  level={5}
                  className="flex items-center gap-2 text-amber-700"
                >
                  <FiDollarSign /> Ngân sách mong muốn
                </Title>
                <Text strong className="text-xl">
                  {selectedRequest.budgetRange.min
                    ? `${selectedRequest.budgetRange.min.toLocaleString(
                        "vi-VN"
                      )}₫`
                    : "Không giới hạn"}{" "}
                  →{" "}
                  {selectedRequest.budgetRange.max
                    ? `${selectedRequest.budgetRange.max.toLocaleString(
                        "vi-VN"
                      )}₫`
                    : "Không giới hạn"}
                </Text>
              </Card>
            )}

            {/* FOOTER - NÚT HÀNH ĐỘNG */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t-2 border-gray-100 gap-4">
              <Text type="secondary" className="text-sm">
                Tạo lúc:{" "}
                {dayjs(selectedRequest.createdAt).format(
                  "HH:mm, ngày DD/MM/YYYY"
                )}
              </Text>

              <div className="flex flex-wrap justify-end gap-3">
                {/* PENDING */}
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      size="large"
                      danger
                      icon={<FiXCircle />}
                      loading={loading}
                      onClick={() => handleStatusChange("rejected")}
                    >
                      Từ chối
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      icon={<FiCheckCircle />}
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                      loading={loading}
                      onClick={() => handleStatusChange("processing")}
                    >
                      Nhận xử lý
                    </Button>
                  </>
                )}

                {/* PROCESSING */}
                {selectedRequest.status === "processing" && (
                  <>
                    <Button
                      size="large"
                      icon={<FiMessageSquare />}
                      type="default"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={handleSendMessage}
                    >
                      Gửi tin nhắn
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      icon={<FiCheckCircle />}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      loading={loading}
                      onClick={() => handleStatusChange("completed")}
                    >
                      Hoàn thành
                    </Button>
                  </>
                )}

                {/* COMPLETED / REJECTED */}
                {["completed", "rejected"].includes(selectedRequest.status) && (
                  <Button
                    size="large"
                    onClick={() => setDetailModalVisible(false)}
                  >
                    Đóng
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffCustomRequestPage;
