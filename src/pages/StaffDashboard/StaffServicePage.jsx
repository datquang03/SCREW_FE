// src/pages/Staff/StaffServicePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Modal,
  Dropdown,
  Button,
  Table,
  Form,
  InputNumber,
} from "antd";
import {
  FiScissors,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiMoreHorizontal,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../../features/service/serviceSlice";
import ToastNotification from "../../components/ToastNotification";
import { gsap } from "gsap";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffServicePage = () => {
  const dispatch = useDispatch();
  const {
    services = [],
    total = 0,
    loading,
  } = useSelector((state) => state.service);

  // === STATE ===
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  // Modal chi tiết
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  // Modal sửa
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm] = Form.useForm();

  // Modal thêm
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // === FETCH DATA (CHỈ GỌI KHI CẦN) ===
  const fetchServices = (page = 1) => {
    dispatch(
      getAllServices({
        page,
        limit: 10,
      })
    );
  };

  useEffect(() => {
    fetchServices(1);
  }, []);

  useEffect(() => {
    if (currentPage !== 1) fetchServices(currentPage);
  }, [currentPage]);

  // === CLIENT-SIDE FILTER & SORT (DỮ LIỆU ĐÃ CÓ SẴN) ===
  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];

    // 1. Tìm kiếm
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(lowerSearch));
    }

    // 2. Sắp xếp
    if (sortOption) {
      const [field, direction] = sortOption.split("-");
      result.sort((a, b) => {
        let valA, valB;
        if (field === "name") {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else {
          valA = a.pricePerUse;
          valB = b.pricePerUse;
        }
        if (direction === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    }

    return result;
  }, [services, search, sortOption]);

  // === PAGINATION CLIENT-SIDE ===
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredAndSortedServices.slice(start, start + 10);
  }, [filteredAndSortedServices, currentPage]);

  const clientTotal = filteredAndSortedServices.length;

  // === TOAST ===
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // === HANDLERS ===
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const handleView = async (id) => {
    try {
      const result = await dispatch(getServiceById(id)).unwrap();
      setCurrentService(result);
      setDetailModalVisible(true);
    } catch (err) {
      showToast("error", "Không thể tải chi tiết");
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await dispatch(getServiceById(id)).unwrap();
      setEditingService(result);
      editForm.setFieldsValue({
        name: result.name,
        pricePerUse: result.pricePerUse,
        description: result.description || "",
      });
      setEditModalVisible(true);
    } catch (err) {
      showToast("error", "Không thể tải dữ liệu");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(
        updateService({
          serviceId: editingService._id,
          updateData: values,
        })
      ).unwrap();
      showToast("success", "Cập nhật thành công!");
      setEditModalVisible(false);
      editForm.resetFields();
      fetchServices(currentPage);
    } catch (err) {
      showToast("error", err?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa dịch vụ "${name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          await dispatch(deleteService(id)).unwrap();
          showToast("success", "Xóa thành công!");
          fetchServices(1);
          setCurrentPage(1);
        } catch (err) {
          showToast("error", "Xóa thất bại");
        }
      },
    });
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      await dispatch(createService(values)).unwrap();
      showToast("success", "Thêm dịch vụ thành công!");
      setAddModalVisible(false);
      addForm.resetFields();
      fetchServices(1);
      setCurrentPage(1);
    } catch (err) {
      showToast("error", err?.message || "Thêm thất bại");
    }
  };

  // === COLUMNS ===
  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Giá (VND)",
      dataIndex: "pricePerUse",
      key: "pricePerUse",
      render: (price) => (
        <Text strong className="text-blue-600">
          {price?.toLocaleString("vi-VN")}₫
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => (
        <Text type="secondary" className="text-sm max-w-xs truncate">
          {desc || "—"}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "view",
            label: "Xem chi tiết",
        icon: <FiEye />,
            onClick: () => handleView(record._id),
          },
          {
            key: "edit",
            label: "Chỉnh sửa",
        icon: <FiEdit />,
            onClick: () => handleEdit(record._id),
          },
          {
            key: "delete",
            label: "Xóa",
        icon: <FiTrash2 />,
            danger: true,
            onClick: () => handleDelete(record._id, record.name),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              icon={<FiMoreHorizontal />}
              className="hover:bg-gray-100 rounded-full"
            />
          </Dropdown>
        );
      },
    },
  ];

  // === INFO ITEMS CHO MODAL CHI TIẾT ===
  const infoItems = currentService
    ? [
        {
          label: "Tên dịch vụ",
          value: currentService.name,
          icon: <FiTag />,
        },
        {
          label: "Giá mỗi lần",
          value: `${currentService.pricePerUse.toLocaleString("vi-VN")}₫`,
          icon: <FiDollarSign />,
        },
        {
          label: "Mô tả",
          value: currentService.description || "Không có",
          icon: <FiFileText />,
          fullWidth: true,
        },
        {
          label: "ID",
          value: currentService._id,
          icon: <FiTag />,
          code: true,
        },
        {
          label: "Ngày tạo",
          value: new Date(currentService.createdAt).toLocaleString("vi-VN"),
          icon: <FiTag />,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative overflow-hidden rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-100 via-white to-white px-6 py-8 shadow-lg">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-rose-200 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Title level={2} className="mb-1 text-gray-900">
            Quản lý dịch vụ
          </Title>
            <Text className="text-base text-gray-600">
              Theo dõi dịch vụ, giá bán và trạng thái hoạt động
          </Text>
        </div>
        <Button
          type="primary"
            icon={<FiPlus />}
          size="large"
            className="rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 font-semibold shadow-lg"
          onClick={() => setAddModalVisible(true)}
        >
          Thêm dịch vụ
        </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Tổng dịch vụ
          </p>
          <p className="text-4xl font-extrabold text-purple-600">{total}</p>
          <Text className="text-xs text-gray-500">Đang có trên hệ thống</Text>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Giá cao nhất
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {services.length
              ? `${Math.max(...services.map((s) => s.pricePerUse)).toLocaleString(
                  "vi-VN"
                )}₫`
              : "—"}
          </p>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Giá thấp nhất
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {services.length
              ? `${Math.min(...services.map((s) => s.pricePerUse)).toLocaleString(
                  "vi-VN"
                )}₫`
              : "—"}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm tên dịch vụ..."
          prefix={<FiSearch className="text-gray-400" />}
          allowClear
          className="w-full rounded-2xl border border-gray-200 bg-white/70 shadow-inner sm:w-80"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          placeholder="Sắp xếp"
          allowClear
          className="w-full rounded-2xl sm:w-64"
          value={sortOption || undefined}
          onChange={(val) => {
            setSortOption(val ?? "");
            setCurrentPage(1);
          }}
        >
          <Option value="name-asc">
            <div className="flex items-center gap-2">
              <FiArrowUp /> Tên: A → Z
            </div>
          </Option>
          <Option value="name-desc">
            <div className="flex items-center gap-2">
              <FiArrowDown /> Tên: Z → A
            </div>
          </Option>
          <Option value="price-asc">
            <div className="flex items-center gap-2">
              <FiDollarSign /> Giá: Tăng dần
            </div>
          </Option>
          <Option value="price-desc">
            <div className="flex items-center gap-2">
              <FiDollarSign /> Giá: Giảm dần
            </div>
          </Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="rounded-3xl border border-white/60 bg-white shadow-lg">
          <Table
            columns={columns}
            dataSource={paginatedServices.map((s) => ({ key: s._id, ...s }))}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: clientTotal,
              showSizeChanger: false,
            }}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </Card>
      )}

      {/* === CÁC MODAL (CHI TIẾT, SỬA, THÊM) === */}
      {/* (Giữ nguyên như trước, không thay đổi) */}
      {/* MODAL CHI TIẾT */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={720}
        centered
        maskClosable={true}
        afterOpenChange={(open) => {
          if (open && currentService) {
            gsap.fromTo(
              ".service-modal-content",
              { y: -50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
          }
        }}
        getContainer={false}
      >
        {currentService && (
          <div className="service-modal-content flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-xl">
                <FiScissors className="text-3xl" />
              </div>
              <Title level={3} className="m-0 text-gray-900">
                {currentService.name}
              </Title>
              <Text type="secondary">ID: {currentService._id}</Text>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {infoItems.map((info, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white ${
                    info.fullWidth ? "sm:col-span-2" : ""
                  }`}
                  >
                  <span className="text-xl text-indigo-500">{info.icon}</span>
                  <div className="flex-1">
                    <Text strong className="mb-1 block text-gray-700">
                        {info.label}
                      </Text>
                      {info.code ? (
                      <Text className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs">
                          {info.value}
                        </Text>
                      ) : (
                      <Text className="text-gray-900">
                        {info.value || "—"}
                        </Text>
                      )}
                    </div>
                  </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setDetailModalVisible(false)} size="large">
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL SỬA */}
      <Modal
        title={
          <Title level={4} className="mb-0 flex items-center gap-2">
            <FiEdit className="text-green-600" />
            Chỉnh sửa dịch vụ
          </Title>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={720}
        centered
        afterOpenChange={(open) => {
          if (open) {
            gsap.fromTo(
              ".edit-modal-content",
              { y: -30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        }}
      >
        <div className="edit-modal-content">
          <Form form={editForm} layout="vertical" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  name="name"
                  label="Tên dịch vụ"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input size="large" placeholder="Tên dịch vụ" />
                </Form.Item>
                <Form.Item
                  name="pricePerUse"
                  label="Giá mỗi lần (VND)"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    min={0}
                    step={10000}
                    className="w-full"
                    size="large"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
            </div>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={4} placeholder="Mô tả chi tiết..." size="large" />
            </Form.Item>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                size="large"
                onClick={() => {
                  setEditModalVisible(false);
                  editForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-medium"
                onClick={handleUpdate}
              >
                Cập nhật
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* MODAL THÊM */}
      <Modal
        title={
          <Title level={4} className="mb-0 flex items-center gap-2">
            <FiPlus className="text-purple-600" />
            Thêm dịch vụ mới
          </Title>
        }
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        width={720}
        centered
        afterOpenChange={(open) => {
          if (open) {
            gsap.fromTo(
              ".add-modal-content",
              { y: -30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        }}
      >
        <div className="add-modal-content">
          <Form form={addForm} layout="vertical" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  name="name"
                  label="Tên dịch vụ"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên dịch vụ" },
                  ]}
                >
                  <Input size="large" placeholder="Ví dụ: Cắt tóc nam" />
                </Form.Item>
                <Form.Item
                  name="pricePerUse"
                  label="Giá mỗi lần (VND)"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    min={0}
                    step={10000}
                    className="w-full"
                    size="large"
                    placeholder="100000"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
            </div>
            <Form.Item
              name="description"
              label="Mô tả dịch vụ"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết về dịch vụ..."
                size="large"
              />
            </Form.Item>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                size="large"
                onClick={() => {
                  setAddModalVisible(false);
                  addForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 font-medium"
                onClick={handleAdd}
              >
                Thêm dịch vụ
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default StaffServicePage;
