import React from 'react'
import { Typography, Card } from 'antd'

const { Title, Text } = Typography;

const UserReportPage = () => {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <Title level={2}>Báo cáo & phản hồi</Title>
        <Text className="text-gray-700">
          Gửi báo cáo, phản hồi hoặc góp ý về dịch vụ của chúng tôi.
        </Text>
      </div>
      {/* THỐNG KÊ/PLACEHOLDER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold">0</div>
          <div className="text-gray-600">Tổng số báo cáo đã gửi</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold">0</div>
          <div className="text-gray-600">Báo cáo đang xử lý</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold">0</div>
          <div className="text-gray-600">Báo cáo đã phản hồi</div>
        </Card>
      </div>
      {/* NỘI DUNG CHÍNH */}
      <div className="mt-8">
        <Card>
          <div className="text-lg font-semibold mb-2">Gửi báo cáo/Phản hồi</div>
          <div className="text-gray-500">(Chức năng này đang phát triển...)</div>
        </Card>
      </div>
    </div>
  )
}

export default UserReportPage
