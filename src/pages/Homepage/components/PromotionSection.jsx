import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, message } from 'antd'
import { CopyOutlined, ThunderboltFilled } from '@ant-design/icons'
import { getPromotionForCustomer } from '../../../features/promotion/promotionSlice'
import { useNavigate } from 'react-router-dom'

const PromotionSection = () => {
  const dispatch = useDispatch();
  const { activePromotions } = useSelector((state) => state.promotion);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getPromotionForCustomer());
  }, [dispatch]);

  const handleCopy = (code) => {
    if (code) {
      navigator.clipboard.writeText(code);
      message.success(`Đã copy mã ${code} thành công!`);
    }
  };

  // Đảm bảo luôn là mảng
  const promoList = Array.isArray(activePromotions)
    ? activePromotions
    : (activePromotions?.promotions || []);

  if (!promoList || promoList.length === 0) return <div className="text-center text-gray-400 py-10">Không có ưu đãi nào khả dụng.</div>;

  return (
    <div className="w-full bg-[#f5f8fe] py-12 px-2 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ưu đãi đặc biệt</h2>
        <p className="text-gray-500 mb-6">Nhận ưu đãi hấp dẫn cho lần đặt studio tiếp theo của bạn.</p>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {promoList.map((promo) => (
            <div
              key={promo._id}
              className="min-w-[340px] w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-xl flex flex-col md:flex-row items-stretch"
            >
              {/* LEFT */}
              <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-br from-black/80 via-black/60 to-gray-900/60 relative">
                <span className="uppercase text-xs font-bold text-blue-400 tracking-widest mb-2">Ưu đãi giới hạn</span>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{promo.name || 'New Year Kickstart: 20% OFF'}</div>
                  <div className="text-white/90 text-lg mb-6">{promo.description || 'Sử dụng mã bên dưới để nhận ưu đãi.'}</div>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 border-2 border-dashed border-white/40 rounded-xl px-6 py-3 text-lg font-mono font-bold text-white tracking-widest flex items-center gap-2 select-all cursor-pointer" onClick={() => handleCopy(promo.code)}>
                    {promo.code || 'STUDIO20'}
                    <CopyOutlined />
                  </div>
                </div>
                <Button onClick={() => navigate("/studio")} type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 border-none font-bold flex items-center gap-2 w-fit px-8 py-2 text-base">
                  Dùng ngay <ThunderboltFilled />
                </Button>
              </div>
              {/* RIGHT */}
              <div className="flex-1 min-h-[220px] md:min-h-0">
                <img src={promo.image || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80'} alt="promo" className="w-full h-full object-cover object-center md:rounded-none rounded-b-3xl md:rounded-r-3xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromotionSection
