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
  paid: "green",
  cancelled: "red",
};

const paymentStatusColor = {
  pending: "orange",
  succeeded: "green",
  failed: "red",
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
      render: (code) => <Text strong>{code}</Text>,
    },
    {
      title: "Set Design",
      dataIndex: ["setDesignId", "name"],
      key: "setDesign",
      render: (name, record) => (
        <div>
          <Text strong>{name || "—"}</Text>
          <div className="text-gray-500 text-xs">
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
      render: (val) => <Text strong>{(val || 0).toLocaleString("vi-VN")}₫</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (val) => <Tag color={statusColor[val] || "default"}>{val || "—"}</Tag>,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (val) => (
        <Tag color={paymentStatusColor[val] || "default"}>{val || "—"}</Tag>
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
        <Button type="link" onClick={() => handleViewDetail(record._id)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-amber-600 font-bold">
            Set Design
          </p>
          <Title level={2} className="!mb-0">
            Đơn đặt Set Design của tôi
          </Title>
          <Text type="secondary">
            Xem danh sách đơn hàng set design và chi tiết thanh toán
          </Text>
        </div>
        <Button loading={loading} onClick={() => dispatch(getMySetDesignOrder())}>
          Làm mới
        </Button>
      </div>

      <Card className="shadow-md border border-gray-100 rounded-2xl">
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
        width={720}
        title="Chi tiết đơn Set Design"
      >
        {detailLoading || !currentOrder ? (
          <div className="py-10 text-center">
            <Spin />
          </div>
        ) : (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Mã đơn">
              {currentOrder.orderCode || currentOrder._id}
            </Descriptions.Item>
            <Descriptions.Item label="Set Design">
              {currentOrder?.setDesignId?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Giá Set Design">
              {(currentOrder?.setDesignId?.price || 0).toLocaleString("vi-VN")}₫
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {currentOrder.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {currentOrder.totalAmount?.toLocaleString("vi-VN")}₫
            </Descriptions.Item>
            <Descriptions.Item label="Đã thanh toán">
              {currentOrder.paidAmount?.toLocaleString("vi-VN")}₫
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn">
              <Tag color={statusColor[currentOrder.status] || "default"}>
                {currentOrder.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              <Tag color={paymentStatusColor[currentOrder.paymentStatus] || "default"}>
                {currentOrder.paymentStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {currentOrder.createdAt
                ? dayjs(currentOrder.createdAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {currentOrder.updatedAt
                ? dayjs(currentOrder.updatedAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}


