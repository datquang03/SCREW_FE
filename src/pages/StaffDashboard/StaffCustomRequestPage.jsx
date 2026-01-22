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
  Select,
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
  FiTrash2,
  FiEdit,
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
  updateConvertedCustomDesign,
  deleteSetDesign,
} from "../../features/setDesign/setDesignSlice";
import { createMessage } from "../../features/message/messageSlice";
import { getCustomerById } from "../../features/admin/admin.customerSlice";
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

const DEFAULT_AVATAR = "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fveM07aaKSJN96ZUggs.jpg";

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
    name: "Custom Vintage Portrait Set",
    price: 4800000,
    category: "Portrait",
    tagsText: "custom, vintage, portrait",
    additionalImages: [], // base64 strings to send
    additionalPreview: [], // data URLs for preview
  });
  const [sendAfterConvert, setSendAfterConvert] = useState(true);
  const [convertResult, setConvertResult] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updatingDesign, setUpdatingDesign] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: "",
    category: "",
    tagsText: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedSetDesignForMessage, setSelectedSetDesignForMessage] =
    useState(null);
  const [userAvatars, setUserAvatars] = useState({});

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

  const showToast = (type, content, suggestion = null) => {
    setToast({ type, message: content, suggestion });
    setTimeout(() => setToast(null), 5000); // Tăng thời gian để đọc suggestion
  };

  // Handle additional images upload (convert to base64 for body and preview)
  const handleAdditionalImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const readAsDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const dataUrls = await Promise.all(files.map(readAsDataUrl));
      setConvertForm((p) => ({
        ...p,
        additionalImages: [...(p.additionalImages || []), ...dataUrls], // Append new images
        additionalPreview: [...(p.additionalPreview || []), ...dataUrls], // Append preview
      }));
      // Reset file input
      e.target.value = '';
    } catch (err) {
      console.error("Failed to read images", err);
      showToast("error", "Không đọc được file ảnh. Vui lòng thử lại.");
    }
  };

  // Remove image at index
  const removeAdditionalImage = (idx) => {
    setConvertForm((p) => ({
      ...p,
      additionalImages: p.additionalImages.filter((_, i) => i !== idx),
      additionalPreview: p.additionalPreview.filter((_, i) => i !== idx),
    }));
  };

  // Helper để parse error từ API response
  const parseError = (err) => {
    // Nếu err là object có message và suggestion
    if (err?.message && err?.suggestion) {
      return {
        message: err.message,
        suggestion: err.suggestion,
      };
    }
    // Nếu err.response?.data có format như API trả về
    if (err?.response?.data) {
      const errorData = err.response.data;
      return {
        message: errorData.message || errorData.errorCode || "Đã xảy ra lỗi",
        suggestion: errorData.suggestion || null,
      };
    }
    // Fallback
    return {
      message: err?.message || "Đã xảy ra lỗi",
      suggestion: null,
    };
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

  // Fetch missing avatars for visible items
  useEffect(() => {
    const fetchMissingAvatars = async () => {
      const idsToFetch = new Set();
      paginatedData.forEach((item) => {
        // Check if avatar is already avail in record or fetched map
        const hasAvatar = item.customerAvatar || item.customerId?.avatar;
        if (hasAvatar) return;

        let uid = item.customerId;
        if (typeof uid === "object" && uid !== null) {
          uid = uid._id || uid.id;
        }

        // If valid ID and not already fetched/fetching
        // (Check userAvatars[uid] === undefined to allow re-fetching if failed/null before, or just check simple existence)
        if (uid && !userAvatars[uid]) {
          idsToFetch.add(uid);
        }
      });

      if (idsToFetch.size === 0) return;

      const promises = Array.from(idsToFetch).map((id) =>
        dispatch(getCustomerById(id))
          .unwrap()
          .then((res) => {
            // Adjust based on actual API structure. User showed: { data: { avatar: "..." } }
            const avatar = res.data?.avatar || res.avatar;
            return { id, avatar };
          })
          .catch(() => ({ id, avatar: null }))
      );

      try {
        const results = await Promise.all(promises);
        const newAvatars = {};
        results.forEach((r) => {
          if (r.avatar) {
            newAvatars[r.id] = r.avatar;
          }
        });
        
        if (Object.keys(newAvatars).length > 0) {
            setUserAvatars((prev) => ({ ...prev, ...newAvatars }));
        }
      } catch (error) {
        console.error("Error fetching avatars", error);
      }
    };

    if (paginatedData.length > 0) {
      fetchMissingAvatars();
    }
  }, [paginatedData, dispatch]); // Keep dependency simple to avoid loops

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
      console.error("Status change error:", err);
      const errorInfo = parseError(err);
      showToast("error", errorInfo.message, errorInfo.suggestion);
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
      let contentToSend = overrideContent?.trim?.() || messageContent.trim();

      // Nếu có chọn Set Design, thêm thông tin Set Design vào content với format chuẩn
      if (selectedSetDesignForMessage) {
        const design = selectedSetDesignForMessage;
        const designInfo =
          `\n\n📦 Set Design được gửi kèm:\n` +
          `Tên: ${design.name || "Chưa có tên"}\n` +
          `Giá: ${
            design.price
              ? Number(design.price).toLocaleString("vi-VN") + "₫"
              : "Chưa có giá"
          }\n` +
          `Danh mục: ${design.category || "Chưa có"}\n` +
          (design._id ? `ID: ${design._id}\n` : "") +
          (Array.isArray(design.tags) && design.tags.length > 0
            ? `Tags: ${design.tags.join(", ")}\n`
            : "");
        contentToSend += designInfo;
      }

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
      setSelectedSetDesignForMessage(null); // Reset sau khi gửi
      navigate(`/message?user=${userIdStr}`);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      const errorInfo = parseError(err);
      showToast("error", errorInfo.message, errorInfo.suggestion);
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
    setSelectedSetDesignForMessage(null); // Reset khi mở modal
    setMessageModalOpen(true);
  };

  const handleConvertSetDesign = async () => {
    if (!selectedRequest) return;
    const tags = convertForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const additionalImages = (selectedRequest.referenceImages || [])
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean);
    const body = {
      name: convertForm.name,
      price: Number(convertForm.price) || 0,
      tags,
      isActive: true,
      additionalImages: [...(convertForm.additionalImages || []), ...additionalImages],
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
      const errorInfo = parseError(err);
      showToast("error", errorInfo.message, errorInfo.suggestion);
    } finally {
      setConvertLoading(false);
    }
  };

  const handleUpdateDesign = async () => {
    if (!updatingDesign?._id) return;

    const tags = updateForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      name: updateForm.name.trim(),
      price: Number(updateForm.price) || 0,
      category: updateForm.category.trim() || "Other",
      tags,
    };

    try {
      setUpdateLoading(true);
      await dispatch(
        updateConvertedCustomDesign({
          designId: updatingDesign._id,
          payload,
        })
      ).unwrap();

      // Refresh converted designs
      dispatch(getConvertedCustomDesigns({ page: 1, limit: 10 }))
        .unwrap()
        .catch((err) => console.warn("Could not refresh:", err));

      showToast("success", "Đã cập nhật Set Design!");
      setUpdateModalOpen(false);
      setUpdatingDesign(null);
      setUpdateForm({ name: "", price: "", category: "", tagsText: "" });
    } catch (err) {
      console.error("Update error:", err);
      const errorInfo = parseError(err);
      showToast("error", errorInfo.message, errorInfo.suggestion);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteDesign = async (designId) => {
    if (!designId) return;

    Modal.confirm({
      title: "Xóa Set Design?",
      content:
        "Bạn có chắc chắn muốn xóa Set Design này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(deleteSetDesign(designId)).unwrap();

          // Refresh converted designs
          dispatch(getConvertedCustomDesigns({ page: 1, limit: 10 }))
            .unwrap()
            .catch((err) => console.warn("Could not refresh:", err));

          // Clear convertResult if it matches
          if (convertResult?._id === designId) {
            setConvertResult(null);
          }

          showToast("success", "Đã xóa Set Design!");
        } catch (err) {
          console.error("Delete error:", err);
          const errorInfo = parseError(err);
          showToast("error", errorInfo.message, errorInfo.suggestion);
        }
      },
    });
  };

  const openUpdateModal = (design) => {
    if (!design) return;
    setUpdatingDesign(design);
    setUpdateForm({
      name: design.name || "",
      price: design.price || "",
      category: design.category || "",
      tagsText: Array.isArray(design.tags)
        ? design.tags.join(", ")
        : design.tags || "",
    });
    setUpdateModalOpen(true);
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
      render: (_, record) => {
        let avatarUrl = record.customerAvatar || record.customerId?.avatar;
        
        // If not found in record, check fetched map
        if (!avatarUrl) {
           let uid = record.customerId;
           if (typeof uid === "object" && uid !== null) uid = uid._id || uid.id;
           if (uid && userAvatars[uid]) {
               avatarUrl = userAvatars[uid];
           }
        }

        const finalAvatar = avatarUrl || DEFAULT_AVATAR;
        const createdAt = record.createdAt || record.requestedAt;

        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={finalAvatar}
              key={finalAvatar} 
              className="bg-gray-200"
            />
            <div>
              <Text strong>{record.customerName || "Khách vãng lai"}</Text>
              <br />
              <Text type="secondary" className="text-xs">
                {createdAt ? dayjs(createdAt).fromNow() : ""}
              </Text>
            </div>
          </div>
        );
      },
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
          suggestion={toast.suggestion}
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
        maskClosable={true}
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
                {(() => {
                   let avatarUrl = selectedRequest.customerAvatar || selectedRequest.customerId?.avatar;
                    if (!avatarUrl) {
                      let uid = selectedRequest.customerId;
                      if (typeof uid === "object" && uid !== null) uid = uid._id || uid.id;
                      if (uid && userAvatars[uid]) {
                          avatarUrl = userAvatars[uid];
                      }
                    }
                    const finalAvatar = avatarUrl || DEFAULT_AVATAR;
                    return (
                      <Avatar
                        size={100}
                        src={finalAvatar}
                        key={finalAvatar}
                        className="border-4 border-white shadow-2xl bg-gray-200"
                      />
                    );
                })()}
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

            {/* Tất cả hình ảnh - Hiển thị khi có ảnh tham khảo */}
            {selectedRequest.referenceImages?.length > 0 && (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <FiImage /> Tất cả hình ảnh ({selectedRequest.referenceImages.length})
                  </span>
                }
                className="mb-6 rounded-2xl"
              >
                <div className="overflow-x-auto pb-4 -mx-6 px-6">
                  <div className="flex gap-4 min-w-min">
                    {selectedRequest.referenceImages.map((imgObj, i) => {
                      // Handle both array of strings and array of objects
                      const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.url;
                      return (
                        <div key={i} className="flex-shrink-0">
                          <img
                            src={imgUrl}
                            alt={`Ref ${i + 1}`}
                            className="rounded-lg object-cover h-48 w-56 border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition cursor-pointer"
                            onClick={() => {
                              // Open fullscreen preview using Image component preview
                              const image = new window.Image();
                              image.src = imgUrl;
                              image.onload = () => {
                                const modal = document.createElement('div');
                                modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] cursor-pointer';
                                modal.innerHTML = `
                                  <img src="${imgUrl}" alt="Fullscreen" class="max-w-full max-h-full object-contain rounded-lg" />
                                  <button class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full text-white text-xl transition flex items-center justify-center" onclick="this.closest('div').remove()">✕</button>
                                `;
                                modal.onclick = (e) => {
                                  if (e.target === modal) modal.remove();
                                };
                                document.body.appendChild(modal);
                              };
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
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
        onCancel={() => {
          setMessageModalOpen(false);
          setSelectedSetDesignForMessage(null); // Reset khi đóng modal
        }}
        footer={null}
        width={800}
        centered
        maskClosable={true}
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
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiPackage /> Chọn Set Design gửi kèm
              </div>
              </div>

              {/* Select Set Design */}
              <Select
                placeholder="Chọn Set Design để gửi kèm tin nhắn..."
                value={selectedSetDesignForMessage?._id}
                onChange={(value) => {
                  if (!value) {
                    setSelectedSetDesignForMessage(null);
                    return;
                  }

                  // Tìm trong convertedDesigns
                  let foundDesign = null;
                  for (const item of convertedDesigns) {
                    const design = item.setDesign || item;
                    if (design._id === value) {
                      foundDesign = design;
                      break;
                    }
                  }

                  // Nếu không tìm thấy, kiểm tra convertResult
                  if (
                    !foundDesign &&
                    convertResult &&
                    convertResult._id === value
                  ) {
                    foundDesign = convertResult;
                  }

                  setSelectedSetDesignForMessage(foundDesign);
                }}
                allowClear
                showSearch
                optionFilterProp="children"
                className="w-full"
                size="large"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {/* Thêm convertResult vào danh sách nếu có */}
                {convertResult && (
                  <Select.Option
                    key={convertResult._id}
                    value={convertResult._id}
                    label={convertResult.name || "Chưa có tên"}
                  >
                    {convertResult.name || "Chưa có tên"} -{" "}
                    {convertResult.price
                      ? `${Number(convertResult.price).toLocaleString(
                          "vi-VN"
                        )}₫`
                      : "Chưa có giá"}{" "}
                    <Tag color="green" className="ml-2">
                      Mới tạo
                    </Tag>
                  </Select.Option>
                )}
                {convertedDesigns.map((item) => {
                  const design = item.setDesign || item;
                  const designId = design._id;
                  if (!designId) return null;

                  // Bỏ qua nếu đã có trong convertResult
                  if (convertResult && convertResult._id === designId) {
                    return null;
                  }

                  const designName = design.name || "Chưa có tên";
                  const designPrice = design.price
                    ? `${Number(design.price).toLocaleString("vi-VN")}₫`
                    : "Chưa có giá";
                  return (
                    <Select.Option
                      key={designId}
                      value={designId}
                      label={designName}
                    >
                      {designName} - {designPrice}
                    </Select.Option>
                  );
                })}
              </Select>

              {(() => {
                // Hiển thị Set Design đã chọn hoặc Set Design mặc định từ request
                let displayDesign = selectedSetDesignForMessage;

                // Nếu chưa chọn, tìm set design đã convert từ convertedDesigns
                if (!displayDesign) {
                if (convertResult) {
                    displayDesign = convertResult;
                } else if (selectedRequest?._id) {
                  const matched = convertedDesigns.find(
                    (d) => d.requestId === selectedRequest._id
                  );
                  if (matched?.setDesign) {
                      displayDesign = matched.setDesign;
                  } else if (matched?._id) {
                      displayDesign = matched;
                    }
                  }
                }

                if (!displayDesign) {
                  return (
                    <Card className="border-dashed border-purple-200 bg-white rounded-2xl">
                      <div className="text-gray-500 text-sm text-center py-8">
                        Chưa có Set Design được tạo. Bấm "Tạo Set Design" để
                        thêm.
                      </div>
                    </Card>
                  );
                }

                return (
                  <div className="group relative">
                    <Card
                      className={`border-2 ${
                        selectedSetDesignForMessage?._id === displayDesign._id
                          ? "border-green-400 bg-green-50"
                          : "border-purple-200 bg-white"
                      } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                    >
                      {/* Hover Actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <button
                          onClick={() => openUpdateModal(displayDesign)}
                          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 shadow-md transition-colors"
                          title="Sửa Set Design"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteDesign(displayDesign._id)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md transition-colors"
                          title="Xóa Set Design"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      {/* Selected Badge */}
                      {selectedSetDesignForMessage?._id ===
                        displayDesign._id && (
                        <div className="absolute top-3 left-3 z-10">
                          <Tag
                            color="green"
                            className="px-3 py-1 rounded-full shadow-md"
                          >
                            <FiCheckCircle className="inline mr-1" />
                            Đã chọn để gửi
                          </Tag>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="pb-3 border-b border-purple-100">
                          <Title level={5} className="mb-1 text-purple-700">
                            {displayDesign.name || "Chưa có tên"}
                          </Title>
                          {displayDesign._id && (
                            <Text type="secondary" className="text-xs">
                              ID: {displayDesign._id.slice(-8)}
                            </Text>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <Text type="secondary" className="text-sm">
                            Giá:
                          </Text>
                          <Text strong className="text-lg text-green-600">
                            {displayDesign.price
                              ? `${Number(displayDesign.price).toLocaleString(
                                  "vi-VN"
                                )}₫`
                              : "-"}
                          </Text>
                        </div>

                        {/* Category */}
                        <div className="flex items-center justify-between">
                          <Text type="secondary" className="text-sm">
                            Danh mục:
                          </Text>
                          <Tag color="blue" className="px-3 py-1">
                            {displayDesign.category || "-"}
                          </Tag>
                        </div>

                        {/* Description */}
                        {displayDesign.description && (
                          <div className="pt-2 border-t border-gray-100">
                            <Text
                              type="secondary"
                              className="text-xs block mb-1"
                            >
                              Mô tả:
                            </Text>
                            <Text className="text-xs text-gray-600 line-clamp-2">
                              {displayDesign.description}
                            </Text>
                          </div>
                        )}

                        {/* Tags */}
                        {(Array.isArray(displayDesign.tags)
                          ? displayDesign.tags
                          : []
                        ).filter(Boolean).length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <Text
                              type="secondary"
                              className="text-xs block mb-2"
                            >
                              Tags:
                            </Text>
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(displayDesign.tags)
                                ? displayDesign.tags
                                : []
                              )
                                .filter(Boolean)
                                .map((t, idx) => (
                                  <Tag
                                    key={idx}
                                    color="purple"
                                    className="rounded-full text-xs"
                                  >
                                    {t}
                                  </Tag>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })()}
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
        maskClosable={true}
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

                {/* Upload thêm ảnh bổ sung */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text className="text-xs text-gray-500">Ảnh bổ sung (optional)</Text>
                    <Text className="text-[11px] text-gray-400">Chấp nhận nhiều ảnh • jpg/png/webp</Text>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {convertForm.additionalPreview?.length > 0 && (
                    <div className="space-y-2">
                      <div className="overflow-x-auto -mx-2 px-2">
                        <div className="flex gap-3 py-2">
                          {convertForm.additionalPreview.map((url, idx) => (
                            <div key={idx} className="relative flex-shrink-0">
                              <img
                                src={url}
                                alt={`Preview ${idx + 1}`}
                                className="h-24 w-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Text className="text-[11px] text-gray-500">
                        {convertForm.additionalPreview.length} ảnh được chọn • Click ✕ để xóa
                      </Text>
                    </div>
                  )}
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

                  {/* Hiển thị ảnh bổ sung */}
                  {convertForm.additionalPreview?.length > 0 && (
                    <div className="border-t pt-3">
                      <Text type="secondary" className="block mb-2">Ảnh bổ sung ({convertForm.additionalPreview.length})</Text>
                      <div className="overflow-x-auto -mx-3 px-3">
                        <div className="flex gap-2 pb-1">
                          {convertForm.additionalPreview.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className="h-20 w-20 object-cover rounded-lg border border-amber-200 flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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

      {/* MODAL CẬP NHẬT SET DESIGN */}
      <Modal
        open={updateModalOpen}
        onCancel={() => {
          setUpdateModalOpen(false);
          setUpdatingDesign(null);
          setUpdateForm({ name: "", price: "", category: "", tagsText: "" });
        }}
        onOk={handleUpdateDesign}
        okText="Cập nhật"
        confirmLoading={updateLoading}
        width={720}
        centered
        maskClosable={true}
        styles={{ body: { padding: 0, background: "transparent" } }}
      >
        <div className="bg-white rounded-3xl border border-blue-100 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">
                Cập nhật Set Design
              </p>
              <h3 className="text-xl font-semibold">Chỉnh sửa thông tin</h3>
            </div>
            <Tag
              color="gold"
              className="px-3 py-1 rounded-full bg-white/20 border-white/30"
            >
              Sửa & Lưu
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
                    value={updateForm.name}
                    onChange={(e) =>
                      setUpdateForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <Text className="text-xs text-gray-500">Giá (VND)</Text>
                  <Input
                    placeholder="8500000"
                    type="number"
                    value={updateForm.price}
                    onChange={(e) =>
                      setUpdateForm((p) => ({ ...p, price: e.target.value }))
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
                    value={updateForm.category}
                    onChange={(e) =>
                      setUpdateForm((p) => ({
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
                    value={updateForm.tagsText}
                    onChange={(e) =>
                      setUpdateForm((p) => ({
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
            <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-l border-blue-100 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiPackage /> Xem trước
              </div>
              <Card className="border-dashed border-blue-200 bg-white rounded-2xl">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <Text type="secondary">Tên</Text>
                    <Text strong>{updateForm.name || "..."}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Giá</Text>
                    <Text strong>
                      {updateForm.price
                        ? `${Number(updateForm.price).toLocaleString("vi-VN")}₫`
                        : "..."}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Danh mục</Text>
                    <Text>{updateForm.category || "..."}</Text>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <Text type="secondary">Tags</Text>
                    <div className="flex flex-wrap gap-2">
                      {updateForm.tagsText
                        ? updateForm.tagsText
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
              </Card>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffCustomRequestPage;
