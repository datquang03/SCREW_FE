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
        <div className="flex flex-col gap-1 pr-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Text strong className="text-base">{record.name}</Text>
            <Tag color="blue" className="m-0 font-bold">{record.code}</Tag>
          </div>
          <Text type="secondary" className="text-sm text-gray-500 break-words whitespace-normal text-justify">
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
          <Text type="danger" strong style={{ fontSize: '20px' }}>
            {record.discountValue?.toLocaleString('vi-VN')}
            {record.discountType === 'percentage' ? '%' : '₫'}
          </Text>
          <div className="text-xs text-gray-500">
            {record.discountType === 'percentage' ? 'Giảm theo %' : 'Giảm trực tiếp'}
          </div>
        </div>
      )
    },
    {
      title: 'Điều kiện áp dụng',
      key: 'conditions',
      width: '30%',
      render: (_, record) => (
        <div className="text-sm space-y-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-1 border-dashed">
             <span className="text-gray-500 text-xs">Đơn tối thiểu</span>
             <Text strong>{record.minOrderValue?.toLocaleString('vi-VN')}₫</Text>
          </div>
          {record.maxDiscount && (
             <div className="flex justify-between items-center border-b border-gray-200 pb-1 border-dashed">
                <span className="text-gray-500 text-xs">Giảm tối đa</span>
                <Text strong>{record.maxDiscount?.toLocaleString('vi-VN')}₫</Text>
             </div>
          )}
          <div className="pt-1">
             <span className="text-gray-500 text-xs mr-2">Phạm vi:</span>
             <span className="font-medium">{record.applicableFor === 'all' ? 'Tất cả dịch vụ' : record.applicableFor}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Thời gian & Trạng thái',
      key: 'meta',
      width: '25%',
      render: (_, record) => (
        <div className="text-sm space-y-3">
          <div>
            <div className="flex items-center text-xs text-gray-500 mb-1 gap-1">
                <FiClock /> Thời gian hiệu lực
            </div>
            <div className="font-medium">{dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
             {record.usageLimit ? (
                 <Tag color="orange" className="m-0 border-0">{record.usageLimit} lượt</Tag>
             ) : (
                 <Tag color="cyan" className="m-0 border-0">Không giới hạn</Tag>
             )}
             <Tag color={record.isActive ? 'success' : 'error'} className="m-0 border-0">
                 {record.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
             </Tag>
          </div>
        </div>
      )
    }
  ]

  return (
      <div className="pb-10">
        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-8 shadow-lg">
           <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                       <FiGift className="text-3xl text-yellow-300 animate-bounce" />
                       <Title level={2} style={{ color: 'white', margin: 0 }}>Kho Ưu Đãi & Khuyến Mãi</Title>
                  </div>
                  <Paragraph className="text-lg max-w-2xl" style={{ color: 'white' }}>
                    Khám phá các mã giảm giá và chương trình ưu đãi độc quyền dành riêng cho bạn tại S+ Studio. 
                    Lưu ngay mã để sử dụng cho lần đặt lịch tiếp theo!
                  </Paragraph>
              </div>
              <div className="hidden md:block">
                  <FiTag className="text-[120px] text-white opacity-20 rotate-12" />
              </div>
           </div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block">
                <Card className="shadow-lg rounded-2xl border-0 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <Title level={4} className="m-0 text-gray-700">Danh sách mã hiệu lực</Title>
                        <Tag color="blue">{dataSource.length} mã khả dụng</Tag>
                    </div>
                    <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="block md:hidden space-y-4">
                <div className="flex items-center justify-between mb-4">
                     <Title level={4} className="m-0">Mã ưu đãi của bạn</Title>
                     <span className="text-gray-500 text-sm">{dataSource.length} mã</span>
                </div>
                {loading ? (
                    <div className="text-center py-10"><Spin size="large" /></div>
                ) : dataSource.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">Hiện chưa có khuyến mãi nào</div>
                ) : (
                    dataSource.map((item) => (
                        <Card key={item._id} className="shadow-md rounded-xl border-l-[6px] border-blue-600 overflow-hidden transition-all active:scale-[0.98]">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 mr-2">
                                <Text strong className="text-lg block mb-1">{item.name}</Text>
                                <Tag color="blue" className="text-sm font-mono">{item.code}</Tag>
                            </div>
                            <div className="text-right whitespace-nowrap">
                                <Text type="danger" strong className="text-xl block">
                                    {item.discountValue?.toLocaleString('vi-VN')}
                                    {item.discountType === 'percentage' ? '%' : '₫'}
                                </Text>
                                <Text type="secondary" className="text-xs">
                                    {item.discountType === 'percentage' ? 'Giảm' : 'Giảm trực tiếp'}
                                </Text>
                            </div>
                        </div>

                        {item.description && (
                            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mb-3 flex items-start gap-2">
                                <FiInfo className="mt-1 flex-shrink-0 text-blue-400" />
                                <span>{item.description}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-500 text-xs block">Đơn tối thiểu</span>
                                <Text strong>{item.minOrderValue?.toLocaleString('vi-VN')}₫</Text>
                            </div>
                            {item.maxDiscount && (
                                <div className="bg-gray-50 p-2 rounded">
                                    <span className="text-gray-500 text-xs block">Giảm tối đa</span>
                                    <Text strong>{item.maxDiscount?.toLocaleString('vi-VN')}₫</Text>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                             <div className="flex items-center gap-1">
                                <FiClock />
                                <span>HSD: {dayjs(item.endDate).format('DD/MM/YYYY')}</span>
                             </div>
                             <div>
                                {item.usageLimit ? (
                                    <Tag color="orange" className="m-0 text-xs rounded-full px-2">{item.usageLimit} lượt</Tag>
                                ) : (
                                    <Tag color="green" className="m-0 text-xs rounded-full px-2">Không giới hạn</Tag>
                                )}
                             </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
      </div>
    </div>
  )
}

export default PromotionPage