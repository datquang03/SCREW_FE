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
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý khuyến mãi</h1>
        <p className="opacity-90">
          Tạo và theo dõi chương trình ưu đãi
        </p>

        <div className="absolute top-8 right-8">
          <button
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 backdrop-blur transition"
            onClick={() => openEditModal()}
          >
            Tạo mã mới
          </button>
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
          <Title level={3} className="text-[#C5A267]">
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

      {/* Modal Tạo / Sửa – ĐƯỢC TỐI ƯU ĐỂ DỄ HIỂU */}
      <Modal
        open={editModalVisible}
        title={
          <div className="flex items-center gap-2">
            <FiTag className="text-xl" />
            <span>{editingPromotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}</span>
          </div>
        }
        onCancel={() => {
          setEditModalVisible(false);
          setEditingPromotion(null);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setEditModalVisible(false);
            setEditingPromotion(null);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave} loading={loading}>
            {editingPromotion ? "Cập nhật" : "Tạo mới"}
          </Button>,
        ]}
        width={900}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="space-y-6">
          {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
          <Card 
            title={<span className="text-base font-semibold">📋 Thông tin cơ bản</span>} 
            className="border-blue-200"
            size="small"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item 
                  label={
                    <span className="font-semibold">
                      Tên chương trình <span className="text-red-500">*</span>
                    </span>
                  } 
                  name="name"
                  tooltip="Tên hiển thị cho chương trình khuyến mãi"
                >
                  <Input 
                    prefix={<FiTag className="text-gray-400" />} 
                    placeholder="VD: Black Friday 2025, Giảm giá mùa hè..."
                    size="large"
                  />
                </Form.Item>
                <Form.Item 
                  label={
                    <span className="font-semibold">
                      Mã khuyến mãi <span className="text-red-500">*</span>
                    </span>
                  } 
                  name="code"
                  tooltip="Mã code khách hàng sẽ nhập khi thanh toán (VD: BLACK2025)"
                >
                  <Input 
                    prefix={<FiPercent className="text-gray-400" />} 
                    placeholder="VD: BLACK2025, SUMMER50..."
                    size="large"
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      form.setFieldValue("code", upperValue);
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item 
                label={<span className="font-semibold">Mô tả chương trình</span>} 
                name="description"
                tooltip="Mô tả chi tiết về chương trình (tùy chọn)"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="VD: Giảm 30% cho tất cả đơn hàng, tối đa 200.000₫. Áp dụng từ ngày..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </Card>

          {/* PHẦN 2: THIẾT LẬP GIẢM GIÁ */}
          <Card 
            title={<span className="text-base font-semibold">💰 Thiết lập giảm giá</span>} 
            className="border-green-200"
            size="small"
          >
            <div className="space-y-4">
              <Form.Item
                label={<span className="font-semibold">Loại giảm giá <span className="text-red-500">*</span></span>}
                name="discountType"
                initialValue="percentage"
                tooltip="Chọn cách tính giảm giá: theo phần trăm hoặc số tiền cố định"
              >
                <Select size="large">
                  <Select.Option value="percentage">
                    <div className="flex items-center gap-2">
                      <FiPercent /> Giảm theo phần trăm (%)
                    </div>
                  </Select.Option>
                  <Select.Option value="fixed">
                    <div className="flex items-center gap-2">
                      <FiDollarSign /> Giảm cố định (VNĐ)
                    </div>
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item shouldUpdate={(prev, curr) => prev.discountType !== curr.discountType}>
                {({ getFieldValue }) => {
                  const discountType = getFieldValue("discountType") || "percentage";
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item 
                        label={
                          <span className="font-semibold">
                            Giá trị giảm <span className="text-red-500">*</span>
                          </span>
                        } 
                        name="discountValue"
                        tooltip={
                          discountType === "percentage" 
                            ? "Nhập số phần trăm (VD: 30 = giảm 30%)"
                            : "Nhập số tiền giảm (VD: 50000 = giảm 50.000₫)"
                        }
                      >
                        <InputNumber
                          min={0}
                          max={discountType === "percentage" ? 100 : undefined}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder={discountType === "percentage" ? "VD: 30" : "VD: 50000"}
                          formatter={(value) => {
                            if (!value) return "";
                            return discountType === "percentage" 
                              ? `${value}%`
                              : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          }}
                          parser={(value) => value.replace(/%|,/g, "")}
                        />
                      </Form.Item>
                      <Form.Item 
                        label={<span className="font-semibold">Tối đa giảm (VNĐ)</span>} 
                        name="maxDiscount"
                        tooltip={
                          discountType === "percentage"
                            ? "Giới hạn số tiền tối đa được giảm (chỉ áp dụng khi giảm theo %). Để trống = không giới hạn"
                            : "Không áp dụng cho giảm cố định"
                        }
                        extra={
                          discountType === "percentage" 
                            ? "Chỉ áp dụng khi giảm theo %" 
                            : "Không áp dụng cho giảm cố định"
                        }
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="VD: 200000 (tối đa 200.000₫)"
                          disabled={discountType === "fixed"}
                          formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                          parser={(value) => value.replace(/,/g, "")}
                        />
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </Card>

          {/* PHẦN 3: ĐIỀU KIỆN ÁP DỤNG */}
          <Card 
            title={<span className="text-base font-semibold">⚙️ Điều kiện áp dụng</span>} 
            className="border-slate-200"
            size="small"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item 
                  label={<span className="font-semibold">Đơn hàng tối thiểu</span>} 
                  name="minOrderValue"
                  tooltip="Khách hàng phải đặt đơn tối thiểu bao nhiêu để được áp dụng mã. Để 0 = không yêu cầu"
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="VD: 100000 (tối thiểu 100.000₫)"
                    formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                    parser={(value) => value.replace(/,/g, "")}
                  />
                </Form.Item>
                <Form.Item 
                  label={<span className="font-semibold">Giới hạn sử dụng</span>} 
                  name="usageLimit"
                  tooltip="Số lần tối đa mã có thể được sử dụng. Để trống = không giới hạn"
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="VD: 100 (tối đa 100 lần)"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="font-semibold">Áp dụng cho</span>}
                name="applicableFor"
                initialValue="all"
                tooltip="Chọn đối tượng khách hàng được áp dụng mã khuyến mãi"
              >
                <Select size="large">
                  <Select.Option value="all">🌍 Tất cả khách hàng</Select.Option>
                  <Select.Option value="first_time">🆕 Chỉ khách hàng mới</Select.Option>
                  <Select.Option value="return">🔄 Chỉ khách hàng cũ</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* PHẦN 4: THỜI GIAN & TRẠNG THÁI */}
          <Card 
            title={<span className="text-base font-semibold">📅 Thời gian & Trạng thái</span>} 
            className="border-orange-200"
            size="small"
          >
            <div className="space-y-4">
              <Form.Item 
                label={
                  <span className="font-semibold">
                    Thời gian hiệu lực <span className="text-red-500">*</span>
                  </span>
                } 
                name="dateRange"
                tooltip="Chọn khoảng thời gian mã khuyến mãi có hiệu lực"
              >
                <RangePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  className="w-full"
                  size="large"
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  suffixIcon={<FiCalendar />}
                />
              </Form.Item>

              <Form.Item 
                label={<span className="font-semibold">Trạng thái</span>} 
                name="isActive" 
                initialValue={true}
                tooltip="Bật/tắt mã khuyến mãi. Mã tắt sẽ không thể sử dụng"
              >
                <Select size="large">
                  <Select.Option value={true}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Bật (Đang hoạt động)
                    </div>
                  </Select.Option>
                  <Select.Option value={false}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Tắt (Tạm ngưng)
                    </div>
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Card>
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
              <Title level={3} className="text-[#C5A267] mb-2">
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
