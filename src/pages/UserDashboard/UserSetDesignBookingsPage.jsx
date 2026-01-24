import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Typography,
  Spin,
  Empty,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getMySetDesignOrder,
  getSetDesignOrderDetail,
} from "../../features/setDesignPayment/setDesignPayment";

const { Title, Text } = Typography;

const statusColor = {
  pending: "orange",
  confirmed: "green",
  paid: "green",
  cancelled: "red",
};

const paymentStatusColor = {
  pending: "orange",
  paid: "green",
  succeeded: "green",
  failed: "red",
};

const statusText = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

const paymentStatusText = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  succeeded: "Đã thanh toán",
  failed: "Thất bại",
};

export default function UserSetDesignBookingsPage() {
  const dispatch = useDispatch();
  const { myOrders = [], loading, currentOrder } = useSelector(
    (state) => state.setDesignPayment || {}
  );

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    dispatch(getMySetDesignOrder());
  }, [dispatch]);

  const handleViewDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      await dispatch(getSetDesignOrderDetail(orderId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      // handled by slice error state; optionally toast here
      console.error("Load order detail failed", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (code) => <Text strong className="text-[#0F172A]">{code}</Text>,
    },
    {
      title: "Set Design",
      dataIndex: ["setDesignId", "name"],
      key: "setDesign",
      render: (name, record) => (
        <div>
          <Text strong className="text-[#0F172A]">{name || "—"}</Text>
          <div className="text-slate-500 text-xs">
            Giá: {record?.setDesignId?.price?.toLocaleString("vi-VN") || 0}₫
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => <Text strong className="text-[#C5A267]">{(val || 0).toLocaleString("vi-VN")}₫</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (val) => (
        <Tag color={statusColor[val] || "default"}>
          {statusText[val] || val || "—"}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (val) => (
        <Tag color={paymentStatusColor[val] || "default"}>
          {paymentStatusText[val] || val || "—"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) =>
        val ? dayjs(val).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetail(record._id)}
          style={{ color: '#C5A267' }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Đơn đặt Set Design của tôi</h1>
        <p className="opacity-90">
          Xem danh sách đơn hàng set design và chi tiết thanh toán
        </p>
      </div>

      <Card className="shadow-md border border-slate-200">
        {loading ? (
          <div className="py-12 text-center">
            <Spin />
          </div>
        ) : myOrders.length === 0 ? (
          <Empty description="Chưa có đơn set design nào" />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={myOrders}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={900}
        title={<span className="text-[#0F172A] font-bold">Chi tiết đơn Set Design</span>}
      >
        {detailLoading || !currentOrder ? (
          <div className="py-10 text-center">
            <Spin />
          </div>
        ) : (() => {
          // Handle API response structure: { order: {...}, payments: [...] }
          const order = currentOrder.order || currentOrder;
          const payments = currentOrder.payments || [];
          
          return (
            <div className="space-y-6">
              {/* Thông tin đơn hàng */}
              <Card className="border-slate-200 bg-[#FCFBFA]">
                <Title level={5} className="!text-[#C5A267] !mb-4">Thông tin đơn hàng</Title>
                <Descriptions bordered column={1} size="middle">
                  <Descriptions.Item label="Mã đơn">
                    <Text strong className="text-[#0F172A]">{order.orderCode || order._id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng">
                    {order.quantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đơn giá">
                    {(order?.unitPrice || 0).toLocaleString("vi-VN")}₫
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    <Text strong className="text-[#C5A267] text-lg">
                      {order.totalAmount?.toLocaleString("vi-VN")}₫
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Đã thanh toán">
                    <Text strong className="text-green-600">
                      {order.paidAmount?.toLocaleString("vi-VN")}₫
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái đơn">
                    <Tag color={statusColor[order.status] || "default"} className="!font-semibold">
                      {statusText[order.status] || order.status || "—"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái thanh toán">
                    <Tag color={paymentStatusColor[order.paymentStatus] || "default"} className="!font-semibold">
                      {paymentStatusText[order.paymentStatus] || order.paymentStatus || "—"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {order.createdAt
                      ? dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")
                      : "—"}
                  </Descriptions.Item>
                  {order.confirmedAt && (
                    <Descriptions.Item label="Ngày xác nhận">
                      {dayjs(order.confirmedAt).format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Ngày cập nhật">
                    {order.updatedAt
                      ? dayjs(order.updatedAt).format("DD/MM/YYYY HH:mm")
                      : "—"}
                  </Descriptions.Item>
                  {order.usageDate && (
                    <Descriptions.Item label="Ngày sử dụng">
                      {dayjs(order.usageDate).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                  )}
                  {order.bookingId && (
                    <Descriptions.Item label="Booking ID">
                      {order.bookingId}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Thông tin khách hàng */}
              {order?.customerId && typeof order.customerId === 'object' && (
                <Card className="border-slate-200">
                  <Title level={5} className="!text-[#C5A267] !mb-4">Thông tin khách hàng</Title>
                  <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Tên người dùng">
                      {order.customerId.username || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {order.customerId.email || "—"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              )}

              {/* Thông tin Set Design */}
              {order?.setDesignId && (
                <Card className="border-slate-200">
                  <Title level={5} className="!text-[#C5A267] !mb-4">Thông tin Set Design</Title>
                  <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Tên Set Design">
                      <Text strong className="text-[#0F172A]">{order.setDesignId.name || "—"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá">
                      <Text strong className="text-[#C5A267]">
                        {(order.setDesignId.price || 0).toLocaleString("vi-VN")}₫
                      </Text>
                    </Descriptions.Item>
                    {order.setDesignId.category && (
                      <Descriptions.Item label="Danh mục">
                        <Tag style={{ backgroundColor: '#C5A267', color: 'white', border: 0 }}>
                          {order.setDesignId.category}
                        </Tag>
                      </Descriptions.Item>
                    )}
                    {order.setDesignId.description && (
                      <Descriptions.Item label="Mô tả">
                        <Text className="whitespace-pre-wrap">{order.setDesignId.description}</Text>
                      </Descriptions.Item>
                    )}
                    {order.setDesignId.images && order.setDesignId.images.length > 0 && (
                      <Descriptions.Item label="Hình ảnh">
                        <div className="grid grid-cols-3 gap-2">
                          {order.setDesignId.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Set Design ${idx + 1}`}
                              className="w-full h-32 object-cover border border-slate-200 hover:border-[#C5A267] transition cursor-pointer"
                              onClick={() => window.open(img, '_blank')}
                            />
                          ))}
                        </div>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              )}

              {/* Lịch sử thanh toán */}
              {payments.length > 0 && (
                <Card className="border-slate-200">
                  <Title level={5} className="!text-[#C5A267] !mb-4">
                    Lịch sử thanh toán ({payments.length} giao dịch)
                  </Title>
                  <div className="space-y-4">
                    {payments.map((payment, idx) => (
                      <Card key={payment._id} className="border-slate-100 bg-white" size="small">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Text strong className="text-[#0F172A] block">Giao dịch #{idx + 1}</Text>
                            <Text className="text-xs text-slate-500">Mã: {payment.paymentCode}</Text>
                          </div>
                          <Tag 
                            color={paymentStatusColor[payment.status] || "default"}
                            className="!font-semibold"
                          >
                            {paymentStatusText[payment.status] || payment.status || "—"}
                          </Tag>
                        </div>
                        <Descriptions bordered column={1} size="small">
                          <Descriptions.Item label="Số tiền">
                            <Text strong className="text-[#C5A267]">
                              {(payment.amount || 0).toLocaleString("vi-VN")}₫
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Loại thanh toán">
                            <Tag color={payment.payType === 'full' ? 'green' : 'orange'}>
                              {payment.payType === 'full' ? 'Thanh toán đầy đủ (100%)' : 'Thanh toán trước (30%)'}
                            </Tag>
                          </Descriptions.Item>
                          {payment.transactionId && (
                            <Descriptions.Item label="Mã giao dịch">
                              {payment.transactionId}
                            </Descriptions.Item>
                          )}
                          {payment.gatewayResponse?.bin && (
                            <Descriptions.Item label="Ngân hàng">
                              BIN: {payment.gatewayResponse.bin}
                            </Descriptions.Item>
                          )}
                          {payment.gatewayResponse?.accountNumber && (
                            <Descriptions.Item label="Số tài khoản">
                              {payment.gatewayResponse.accountNumber}
                            </Descriptions.Item>
                          )}
                          {payment.gatewayResponse?.webhookData?.counterAccountBankName && (
                            <Descriptions.Item label="Ngân hàng thanh toán">
                              {payment.gatewayResponse.webhookData.counterAccountBankName}
                            </Descriptions.Item>
                          )}
                          {payment.gatewayResponse?.webhookData?.reference && (
                            <Descriptions.Item label="Mã tham chiếu">
                              {payment.gatewayResponse.webhookData.reference}
                            </Descriptions.Item>
                          )}
                          <Descriptions.Item label="Ngày tạo">
                            {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm")}
                          </Descriptions.Item>
                          {payment.paidAt && (
                            <Descriptions.Item label="Ngày thanh toán">
                              <Text className="text-green-600 font-semibold">
                                {dayjs(payment.paidAt).format("DD/MM/YYYY HH:mm")}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {payment.gatewayResponse?.completedAt && (
                            <Descriptions.Item label="Hoàn thành lúc">
                              <Text className="text-green-600 font-semibold">
                                {dayjs(payment.gatewayResponse.completedAt).format("DD/MM/YYYY HH:mm")}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {payment.expiresAt && (
                            <Descriptions.Item label="Hết hạn lúc">
                              {dayjs(payment.expiresAt).format("DD/MM/YYYY HH:mm")}
                            </Descriptions.Item>
                          )}
                        </Descriptions>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}


