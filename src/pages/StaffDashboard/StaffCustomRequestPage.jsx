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
  FiSend,
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

  const showToast = (type, content) => {
    setToast({ type, message: content });
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
      setSelectedRequest(result.data || result); // Đảm bảo lấy đúng data
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

      // Cập nhật lại danh sách + chi tiết
      dispatch(getCustomRequestSetDesign());
      const updated = await dispatch(
        getCustomRequestSetDesignById(selectedRequest._id)
      ).unwrap();
      setSelectedRequest(updated.data || updated);

      const msgMap = {
        processing: "nhận xử lý",
        rejected: "từ chối",
        completed: "đánh dấu hoàn thành",
      };
      showToast("success", `Yêu cầu đã được ${msgMap[newStatus]}!`);
    } catch (err) {
      showToast("error", err?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleSendMessage = async () => {
    const userId = selectedRequest?.customerId?._id;
    if (!userId) {
      showToast("error", "Không tìm thấy ID khách hàng");
      return;
    }

    // 1. Tự động nhận xử lý nếu đang pending
    if (selectedRequest.status === "pending") {
      try {
        await dispatch(
          updateCustomRequestStatus({
            requestId: selectedRequest._id,
            status: "processing",
          })
        ).unwrap();

        const updated = await dispatch(
          getCustomRequestSetDesignById(selectedRequest._id)
        ).unwrap();
        setSelectedRequest(updated.data || updated);
      } catch (err) {
        console.warn("Không thể tự động nhận xử lý:", err);
      }
    }

    // 2. Tạo tin nhắn cực đẹp + gợi ý Set Design
    const customerName = selectedRequest.customerName || "bạn";
    const requestCode = selectedRequest._id.slice(-8).toUpperCase();

    const message = `Chào ${customerName}!

Mình là staff phụ trách yêu cầu thiết kế tùy chỉnh của bạn (mã #${requestCode}).

Cảm ơn bạn đã gửi yêu cầu chi tiết! Mình đã xem qua mô tả và hình ảnh tham khảo rồi ạ. Dưới đây là gợi ý Set Design mà mình nghĩ sẽ **rất hợp với ý tưởng của bạn**:

**Gợi ý Set Design:**
• Tên: "${customerName}'s Dream Set"  
• Phong cách: Hiện đại / Vintage / Tối giản (tùy theo mô tả)  
• Màu chủ đạo: Pastel / Trầm ấm / Tươi sáng  
• Giá dự kiến: 6.500.000đ - 9.800.000đ  
• Thời gian hoàn thiện: 5-7 ngày

Bạn thấy concept này thế nào ạ? Nếu muốn chỉnh sửa gì (màu sắc, chi tiết, ngân sách...) thì cứ nói mình nhé! Mình sẽ làm đúng ý bạn 100% luôn!

Hoặc nếu bạn muốn mình tạo luôn bản thiết kế chi tiết (có hình ảnh 3D), mình sẽ bắt tay vào làm ngay hôm nay!

Bạn chọn nha:
1. Đồng ý tạo Set Design theo gợi ý
2. Muốn thay đổi thêm chi tiết
3. Cần báo giá chính xác hơn

Mình chờ phản hồi của bạn nha! 

Cảm ơn bạn đã tin tưởng shop!`;

    try {
      await dispatch(
        createMessage({
          toUserId: userId,
          content: message.trim(),
        })
      ).unwrap();

      showToast(
        "success",
        `Đã gửi tin nhắn gợi ý Set Design cho ${customerName}!`
      );
      setDetailModalVisible(false);

      // Nhảy thẳng vào chat với khách
      navigate(`/message/${userId}`);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
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
          <Avatar
            src={record.customerId?.avatar}
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
          >
            {record.customerName?.charAt(0).toUpperCase() || "K"}
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
        <Paragraph ellipsis={{ rows: 2 }} className="text-sm max-w-xs m-0">
          {text || "Không có mô tả"}
        </Paragraph>
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
          onClick={() => handleViewDetail(record._id || record.id)}
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
        {[
          {
            label: "Tổng yêu cầu",
            value: customRequests.length,
            icon: FiPackage,
            color: "purple",
          },
          {
            label: "Chờ xử lý",
            value: customRequests.filter((r) => r.status === "pending").length,
            icon: FiClock,
            color: "orange",
          },
          {
            label: "Đang xử lý",
            value: customRequests.filter((r) => r.status === "processing")
              .length,
            icon: FiEdit3,
            color: "blue",
          },
          {
            label: "Hoàn thành",
            value: customRequests.filter((r) => r.status === "completed")
              .length,
            icon: FiCheckCircle,
            color: "green",
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="rounded-2xl border border-white/60 bg-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-sm uppercase text-gray-500">
                  {item.label}
                </Text>
                <Title
                  level={3}
                  className={`mt-1 !mb-0 text-${item.color}-600`}
                >
                  {item.value}
                </Title>
              </div>
              <item.icon className={`text-4xl text-${item.color}-200`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Tìm khách hàng, email, sđt, mô tả..."
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
            dataSource={paginatedData.map((r) => ({
              key: r._id || r.id,
              ...r,
            }))}
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

      {/* MODAL CHI TIẾT - ĐÃ FIX USERID + TỐI ƯU */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1100}
        centered
        maskClosable={false}
        closeIcon={null}
        className="custom-request-detail-modal"
        afterOpenChange={(open) => {
          if (open) {
            gsap.fromTo(
              ".detail-content > *",
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.08,
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
                <Avatar
                  size={100}
                  src={selectedRequest.customerId?.avatar}
                  className="border-4 border-white shadow-2xl"
                >
                  {selectedRequest.customerName?.charAt(0).toUpperCase()}
                </Avatar>
                {selectedRequest.status === "pending" && (
                  <div className="absolute -top-1 -right-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                    MỚI
                  </div>
                )}
              </div>

              <Title level={2} className="mt-6 !mb-1">
                {selectedRequest.customerName}
              </Title>
              <Text type="secondary" className="text-lg">
                #{selectedRequest._id.slice(-8).toUpperCase()}
              </Text>
              <div className="mt-4">{getStatusTag(selectedRequest.status)}</div>
            </div>

            {/* 3 Cột thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Thông tin khách */}
              <Card className="rounded-2xl shadow-md border-purple-0 bg-gradient-to-br from-purple-50 to-white">
                <Title
                  level={5}
                  className="flex items-center gap-2 text-purple-700 mb-4"
                >
                  <FiUser /> Khách hàng
                </Title>
                <div className="space-y-3 text-sm">
                  <div>
                    <Text strong>{selectedRequest.customerName}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-purple-500" />{" "}
                    {selectedRequest.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-purple-500" />{" "}
                    {selectedRequest.phoneNumber || "Chưa cung cấp"}
                  </div>
                </div>
              </Card>

              {/* Thời gian & AI */}
              <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-blue-50 to-white">
                <Title
                  level={5}
                  className="flex items-center gap-2 text-blue-700 mb-4"
                >
                  <FiClock /> Thời gian & AI
                </Title>
                <div className="space-y-3 text-sm">
                  <div>
                    <Text type="secondary">Gửi lúc</Text>
                    <br />
                    <Text strong>
                      {dayjs(selectedRequest.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                    <Text type="success" className="block text-xs">
                      ({dayjs(selectedRequest.createdAt).fromNow()})
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">AI Model:</Text>{" "}
                    <Tag color="purple">
                      {selectedRequest.aiModel || "Gemini Flash"}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary">Số lần thử:</Text>{" "}
                    <Text strong>
                      {selectedRequest.aiGenerationAttempts || 0}
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Xử lý */}
              <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-emerald-50 to-white">
                <Title
                  level={5}
                  className="flex items-center gap-2 text-emerald-700 mb-4"
                >
                  <FiPackage /> Tình trạng
                </Title>
                {selectedRequest.processedBy ? (
                  <Text strong className="text-emerald-600">
                    {selectedRequest.processedBy.email}
                  </Text>
                ) : (
                  <Text type="warning">Chưa có staff nhận</Text>
                )}
                {selectedRequest.convertedToDesignId && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                    <FiCheckCircle className="text-2xl text-green-600 mx-auto mb-1" />
                    <Text strong className="text-green-700 block">
                      ĐÃ CHUYỂN THÀNH SẢN PHẨM
                    </Text>
                  </div>
                )}
              </Card>
            </div>

            {/* Mô tả */}
            <Card
              title={
                <span className="flex items-center gap-2 text-lg">
                  <FiMessageSquare className="text-purple-600" /> Mô tả yêu cầu
                </span>
              }
              className="mb-6 rounded-2xl"
            >
              <Paragraph className="text-base whitespace-pre-wrap">
                {selectedRequest.description || "Không có nội dung mô tả"}
              </Paragraph>
            </Card>

            {/* Hình ảnh tham khảo */}
            {selectedRequest.referenceImages?.length > 0 && (
              <Card
                title={
                  <span>
                    <FiImage /> Hình ảnh tham khảo (
                    {selectedRequest.referenceImages.length})
                  </span>
                }
                className="mb-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedRequest.referenceImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Ref ${i + 1}`}
                      className="rounded-lg object-cover w-full h-40 border-2 border-dashed border-purple-300 hover:border-purple-500 transition"
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Hình AI sinh ra */}
            {selectedRequest.generatedImage && (
              <Card title="Kết quả AI tạo" className="mb-6">
                <div className="text-center">
                  <img
                    src={selectedRequest.generatedImage}
                    alt="AI Generated"
                    className="rounded-xl shadow-2xl max-w-full mx-auto max-h-96"
                  />
                </div>
              </Card>
            )}

            {/* Ngân sách */}
            {(selectedRequest.budgetRange?.min ||
              selectedRequest.budgetRange?.max) && (
              <Card className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
                <Title
                  level={5}
                  className="flex items-center gap-2 text-amber-700"
                >
                  <FiDollarSign /> Ngân sách mong muốn
                </Title>
                <Text className="text-2xl font-bold text-amber-800">
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

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t-2 border-gray-100 gap-4">
              <Text type="secondary">
                Tạo lúc:{" "}
                {dayjs(selectedRequest.createdAt).format("HH:mm - DD/MM/YYYY")}
              </Text>

              <div className="flex flex-wrap gap-3">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      size="large"
                      danger
                      icon={<FiXCircle />}
                      onClick={() => handleStatusChange("rejected")}
                      loading={loading}
                    >
                      Từ chối
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      icon={<FiCheckCircle />}
                      className="bg-blue-600"
                      onClick={() => handleStatusChange("processing")}
                      loading={loading}
                    >
                      Nhận xử lý
                    </Button>
                  </>
                )}

                {selectedRequest.status === "processing" && (
                  <>
                    <Button
                      size="large"
                      type="default"
                      icon={<FiSend />}
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={handleSendMessage}
                    >
                      Gửi tin nhắn cho khách
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      icon={<FiCheckCircle />}
                      className="bg-emerald-600"
                      onClick={() => handleStatusChange("completed")}
                      loading={loading}
                    >
                      Hoàn thành
                    </Button>
                  </>
                )}

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
