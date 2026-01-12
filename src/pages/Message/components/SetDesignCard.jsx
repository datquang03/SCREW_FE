// src/pages/Message/components/SetDesignCard.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Modal,
  Spin,
  Typography,
  Divider,
  Avatar,
  Radio,
  message,
} from "antd";
import {
  FiPackage,
  FiDollarSign,
  FiEye,
  FiShoppingCart,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiCalendar,
  FiCreditCard,
  FiPercent,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConvertedCustomDesignByIdPublic } from "../../../features/setdesign/setDesignSlice";
import {
  createOrderSetDesign,
  createPayment30,
  createPaymentFull,
} from "../../../features/setDesignPayment/setDesignPayment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

// Parse Set Design info từ message content
export const parseSetDesignFromMessage = (content) => {
  if (!content || typeof content !== "string") return null;

  // Tìm pattern: 📦 Set Design được gửi kèm: ... ID: ...
  const pattern = /📦\s*Set Design được gửi kèm:([\s\S]*?)(?=\n\n|\n$|$)/;
  const match = content.match(pattern);

  if (!match) return null;

  const infoText = match[1];
  const design = {
    name: null,
    price: null,
    category: null,
    id: null,
    tags: [],
  };

  // Parse name (hỗ trợ cả format có và không có dấu "-")
  const nameMatch = infoText.match(/(?:-?\s*)?Tên:\s*(.+?)(?:\n|$)/);
  if (nameMatch) design.name = nameMatch[1].trim();

  // Parse price (hỗ trợ cả format có và không có dấu "-")
  const priceMatch = infoText.match(/(?:-?\s*)?Giá:\s*([^\n]+)/);
  if (priceMatch) {
    let priceStr = priceMatch[1].trim();

    // Xóa ký tự ₫ và khoảng trắng
    priceStr = priceStr.replace(/[₫\s]/g, "");

    // Xóa dấu chấm (dấu phân cách hàng nghìn trong tiếng Việt: 8.500.000)
    priceStr = priceStr.replace(/\./g, "");

    // Xóa dấu phẩy (trong format VN, dấu phẩy có thể là phân cách hàng nghìn)
    // Xóa hết dấu phẩy vì giá là số nguyên
    priceStr = priceStr.replace(/,/g, "");

    // Parse thành số nguyên
    const parsedPrice = parseInt(priceStr, 10);
    design.price = isNaN(parsedPrice) || parsedPrice < 0 ? null : parsedPrice;
  }

  // Parse category (hỗ trợ cả format có và không có dấu "-")
  const categoryMatch = infoText.match(/(?:-?\s*)?Danh mục:\s*(.+?)(?:\n|$)/);
  if (categoryMatch) design.category = categoryMatch[1].trim();

  // Parse ID
  const idMatch = infoText.match(/ID:\s*([0-9a-fA-F]{24})/);
  if (idMatch) design.id = idMatch[1].trim();

  // Parse tags (hỗ trợ cả format có và không có dấu "-")
  const tagsMatch = infoText.match(/(?:-?\s*)?Tags:\s*(.+?)(?:\n|$)/);
  if (tagsMatch) {
    design.tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return design.id ? design : null;
};

// Component hiển thị Set Design card
const SetDesignCard = ({ designInfo, isMine, messageContent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const { loading: orderLoading, paymentLoading } = useSelector(
    (state) => state.setDesignPayment || {}
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailDesign, setDetailDesign] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("full");

  // Chỉ customer mới thấy nút "Xác nhận đặt"
  const isCustomer = user?.role === "customer";

  const handleViewDetail = async () => {
    if (!designInfo?.id) return;

    try {
      setLoadingDetail(true);
      setDetailModalVisible(true);
      const result = await dispatch(
        getConvertedCustomDesignByIdPublic(designInfo.id)
      ).unwrap();
      // Lưu cả setDesign và originalRequest
      setDetailDesign(result);
    } catch (err) {
      console.error("Lỗi tải chi tiết Set Design:", err);
      // Vẫn hiển thị modal với thông tin từ designInfo
      setDetailDesign({ setDesign: designInfo });
    } finally {
      setLoadingDetail(false);
    }
  };

  // Remove Set Design info từ content để hiển thị text thông thường
  const textContent = messageContent
    ?.replace(/📦\s*Set Design được gửi kèm:[\s\S]*?(?=\n\n|\n$|$)/, "")
    .trim();

  return (
    <>
      <div className={`mt-3 ${isMine ? "text-right" : ""}`}>
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
            isMine
              ? "bg-white border-2 border-purple-300 shadow-lg"
              : "bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-purple-200 shadow-md"
          }`}
          onClick={handleViewDetail}
          hoverable
          style={{
            borderRadius: "16px",
            boxShadow: isMine
              ? "0 8px 24px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)"
              : "0 4px 12px rgba(139, 92, 246, 0.15)",
          }}
        >
          <div className="flex items-start gap-4">
            {/* Icon với background gradient */}
            <div
              className={`p-4 rounded-2xl shadow-md flex-shrink-0 ${
                isMine
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-purple-400 to-pink-400"
              }`}
            >
              <FiPackage className="text-white" size={28} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header với tên */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1">
                  <Title level={5} className="!mb-0 !text-purple-700 font-bold">
                    {designInfo.name || "Set Design"}
                  </Title>
                </div>
              </div>

              {/* Button Xem chi tiết */}
              <Button
                type="primary"
                icon={<FiEye />}
                size="small"
                block
                className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !border-0 !hover:from-purple-600 !hover:to-pink-600 !shadow-md !font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetail();
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal chi tiết Set Design */}
      <Modal
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setDetailDesign(null);
        }}
        footer={null}
        width={900}
        centered
        title={
          <div className="flex items-center gap-2">
            <FiPackage className="text-purple-600" size={20} />
            <span className="text-lg font-semibold">Chi tiết Set Design</span>
          </div>
        }
      >
        {loadingDetail ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : detailDesign?.setDesign ? (
          <div className="space-y-4">
            {/* Header với Status */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Title level={3} className="!mb-0 text-purple-700">
                      {detailDesign.setDesign.name ||
                        designInfo.name ||
                        "Set Design"}
                    </Title>
                    <Tag
                      color={
                        detailDesign.setDesign.isActive ? "green" : "orange"
                      }
                      className="!px-3 !py-1 !rounded-full !font-medium"
                    >
                      {detailDesign.setDesign.isActive ? (
                        <>
                          <FiCheckCircle className="inline mr-1" />
                          Đang hoạt động
                        </>
                      ) : (
                        <>
                          <FiXCircle className="inline mr-1" />
                          Tạm ngưng
                        </>
                      )}
                    </Tag>
                  </div>
                  {detailDesign.setDesign._id && (
                    <Text type="secondary" className="text-xs">
                      ID: {detailDesign.setDesign._id}
                    </Text>
                  )}
                </div>
              </div>
            </Card>

            {/* Thông tin chính */}
            <Card className="border-purple-200">
              <Title
                level={5}
                className="text-purple-700 mb-4 flex items-center gap-2"
              >
                <FiPackage /> Thông tin Set Design
              </Title>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <Text type="secondary" className="text-xs block mb-1">
                    Giá
                  </Text>
                  <Text strong className="text-xl text-green-600 font-bold">
                    {detailDesign.setDesign.price
                      ? `${Number(detailDesign.setDesign.price).toLocaleString(
                          "vi-VN"
                        )}₫`
                      : "Chưa có giá"}
                  </Text>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Text type="secondary" className="text-xs block mb-1">
                    Danh mục
                  </Text>
                  <Tag color="blue" className="!text-base !px-3 !py-1">
                    {detailDesign.setDesign.category || "Chưa có"}
                  </Tag>
                </div>
              </div>

              {detailDesign.setDesign.description && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Text
                    type="secondary"
                    className="text-sm block mb-2 font-medium"
                  >
                    Mô tả:
                  </Text>
                  <Text className="text-base whitespace-pre-wrap">
                    {detailDesign.setDesign.description}
                  </Text>
                </div>
              )}

              {detailDesign.setDesign.tags &&
                detailDesign.setDesign.tags.length > 0 && (
                  <div className="mb-4">
                    <Text
                      type="secondary"
                      className="text-sm block mb-2 font-medium"
                    >
                      Tags:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {detailDesign.setDesign.tags.map((tag, idx) => (
                        <Tag
                          key={idx}
                          color="purple"
                          className="!px-3 !py-1 !rounded-full !font-medium"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <Text type="secondary" className="text-xs block mb-1">
                    <FiCalendar className="inline mr-1" />
                    Tạo lúc:
                  </Text>
                  <Text className="text-sm">
                    {detailDesign.setDesign.createdAt
                      ? dayjs(detailDesign.setDesign.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "-"}
                  </Text>
                  {detailDesign.setDesign.createdAt && (
                    <Text type="secondary" className="text-xs block mt-1">
                      ({dayjs(detailDesign.setDesign.createdAt).fromNow()})
                    </Text>
                  )}
                </div>
                <div>
                  <Text type="secondary" className="text-xs block mb-1">
                    <FiEdit3 className="inline mr-1" />
                    Cập nhật lúc:
                  </Text>
                  <Text className="text-sm">
                    {detailDesign.setDesign.updatedAt
                      ? dayjs(detailDesign.setDesign.updatedAt).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "-"}
                  </Text>
                  {detailDesign.setDesign.updatedAt && (
                    <Text type="secondary" className="text-xs block mt-1">
                      ({dayjs(detailDesign.setDesign.updatedAt).fromNow()})
                    </Text>
                  )}
                </div>
              </div>

              {/* Hình ảnh */}
              {detailDesign.setDesign.images &&
                detailDesign.setDesign.images.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Text
                      type="secondary"
                      className="text-sm block mb-3 font-medium"
                    >
                      Hình ảnh ({detailDesign.setDesign.images.length}):
                    </Text>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {detailDesign.setDesign.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Set Design ${idx + 1}`}
                          className="rounded-lg object-cover w-full h-40 border-2 border-purple-200 hover:border-purple-400 transition"
                        />
                      ))}
                    </div>
                  </div>
                )}
            </Card>

            {/* Thông tin Original Request */}
            {detailDesign.originalRequest && (
              <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <Title
                  level={5}
                  className="text-amber-700 mb-4 flex items-center gap-2"
                >
                  <FiUser /> Thông tin yêu cầu gốc
                </Title>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text type="secondary" className="text-xs block mb-1">
                        <FiUser className="inline mr-1" />
                        Khách hàng:
                      </Text>
                      <Text strong className="text-base">
                        {detailDesign.originalRequest.customerName || "-"}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs block mb-1">
                        <FiMail className="inline mr-1" />
                        Email:
                      </Text>
                      <Text className="text-base">
                        {detailDesign.originalRequest.email || "-"}
                      </Text>
                    </div>
                  </div>

                  {detailDesign.originalRequest.phoneNumber && (
                    <div>
                      <Text type="secondary" className="text-xs block mb-1">
                        <FiPhone className="inline mr-1" />
                        Số điện thoại:
                      </Text>
                      <Text className="text-base">
                        {detailDesign.originalRequest.phoneNumber}
                      </Text>
                    </div>
                  )}

                  {detailDesign.originalRequest.originalDescription && (
                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                      <Text
                        type="secondary"
                        className="text-xs block mb-2 font-medium"
                      >
                        Mô tả yêu cầu gốc:
                      </Text>
                      <Text className="text-sm whitespace-pre-wrap">
                        {detailDesign.originalRequest.originalDescription}
                      </Text>
                    </div>
                  )}

                  {detailDesign.originalRequest.processedBy && (
                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                      <Text
                        type="secondary"
                        className="text-xs block mb-2 font-medium"
                      >
                        Xử lý bởi:
                      </Text>
                      <div className="flex items-center gap-2">
                        <Avatar size="small" className="bg-purple-500">
                          {detailDesign.originalRequest.processedBy.email
                            ?.charAt(0)
                            .toUpperCase()}
                        </Avatar>
                        <Text className="text-sm">
                          {detailDesign.originalRequest.processedBy.email ||
                            "-"}
                        </Text>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-amber-200">
                    <div>
                      <Text type="secondary" className="text-xs block mb-1">
                        <FiClock className="inline mr-1" />
                        Yêu cầu lúc:
                      </Text>
                      <Text className="text-sm">
                        {detailDesign.originalRequest.requestedAt
                          ? dayjs(
                              detailDesign.originalRequest.requestedAt
                            ).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs block mb-1">
                        <FiCheckCircle className="inline mr-1" />
                        Chuyển đổi lúc:
                      </Text>
                      <Text className="text-sm">
                        {detailDesign.originalRequest.convertedAt
                          ? dayjs(
                              detailDesign.originalRequest.convertedAt
                            ).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Nút Xác nhận đặt - chỉ cho customer */}
            {isCustomer && (
              <div className="pt-4">
                <Button
                  type="primary"
                  icon={<FiCheckCircle />}
                  block
                  size="large"
                  className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !border-none !h-12 !text-base !font-semibold !shadow-lg"
                  loading={orderLoading || paymentLoading || creatingOrder}
                  onClick={async () => {
                    if (!detailDesign?.setDesign?._id) {
                      message.error("Không tìm thấy thông tin Set Design");
                      return;
                    }

                    try {
                      setCreatingOrder(true);
                      const hideCreate = message.loading(
                        "Đang tạo đơn hàng...",
                        0
                      );

                      const orderResult = await dispatch(
                        createOrderSetDesign({
                          setDesignId: detailDesign.setDesign._id,
                          quantity: 1,
                        })
                      ).unwrap();

                      hideCreate?.();
                      setCreatingOrder(false);

                      const orderId =
                        orderResult?.orderId ||
                        orderResult?._id ||
                        orderResult?.order?._id ||
                        orderResult?.data?._id ||
                        orderResult?.data?.orderId ||
                        orderResult?.data?.order?._id;

                      if (!orderId) {
                        throw new Error(
                          "Không lấy được orderId, vui lòng thử lại."
                        );
                      }

                      setCreatedOrder({
                        ...orderResult,
                        orderId,
                      });
                      setPaymentModalVisible(true);
                    } catch (error) {
                      setCreatingOrder(false);
                      message.destroy();
                      message.error(
                        error?.message ||
                          "Tạo đơn hàng thất bại, vui lòng thử lại!"
                      );
                    }
                  }}
                >
                  Xác nhận đặt
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin Set Design
          </div>
        )}
      </Modal>

      {/* Modal chọn phương thức thanh toán */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-purple-600" />
            <span className="text-xl font-bold">
              Chọn phương thức thanh toán
            </span>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => {
          setPaymentModalVisible(false);
          setSelectedPaymentType("full");
        }}
        footer={null}
        width={600}
        className="payment-modal"
        maskClosable={false}
      >
        <div className="space-y-6 py-4">
          {/* Thông tin Set Design */}
          {detailDesign?.setDesign && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Text className="text-sm text-gray-600 block mb-1">
                    Set Design
                  </Text>
                  <Title level={4} className="!mb-2 !text-gray-900">
                    {detailDesign.setDesign.name}
                  </Title>
                  <Text className="text-2xl font-bold text-purple-600">
                    {detailDesign.setDesign.price?.toLocaleString("vi-VN")}₫
                  </Text>
                </div>
              </div>
            </Card>
          )}

          {/* Chọn phương thức thanh toán */}
          <div>
            <div className="flex items-center justify-between mb-4 gap-3">
              <Text className="text-base font-semibold text-gray-700 block">
                Chọn phương thức thanh toán:
              </Text>
              {createdOrder && (
                <Tag color="purple" className="font-semibold">
                  Mã đơn:{" "}
                  {createdOrder.orderCode ||
                    createdOrder.code ||
                    createdOrder._id}
                </Tag>
              )}
            </div>
            <Radio.Group
              value={selectedPaymentType}
              onChange={(e) => setSelectedPaymentType(e.target.value)}
              className="w-full"
            >
              <div className="space-y-3">
                {/* Option 1: Thanh toán đầy đủ */}
                <Radio value="full" className="w-full">
                  <Card
                    className={`border-2 transition-all cursor-pointer ${
                      selectedPaymentType === "full"
                        ? "border-purple-500 bg-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedPaymentType("full")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <Text className="text-lg font-bold text-gray-900 block">
                            Thanh toán đầy đủ (100%)
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Thanh toán toàn bộ số tiền ngay
                          </Text>
                        </div>
                      </div>
                      {detailDesign?.setDesign?.price && (
                        <Text className="text-xl font-bold text-green-600">
                          {detailDesign.setDesign.price.toLocaleString("vi-VN")}
                          ₫
                        </Text>
                      )}
                    </div>
                  </Card>
                </Radio>

                {/* Option 2: Thanh toán trước 30% */}
                <Radio value="prepay_30" className="w-full">
                  <Card
                    className={`border-2 transition-all cursor-pointer ${
                      selectedPaymentType === "prepay_30"
                        ? "border-purple-500 bg-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedPaymentType("prepay_30")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <FiPercent className="text-orange-600 text-xl" />
                        </div>
                        <div>
                          <Text className="text-lg font-bold text-gray-900 block">
                            Thanh toán trước (30%)
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Thanh toán 30% trước, phần còn lại thanh toán sau
                          </Text>
                        </div>
                      </div>
                      {detailDesign?.setDesign?.price && (
                        <Text className="text-xl font-bold text-orange-600">
                          {Math.round(
                            detailDesign.setDesign.price * 0.3
                          ).toLocaleString("vi-VN")}
                          ₫
                        </Text>
                      )}
                    </div>
                  </Card>
                </Radio>
              </div>
            </Radio.Group>
          </div>

          {/* Nút xác nhận */}
          <div className="flex gap-3 pt-4">
            <Button
              size="large"
              block
              onClick={() => {
                setPaymentModalVisible(false);
                setSelectedPaymentType("full");
              }}
              disabled={orderLoading || paymentLoading}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              block
              icon={<FiCheckCircle />}
              loading={orderLoading || paymentLoading}
              className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !border-none"
              onClick={async () => {
                if (!createdOrder?.orderId) {
                  message.error("Chưa có đơn hàng, vui lòng tạo đơn trước.");
                  return;
                }

                if (!detailDesign?.setDesign?._id) {
                  message.error("Không tìm thấy thông tin Set Design");
                  return;
                }

                try {
                  // Bước 2: Thanh toán với orderId đã tạo
                  const hidePay = message.loading(
                    selectedPaymentType === "full"
                      ? "Đang thanh toán 100%..."
                      : "Đang thanh toán 30%...",
                    0
                  );

                  let paymentResult;
                  if (selectedPaymentType === "full") {
                    paymentResult = await dispatch(
                      createPaymentFull(createdOrder.orderId)
                    ).unwrap();
                  } else {
                    paymentResult = await dispatch(
                      createPayment30(createdOrder.orderId)
                    ).unwrap();
                  }

                  hidePay?.();
                  message.success("Đặt hàng thành công!");

                  // Mở trang thanh toán PayOS nếu có checkoutUrl
                  const checkoutUrl =
                    paymentResult?.checkoutUrl ||
                    paymentResult?.data?.checkoutUrl ||
                    paymentResult?.payment?.checkoutUrl ||
                    paymentResult?.payment?.gatewayResponse?.checkoutUrl;
                  if (checkoutUrl) {
                    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
                  }

                  // Đóng modal
                  setPaymentModalVisible(false);
                  setDetailModalVisible(false);
                  setSelectedPaymentType("full");

                  // Redirect sau 1 giây
                  setTimeout(() => {
                    navigate("/dashboard/customer/set-designs/bookings");
                  }, 1000);
                } catch (error) {
                  message.destroy();
                  message.error(
                    error?.message || "Đặt hàng thất bại, vui lòng thử lại!"
                  );
                }
              }}
            >
              Xác nhận đặt hàng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SetDesignCard;
