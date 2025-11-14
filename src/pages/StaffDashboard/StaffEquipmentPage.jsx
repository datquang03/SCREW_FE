// src/pages/Staff/StaffEquipmentPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Spin,
  message,
  Dropdown,
} from "antd";
import {
  ToolOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} from "../../features/equipment/equipmentSlice";
import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;
const { TextArea } = Input;

const StaffEquipmentPage = () => {
  const dispatch = useDispatch();
  const {
    equipments = [],
    loading,
    total = 0,
  } = useSelector((state) => state.equipment);

  // === STATE CHO CÁC MODAL ===
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailEquipment, setDetailEquipment] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [previewImageCreate, setPreviewImageCreate] = useState("");
  const [previewImageEdit, setPreviewImageEdit] = useState("");

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    dispatch(getAllEquipments({ page: 1, limit: 10 }));
  }, [dispatch]);

  const displayToast = (type, msg) => {
    setToastType(type);
    setToastMessage(msg);
    setShowToast(true);
  };
  const closeToast = () => setShowToast(false);

  // === CREATE ===
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      await dispatch(createEquipment(values)).unwrap();
      displayToast("success", "Thêm thiết bị thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setPreviewImageCreate("");
      dispatch(getAllEquipments({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Thêm thất bại!");
    }
  };

  // === EDIT ===
  const handleEdit = async (id) => {
    setLoadingEdit(true);
    try {
      const result = await dispatch(getEquipmentById(id)).unwrap();
      editForm.setFieldsValue({
        name: result.name,
        pricePerHour: result.pricePerHour,
        totalQty: result.totalQty,
        image: result.image,
        description: result.description,
      });
      setPreviewImageEdit(result.image || "");
      setEditingEquipmentId(id);
      setIsEditModalOpen(true);
    } catch (err) {
      displayToast("error", "Không thể tải dữ liệu!");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(
        updateEquipment({ equipmentId: editingEquipmentId, updateData: values })
      ).unwrap();
      displayToast("success", "Cập nhật thành công!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingEquipmentId(null);
      setPreviewImageEdit("");
      dispatch(getAllEquipments({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Cập nhật thất bại!");
    }
  };

  // === DELETE ===
  const handleDelete = (id, name) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa thiết bị "${name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { className: "bg-red-500 text-white hover:bg-red-400" },
      centered: true,
      onOk: async () => {
        try {
          await dispatch(deleteEquipment(id)).unwrap();
          displayToast("success", "Xóa thành công!");
          dispatch(getAllEquipments({ page: 1, limit: 10 }));
        } catch (err) {
          displayToast("error", "Xóa thất bại!");
        }
      },
    });
  };

  // === XEM CHI TIẾT ===
  const handleViewDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const result = await dispatch(getEquipmentById(id)).unwrap();
      setDetailEquipment(result);
      setIsDetailModalOpen(true);
    } catch (err) {
      displayToast("error", "Không thể tải thông tin chi tiết!");
    } finally {
      setLoadingDetail(false);
    }
  };

  // === CỘT BẢNG (ĐÃ XÓA "HOẠT ĐỘNG") ===
  const columns = [
    {
      title: "Thiết bị",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.image && (
            <img
              src={record.image}
              alt={record.name}
              className="w-10 h-10 object-cover rounded-md shadow-sm"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <Text strong>{record.name}</Text>
        </div>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (status) => {
        let color = "gray";
        let text = "Chưa xác định";
        if (status === "available") {
          color = "green";
          text = "Sẵn sàng";
        } else if (status === "maintenance") {
          color = "orange";
          text = "Bảo trì";
        } else if (status === "unavailable") {
          color = "red";
          text = "Không hoạt động";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hạn bảo trì",
      render: () => <Tag color="green">15/12/2025</Tag>,
    },
    // ĐÃ XÓA CỘT "HOẠT ĐỘNG"
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const menuItems = [
          {
            key: "view",
            label: "Chi tiết",
            icon: <EyeOutlined />,
            onClick: () => handleViewDetail(record._id),
          },
          {
            key: "edit",
            label: "Sửa",
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
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              icon={<MoreOutlined />}
              className="hover:bg-gray-100 rounded-full"
              size="small"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="mb-1">
            Quản lý thiết bị
          </Title>
          <Text className="text-gray-600">
            Theo dõi tình trạng và lịch bảo trì thiết bị
          </Text>
        </div>
        <Button
          type="primary"
          icon={<ToolOutlined />}
          size="large"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm thiết bị
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow transition-shadow">
          <Title level={4} className="text-gray-700">
            Tổng thiết bị
          </Title>
          <Text className="text-3xl font-bold text-blue-600">{total}</Text>
          <Text className="text-sm text-gray-500 block">
            Thiết bị đang được quản lý
          </Text>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <Title level={4} className="text-gray-700">
            Thiết bị đang sử dụng
          </Title>
          <div className="flex items-center gap-2 text-orange-600 text-xl font-semibold">
            <ExclamationCircleOutlined />
            <span>
              {
                equipments.filter(
                  (e) => e.status === "unavailable" || e.inUseQty > 0
                ).length
              }{" "}
              thiết bị
            </span>
          </div>
          <Text className="text-sm text-gray-500">
            Đang được thuê hoặc vận hành
          </Text>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <Title level={4} className="text-gray-700">
            Thiết bị đang bảo trì
          </Title>
          <Text className="text-3xl font-bold text-red-600">
            {equipments.filter((e) => e.status === "maintenance").length}
          </Text>
          <Text className="text-sm text-gray-500 block">
            Cần kiểm tra và bảo dưỡng
          </Text>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={equipments.map((e) => ({ key: e._id, ...e }))}
          pagination={{
            pageSize: 8,
            total,
            showSizeChanger: false,
            className: "px-4",
          }}
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* === CÁC MODAL (GIỮ NGUYÊN NHƯ CŨ) === */}
      {/* MODAL THÊM */}
      <Modal
        title={
          <Title level={4} className="mb-0">
            Thêm thiết bị mới
          </Title>
        }
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
          setPreviewImageCreate("");
        }}
        footer={null}
        width={720}
        centered
      >
        <Form form={createForm} layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Form.Item
              name="name"
              label="Tên thiết bị"
              rules={[
                { required: true, message: "Vui lòng nhập tên thiết bị" },
              ]}
            >
              <Input placeholder="VD: Camera Sony A7S III" size="large" />
            </Form.Item>
            <Form.Item
              name="pricePerHour"
              label="Giá thuê / giờ (VND)"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber
                min={0}
                step={10000}
                className="w-full"
                size="large"
                placeholder="200,000"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="totalQty"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber
                min={1}
                className="w-full"
                size="large"
                placeholder="5"
              />
            </Form.Item>
            <Form.Item
              name="image"
              label="Hình ảnh (URL)"
              rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
              className="md:col-span-2"
            >
              <Input
                placeholder="https://example.com/camera.jpg"
                size="large"
                onChange={(e) => setPreviewImageCreate(e.target.value)}
              />
            </Form.Item>
            {previewImageCreate && (
              <div className="md:col-span-2 flex justify-center -mt-2 mb-4">
                <div className="relative group">
                  <img
                    src={previewImageCreate}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-lg border"
                    onError={(e) => {
                      e.target.src = "";
                      setPreviewImageCreate("");
                      message.error("Link ảnh không hợp lệ");
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition"></div>
                </div>
              </div>
            )}
            <Form.Item
              name="description"
              label="Mô tả"
              className="md:col-span-2"
            >
              <TextArea
                rows={3}
                placeholder="Mô tả chi tiết về thiết bị (tùy chọn)..."
                size="large"
              />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              size="large"
              onClick={() => {
                setIsCreateModalOpen(false);
                createForm.resetFields();
                setPreviewImageCreate("");
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-blue-600"
              onClick={handleCreate}
            >
              Thêm thiết bị
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL SỬA */}
      <Modal
        title={
          <Title level={4} className="mb-0">
            Chỉnh sửa thiết bị
          </Title>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          setEditingEquipmentId(null);
          setPreviewImageEdit("");
        }}
        footer={null}
        width={720}
        centered
      >
        {loadingEdit ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form form={editForm} layout="vertical" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Form.Item
                name="name"
                label="Tên thiết bị"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="pricePerHour"
                label="Giá thuê / giờ (VND)"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  min={0}
                  step={10000}
                  className="w-full"
                  size="large"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                name="totalQty"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
              >
                <InputNumber min={1} className="w-full" size="large" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Hình ảnh (URL)"
                rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
                className="md:col-span-2"
              >
                <Input
                  size="large"
                  onChange={(e) => setPreviewImageEdit(e.target.value)}
                />
              </Form.Item>
              {previewImageEdit && (
                <div className="md:col-span-2 flex justify-center -mt-2 mb-4">
                  <img
                    src={previewImageEdit}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-lg border"
                  />
                </div>
              )}
              <Form.Item
                name="description"
                label="Mô tả"
                className="md:col-span-2"
              >
                <TextArea rows={3} size="large" />
              </Form.Item>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                size="large"
                onClick={() => {
                  setIsEditModalOpen(false);
                  editForm.resetFields();
                  setPreviewImageEdit("");
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                className="bg-green-600"
                onClick={handleUpdate}
              >
                Cập nhật
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* MODAL CHI TIẾT */}
      <Modal
        title={
          <Title level={4} className="mb-0 flex items-center gap-2">
            <ToolOutlined /> Chi tiết thiết bị
          </Title>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setDetailEquipment(null);
        }}
        footer={null}
        width={800}
        centered
      >
        {loadingDetail ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : detailEquipment ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={detailEquipment.image}
                  alt={detailEquipment.name}
                  className="w-64 h-64 object-cover rounded-xl shadow-lg border"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/256?text=No+Image";
                  }}
                />
              </div>
              <div className="flex-1 space-y-3">
                <Title level={3} className="mb-1">
                  {detailEquipment.name}
                </Title>
                <Tag
                  color={
                    detailEquipment.status === "available"
                      ? "green"
                      : detailEquipment.status === "maintenance"
                      ? "orange"
                      : "red"
                  }
                  className="text-sm"
                >
                  {detailEquipment.status === "available"
                    ? "Sẵn sàng"
                    : detailEquipment.status === "maintenance"
                    ? "Bảo trì"
                    : "Không hoạt động"}
                </Tag>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <Text strong className="text-blue-700">
                      Giá thuê/giờ
                    </Text>
                    <Text className="block text-xl font-bold text-blue-600">
                      {detailEquipment.pricePerHour.toLocaleString("vi-VN")}₫
                    </Text>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <Text strong className="text-green-700">
                      Tổng số lượng
                    </Text>
                    <Text className="block text-xl font-bold text-green-600">
                      {detailEquipment.totalQty}
                    </Text>
                  </Card>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center bg-emerald-50 border-emerald-200">
                <Text type="secondary" className="block">
                  Sẵn có
                </Text>
                <Text className="text-2xl font-bold text-emerald-600">
                  {detailEquipment.availableQty}
                </Text>
              </Card>
              <Card className="text-center bg-amber-50 border-amber-200">
                <Text type="secondary" className="block">
                  Đang sử dụng
                </Text>
                <Text className="text-2xl font-bold text-amber-600">
                  {detailEquipment.inUseQty}
                </Text>
              </Card>
              <Card className="text-center bg-orange-50 border-orange-200">
                <Text type="secondary" className="block">
                  Cần bảo trì
                </Text>
                <Text className="text-2xl font-bold text-orange-600">
                  {detailEquipment.maintenanceQty}
                </Text>
              </Card>
            </div>

            {detailEquipment.description && (
              <Card title="Mô tả" className="bg-gray-50">
                <Text className="text-gray-700 whitespace-pre-wrap">
                  {detailEquipment.description}
                </Text>
              </Card>
            )}

            <Card title="Thông tin hệ thống" className="bg-gray-50 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Text type="secondary">ID thiết bị:</Text>
                  <Text className="block font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                    {detailEquipment._id}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Ngày tạo:</Text>
                  <Text className="block">
                    {new Date(detailEquipment.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </Text>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button size="large" onClick={() => setIsDetailModalOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <Text>Không có dữ liệu</Text>
        )}
      </Modal>

      {/* Toast */}
      {showToast && (
        <ToastNotification
          type={toastType}
          message={toastMessage}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default StaffEquipmentPage;
