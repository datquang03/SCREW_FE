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

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy',
      'rejected': 'Từ chối'
    };
    return statusMap[status] || status;
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'wedding': 'Tiệc cưới',
      'corporate': 'Doanh nghiệp',
      'birthday': 'Sinh nhật',
      'other': 'Khác'
    };
    return categoryMap[category] || category;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
            Order Details
          </p>
          <Title level={1} className="!text-4xl md:!text-5xl !font-semibold !text-white !mb-0">
            Chi tiết Đặt Set Design
          </Title>
          <div className="h-px w-24 bg-[#C5A267] mx-auto mt-6 opacity-40"></div>
        </div>

        {/* Order Card */}
        <div className="bg-[#FCFBFA] border border-slate-200 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                  Mã đơn hàng
                </p>
                <Text className="text-2xl font-bold text-[#0F172A]">
                  #{order.orderCode || order._id?.slice(-6).toUpperCase()}
                </Text>
              </div>
              <Tag 
                color={order.status === "pending" ? "gold" : order.status === "completed" ? "green" : "blue"} 
                className="!text-sm !px-6 !py-2 !border-0 uppercase tracking-[0.2em] font-bold"
              >
                {getStatusText(order.status)}
              </Tag>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 mb-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Set Design
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    {order.setDesignId?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Loại Set
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    {getCategoryText(order.setDesignId?.category) || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Số lượng
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    {order.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Khách hàng
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    {order.customerId?.username || order.customerId?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Đơn giá
                  </p>
                  <p className="text-lg font-semibold text-[#C5A267]">
                    {order.unitPrice?.toLocaleString()} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Tổng tiền
                  </p>
                  <p className="text-3xl font-bold text-[#C5A267]">
                    {order.totalAmount?.toLocaleString()} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">
                    Ngày tạo
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {Array.isArray(order.setDesignId?.images) && order.setDesignId.images.length > 0 && (
              <div className="border-t border-slate-200 pt-8">
                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">
                  Hình ảnh Set Design
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order.setDesignId.images.map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden border border-slate-200 hover:border-[#C5A267] transition-all duration-300">
                      <img
                        src={img}
                        alt={`set-design-img-${idx}`}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Button */}
            <div className="flex justify-center mt-10 pt-8 border-t border-slate-200">
              <Button
                type="primary"
                size="large"
                className="!h-16 !px-16 !bg-[#C5A267] hover:!bg-[#0F172A] !border-none !text-white !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
                onClick={() => setPayModalOpen(true)}
              >
                Thanh toán đơn hàng
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <Modal
          open={payModalOpen}
          onCancel={() => setPayModalOpen(false)}
          footer={null}
          centered
          width={480}
          className="executive-modal"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
                Payment Options
              </p>
              <Title level={3} className="!text-2xl !font-semibold !text-[#0F172A] !mb-2">
                Chọn mức thanh toán
              </Title>
              <p className="text-slate-600 text-sm">
                Bạn muốn thanh toán toàn bộ hay trước 30%?
              </p>
            </div>

            <Radio.Group
              value={payType}
              onChange={e => setPayType(e.target.value)}
              className="flex flex-col gap-4 mb-8 w-full"
            >
              <Radio.Button 
                value="full" 
                className={`!h-16 !text-base !font-bold border-2 transition-all duration-300 ${
                  payType === 'full' 
                    ? '!bg-[#C5A267] !text-white !border-[#C5A267]' 
                    : '!bg-white !text-[#0F172A] !border-slate-200 hover:!border-[#C5A267]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="uppercase tracking-[0.2em]">Thanh toán 100%</span>
                </div>
              </Radio.Button>
              <Radio.Button 
                value="prepay_30" 
                className={`!h-16 !text-base !font-bold border-2 transition-all duration-300 ${
                  payType === 'prepay_30' 
                    ? '!bg-[#C5A267] !text-white !border-[#C5A267]' 
                    : '!bg-white !text-[#0F172A] !border-slate-200 hover:!border-[#C5A267]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="uppercase tracking-[0.2em]">Thanh toán trước 30%</span>
                </div>
              </Radio.Button>
            </Radio.Group>

            <Button
              type="primary"
              size="large"
              block
              className="!h-16 !bg-[#0F172A] hover:!bg-[#C5A267] !border-none !text-white !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
              loading={payLoading}
              onClick={handlePay}
            >
              Xác nhận thanh toán
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BookingDetailPage;