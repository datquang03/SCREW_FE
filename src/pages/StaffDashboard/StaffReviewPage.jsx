import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Tag, Button, Modal, Typography, Spin } from 'antd';
import { getReviews } from '../../features/reviews/reviewSlice';
import { getStudioById } from '../../features/studio/studioSlice';
import dayjs from 'dayjs';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const StaffReviewPage = () => {
  const dispatch = useDispatch();
  const reviewsState = useSelector(state => state.reviews || {});
  const { reviews = [], loading = false } = reviewsState;
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [studioDetail, setStudioDetail] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const action = await dispatch(getReviews());
      const reviewsData = action.payload || [];
      const studioIds = reviewsData.filter(r => r.targetType === 'Studio').map(r => r.targetId);
      const uniqueStudioIds = Array.from(new Set(studioIds));
      const studioMap = {};
      for (const id of uniqueStudioIds) {
        try {
          const studio = await dispatch(getStudioById(id)).unwrap();
          studioMap[id] = studio;
        } catch {}
      }
      // Gán studioDetail vào từng review
      reviewsData.forEach(r => {
        if (r.targetType === 'Studio' && studioMap[r.targetId]) {
          r.studioDetail = studioMap[r.targetId];
        }
      });
      // Nếu bạn dùng setState cho reviews, hãy set lại reviews ở đây
      // setReviews(reviewsData);
    }
    fetchData();
  }, [dispatch]);

  const handleViewDetail = async (review) => {
    setCurrentReview(review);
    setDetailModalOpen(true);
    setStudioDetail(null);
    if (review.targetType === 'Studio' && review.targetId) {
      setStudioLoading(true);
      try {
        const data = await dispatch(getStudioById(review.targetId)).unwrap();
        setStudioDetail(data);
      } catch {
        setStudioDetail(null);
      } finally {
        setStudioLoading(false);
      }
    }
  };

  const columns = [
    {
      title: 'Đối tượng',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (v, r) => (
        r.targetType === 'Studio' && r.studioDetail ? (
          <span
            className="font-semibold text-blue-700 text-base cursor-pointer hover:underline"
            onClick={() => window.location.href = `/studio/${r.studioDetail._id}`}
            title={r.studioDetail.name}
          >
            {r.studioDetail.name}
            {r.studioDetail.images?.[0] && (
              <img
                src={r.studioDetail.images[0]}
                alt={r.studioDetail.name}
                style={{ width: 40, height: 40, objectFit: 'cover', display: 'inline-block', marginLeft: 8, borderRadius: 4, verticalAlign: 'middle' }}
              />
            )}
          </span>
        ) : (
          <span className="font-semibold text-gray-700 text-base">{r.targetName || r.target?.name || v || '-'}</span>
        )
      ),
    },
    {
      title: 'Studio ID',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (v) => (
        <span
          className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800"
          onClick={() => window.location.href = `/studio/${v}`}
          title={v}
        >
          {v}
        </span>
      ),
    },
    {
      title: 'Số sao',
      dataIndex: 'rating',
      key: 'rating',
      render: (v) => <span className="font-bold text-yellow-500">{v} ★</span>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (v) => <span className="truncate block max-w-[220px]" title={v}>{v}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isHidden',
      key: 'isHidden',
      render: (v) => v ? <Tag color="red">Đã ẩn</Tag> : <Tag color="green">Hiển thị</Tag>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý đánh giá</h1>
        <p className="opacity-90">Xem và kiểm duyệt các đánh giá của khách hàng về studio, dịch vụ...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-blue-700">{reviews?.length || 0}</div>
          <div className="text-gray-600">Tổng số đánh giá</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-green-700">{reviews?.filter(r => !r.isHidden).length || 0}</div>
          <div className="text-gray-600">Đang hiển thị</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-red-700">{reviews?.filter(r => r.isHidden).length || 0}</div>
          <div className="text-gray-600">Đã ẩn</div>
        </Card>
      </div>
      <div className="mt-8">
        <Table
          columns={columns}
          dataSource={reviews?.map(r => ({ ...r, key: r._id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      <Modal
        open={detailModalOpen}
        onCancel={() => { setDetailModalOpen(false); setCurrentReview(null); }}
        footer={null}
        centered
        width={window.innerWidth < 600 ? '95vw' : 500}
        title={
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl text-yellow-600 font-bold">★</span>
            </div>
            <div>
              <span className="font-bold text-lg">Chi tiết đánh giá</span>
              <div className="text-xs text-gray-500">ID: {currentReview?._id}</div>
            </div>
          </div>
        }
        styles={{ body: { padding: window.innerWidth < 600 ? '16px' : '24px' } }}
      >
        {!currentReview ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Đối tượng</div>
                <div className="font-semibold text-blue-700 text-base">{currentReview.targetType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Tên đối tượng</div>
                {currentReview.targetType === 'Studio' && studioLoading ? (
                  <div className="text-base text-gray-400 italic">Đang tải...</div>
                ) : (
                  <div className="font-semibold text-gray-700 text-base">
                    {studioDetail?.name || currentReview.targetName || currentReview.target?.name || '-'}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Số sao</div>
                <div className="font-bold text-yellow-500 text-lg">{currentReview.rating} ★</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Ngày tạo</div>
                <div className="font-semibold text-base">{currentReview.createdAt ? dayjs(currentReview.createdAt).format('DD/MM/YYYY HH:mm') : '-'}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Nội dung</div>
              <div className="bg-gray-50 rounded p-3 text-base text-gray-800 border border-gray-200 min-h-[48px]">{currentReview.content || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
              <div>
                {currentReview.isHidden ? <Tag color="red">Đã ẩn</Tag> : <Tag color="green">Hiển thị</Tag>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffReviewPage;
