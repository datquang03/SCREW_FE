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
  Input,
  Form,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getMySetDesignOrder,
  getSetDesignOrderDetail,
  createPaymentFull,
  createOrderSetDesign,
  payRemainingSetDesign,
  cancelSetDesignOrder,
} from "../../features/setDesignPayment/setDesignPayment";
import { requestRefundSetDesign } from "../../features/payment/paymentSlice";

const { Title, Text } = Typography;

const statusColor = {
  pending: "orange",
  confirmed: "green",
  paid: "green",
  cancelled: "red",
  refunded: "blue",
};

const paymentStatusColor = {
  pending: "orange",
  paid: "green",
  succeeded: "green",
  failed: "red",
  refunded: "blue",
};

const statusText = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const paymentStatusText = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  succeeded: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

export default function UserSetDesignBookingsPage() {
  const dispatch = useDispatch();
  const {
    myOrders = [],
    loading,
    currentOrder,
  } = useSelector((state) => state.setDesignPayment || {});

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundForm] = Form.useForm();

  useEffect(() => {
    dispatch(getMySetDesignOrder());
  }, [dispatch]);

  const handleViewDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      await dispatch(getSetDesignOrderDetail(orderId)).unwrap();
      setDetailModalOpen(true);
    } catch (err) {
      console.error("Load order detail failed", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const submitRefund = async (order) => {
    try {
      const values = await refundForm.validateFields();
      setRefundLoading(true);

      const formData = new FormData();
      formData.append("bankName", values.bankName || "");
      formData.append("accountNumber", values.accountNumber || "");
      formData.append("accountName", values.accountName || "");
      formData.append("reason", values.reason || "");

      if (values.proofImages?.length > 0) {
        values.proofImages.forEach((file) => {
          formData.append("proofImages", file.originFileObj || file);
        });
      }

      // Debug: log formData entries
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }

      await dispatch(
        requestRefundSetDesign({ orderId: order._id, formData })
      ).unwrap();

      Modal.success({ content: "Đã gửi yêu cầu hoàn tiền thành công!" });
      setRefundModalOpen(false);
      setDetailModalOpen(false);
      refundForm.resetFields();
    } catch (err) {
      Modal.error({ content: err.message || "Gửi yêu cầu thất bại" });
    } finally {
      setRefundLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (code) => (
        <Text strong className="text-[#0F172A]">
          {code}
        </Text>
      ),
    },
    {
      title: "Set Design",
      dataIndex: ["setDesignId", "name"],
      key: "setDesign",
      render: (name, record) => (
        <div>
          <Text strong className="text-[#0F172A]">
            {name || "—"}
          </Text>
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
      render: (val) => (
        <Text strong className="text-[#C5A267]">
          {(val || 0).toLocaleString("vi-VN")}₫
        </Text>
      ),
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
      render: (val) => (val ? dayjs(val).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record._id)}
          style={{ color: "#C5A267" }}
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
        title={
          <span className="text-[#0F172A] font-bold">
            Chi tiết đơn Set Design
          </span>
        }
      >
        {detailLoading || !currentOrder ? (
          <div className="py-10 text-center">
            <Spin />
          </div>
        ) : (
          (() => {
            const order = currentOrder.order || currentOrder;
            const payments = currentOrder.payments || [];
            const lastPayment =
              payments.length > 0 ? payments[payments.length - 1] : null;
            console.log("Order status:", order.status);

            return (
              <div className="space-y-6">
                {/* Thông tin đơn hàng */}
                <Card className="border-slate-200 bg-[#FCFBFA]">
                  <Title level={5} className="!text-[#C5A267] !mb-4">
                    Thông tin đơn hàng
                  </Title>
                  <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Mã đơn">
                      <Text strong className="text-[#0F172A]">
                        {order.orderCode || order._id}
                      </Text>
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
                        {order.paidAmount?.toLocaleString("vi-VN") || "0"}₫
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn">
                      <Tag
                        color={statusColor[order.status] || "default"}
                        className="!font-semibold"
                      >
                        {statusText[order.status] || order.status || "—"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                      <Tag
                        color={
                          paymentStatusColor[order.paymentStatus] || "default"
                        }
                        className="!font-semibold"
                      >
                        {paymentStatusText[order.paymentStatus] ||
                          order.paymentStatus ||
                          "—"}
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
                {order?.customerId && typeof order.customerId === "object" && (
                  <Card className="border-slate-200">
                    <Title level={5} className="!text-[#C5A267] !mb-4">
                      Thông tin khách hàng
                    </Title>
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
                    <Title level={5} className="!text-[#C5A267] !mb-4">
                      Thông tin Set Design
                    </Title>
                    <Descriptions bordered column={1} size="middle">
                      <Descriptions.Item label="Tên Set Design">
                        <Text strong className="text-[#0F172A]">
                          {order.setDesignId.name || "—"}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá">
                        <Text strong className="text-[#C5A267]">
                          {(order.setDesignId.price || 0).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </Text>
                      </Descriptions.Item>
                      {order.setDesignId.category && (
                        <Descriptions.Item label="Danh mục">
                          <Tag
                            style={{
                              backgroundColor: "#C5A267",
                              color: "white",
                              border: 0,
                            }}
                          >
                            {order.setDesignId.category}
                          </Tag>
                        </Descriptions.Item>
                      )}
                      {order.setDesignId.description && (
                        <Descriptions.Item label="Mô tả">
                          <Text className="whitespace-pre-wrap">
                            {order.setDesignId.description}
                          </Text>
                        </Descriptions.Item>
                      )}
                      {order.setDesignId.images?.length > 0 && (
                        <Descriptions.Item label="Hình ảnh">
                          <div className="grid grid-cols-3 gap-2">
                            {order.setDesignId.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Set Design ${idx + 1}`}
                                className="w-full h-32 object-cover border border-slate-200 hover:border-[#C5A267] transition cursor-pointer"
                                onClick={() => window.open(img, "_blank")}
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
                        <Card
                          key={payment._id}
                          className="border-slate-100 bg-white"
                          size="small"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Text strong className="text-[#0F172A] block">
                                Giao dịch #{idx + 1}
                              </Text>
                              <Text className="text-xs text-slate-500">
                                Mã: {payment.paymentCode}
                              </Text>
                            </div>
                            <Tag
                              color={
                                paymentStatusColor[payment.status] || "default"
                              }
                              className="!font-semibold"
                            >
                              {paymentStatusText[payment.status] ||
                                payment.status ||
                                "—"}
                            </Tag>
                          </div>
                          <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Số tiền">
                              <Text strong className="text-[#C5A267]">
                                {(payment.amount || 0).toLocaleString("vi-VN")}₫
                              </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại thanh toán">
                              <Tag
                                color={
                                  payment.payType === "full"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {payment.payType === "full"
                                  ? "Thanh toán đầy đủ (100%)"
                                  : "Thanh toán trước (30%)"}
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
                            {/* ... các trường gatewayResponse khác nếu cần ... */}
                            <Descriptions.Item label="Ngày tạo">
                              {dayjs(payment.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Descriptions.Item>
                            {payment.paidAt && (
                              <Descriptions.Item label="Ngày thanh toán">
                                <Text className="text-green-600 font-semibold">
                                  {dayjs(payment.paidAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </Text>
                              </Descriptions.Item>
                            )}
                          </Descriptions>
                        </Card>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Khu vực nút hành động */}
                <div className="flex justify-end gap-4 mt-6 flex-wrap">
                  {lastPayment && lastPayment.status === "refunded" ? (
                    <Text
                      disabled
                      size="large"
                      className="rounded-xl border border-gray-300 shadow"
                    ></Text>
                  ) : (
                    <>
                      {/* Thanh toán còn lại / Tạo lại link thanh toán */}
                      {order.totalAmount > (order.paidAmount || 0) && (
                        <>
                          {payments.length > 0 &&
                          payments[payments.length - 1].status === "pending" ? (
                            <Button
                              type="primary"
                              size="large"
                              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl"
                              onClick={async () => {
                                try {
                                  const result = await dispatch(
                                    createOrderSetDesign({
                                      setDesignId:
                                        order.setDesignId?._id ||
                                        order.setDesignId,
                                      customerName:
                                        order.customerId?.username ||
                                        order.customerName,
                                      email:
                                        order.customerId?.email || order.email,
                                      phoneNumber: order.phoneNumber,
                                      description: order.description,
                                      quantity: order.quantity,
                                    })
                                  ).unwrap();

                                  Modal.success({
                                    content:
                                      "Tạo đơn thanh toán lại thành công! Đang chuyển...",
                                  });

                                  if (result?._id) {
                                    setTimeout(() => {
                                      window.location.href = `/set-design-order/detail/${result._id}`;
                                    }, 1200);
                                  }
                                } catch (err) {
                                  Modal.error({
                                    content:
                                      err?.message ||
                                      "Tạo đơn thanh toán lại thất bại!",
                                  });
                                }
                              }}
                            >
                              Tạo đơn thanh toán lại
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              size="large"
                              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl"
                              onClick={async () => {
                                try {
                                  const result = await dispatch(
                                    payRemainingSetDesign(order._id)
                                  ).unwrap();

                                  Modal.success({
                                    content: `Thanh toán phần còn lại (${(
                                      order.totalAmount -
                                      (order.paidAmount || 0)
                                    ).toLocaleString(
                                      "vi-VN"
                                    )}₫) thành công! Đang chuyển...`,
                                  });

                                  if (result?.checkoutUrl) {
                                    setTimeout(() => {
                                      window.location.href = result.checkoutUrl;
                                    }, 1200);
                                  }
                                } catch (err) {
                                  Modal.error({
                                    content:
                                      err?.message || "Thanh toán thất bại!",
                                  });
                                }
                              }}
                            >
                              Thanh toán phần còn lại (
                              {(
                                order.totalAmount - (order.paidAmount || 0)
                              ).toLocaleString("vi-VN")}
                              ₫)
                            </Button>
                          )}
                        </>
                      )}

                      {/* Nút Hủy đơn */}
                      {order.status !== "cancelled" &&
                        order.status !== "refunded" &&
                        order.paymentStatus !== "succeeded" && (
                          <Button
                            danger
                            size="large"
                            className="rounded-xl border border-red-400 shadow hover:shadow-lg"
                            onClick={() => {
                              Modal.confirm({
                                title: "Xác nhận hủy đơn",
                                content: (
                                  <div>
                                    <div>
                                      Bạn có chắc chắn muốn hủy đơn này?
                                    </div>
                                    <Input.TextArea
                                      placeholder="Lý do hủy đơn (tùy chọn)"
                                      id="cancel-reason-input"
                                      autoSize
                                    />
                                  </div>
                                ),
                                okText: "Hủy đơn",
                                okType: "danger",
                                cancelText: "Đóng",
                                onOk: async () => {
                                  const reason =
                                    document.getElementById(
                                      "cancel-reason-input"
                                    )?.value || "";
                                  try {
                                    await dispatch(
                                      cancelSetDesignOrder({
                                        orderId: order._id,
                                        reason,
                                      })
                                    ).unwrap();
                                    Modal.success({
                                      content: "Đã hủy đơn thành công!",
                                    });
                                    setDetailModalOpen(false);
                                    dispatch(getMySetDesignOrder());
                                  } catch (err) {
                                    Modal.error({
                                      content:
                                        err?.message || "Hủy đơn thất bại!",
                                    });
                                  }
                                },
                              });
                            }}
                          >
                            Hủy đặt
                          </Button>
                        )}
                    </>
                  )}
                </div>

                {/* Nút Yêu cầu hoàn tiền luôn ở dưới cùng nếu status = cancelled */}
                {order.status === "cancelled" && (
                  <div className="flex justify-end mt-4">
                    <Button
                      type="primary"
                      danger
                      size="large"
                      className="rounded-xl shadow hover:shadow-lg"
                      onClick={() => setRefundModalOpen(true)}
                    >
                      Yêu cầu hoàn tiền
                    </Button>
                  </div>
                )}

                {/* Modal yêu cầu hoàn tiền */}
                <Modal
                  title="Yêu cầu hoàn tiền"
                  open={refundModalOpen}
                  onCancel={() => {
                    setRefundModalOpen(false);
                    refundForm.resetFields();
                  }}
                  footer={null}
                  centered
                  width={500}
                >
                  <Form
                    form={refundForm}
                    layout="vertical"
                    onFinish={() => submitRefund(order)}
                  >
                    <Form.Item
                      name="bankName"
                      label="Tên ngân hàng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên ngân hàng",
                        },
                      ]}
                    >
                      <Input placeholder="Ví dụ: Vietcombank, Techcombank..." />
                    </Form.Item>

                    <Form.Item
                      name="accountNumber"
                      label="Số tài khoản"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số tài khoản",
                        },
                      ]}
                    >
                      <Input placeholder="0123456789" />
                    </Form.Item>

                    <Form.Item
                      name="accountName"
                      label="Tên chủ tài khoản"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên chủ tài khoản",
                        },
                      ]}
                    >
                      <Input
                        placeholder="NGUYEN VAN A"
                        style={{ textTransform: "uppercase" }}
                      />
                    </Form.Item>

                    <Form.Item name="reason" label="Lý do (Tùy chọn)">
                      <Input.TextArea
                        rows={3}
                        placeholder="Lý do hoàn tiền..."
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ảnh minh chứng (nếu có)"
                      name="proofImages"
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                      }
                    >
                      <Upload
                        listType="picture-card"
                        maxCount={5}
                        accept="image/*"
                        beforeUpload={() => false}
                        multiple
                      >
                        <div>
                          <PlusOutlined
                            style={{ fontSize: 28, color: "#1890ff" }}
                          />
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              color: "#666",
                            }}
                          >
                            Upload ảnh
                          </div>
                        </div>
                      </Upload>
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-6">
                      <Button onClick={() => setRefundModalOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={refundLoading}
                      >
                        Gửi yêu cầu hoàn tiền
                      </Button>
                    </div>
                  </Form>
                </Modal>
              </div>
            );
          })()
        )}
      </Modal>
    </div>
  );
}
