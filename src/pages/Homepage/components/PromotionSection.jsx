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
    <div className="w-full bg-[#FCFBFA] py-12 px-2 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold text-[#C5A267] uppercase tracking-[0.3em] text-center mb-4">ƯU ĐÃI ĐẶC BIỆT</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] mb-2 text-center">Ưu đãi đặc biệt</h2>
        <p className="text-slate-600 mb-6 text-center">Nhận ưu đãi hấp dẫn cho lần đặt studio tiếp theo của bạn.</p>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {promoList.map((promo) => (
            <div
              key={promo._id}
              className="min-w-[320px] w-full max-w-md overflow-hidden bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row items-stretch"
            >
              {/* LEFT */}
              <div className="flex-1 p-6 flex flex-col justify-between bg-[#0F172A] relative">
                <span className="uppercase text-xs font-semibold text-[#C5A267] tracking-[0.3em] mb-2">Ưu đãi giới hạn</span>
                <div>
                  <div className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-tight">{promo.name || 'New Year Kickstart: 20% OFF'}</div>
                  <div className="text-white/90 text-lg mb-6">{promo.description || 'Sử dụng mã bên dưới để nhận ưu đãi.'}</div>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 border-2 border-dashed border-[#C5A267] px-6 py-3 text-lg font-mono font-semibold text-white tracking-widest flex items-center gap-2 select-all cursor-pointer" onClick={() => handleCopy(promo.code)}>
                    {promo.code || 'STUDIO20'}
                    <CopyOutlined />
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/studio")} 
                  type="primary" 
                  size="large" 
                  style={{ backgroundColor: '#A0826D', borderColor: '#A0826D', color: 'white' }}
                  className="font-semibold flex items-center gap-2 w-fit px-8 py-2 text-base uppercase tracking-[0.2em]"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8B7355'; e.currentTarget.style.borderColor = '#8B7355'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#A0826D'; e.currentTarget.style.borderColor = '#A0826D'; }}
                >
                  Dùng ngay <ThunderboltFilled />
                </Button>
              </div>
              {/* RIGHT */}
              <div className="flex-1 min-h-[220px] md:min-h-0">
                <img src={promo.image || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80'} alt="promo" className="w-full h-full object-cover transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromotionSection
