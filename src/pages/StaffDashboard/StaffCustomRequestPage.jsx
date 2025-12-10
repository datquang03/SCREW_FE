// src/pages/Staff/StaffCustomRequestPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Modal,
  Tag,
  Button,
  Table,
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
  convertCustomRequestToSetDesign,
  getConvertedCustomDesigns,
} from "../../features/setDesign/setDesignSlice";
import { createMessage } from "../../features/message/messageSlice";
import StaffPageHeader from "./components/StaffPageHeader";
import StaffStatCard from "./components/StaffStatCard";
import StaffSectionCard from "./components/StaffSectionCard";
import StaffSearchFilterBar from "./components/StaffSearchFilterBar";
import StaffEmptyState from "./components/StaffEmptyState";

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

  const {
    customRequests = [],
    convertedDesigns = [],
    loading: setDesignLoading,
  } = useSelector((state) => state.setDesign || {});
  const { loading: msgLoading } = useSelector((state) => state.message || {});
  const { user } = useSelector((state) => state.auth || {});
  const loading = setDesignLoading || msgLoading;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [convertForm, setConvertForm] = useState({
    name: "Vintage Wedding Set Design",
    price: 8500000,
    category: "Wedding",
    tagsText: "vintage, wedding, pastel, romantic",
  });
  const [sendAfterConvert, setSendAfterConvert] = useState(true);
  const [convertResult, setConvertResult] = useState(null);

  useEffect(() => {
    dispatch(getCustomRequestSetDesign());
    // Try to fetch converted designs, but don't break if API doesn't exist
    dispatch(getConvertedCustomDesigns({ page: 1, limit: 10 }))
      .unwrap()
      .catch((err) => {
        // Silently handle error - API might not be implemented yet
        console.warn("Could not fetch converted designs:", err);
      });
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

  const handleSendMessage = async (overrideContent) => {
    // Lấy userId từ nhiều nguồn khác nhau để đảm bảo có giá trị
    const userId =
      selectedRequest?.customerId?._id ||
      selectedRequest?.customerId?.id ||
      selectedRequest?.customerId;

    if (!userId) {
      showToast("error", "Không tìm thấy ID khách hàng");
      return;
    }

    // Đảm bảo userId là string hợp lệ (24 ký tự hex)
    const userIdStr = String(userId).trim();
    if (!userIdStr || userIdStr.length < 10) {
      showToast("error", "ID khách hàng không hợp lệ");
      console.error("Invalid userId:", userId);
      return;
    }

    try {
      setSendLoading(true);
      const contentToSend = overrideContent?.trim?.() || messageContent.trim();

      if (!contentToSend) {
        showToast("error", "Nội dung tin nhắn không được để trống");
        return;
      }

      // Chỉ gửi toUserId và content, KHÔNG gửi conversationId
      await dispatch(
        createMessage({
          toUserId: userIdStr,
          content: contentToSend,
        })
      ).unwrap();

      showToast("success", "Đã gửi tin nhắn cho khách!");
      setMessageModalOpen(false);
      navigate(`/message?user=${userIdStr}`);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      const errorMsg =
        err?.message || err?.errorCode || "Gửi tin nhắn thất bại";
      showToast("error", errorMsg);
    } finally {
      setSendLoading(false);
    }
  };

  const openMessageModal = () => {
    if (!selectedRequest) return;
    const customerName = selectedRequest.customerName || "bạn";
    const requestCode = selectedRequest._id?.slice(-8).toUpperCase() || "--";
    const template = `Chào ${customerName}!

Mình là staff phụ trách yêu cầu thiết kế tùy chỉnh của bạn (mã #${requestCode}).

Mình đã xem mô tả và hình ảnh tham khảo. Bạn cho mình biết thêm:
- Phong cách mong muốn (vintage/hiện đại/tối giản...).
- Màu chủ đạo bạn thích.
- Ngân sách linh hoạt khoảng bao nhiêu?

Nếu bạn đồng ý, mình sẽ tiến hành tạo Set Design chi tiết ngay.`;
    setMessageContent(template);
    setMessageModalOpen(true);
  };

  const handleConvertSetDesign = async () => {
    if (!selectedRequest) return;
    const tags = convertForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body = {
      name: convertForm.name,
      price: Number(convertForm.price) || 0,
      category: convertForm.category || "Other",
      tags,
    };
    try {
      setConvertLoading(true);
      const convertRes = await dispatch(
        convertCustomRequestToSetDesign({
          requestId: selectedRequest._id,
          setDesignData: body,
        })
      ).unwrap();
      setConvertResult(convertRes);

      // refresh list + detail + converted designs
      dispatch(getCustomRequestSetDesign());
      dispatch(getConvertedCustomDesigns({ page: 1, limit: 10 }))
        .unwrap()
        .catch((err) => {
          console.warn("Could not refresh converted designs:", err);
        });
      const updated = await dispatch(
        getCustomRequestSetDesignById(selectedRequest._id)
      ).unwrap();
      setSelectedRequest(updated.data || updated);

      // Optionally send message after convert (chỉ gửi thông tin Set Design tách riêng)
      if (sendAfterConvert) {
        const customerUserId =
          selectedRequest.customerId?._id ||
          selectedRequest.customerId?.id ||
          selectedRequest.customerId;

        if (customerUserId) {
          const preview = convertRes || body;
          const previewText = `Set Design vừa tạo:
- Tên: ${preview.name}
- Giá: ${preview.price?.toLocaleString("vi-VN")}₫
- Danh mục: ${preview.category}
- Tags: ${Array.isArray(preview.tags) ? preview.tags.join(", ") : ""}`;

          // Chỉ gửi toUserId và content, KHÔNG gửi conversationId
          await dispatch(
            createMessage({
              toUserId: String(customerUserId).trim(),
              content: previewText,
            })
          ).unwrap();
        } else {
          console.warn("Không thể gửi tin nhắn: không tìm thấy customerId");
        }
      }

      showToast("success", "Đã chuyển thành Set Design!");
      setConvertModalOpen(false);
    } catch (err) {
      console.error("Convert error:", err);
      showToast(
        "error",
        err?.message || "Chuyển yêu cầu thành Set Design thất bại"
      );
    } finally {
      setConvertLoading(false);
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

      <StaffPageHeader
        title="Yêu cầu thiết kế tùy chỉnh"
        subtitle="Quản lý và xử lý yêu cầu thiết kế riêng từ khách hàng"
        badge={`${
          customRequests.filter((r) => r.status === "pending").length
        } chờ xử lý`}
        gradient="from-purple-600 via-indigo-500 to-blue-500"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaffStatCard
          icon={FiPackage}
          label="Tổng yêu cầu"
          value={customRequests.length}
          color="purple"
        />
        <StaffStatCard
          icon={FiClock}
          label="Chờ xử lý"
          value={customRequests.filter((r) => r.status === "pending").length}
          color="orange"
        />
        <StaffStatCard
          icon={FiEdit3}
          label="Đang xử lý"
          value={customRequests.filter((r) => r.status === "processing").length}
          color="blue"
        />
        <StaffStatCard
          icon={FiCheckCircle}
          label="Hoàn thành"
          value={customRequests.filter((r) => r.status === "completed").length}
          color="green"
        />
      </div>

      <StaffSearchFilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        selectValue={statusFilter}
        onSelectChange={(v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }}
        selectOptions={[
          { value: "pending", label: "Chờ xử lý" },
          { value: "processing", label: "Đang xử lý" },
          { value: "completed", label: "Hoàn thành" },
          { value: "rejected", label: "Từ chối" },
        ]}
        selectPlaceholder="Lọc theo trạng thái"
      />

      <StaffSectionCard title="Danh sách yêu cầu">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <StaffEmptyState title="Chưa có yêu cầu nào" />
        ) : (
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
        )}
      </StaffSectionCard>

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
        styles={{ body: { padding: 0, background: "transparent" } }}
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
          <div className="bg-gradient-to-br from-white via-purple-50 to-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-2xl detail-content">
            <div className="flex justify-end">
              <button
                className="w-10 h-10 rounded-full bg-white/80 border border-purple-100 shadow hover:shadow-md hover:bg-white transition"
                onClick={() => setDetailModalVisible(false)}
              >
                ✕
              </button>
            </div>
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
                      onClick={openMessageModal}
                    >
                      Soạn tin / Tạo set design
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

      {/* MODAL SOẠN TIN NHẮN */}
      <Modal
        open={messageModalOpen}
        onCancel={() => setMessageModalOpen(false)}
        footer={null}
        width={800}
        centered
        styles={{ body: { padding: 0, background: "transparent" } }}
      >
        <div className="bg-white rounded-3xl border border-purple-100 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">
                Soạn tin nhắn
              </p>
              <h3 className="text-xl font-semibold">
                Gửi khách: {selectedRequest?.customerName || "Khách hàng"}
              </h3>
            </div>
            <Tag color="gold" className="px-3 py-1 rounded-full">
              Tạo Set Design & gửi
            </Tag>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Soạn nội dung */}
            <div className="p-6 space-y-4 bg-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiSend /> Nội dung tin nhắn
              </div>
              <Input.TextArea
                rows={10}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Nhập nội dung cho khách..."
                className="rounded-2xl border-gray-200 focus:border-purple-400 focus:shadow"
              />
              <div className="flex justify-between items-center flex-wrap gap-3">
                <Button
                  icon={<FiPackage />}
                  onClick={() => setConvertModalOpen(true)}
                  className="border-purple-500 text-purple-600"
                >
                  Tạo Set Design
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => setMessageModalOpen(false)}>
                    Đóng
                  </Button>
                  <Button
                    type="primary"
                    icon={<FiSend />}
                    loading={sendLoading}
                    onClick={() => handleSendMessage()}
                    disabled={!messageContent.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 border-none"
                  >
                    Gửi tin nhắn
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Set Design */}
            <div className="p-6 bg-gradient-to-br from-purple-50 via-white to-amber-50 border-l border-purple-100 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiPackage /> Xem trước Set Design (nếu có)
              </div>
              <Card className="border-dashed border-purple-200 bg-white rounded-2xl">
                {(() => {
                  // Tìm set design đã convert từ convertedDesigns
                  // Cấu trúc: { requestId, setDesign: { _id, name, price, category, tags, ... }, ... }
                  let matchedSetDesign = null;

                  if (convertResult) {
                    // Nếu vừa tạo xong, dùng convertResult
                    matchedSetDesign = convertResult;
                  } else if (selectedRequest?._id) {
                    // Tìm trong convertedDesigns theo requestId
                    const matched = convertedDesigns.find(
                      (d) => d.requestId === selectedRequest._id
                    );
                    if (matched?.setDesign) {
                      matchedSetDesign = matched.setDesign;
                    } else if (matched?._id) {
                      // Nếu matched là setDesign trực tiếp (fallback)
                      matchedSetDesign = matched;
                    }
                  }

                  if (!matchedSetDesign) {
                    return (
                      <div className="text-gray-500 text-sm">
                        Chưa có Set Design được tạo. Bấm "Tạo Set Design" để
                        thêm.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <Text type="secondary">Tên: </Text>
                        <Text strong className="text-right">
                          {matchedSetDesign.name || "-"}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text type="secondary">Giá: </Text>
                        <Text strong className="text-right">
                          {matchedSetDesign.price
                            ? `${Number(matchedSetDesign.price).toLocaleString(
                                "vi-VN"
                              )}₫`
                            : "-"}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text type="secondary">Danh mục: </Text>
                        <Tag color="blue">
                          {matchedSetDesign.category || "-"}
                        </Tag>
                      </div>
                      {matchedSetDesign.description && (
                        <div className="flex flex-col gap-1">
                          <Text type="secondary">Mô tả: </Text>
                          <Text className="text-xs text-gray-600 line-clamp-2">
                            {matchedSetDesign.description}
                          </Text>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <Text type="secondary">Tags: </Text>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {(Array.isArray(matchedSetDesign.tags)
                            ? matchedSetDesign.tags
                            : []
                          )
                            .filter(Boolean)
                            .map((t, idx) => (
                              <Tag
                                key={idx}
                                color="purple"
                                className="rounded-full"
                              >
                                {t}
                              </Tag>
                            ))}
                        </div>
                      </div>
                      {matchedSetDesign._id && (
                        <div className="pt-2 border-t border-gray-100">
                          <Text type="secondary" className="text-xs">
                            ID: {matchedSetDesign._id.slice(-8)}
                          </Text>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Card>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL TẠO SET DESIGN */}
      <Modal
        open={convertModalOpen}
        onCancel={() => setConvertModalOpen(false)}
        onOk={handleConvertSetDesign}
        okText="Tạo Set Design"
        confirmLoading={convertLoading}
        width={720}
        centered
        styles={{ body: { padding: 0, background: "transparent" } }}
      >
        <div className="bg-white rounded-3xl border border-amber-100 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-400 to-pink-400 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">
                Tạo Set Design
              </p>
              <h3 className="text-xl font-semibold">Từ yêu cầu khách hàng</h3>
            </div>
            <Tag
              color="gold"
              className="px-3 py-1 rounded-full bg-white/20 border-white/30"
            >
              Xem trước & gửi
            </Tag>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Form nhập */}
            <div className="p-6 space-y-4 bg-white">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Text className="text-xs text-gray-500">Tên Set Design</Text>
                  <Input
                    placeholder="Ví dụ: Vintage Wedding Set Design"
                    value={convertForm.name}
                    onChange={(e) =>
                      setConvertForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <Text className="text-xs text-gray-500">Giá (VND)</Text>
                  <Input
                    placeholder="8500000"
                    type="number"
                    value={convertForm.price}
                    onChange={(e) =>
                      setConvertForm((p) => ({ ...p, price: e.target.value }))
                    }
                    className="rounded-2xl"
                    addonAfter="₫"
                  />
                  <Text className="text-[11px] text-gray-400">
                    Nhập số, không cần dấu chấm. Hệ thống sẽ tự format.
                  </Text>
                </div>
                <div className="space-y-1">
                  <Text className="text-xs text-gray-500">Danh mục</Text>
                  <Input
                    placeholder="VD: Wedding, Studio, Fashion"
                    value={convertForm.category}
                    onChange={(e) =>
                      setConvertForm((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <Text className="text-xs text-gray-500">Tags</Text>
                  <Input.TextArea
                    rows={2}
                    placeholder="vintage, wedding, pastel, romantic"
                    value={convertForm.tagsText}
                    onChange={(e) =>
                      setConvertForm((p) => ({
                        ...p,
                        tagsText: e.target.value,
                      }))
                    }
                    className="rounded-2xl"
                  />
                  <Text className="text-[11px] text-gray-400">
                    Ngăn cách bằng dấu phẩy để tự động tách tag.
                  </Text>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-purple-50 border-l border-amber-100 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiPackage /> Xem trước
              </div>
              <Card className="border-dashed border-amber-200 bg-white rounded-2xl">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <Text type="secondary">Tên</Text>
                    <Text strong>{convertForm.name || "..."}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Giá</Text>
                    <Text strong>
                      {convertForm.price
                        ? `${Number(convertForm.price).toLocaleString(
                            "vi-VN"
                          )}₫`
                        : "..."}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Danh mục</Text>
                    <Text>{convertForm.category || "..."}</Text>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <Text type="secondary">Tags</Text>
                    <div className="flex flex-wrap gap-2">
                      {convertForm.tagsText
                        ? convertForm.tagsText
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .map((t, idx) => (
                              <Tag
                                key={idx}
                                color="purple"
                                className="rounded-full"
                              >
                                {t}
                              </Tag>
                            ))
                        : "..."}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input
                    id="send-after-convert"
                    type="checkbox"
                    checked={sendAfterConvert}
                    onChange={(e) => setSendAfterConvert(e.target.checked)}
                  />
                  <label
                    htmlFor="send-after-convert"
                    className="text-sm text-gray-700"
                  >
                    Gửi luôn tin nhắn hiện tại cho khách sau khi tạo Set Design
                  </label>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffCustomRequestPage;
