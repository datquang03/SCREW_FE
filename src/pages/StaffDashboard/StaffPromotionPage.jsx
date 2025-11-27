// src/pages/StaffDashboard/StaffPromotionPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Input,
  Table,
  Button,
  Dropdown,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  message,
  Spin,
  Progress,
} from "antd";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMoreHorizontal,
  FiEye,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiCopy,
} from "react-icons/fi";
import dayjs from "dayjs";

import {
  getAllPromotions,
  getPromotionDetails,
  createPromotion,
  updatePromotion,
  deletePromotion,
  clearPromotionError,
} from "../../features/promotion/promotionSlice";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StaffPromotionPage = () => {
  const dispatch = useDispatch();
  const {
    promotions = [],
    total = 0,
    currentPromotion,
    loading,
    error,
  } = useSelector((state) => state.promotion || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getStatus = (record) => {
    if (!record?.endDate || !record?.isActive) return "expired";
    return dayjs(record.endDate).isAfter(dayjs()) ? "active" : "expired";
  };

  useEffect(() => {
    dispatch(getAllPromotions({ page, limit: pageSize }));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      const msg = error.message || error.error?.message || "Đã có lỗi xảy ra";
      message.error(msg);
      dispatch(clearPromotionError());
    }
  }, [error, dispatch]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(promotions)) return [];
    return promotions.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.code?.toLowerCase()?.includes(search.toLowerCase());
      const matchesStatus = statusFilter
        ? getStatus(item) === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [promotions, search, statusFilter]);

  const openEditModal = (promotion = null) => {
    setEditingPromotion(promotion);
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
      });
    } else {
      form.resetFields();
    }
    setEditModalVisible(true);
  };

  const openDetailModal = async (id) => {
    try {
      await dispatch(getPromotionDetails(id)).unwrap();
      setDetailModalVisible(true);
    } catch {
      message.error("Không thể tải chi tiết khuyến mãi");
    }
  };

  // ĐÃ FIX HOÀN TOÀN: KHÔNG VALIDATE FRONTEND, BACKEND QUYẾT ĐỊNH TẤT CẢ
  const handleSave = async () => {
    try {
      const currentValues = form.getFieldsValue(); // Giá trị hiện tại trên form
      const original = editingPromotion; // Dữ liệu gốc khi mở modal

      // Nếu là tạo mới → gửi hết
      if (!editingPromotion) {
        if (!currentValues.dateRange || currentValues.dateRange.length !== 2) {
          message.error("Vui lòng chọn thời gian hiệu lực!");
          return;
        }

        const payload = {
          name: (currentValues.name || "").trim(),
          code: (currentValues.code || "").toUpperCase().trim(),
          description: (currentValues.description || "").trim() || undefined,
          discountType: currentValues.discountType || "percentage",
          discountValue: Number(currentValues.discountValue) || 0,
          minOrderValue: Number(currentValues.minOrderValue) || 0,
          applicableFor: currentValues.applicableFor || "all",
          startDate: currentValues.dateRange[0].toISOString(),
          endDate: currentValues.dateRange[1].toISOString(),
          usageLimit: currentValues.usageLimit
            ? Number(currentValues.usageLimit)
            : null,
          isActive: currentValues.isActive ?? true,
          ...(currentValues.discountType === "percentage" &&
            currentValues.maxDiscount > 0 && {
              maxDiscount: Number(currentValues.maxDiscount),
            }),
        };

        await dispatch(createPromotion(payload)).unwrap();
        message.success("Tạo mã khuyến mãi thành công!");
      }
      // NẾU LÀ CHỈNH SỬA → CHỈ GỬI FIELD ĐÃ THAY ĐỔI
      else {
        const changedPayload = {};

        // So sánh từng field
        if (currentValues.name?.trim() !== (original.name || "").trim()) {
          changedPayload.name = currentValues.name?.trim();
        }
        if (
          currentValues.code?.toUpperCase().trim() !==
          (original.code || "").toUpperCase().trim()
        ) {
          changedPayload.code = currentValues.code?.toUpperCase().trim();
        }
        if (
          currentValues.description?.trim() !==
          (original.description || "").trim()
        ) {
          changedPayload.description =
            currentValues.description?.trim() || undefined;
        }
        if (currentValues.discountType !== original.discountType) {
          changedPayload.discountType = currentValues.discountType;
        }
        if (
          Number(currentValues.discountValue) !== Number(original.discountValue)
        ) {
          changedPayload.discountValue =
            Number(currentValues.discountValue) || 0;
        }
        if (
          Number(currentValues.minOrderValue) !== Number(original.minOrderValue)
        ) {
          changedPayload.minOrderValue =
            Number(currentValues.minOrderValue) || 0;
        }
        if (currentValues.applicableFor !== original.applicableFor) {
          changedPayload.applicableFor = currentValues.applicableFor;
        }
        if (currentValues.isActive !== original.isActive) {
          changedPayload.isActive = currentValues.isActive;
        }
        if (
          currentValues.usageLimit != null &&
          Number(currentValues.usageLimit) !== (original.usageLimit || 0)
        ) {
          changedPayload.usageLimit = Number(currentValues.usageLimit) || null;
        }
        if (
          currentValues.discountType === "percentage" &&
          Number(currentValues.maxDiscount) !==
            Number(original.maxDiscount || 0)
        ) {
          if (Number(currentValues.maxDiscount) > 0) {
            changedPayload.maxDiscount = Number(currentValues.maxDiscount);
          } else if (original.maxDiscount) {
            changedPayload.maxDiscount = null; // xóa nếu để trống
          }
        }

        // CHỈ GỬI NGÀY NẾU NGƯỜI DÙNG THAY ĐỔI TRONG RangePicker
        const currentStart = currentValues.dateRange?.[0];
        const currentEnd = currentValues.dateRange?.[1];
        const originalStart = dayjs(original.startDate);
        const originalEnd = dayjs(original.endDate);

        const startChanged =
          !currentStart || !originalStart.isSame(currentStart, "minute");
        const endChanged =
          !currentEnd || !originalEnd.isSame(currentEnd, "minute");

        if (startChanged || endChanged) {
          if (!currentStart || !currentEnd) {
            message.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!");
            return;
          }
          if (currentEnd.isBefore(currentStart)) {
            message.error("Ngày kết thúc phải sau ngày bắt đầu!");
            return;
          }
          changedPayload.startDate = currentStart.toISOString();
          changedPayload.endDate = currentEnd.toISOString();
        }

        // Nếu không thay đổi gì → thông báo
        if (Object.keys(changedPayload).length === 0) {
          message.info("Không có thay đổi nào được thực hiện");
          setEditModalVisible(false);
          return;
        }

        await dispatch(
          updatePromotion({
            promotionId: editingPromotion._id,
            updateData: changedPayload,
          })
        ).unwrap();

        message.success("Cập nhật thành công!");
      }

      setEditModalVisible(false);
      setEditingPromotion(null);
      form.resetFields();
    } catch (err) {
      const errorMsg = err?.message || err?.error?.message || "Có lỗi xảy ra!";
      message.error(errorMsg);
    }
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa mã khuyến mãi?",
      content: (
        <>
          Xóa <strong>{record.code}</strong>? Không thể hoàn tác.
        </>
      ),
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          await dispatch(deletePromotion(record._id)).unwrap();
          message.success("Đã xóa!");
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "Chương trình",
      render: (_, r) => (
        <div>
          <div className="font-medium">{r.name || "Chưa đặt tên"}</div>
          <Tag color="blue">{r.code}</Tag>
        </div>
      ),
    },
    {
      title: "Giá trị giảm",
      render: (_, r) => {
        const value = Number(r.discountValue || 0);
        const base =
          r.discountType === "percentage"
            ? `${value}%`
            : `${value.toLocaleString()}đ`;
        const max =
          r.maxDiscount && Number(r.maxDiscount) > 0
            ? ` (tối đa ${Number(r.maxDiscount).toLocaleString()}đ)`
            : "";
        return (
          <span className="font-medium">
            {base}
            {max}
          </span>
        );
      },
    },
    {
      title: "Đơn tối thiểu",
      render: (_, r) => {
        const value = Number(r.minOrderValue || 0);
        return value > 0 ? (
          `${value.toLocaleString()}đ`
        ) : (
          <span className="text-gray-400">Không</span>
        );
      },
    },
    {
      title: "Thời gian",
      render: (_, r) =>
        `${dayjs(r.startDate).format("DD/MM")} → ${dayjs(r.endDate).format(
          "DD/MM"
        )}`,
    },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Tag color={getStatus(r) === "active" ? "green" : "red"}>
          {getStatus(r) === "active" ? "Đang chạy" : "Hết hạn"}
        </Tag>
      ),
    },
    {
      title: "",
      fixed: "right",
      width: 80,
      render: (_, r) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem",
                icon: <FiEye />,
                onClick: () => openDetailModal(r._id),
              },
              {
                key: "edit",
                label: "Sửa",
                icon: <FiEdit />,
                onClick: () => openEditModal(r),
              },
              {
                key: "delete",
                label: "Xóa",
                icon: <FiTrash2 />,
                danger: true,
                onClick: () => handleDelete(r),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<FiMoreHorizontal />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={3} className="mb-0">
              Quản lý khuyến mãi
            </Title>
            <Text type="secondary">Tạo và theo dõi chương trình ưu đãi</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FiPlus />}
            onClick={() => openEditModal()}
          >
            Tạo mã mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <Text type="secondary" className="text-xs uppercase">
            Tổng chương trình
          </Text>
          <Title level={3}>{total}</Title>
        </Card>
        <Card className="text-center">
          <Text type="secondary" className="text-xs uppercase">
            Đang hoạt động
          </Text>
          <Title level={3} className="text-green-600">
            {promotions.filter((p) => getStatus(p) === "active").length}
          </Title>
        </Card>
        <Card className="text-center">
          <Text type="secondary" className="text-xs uppercase">
            Tổng lượt dùng
          </Text>
          <Title level={3} className="text-purple-600">
            {promotions.reduce((sum, p) => sum + (p.usageCount || 0), 0)}
          </Title>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Tìm tên hoặc mã code..."
          prefix={<FiSearch className="text-gray-400" />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          value={statusFilter || undefined}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
        >
          <Select.Option value="active">Đang chạy</Select.Option>
          <Select.Option value="expired">Hết hạn</Select.Option>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              onChange: setPage,
            }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>

      {/* Modal Tạo / Sửa – KHÔNG CÓ VALIDATE */}
      <Modal
        open={editModalVisible}
        title={editingPromotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingPromotion(null);
          form.resetFields();
        }}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        width={900}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Tên chương trình" name="name">
              <Input prefix={<FiTag />} placeholder="Black Friday 2025" />
            </Form.Item>
            <Form.Item label="Mã code" name="code">
              <Input prefix={<FiPercent />} placeholder="BLACK2025" />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả chương trình" name="description">
            <Input.TextArea rows={2} placeholder="Giảm 30% tối đa 200k..." />
          </Form.Item>

          <Form.Item
            label="Loại giảm giá"
            name="discountType"
            initialValue="percentage"
          >
            <Select>
              <Select.Option value="percentage">Giảm theo %</Select.Option>
              <Select.Option value="fixed">Giảm cố định (VNĐ)</Select.Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Giá trị giảm" name="discountValue">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                prefix={<FiDollarSign />}
              />
            </Form.Item>
            <Form.Item label="Tối đa giảm (VNĐ)" name="maxDiscount">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                prefix={<FiDollarSign />}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Đơn hàng tối thiểu" name="minOrderValue">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                prefix={<FiDollarSign />}
              />
            </Form.Item>
            <Form.Item label="Giới hạn sử dụng" name="usageLimit">
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Để trống = không giới hạn"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Áp dụng cho"
              name="applicableFor"
              initialValue="all"
            >
              <Select>
                <Select.Option value="all">Tất cả khách hàng</Select.Option>
                <Select.Option value="first_time">Chỉ khách mới</Select.Option>
                <Select.Option value="return">Khách cũ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
              <Select>
                <Select.Option value={true}>Bật (Đang chạy)</Select.Option>
                <Select.Option value={false}>Tắt</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Thời gian hiệu lực" name="dateRange">
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-full"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              suffixIcon={<FiCalendar />}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chi tiết – ĐẸP LUNG LINH */}
      <Modal
        open={detailModalVisible}
        title="Chi tiết khuyến mãi"
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={850}
        destroyOnClose
      >
        {currentPromotion ? (
          <div className="space-y-8">
            <div className="text-center pb-6 border-b">
              <Title level={3} className="text-blue-600 mb-2">
                {currentPromotion.name || "Chưa đặt tên"}
              </Title>
              <Tag color="blue" size="large" className="text-lg px-4 py-1">
                {currentPromotion.code}
              </Tag>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <Text strong className="block mb-1">
                    Loại giảm giá:
                  </Text>
                  <Tag
                    color={
                      currentPromotion.discountType === "percentage"
                        ? "purple"
                        : "orange"
                    }
                  >
                    {currentPromotion.discountType === "percentage"
                      ? "Giảm theo %"
                      : "Giảm cố định (VNĐ)"}
                  </Tag>
                </div>
                <div>
                  <Text strong className="block mb-1">
                    Giá trị giảm:
                  </Text>
                  <div className="text-xl font-bold text-green-600">
                    {currentPromotion.discountType === "percentage"
                      ? `${currentPromotion.discountValue}%`
                      : `${Number(
                          currentPromotion.discountValue || 0
                        ).toLocaleString()}₫`}
                  </div>
                  {currentPromotion.maxDiscount > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      Tối đa giảm:{" "}
                      <strong>
                        {Number(currentPromotion.maxDiscount).toLocaleString()}₫
                      </strong>
                    </div>
                  )}
                </div>
                <div>
                  <Text strong className="block mb-1">
                    Đơn hàng tối thiểu:
                  </Text>
                  <span className="text-lg">
                    {currentPromotion.minOrderValue > 0 ? (
                      `${Number(
                        currentPromotion.minOrderValue
                      ).toLocaleString()}₫`
                    ) : (
                      <span className="text-gray-500">Không yêu cầu</span>
                    )}
                  </span>
                </div>
                <div>
                  <Text strong className="block mb-1">
                    Áp dụng cho:
                  </Text>
                  <span>
                    {currentPromotion.applicableFor === "all"
                      ? "Tất cả khách hàng"
                      : currentPromotion.applicableFor === "first_time"
                      ? "Chỉ khách mới"
                      : currentPromotion.applicableFor === "return"
                      ? "Khách cũ"
                      : "Không xác định"}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Text strong className="block mb-1">
                    Thời gian hiệu lực:
                  </Text>
                  <div className="text-sm bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="text-gray-600">Từ:</span>{" "}
                      <strong>
                        {dayjs(currentPromotion.startDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Đến:</span>{" "}
                      <strong>
                        {dayjs(currentPromotion.endDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-1">
                    Giới hạn sử dụng:
                  </Text>
                  {currentPromotion.usageLimit ? (
                    <div className="text-lg">
                      <strong>{currentPromotion.usageCount || 0}</strong> /{" "}
                      {currentPromotion.usageLimit} lần
                      <Progress
                        percent={
                          ((currentPromotion.usageCount || 0) /
                            currentPromotion.usageLimit) *
                          100
                        }
                        size="small"
                        className="mt-2"
                      />
                    </div>
                  ) : (
                    <Tag color="green">Không giới hạn</Tag>
                  )}
                </div>

                <div>
                  <Text strong className="block mb-1">
                    Trạng thái:
                  </Text>
                  <Tag
                    color={
                      getStatus(currentPromotion) === "active" ? "green" : "red"
                    }
                    size="large"
                  >
                    {getStatus(currentPromotion) === "active"
                      ? "Đang hoạt động"
                      : "Đã tắt / Hết hạn"}
                  </Tag>
                </div>
              </div>
            </div>

            {currentPromotion.description && (
              <div className="bg-gray-50 p-5 rounded-xl border">
                <Text strong className="block mb-2 text-lg">
                  Mô tả chương trình:
                </Text>
                <p className="text-gray-700 leading-relaxed">
                  {currentPromotion.description}
                </p>
              </div>
            )}

            <div className="text-center pt-4 border-t">
              <Button
                type="primary"
                size="large"
                icon={<FiCopy />}
                onClick={() => {
                  navigator.clipboard.writeText(currentPromotion.code);
                  message.success(`Đã copy mã: ${currentPromotion.code}`);
                }}
              >
                Copy mã khuyến mãi
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <Spin size="large" tip="Đang tải chi tiết..." />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffPromotionPage;
