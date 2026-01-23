import React, { useEffect } from 'react'
import { Typography, Card, Table, Button, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { getMyReport, getReportById } from '../../features/report/reportSlice';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const UserReportPage = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector(state => state.report);

  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [reportDetail, setReportDetail] = React.useState(null);

  useEffect(() => {
    dispatch(getMyReport());
  }, [dispatch]);

  const handleViewDetail = async (id) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await dispatch(getReportById(id)).unwrap();
      setReportDetail(res);
    } catch {
      setReportDetail(null);
    }
    setDetailLoading(false);
  };

  // Thống kê số lượng báo cáo
  const totalReports = reports?.length || 0;
  const pendingReports = reports?.filter(r => r.status?.toLowerCase() === 'pending').length || 0;
  const resolvedReports = reports?.filter(r => r.status?.toLowerCase() === 'resolved').length || 0;

  // Table columns
  const columns = [
    {
      title: 'Loại vấn đề',
      dataIndex: 'issueType',
      key: 'issueType',
      render: (v) => {
        switch (v) {
          case 'missing_item': return 'Thiếu đồ';
          case 'complaint': return 'Khiếu nại';
          case 'inappropriate_content': return 'Nội dung không phù hợp';
          case 'other': return 'Khác';
          default: return v;
        }
      },
    },
    {
      title: 'Đối tượng',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (v) => <span className="text-gray-700">{v || '-'}</span>,
    },
    {
      title: 'Người gửi',
      dataIndex: ['reporterId', 'email'],
      key: 'reporterEmail',
      render: (_, r) => <span className="text-blue-700">{r.reporterId?.email || '-'}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (v) => (
        <span className="max-w-[220px] truncate block" title={v}>
          {v}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (v) => {
        switch (v?.toLowerCase()) {
          case 'pending': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">Đang xử lý</span>;
          case 'resolved': return <span className="px-2 py-1 rounded bg-green-100 text-green-700">Đã phản hồi</span>;
          default: return v;
        }
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (v) => {
        switch (v?.toLowerCase()) {
          case 'high': return <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">Cao</span>;
          case 'medium': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">Trung bình</span>;
          case 'low': return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Thấp</span>;
          default: return v;
        }
      },
    },
    {
      title: 'Bồi thường',
      dataIndex: 'compensationAmount',
      key: 'compensationAmount',
      render: (v) => v ? v.toLocaleString('vi-VN') + '₫' : '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Tác vụ',
      key: 'actions',
      render: (_, r) => (
        <Button type="link" onClick={() => handleViewDetail(r._id)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <Title level={2}>Báo cáo & phản hồi</Title>
        <Text className="text-gray-700">
          Xem lại các báo cáo, phản hồi hoặc góp ý bạn đã gửi về dịch vụ của chúng tôi.
        </Text>
      </div>
      {/* THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-blue-700">{totalReports}</div>
          <div className="text-gray-600">Tổng số báo cáo đã gửi</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-blue-700">{pendingReports}</div>
          <div className="text-gray-600">Báo cáo đang xử lý</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-green-700">{resolvedReports}</div>
          <div className="text-gray-600">Báo cáo đã phản hồi</div>
        </Card>
      </div>
      {/* BẢNG DANH SÁCH BÁO CÁO */}
      <div className="mt-8">
        <Table
          columns={columns}
          dataSource={reports?.map(r => ({ ...r, key: r._id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      {/* MODAL CHI TIẾT */}
      <Modal
        open={detailModalOpen}
        onCancel={() => { setDetailModalOpen(false); setReportDetail(null); }}
        footer={null}
        centered
        width={window.innerWidth < 600 ? '95vw' : 500}
        title={
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl text-blue-600 font-bold">{reportDetail?.issueType ? reportDetail.issueType[0].toUpperCase() : '?'}</span>
            </div>
            <div>
              <span className="font-bold text-lg">Chi tiết báo cáo</span>
              <div className="text-xs text-gray-500">ID: {reportDetail?._id}</div>
            </div>
          </div>
        }
        styles={{ body: { padding: window.innerWidth < 600 ? '16px' : '24px' } }}
      >
        {detailLoading ? (
          <div className="flex justify-center items-center min-h-[180px]">
            <Spin size="large" />
          </div>
        ) : reportDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Loại vấn đề</div>
                <div className="font-semibold text-blue-700 text-base">
                  {(() => {
                    switch (reportDetail.issueType) {
                      case 'missing_item': return 'Thiếu đồ';
                      case 'complaint': return 'Khiếu nại';
                      case 'inappropriate_content': return 'Nội dung không phù hợp';
                      case 'other': return 'Khác';
                      default: return reportDetail.issueType;
                    }
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Đối tượng</div>
                <div className="font-semibold text-gray-700 text-base">{reportDetail.targetType || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Người gửi</div>
                <div className="font-semibold text-blue-700 text-base">{reportDetail.reporterId?.email || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Ngày tạo</div>
                <div className="font-semibold text-base">{reportDetail.createdAt ? dayjs(reportDetail.createdAt).format('DD/MM/YYYY HH:mm') : '-'}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Mô tả</div>
              <div className="bg-gray-50 rounded p-3 text-base text-gray-800 border border-gray-200 min-h-[48px]">{reportDetail.description || '-'}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
                <div>
                  {(() => {
                    switch (reportDetail.status?.toLowerCase()) {
                      case 'pending': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">Đang xử lý</span>;
                      case 'resolved': return <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">Đã phản hồi</span>;
                      default: return reportDetail.status;
                    }
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Độ ưu tiên</div>
                <div>
                  {(() => {
                    switch (reportDetail.priority?.toLowerCase()) {
                      case 'high': return <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">Cao</span>;
                      case 'medium': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">Trung bình</span>;
                      case 'low': return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Thấp</span>;
                      default: return reportDetail.priority;
                    }
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Bồi thường</div>
                <div className="font-semibold text-base">{reportDetail.compensationAmount ? reportDetail.compensationAmount.toLocaleString('vi-VN') + '₫' : '-'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Không có dữ liệu chi tiết.</div>
        )}
      </Modal>
    </div>
  )
}

export default UserReportPage
