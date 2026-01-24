import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMySetDesignOrder, createPaymentFull, createPayment30 } from "../../features/setDesignPayment/setDesignPayment";
import { Spin, Card, Typography, Tag, Button, Modal, Radio } from "antd";

const { Title, Text } = Typography;

const BookingDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { mySetDesignOrders, loading } = useSelector((state) => state.setDesignPayment || {});
  const [order, setOrder] = React.useState(null);
  const [payModalOpen, setPayModalOpen] = React.useState(false);
  const [payType, setPayType] = React.useState("full");
  const [payLoading, setPayLoading] = React.useState(false);

  useEffect(() => {
    dispatch(getMySetDesignOrder()).then((res) => {
      if (res.payload && Array.isArray(res.payload)) {
        const found = res.payload.find((o) => o._id === id);
        setOrder(found || null);
      }
    });
  }, [id, dispatch]);

  const handlePay = async () => {
    setPayLoading(true);
    try {
      let result;
      if (payType === "full") {
        result = await dispatch(createPaymentFull(order._id)).unwrap();
        Modal.success({ content: "Thanh toán 100% thành công! Đang chuyển đến trang thanh toán..." });
      } else {
        result = await dispatch(createPayment30(order._id)).unwrap();
        Modal.success({ content: "Thanh toán trước 30% thành công! Đang chuyển đến trang thanh toán..." });
      }
      setPayModalOpen(false);
      // Nếu có checkoutUrl thì chuyển hướng sang đó
      if (result && result.checkoutUrl) {
        setTimeout(() => {
          window.location.href = result.checkoutUrl;
        }, 1200);
      }
    } catch (err) {
      Modal.error({ content: err?.message || "Thanh toán thất bại!" });
    } finally {
      setPayLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBFA]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-16 px-4 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl p-8 relative">
        <Title level={2} className="text-[#0F172A] mb-6 text-center">Chi tiết Đặt Set Design</Title>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <Text strong>Mã đơn:</Text> <Text code>#{order.orderCode || order._id?.slice(-6).toUpperCase()}</Text>
          </div>
          <Tag color={order.status === "pending" ? "gold" : order.status === "completed" ? "green" : "blue"} className="text-base px-4 py-1 rounded-xl">
            {order.status}
          </Tag>
        </div>
        <div className="mb-2"><Text strong>Set Design:</Text> <span className="font-semibold text-blue-700">{order.setDesignId?.name || "-"}</span></div>
        <div className="mb-2"><Text strong>Giá:</Text> <span className="text-emerald-600 font-bold">{order.unitPrice?.toLocaleString()} VND</span></div>
        <div className="mb-2"><Text strong>Số lượng:</Text> <span className="font-semibold">{order.quantity}</span></div>
        <div className="mb-2"><Text strong>Tổng tiền:</Text> <span className="text-xl text-indigo-700 font-extrabold">{order.totalAmount?.toLocaleString()} VND</span></div>
        <div className="mb-2"><Text strong>Ngày tạo:</Text> <span className="text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</span></div>
        <div className="mb-2"><Text strong>Khách hàng:</Text> <span className="text-gray-700">{order.customerId?.username || order.customerId?.email || "-"}</span></div>
        {Array.isArray(order.setDesignId?.images) && order.setDesignId.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-6">
            {order.setDesignId.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`set-design-img-${idx}`}
                className="w-full h-32 object-cover rounded-xl border shadow"
              />
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <Button
            type="primary"
            size="large"
            className="rounded-2xl px-8 py-2 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all"
            onClick={() => setPayModalOpen(true)}
          >
            Thanh toán đơn hàng
          </Button>
        </div>
        <Modal
          open={payModalOpen}
          onCancel={() => setPayModalOpen(false)}
          footer={null}
          centered
          width={400}
          className="rounded-2xl"
          bodyStyle={{ borderRadius: 24, padding: 32, background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)' }}
        >
          <div className="text-center mb-6">
            <Title level={4} className="mb-2">Chọn mức thanh toán</Title>
            <Text className="text-gray-600">Bạn muốn thanh toán toàn bộ hay trước 30%?</Text>
          </div>
          <Radio.Group
            value={payType}
            onChange={e => setPayType(e.target.value)}
            className="flex flex-col gap-4 items-center mb-8"
          >
            <Radio.Button value="full" className="w-48 h-14 text-lg font-bold rounded-xl shadow bg-white border border-blue-400 flex items-center justify-center">
              Thanh toán 100%
            </Radio.Button>
            <Radio.Button value="prepay_30" className="w-48 h-14 text-lg font-bold rounded-xl shadow bg-white border border-emerald-400 flex items-center justify-center">
              Thanh toán trước 30%
            </Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            size="large"
            block
            className="rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl"
            loading={payLoading}
            onClick={handlePay}
          >
            Xác nhận thanh toán
          </Button>
        </Modal>
      </Card>
    </div>
  );
};

export default BookingDetailPage;