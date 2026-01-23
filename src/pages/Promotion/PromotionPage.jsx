import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tag, Typography, Card, Spin } from 'antd'
import dayjs from 'dayjs'
import { getPromotionForCustomer } from '../../features/promotion/promotionSlice'
import { FiClock, FiInfo, FiGift, FiTag } from 'react-icons/fi'

const { Text, Title, Paragraph } = Typography

const PromotionPage = () => {
  const dispatch = useDispatch()
  const { activePromotions, loading } = useSelector(state => state.promotion)

  // Dữ liệu từ API trả về có dạng { promotions: [...], total: ... } hoặc mảng tùy endpoint
  const dataSource = activePromotions?.promotions || (Array.isArray(activePromotions) ? activePromotions : [])

  useEffect(() => {
    dispatch(getPromotionForCustomer())
  }, [dispatch])

  const columns = [
    {
      title: 'Thông tin chương trình',
      key: 'info',
      width: '30%',
      render: (_, record) => (
        <div className="flex flex-col gap-2 pr-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Text strong className="text-base text-[#0F172A] font-semibold">{record.name}</Text>
            <div className="bg-[#0F172A] px-3 py-1">
              <span className="text-[#C5A267] text-xs font-bold tracking-widest uppercase">{record.code}</span>
            </div>
          </div>
          <Text className="text-sm text-slate-500 font-light leading-relaxed">
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: 'Mức giảm',
      key: 'discount',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col items-center justify-center h-full">
          <Text strong className="text-2xl text-[#C5A267] font-semibold">
            {record.discountValue?.toLocaleString('vi-VN')}
            {record.discountType === 'percentage' ? '%' : '₫'}
          </Text>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">
            {record.discountType === 'percentage' ? 'Phần trăm' : 'Trực tiếp'}
          </span>
        </div>
      )
    },
    {
      title: 'Điều kiện áp dụng',
      key: 'conditions',
      width: '30%',
      render: (_, record) => (
        <div className="text-sm space-y-3 bg-[#F8F9FA] p-4 border border-slate-100">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
             <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Đơn tối thiểu</span>
             <Text strong className="text-[#0F172A]">{record.minOrderValue?.toLocaleString('vi-VN')}₫</Text>
          </div>
          {record.maxDiscount && (
             <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Giảm tối đa</span>
                <Text strong className="text-[#0F172A]">{record.maxDiscount?.toLocaleString('vi-VN')}₫</Text>
             </div>
          )}
          <div className="pt-2">
             <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mr-2">Phạm vi:</span>
             <span className="text-sm font-semibold text-[#0F172A]">
               {record.applicableFor === 'all' ? 'Tất cả dịch vụ' : record.applicableFor}
             </span>
          </div>
        </div>
      )
    },
    {
      title: 'Thời gian & Trạng thái',
      key: 'meta',
      width: '25%',
      render: (_, record) => (
        <div className="text-sm space-y-4">
          <div>
            <div className="flex items-center text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-2 gap-2">
                <FiClock className="text-[#C5A267]" /> Hiệu lực
            </div>
            <div className="font-semibold text-[#0F172A]">
              {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
             {record.usageLimit ? (
                 <div className="bg-[#0F172A] px-3 py-1 border border-slate-100">
                   <span className="text-[#C5A267] text-xs font-bold tracking-widest uppercase">
                     {record.usageLimit} lượt
                   </span>
                 </div>
             ) : (
                 <div className="bg-[#C5A267] px-3 py-1">
                   <span className="text-[#0F172A] text-xs font-bold tracking-widest uppercase">
                     Không giới hạn
                   </span>
                 </div>
             )}
             <div className={`px-3 py-1 border ${record.isActive ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
               <span className={`text-xs font-bold tracking-widest uppercase ${record.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                 {record.isActive ? 'Hoạt động' : 'Ngưng'}
               </span>
             </div>
          </div>
        </div>
      )
    }
  ]

  return (
      <div className="bg-[#FCFBFA] min-h-screen selection:bg-[#C5A267]/20">
        {/* EXECUTIVE HEADER */}
        <div className="bg-[#0F172A] py-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A267]/5 rounded-bl-full"></div>
           <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">
                    Exclusive Offers
                  </p>
                  <Title level={1} className="!text-5xl md:!text-6xl !font-semibold !text-white !mb-0">
                    Ưu Đãi & Khuyến Mãi
                  </Title>
                  <div className="h-px w-24 bg-[#C5A267] mx-auto opacity-40"></div>
                  <Paragraph className="text-slate-400 text-sm uppercase tracking-widest max-w-2xl mx-auto">
                    Khám phá các mã giảm giá độc quyền dành riêng cho bạn
                  </Paragraph>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-6 py-24">
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block">
                <div className="bg-white border border-slate-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="px-10 py-8 bg-[#F8F9FA] border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-2">
                            Danh mục ưu đãi
                          </p>
                          <Title level={4} className="!m-0 !text-[#0F172A] !font-semibold">Mã khuyến mãi hiệu lực</Title>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                            Tổng cộng
                          </span>
                          <span className="text-2xl font-semibold text-[#C5A267]">{dataSource.length}</span>
                          <span className="text-sm text-slate-400 ml-2">mã</span>
                        </div>
                    </div>
                    <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    rowKey="_id"
                    loading={loading}
                    pagination={{ 
                      pageSize: 10,
                      className: "!px-10 !py-6"
                    }}
                    className="executive-table"
                    />
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="block md:hidden space-y-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                     <div>
                       <p className="text-[9px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-1">
                         Danh mục
                       </p>
                       <Title level={4} className="!m-0 !font-semibold !text-[#0F172A]">Mã ưu đãi</Title>
                     </div>
                     <div className="text-right">
                       <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Tổng</span>
                       <span className="text-xl font-semibold text-[#C5A267]">{dataSource.length}</span>
                     </div>
                </div>
                {loading ? (
                    <div className="text-center py-20 bg-white border border-slate-100">
                      <Spin size="large" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-4">Đang tải dữ liệu...</p>
                    </div>
                ) : dataSource.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-100">
                      <FiGift className="text-5xl text-slate-300 mx-auto mb-4" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        Hiện chưa có khuyến mãi
                      </p>
                    </div>
                ) : (
                    dataSource.map((item) => (
                        <div key={item._id} className="bg-white border border-slate-100 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] active:scale-[0.98]">
                        <div className="p-6 space-y-6">
                          {/* Header */}
                          <div className="flex justify-between items-start gap-4 pb-6 border-b border-slate-50">
                            <div className="flex-1">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-2">
                                  Chương trình
                                </p>
                                <Text strong className="text-lg block mb-3 text-[#0F172A]">{item.name}</Text>
                                <div className="inline-block bg-[#0F172A] px-4 py-1.5">
                                  <span className="text-[#C5A267] text-xs font-bold tracking-widest uppercase">{item.code}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                                  Mức giảm
                                </p>
                                <Text strong className="text-3xl block text-[#C5A267]">
                                    {item.discountValue?.toLocaleString('vi-VN')}
                                    {item.discountType === 'percentage' ? '%' : '₫'}
                                </Text>
                            </div>
                          </div>

                        {item.description && (
                            <div className="bg-[#F8F9FA] p-4 border-l-2 border-[#C5A267] text-sm text-slate-600 flex items-start gap-3">
                                <FiInfo className="mt-0.5 flex-shrink-0 text-[#C5A267]" />
                                <span className="font-light leading-relaxed">{item.description}</span>
                            </div>
                        )}

                        {/* Conditions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F8F9FA] p-4 border border-slate-100">
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                                  Đơn tối thiểu
                                </span>
                                <Text strong className="text-[#0F172A]">{item.minOrderValue?.toLocaleString('vi-VN')}₫</Text>
                            </div>
                            {item.maxDiscount && (
                                <div className="bg-[#F8F9FA] p-4 border border-slate-100">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                                      Giảm tối đa
                                    </span>
                                    <Text strong className="text-[#0F172A]">{item.maxDiscount?.toLocaleString('vi-VN')}₫</Text>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest">
                                <FiClock className="text-[#C5A267]" />
                                <span className="font-bold">HSD: {dayjs(item.endDate).format('DD/MM')}</span>
                             </div>
                             <div>
                                {item.usageLimit ? (
                                    <div className="bg-[#0F172A] px-3 py-1">
                                      <span className="text-[#C5A267] text-xs font-bold tracking-widest uppercase">
                                        {item.usageLimit} lượt
                                      </span>
                                    </div>
                                ) : (
                                    <div className="bg-[#C5A267] px-3 py-1">
                                      <span className="text-[#0F172A] text-xs font-bold tracking-widest uppercase">
                                        Không giới hạn
                                      </span>
                                    </div>
                                )}
                             </div>
                        </div>
                      </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}

export default PromotionPage