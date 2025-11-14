// src/pages/Staff/StaffServicePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Modal,
  Row,
  Col,
  Dropdown,
  Button,
  Table,
  Form,
  InputNumber,
} from "antd";
import {
  ScissorOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  TagOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
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
            icon: <EyeOutlined />,
            onClick: () => handleView(record._id),
          },
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => handleEdit(record._id),
          },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record._id, record.name),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              icon={<MoreOutlined />}
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
          icon: <TagOutlined />,
        },
        {
          label: "Giá mỗi lần",
          value: `${currentService.pricePerUse.toLocaleString("vi-VN")}₫`,
          icon: <DollarOutlined />,
        },
        {
          label: "Mô tả",
          value: currentService.description || "Không có",
          icon: <FileTextOutlined />,
          fullWidth: true,
        },
        {
          label: "ID",
          value: currentService._id,
          icon: <TagOutlined />,
          code: true,
        },
        {
          label: "Ngày tạo",
          value: new Date(currentService.createdAt).toLocaleString("vi-VN"),
          icon: <TagOutlined />,
        },
      ]
    : [];

  return (
    <div
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Toast */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Quản lý dịch vụ
          </Title>
          <Text style={{ color: "#666" }}>
            Thiết lập và theo dõi các dịch vụ tại S+ Studio
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-medium rounded-xl shadow-md"
          onClick={() => setAddModalVisible(true)}
        >
          Thêm dịch vụ
        </Button>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card
          style={{
            flex: 1,
            minWidth: 200,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Title level={4} style={{ color: "#555" }}>
            Tổng dịch vụ
          </Title>
          <div
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#722ed1" }}
          >
            {total}
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Đang được cung cấp
          </Text>
        </Card>
      </div>

      {/* 1 FILTER DUY NHẤT - CLIENT-SIDE */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Tìm tên dịch vụ..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          style={{ width: 300 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          placeholder="Sắp xếp"
          allowClear
          style={{ width: 220 }}
          value={sortOption || undefined}
          onChange={(val) => {
            setSortOption(val ?? "");
            setCurrentPage(1);
          }}
        >
          <Option value="name-asc">
            <SortAscendingOutlined /> Tên: A to Z
          </Option>
          <Option value="name-desc">
            <SortDescendingOutlined /> Tên: Z to A
          </Option>
          <Option value="price-asc">
            <DollarOutlined /> Giá: Tăng dần
          </Option>
          <Option value="price-desc">
            <DollarOutlined /> Giá: Giảm dần
          </Option>
        </Select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Card
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
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
          <div
            className="service-modal-content"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "linear-gradient(135deg, #722ed1, #d3adf7)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 8px 20px rgba(114, 46, 209, 0.3)",
                }}
              >
                <ScissorOutlined style={{ fontSize: 36, color: "white" }} />
              </div>
              <Title level={3} style={{ margin: 0, color: "#333" }}>
                {currentService.name}
              </Title>
              <Text type="secondary">ID: {currentService._id}</Text>
            </div>

            <Row gutter={[16, 16]}>
              {infoItems.map((info, idx) => (
                <Col span={info.fullWidth ? 24 : 12} key={idx}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: 16,
                      borderRadius: 12,
                      background: "#f8f9ff",
                      transition: "all 0.3s ease",
                      border: "1px solid #e6e8ff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.1)";
                      e.currentTarget.style.background = "#f0f5ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "#f8f9ff";
                    }}
                  >
                    <span
                      style={{ fontSize: 20, color: "#722ed1", marginTop: 2 }}
                    >
                      {info.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 4,
                          color: "#555",
                        }}
                      >
                        {info.label}
                      </Text>
                      {info.code ? (
                        <Text
                          style={{
                            fontFamily: "monospace",
                            background: "#eee",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          {info.value}
                        </Text>
                      ) : (
                        <Text style={{ color: "#333", whiteSpace: "pre-wrap" }}>
                          {info.value}
                        </Text>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
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
            <EditOutlined className="text-green-600" />
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên dịch vụ"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input size="large" placeholder="Tên dịch vụ" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={4} placeholder="Mô tả chi tiết..." size="large" />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
              }}
            >
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
            <PlusOutlined className="text-purple-600" />
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên dịch vụ"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên dịch vụ" },
                  ]}
                >
                  <Input size="large" placeholder="Ví dụ: Cắt tóc nam" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
              }}
            >
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
