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
import { getConvertedCustomDesignByIdPublic } from "../../../features/setDesign/setDesignSlice";
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
  const [visibleOrders, setVisibleOrders] = useState(5);
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
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            isMine
              ? "bg-white border-2 border-[#C5A267] shadow-md"
              : "bg-white border-2 border-[#A0826D] shadow-md"
          }`}
          onClick={handleViewDetail}
          hoverable
          style={{
            boxShadow: isMine
              ? "0 4px 12px rgba(197, 162, 103, 0.25)"
              : "0 4px 12px rgba(160, 130, 109, 0.25)",
          }}
        >
          <div className="flex items-start gap-4">
            {/* Icon với background */}
            <div
              className={`p-4 shadow-md flex-shrink-0 ${
                isMine
                  ? "bg-[#C5A267]"
                  : "bg-[#A0826D]"
              }`}
            >
              <FiPackage className="text-white" size={28} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header với tên */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1">
                  <Title level={5} className="!mb-0 !text-[#0F172A] font-bold">
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
                className="!shadow-md !font-medium"
                style={{
                  backgroundColor: '#A0826D',
                  borderColor: '#A0826D',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#8B7355';
                  e.currentTarget.style.borderColor = '#8B7355';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#A0826D';
                  e.currentTarget.style.borderColor = '#A0826D';
                }}
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
          setVisibleOrders(5);
        }}
        footer={null}
        width={1000}
        centered
        title={
          <div className="flex items-center gap-2">
            <FiPackage className="text-[#C5A267]" size={20} />
            <span className="text-lg font-semibold text-[#0F172A]">Chi tiết Set Design</span>
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
            <Card className="border-slate-100 bg-[#FCFBFA]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Title level={3} className="!mb-0 text-[#0F172A] !font-semibold">
                      {detailDesign.setDesign.name ||
                        designInfo.name ||
                        "Set Design"}
                    </Title>
                    <Tag
                      color={
                        detailDesign.setDesign.isActive ? "success" : "warning"
                      }
                      className="!px-3 !py-1 !font-medium border-0"
                      style={{
                        backgroundColor: detailDesign.setDesign.isActive ? '#10b981' : '#f59e0b',
                        color: 'white'
                      }}
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
            <Card className="border-slate-100">
              <Title
                level={5}
                className="text-[#0F172A] mb-4 flex items-center gap-2 !font-semibold"
              >
                <FiPackage className="text-[#C5A267]" /> Thông tin Set Design
              </Title>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white border border-slate-200">
                  <Text type="secondary" className="text-xs block mb-2 uppercase tracking-wider">
                    Giá
                  </Text>
                  <Text strong className="text-2xl text-[#C5A267] font-semibold">
                    {detailDesign.setDesign.price
                      ? `${Number(detailDesign.setDesign.price).toLocaleString(
                          "vi-VN"
                        )}₫`
                      : "Chưa có giá"}
                  </Text>
                </div>

                <div className="p-4 bg-white border border-slate-200">
                  <Text type="secondary" className="text-xs block mb-2 uppercase tracking-wider">
                    Danh mục
                  </Text>
                  <Tag 
                    className="!text-sm !px-3 !py-1 !font-semibold border-0" 
                    style={{ backgroundColor: '#C5A267', color: 'white' }}
                  >
                    {detailDesign.setDesign.category || "Chưa có"}
                  </Tag>
                </div>
              </div>

              {detailDesign.setDesign.description && (
                <div className="mb-4 p-4 bg-[#FCFBFA] border border-slate-100">
                  <Text
                    type="secondary"
                    className="text-sm block mb-2 font-semibold text-[#0F172A]"
                  >
                    Mô tả:
                  </Text>
                  <Text className="text-base whitespace-pre-wrap text-slate-700">
                    {detailDesign.setDesign.description}
                  </Text>
                </div>
              )}

              {detailDesign.setDesign.tags &&
                detailDesign.setDesign.tags.length > 0 && (
                  <div className="mb-4">
                    <Text
                      type="secondary"
                      className="text-sm block mb-2 font-semibold text-[#0F172A]"
                    >
                      Tags:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {detailDesign.setDesign.tags.map((tag, idx) => (
                        <Tag
                          key={idx}
                          className="!px-3 !py-1 !font-medium border"
                          style={{ 
                            backgroundColor: 'white', 
                            borderColor: '#C5A267',
                            color: '#C5A267'
                          }}
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
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Text
                      type="secondary"
                      className="text-sm block mb-3 font-semibold text-[#0F172A]"
                    >
                      Hình ảnh ({detailDesign.setDesign.images.length}):
                    </Text>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {detailDesign.setDesign.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Set Design ${idx + 1}`}
                          className="object-cover w-full h-40 border-2 border-slate-200 hover:border-[#C5A267] transition"
                        />
                      ))}
                    </div>
                  </div>
                )}
            </Card>

            {/* Thông tin Original Request */}
            {detailDesign.originalRequest && (
              <Card className="border-slate-100 bg-white">
                <Title
                  level={5}
                  className="text-[#0F172A] mb-4 flex items-center gap-2 !font-semibold"
                >
                  <FiUser className="text-[#C5A267]" /> Thông tin yêu cầu gốc
                </Title>

                <div className="space-y-4">
                  {/* Customer Avatar & Info */}
                  {detailDesign.originalRequest.customerAvatar && (
                    <div className="flex items-center gap-3 p-3 bg-[#FCFBFA] border border-slate-100">
                      <Avatar 
                        size={48} 
                        src={detailDesign.originalRequest.customerAvatar}
                        className="border-2 border-[#C5A267]"
                      >
                        {detailDesign.originalRequest.customerName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <Text strong className="text-base block text-[#0F172A]">
                          {detailDesign.originalRequest.customerName || "-"}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {detailDesign.originalRequest.email || "-"}
                        </Text>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {!detailDesign.originalRequest.customerAvatar && (
                      <>
                        <div>
                          <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                            <FiUser className="inline mr-1" />
                            Khách hàng:
                          </Text>
                          <Text strong className="text-base text-[#0F172A]">
                            {detailDesign.originalRequest.customerName || "-"}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                            <FiMail className="inline mr-1" />
                            Email:
                          </Text>
                          <Text className="text-base text-[#0F172A]">
                            {detailDesign.originalRequest.email || "-"}
                          </Text>
                        </div>
                      </>
                    )}
                    {detailDesign.originalRequest.phoneNumber && (
                      <div>
                        <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                          <FiPhone className="inline mr-1" />
                          Số điện thoại:
                        </Text>
                        <Text className="text-base text-[#0F172A]">
                          {detailDesign.originalRequest.phoneNumber}
                        </Text>
                      </div>
                    )}
                    {detailDesign.originalRequest.estimatedPrice && (
                      <div>
                        <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                          <FiDollarSign className="inline mr-1" />
                          Giá dự kiến:
                        </Text>
                        <Text className="text-base font-semibold text-[#C5A267]">
                          {Number(detailDesign.originalRequest.estimatedPrice).toLocaleString("vi-VN")}₫
                        </Text>
                      </div>
                    )}
                  </div>

                  {detailDesign.originalRequest.originalDescription && (
                    <div className="p-4 bg-white border border-slate-100">
                      <Text
                        type="secondary"
                        className="text-xs block mb-2 font-semibold text-[#0F172A] uppercase tracking-wider"
                      >
                        Mô tả yêu cầu gốc:
                      </Text>
                      <Text className="text-sm whitespace-pre-wrap text-slate-700">
                        {detailDesign.originalRequest.originalDescription}
                      </Text>
                    </div>
                  )}

                  {detailDesign.originalRequest.processedBy && (
                    <div className="p-4 bg-white border border-slate-100">
                      <Text
                        type="secondary"
                        className="text-xs block mb-2 font-semibold text-[#0F172A] uppercase tracking-wider"
                      >
                        Xử lý bởi:
                      </Text>
                      <div className="flex items-center gap-2">
                        <Avatar size="small" className="bg-[#C5A267]">
                          {detailDesign.originalRequest.processedBy.email
                            ?.charAt(0)
                            .toUpperCase()}
                        </Avatar>
                        <Text className="text-sm text-[#0F172A]">
                          {detailDesign.originalRequest.processedBy.email ||
                            "-"}
                        </Text>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div>
                      <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                        <FiClock className="inline mr-1" />
                        Yêu cầu lúc:
                      </Text>
                      <Text className="text-sm text-[#0F172A]">
                        {detailDesign.originalRequest.requestedAt
                          ? dayjs(
                              detailDesign.originalRequest.requestedAt
                            ).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs block mb-1 uppercase tracking-wider">
                        <FiCheckCircle className="inline mr-1" />
                        Chuyển đổi lúc:
                      </Text>
                      <Text className="text-sm text-[#0F172A]">
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

            {/* Payment Info - Order History */}
            {detailDesign.paymentInfo && detailDesign.paymentInfo.totalOrders > 0 && (
              <Card className="border-slate-100 bg-white">
                <Title
                  level={5}
                  className="text-[#0F172A] mb-4 flex items-center gap-2 !font-semibold"
                >
                  <FiShoppingCart className="text-[#C5A267]" /> Lịch sử đặt hàng
                  <Tag className="!ml-2 border-0" style={{ backgroundColor: '#C5A267', color: 'white' }}>
                    {detailDesign.paymentInfo.totalOrders} đơn
                  </Tag>
                </Title>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {detailDesign.paymentInfo.orders?.slice(0, visibleOrders).map((order, idx) => (
                    <div key={order.orderId} className="p-3 border border-slate-100 hover:border-[#C5A267] transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Text className="text-xs text-slate-500 block mb-1">
                            Mã đơn: <span className="font-semibold text-[#0F172A]">{order.orderCode}</span>
                          </Text>
                          <Text className="text-xs text-slate-500">
                            {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                          </Text>
                        </div>
                        <div className="text-right">
                          <Tag 
                            className="!mb-1 border-0"
                            style={{
                              backgroundColor: order.status === 'confirmed' ? '#10b981' : 
                                             order.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                              color: 'white'
                            }}
                          >
                            {order.status === 'confirmed' ? 'Đã xác nhận' :
                             order.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}
                          </Tag>
                          <div>
                            <Tag 
                              className="border-0"
                              style={{
                                backgroundColor: order.paymentStatus === 'paid' ? '#10b981' : 
                                               order.paymentStatus === 'failed' ? '#ef4444' : '#94a3b8',
                                color: 'white'
                              }}
                            >
                              {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                               order.paymentStatus === 'failed' ? 'Thất bại' : 'Chưa thanh toán'}
                            </Tag>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <Text className="text-sm text-slate-600">
                          Số lượng: <span className="font-semibold text-[#0F172A]">{order.quantity}</span>
                        </Text>
                        <Text className="text-base font-semibold text-[#C5A267]">
                          {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                        </Text>
                      </div>
                      {order.paidAmount > 0 && order.paidAmount < order.totalAmount && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <Text className="text-xs text-slate-500">
                            Đã thanh toán: <span className="font-semibold text-green-600">
                              {Number(order.paidAmount).toLocaleString("vi-VN")}₫
                            </span>
                            {" "} / Còn lại: <span className="font-semibold text-orange-600">
                              {Number(order.totalAmount - order.paidAmount).toLocaleString("vi-VN")}₫
                            </span>
                          </Text>
                        </div>
                      )}
                    </div>
                  ))}
                  {visibleOrders < detailDesign.paymentInfo.totalOrders && (
                    <div className="text-center pt-3">
                      <Button
                        type="default"
                        size="middle"
                        onClick={() => setVisibleOrders(prev => prev + 5)}
                        className="!font-semibold"
                        style={{
                          borderColor: '#A0826D',
                          color: '#A0826D',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#A0826D';
                          e.target.style.color = 'white';
                          e.target.style.backgroundColor = '#A0826D';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#A0826D';
                          e.target.style.color = '#A0826D';
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        Xem thêm ({Math.min(detailDesign.paymentInfo.totalOrders - visibleOrders, 5)} đơn)
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Nút Xác nhận đặt hoặc Về Dashboard - chỉ cho customer */}
            {isCustomer && (() => {
              // Kiểm tra xem có đơn hàng nào đã thanh toán và xác nhận chưa
              const hasPaidAndConfirmedOrder = detailDesign.paymentInfo?.orders?.some(
                order => order.status === 'confirmed' && order.paymentStatus === 'paid'
              );

              if (hasPaidAndConfirmedOrder) {
                // Hiển thị nút Về Dashboard
                return (
                  <div className="pt-4">
                    <Button
                      type="primary"
                      icon={<FiCheckCircle />}
                      block
                      size="large"
                      style={{
                        backgroundColor: '#A0826D',
                        borderColor: '#A0826D',
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#8B7355';
                        e.currentTarget.style.borderColor = '#8B7355';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#A0826D';
                        e.currentTarget.style.borderColor = '#A0826D';
                        e.currentTarget.style.color = 'white';
                      }}
                      onClick={() => {
                        navigate('/dashboard/customer/set-designs/bookings');
                      }}
                    >
                      Về Dashboard
                    </Button>
                  </div>
                );
              }

              // Hiển thị nút Xác nhận đặt mặc định
              return (
                <div className="pt-4">
                  <Button
                    type="primary"
                    icon={<FiCheckCircle />}
                    block
                    size="large"
                    loading={orderLoading || paymentLoading || creatingOrder}
                    style={{
                      backgroundColor: '#A0826D',
                      borderColor: '#A0826D',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                    onMouseEnter={(e) => {
                      if (!orderLoading && !paymentLoading && !creatingOrder) {
                        e.currentTarget.style.backgroundColor = '#8B7355';
                        e.currentTarget.style.borderColor = '#8B7355';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!orderLoading && !paymentLoading && !creatingOrder) {
                        e.currentTarget.style.backgroundColor = '#A0826D';
                        e.currentTarget.style.borderColor = '#A0826D';
                      }
                    }}
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
              );
            })()}
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
            <FiCreditCard className="text-[#C5A267]" />
            <span className="text-xl font-bold text-[#0F172A]">
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
            <Card className="bg-[#FCFBFA] border-2 border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Text className="text-sm text-slate-600 block mb-1 uppercase tracking-wider">
                    Set Design
                  </Text>
                  <Title level={4} className="!mb-2 !text-[#0F172A] !font-semibold">
                    {detailDesign.setDesign.name}
                  </Title>
                  <Text className="text-2xl font-bold text-[#C5A267]">
                    {detailDesign.setDesign.price?.toLocaleString("vi-VN")}₫
                  </Text>
                </div>
              </div>
            </Card>
          )}

          {/* Chọn phương thức thanh toán */}
          <div>
            <div className="flex items-center justify-between mb-4 gap-3">
              <Text className="text-base font-semibold text-[#0F172A] block">
                Chọn phương thức thanh toán:
              </Text>
              {createdOrder && (
                <Tag className="font-semibold border-0" style={{ backgroundColor: '#C5A267', color: 'white' }}>
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
                        ? "border-[#C5A267] bg-[#FCFBFA] shadow-lg"
                        : "border-slate-200 hover:border-[#C5A267]/50"
                    }`}
                    onClick={() => setSelectedPaymentType("full")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                          <FiCheckCircle className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <Text className="text-lg font-bold text-[#0F172A] block">
                            Thanh toán đầy đủ (100%)
                          </Text>
                          <Text className="text-sm text-slate-600">
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
                        ? "border-[#C5A267] bg-[#FCFBFA] shadow-lg"
                        : "border-slate-200 hover:border-[#C5A267]/50"
                    }`}
                    onClick={() => setSelectedPaymentType("prepay_30")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 flex items-center justify-center">
                          <FiPercent className="text-orange-600 text-xl" />
                        </div>
                        <div>
                          <Text className="text-lg font-bold text-[#0F172A] block">
                            Thanh toán trước (30%)
                          </Text>
                          <Text className="text-sm text-slate-600">
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
              className="!h-12 !font-semibold border-2 border-slate-200 hover:!border-[#C5A267]"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              block
              icon={<FiCheckCircle />}
              loading={orderLoading || paymentLoading}
              style={{
                backgroundColor: '#A0826D',
                borderColor: '#A0826D',
                height: '48px',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                if (!orderLoading && !paymentLoading) {
                  e.currentTarget.style.backgroundColor = '#8B7355';
                  e.currentTarget.style.borderColor = '#8B7355';
                }
              }}
              onMouseLeave={(e) => {
                if (!orderLoading && !paymentLoading) {
                  e.currentTarget.style.backgroundColor = '#A0826D';
                  e.currentTarget.style.borderColor = '#A0826D';
                }
              }}
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
