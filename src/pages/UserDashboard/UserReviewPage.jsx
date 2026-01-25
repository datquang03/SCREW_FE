import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Tag, Button, Modal, Typography, Spin } from 'antd';
import { getReviews, getReviewById } from '../../features/reviews/reviewSlice';
import dayjs from 'dayjs';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserReviewPage = () => {
  const dispatch = useDispatch();
  const reviewsState = useSelector(state => state.reviews || {});
  const { reviews = [], loading = false } = reviewsState;
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [currentReview, setCurrentReview] = React.useState(null);

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleEditReview = (review) => {
    // TODO: mở modal chỉnh sửa review
    Modal.info({ content: 'Chức năng chỉnh sửa sẽ được bổ sung!' });
  };

  const handleViewDetail = async (reviewId) => {
    setDetailModalOpen(true);
    setCurrentReview(null);
    try {
      const data = await dispatch(getReviewById(reviewId)).unwrap();
      setCurrentReview(data);
    } catch (err) {
      Modal.error({ content: 'Không thể tải chi tiết đánh giá!' });
      setDetailModalOpen(false);
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
      {/* HEADER */}
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Đánh giá của tôi</h1>
        <p className="opacity-90">Xem lại các đánh giá bạn đã gửi về dịch vụ, studio, set design...</p>
      </div>
      {/* THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-blue-700">{reviews?.length || 0}</div>
          <div className="text-gray-600">Tổng số đánh giá</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-green-700">{reviews?.filter(r => r.visible).length || 0}</div>
          <div className="text-gray-600">Đang hiển thị</div>
        </Card>
        <Card className="text-center shadow-lg hover:shadow-xl transition-all">
          <div className="text-3xl font-bold text-red-700">{reviews?.filter(r => !r.visible).length || 0}</div>
          <div className="text-gray-600">Đã ẩn</div>
        </Card>
      </div>
      {/* BẢNG DANH SÁCH ĐÁNH GIÁ */}
      <div className="mt-8">
        <Table
          columns={columns}
          dataSource={reviews?.map(r => ({ ...r, key: r._id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      {/* MODAL CHI TIẾT */}
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
                <div className="font-semibold text-gray-700 text-base">{currentReview.targetName || currentReview.target?.name || '-'}</div>
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
                {currentReview.visible ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Đã ẩn</Tag>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserReviewPage;
