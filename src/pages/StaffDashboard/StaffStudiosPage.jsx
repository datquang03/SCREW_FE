// src/pages/Staff/StaffStudiosPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
} from "antd";
import {
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createStudio,
  getAllStudios,
  getStudioById,
  updateStudio,
  deleteStudio,
  setActivate,
  setDeactivate,
  setMaintenance,
} from "../../features/studio/studioSlice";
import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;
const { TextArea } = Input;

const StaffStudiosPage = () => {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.studio);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudioId, setEditingStudioId] = useState(null);
  const [loadingEditModal, setLoadingEditModal] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const [previewImagesCreate, setPreviewImagesCreate] = useState([]);
  const [previewImagesEdit, setPreviewImagesEdit] = useState([]);

  useEffect(() => {
    dispatch(getAllStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  const displayToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };
  const closeToast = () => setShowToast(false);

  // === CREATE ===
  const handleCreateStudio = async () => {
    try {
      const values = await createForm.validateFields();
      await dispatch(createStudio(values)).unwrap();
      displayToast("success", "Tạo studio thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setPreviewImagesCreate([]);
      dispatch(getAllStudios({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Tạo studio thất bại!");
    }
  };

  // === EDIT ===
  const handleUpdateStudio = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(
        updateStudio({ studioId: editingStudioId, updateData: values })
      ).unwrap();
      displayToast("success", "Cập nhật studio thành công!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingStudioId(null);
      setPreviewImagesEdit([]);
      dispatch(getAllStudios({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Cập nhật studio thất bại!");
    }
  };

  const handleEditStudio = async (studioId) => {
    setLoadingEditModal(true);
    try {
      const result = await dispatch(getStudioById(studioId)).unwrap();
      editForm.setFieldsValue({
        name: result.name,
        description: result.description,
        location: result.location,
        area: result.area,
        capacity: result.capacity,
        basePricePerHour: result.basePricePerHour,
        amenities: result.amenities,
        images: result.images,
      });
      setPreviewImagesEdit(result.images || []);
      setEditingStudioId(studioId);
      setIsEditModalOpen(true);
    } catch (err) {
      displayToast("error", err?.message || "Không thể tải dữ liệu studio!");
    } finally {
      setLoadingEditModal(false);
    }
  };

  // === DELETE ===
  const handleDeleteStudio = (studioId, studioName) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa studio "${studioName}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        className:
          "bg-red-500 text-white cursor-pointer hover:bg-red-400 transition-all",
      },
      centered: true,
      maskStyle: {
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.2)",
      },
      onOk: async () => {
        try {
          await dispatch(deleteStudio(studioId)).unwrap();
          displayToast("success", "Xóa studio thành công!");
          dispatch(getAllStudios({ page: 1, limit: 10 }));
        } catch (err) {
          displayToast("error", err?.message || "Xóa studio thất bại!");
        }
      },
    });
  };

  // === STATUS ===
  const handleStatusChange = async (studioId, value) => {
    try {
      if (value === "active") {
        await dispatch(setActivate(studioId)).unwrap();
        displayToast("success", "Studio đã được kích hoạt!");
      } else if (value === "inactive") {
        await dispatch(setDeactivate(studioId)).unwrap();
        displayToast("success", "Studio đã bị ngưng hoạt động!");
      } else if (value === "maintenance") {
        await dispatch(setMaintenance(studioId)).unwrap();
        displayToast("success", "Studio đã được đặt lịch bảo trì!");
      }

      dispatch(getAllStudios({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Cập nhật trạng thái thất bại!");
    }
  };

  const handlePreviewImagesCreate = (urls) =>
    setPreviewImagesCreate(urls || []);
  const handlePreviewImagesEdit = (urls) => setPreviewImagesEdit(urls || []);

  // === TABLE COLUMNS ===
  const studiosColumns = [
    { title: "Tên Studio", dataIndex: "name", key: "name" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="max-w-[250px] break-words whitespace-pre-wrap">
          {text}
        </div>
      ),
    },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    { title: "Diện tích (m²)", dataIndex: "area", key: "area" },
    { title: "Sức chứa", dataIndex: "capacity", key: "capacity" },
    {
      title: "Giá cơ bản / giờ",
      dataIndex: "basePricePerHour",
      key: "basePricePerHour",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div className="flex flex-wrap gap-2">
          {images?.map((url) => (
            <img
              key={url}
              src={url}
              alt="Studio"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 160 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            {
              value: "active",
              label: (
                <span className="text-green-500 font-medium">Hoạt động</span>
              ),
            },
            {
              value: "inactive",
              label: (
                <span className="text-red-500 font-medium">
                  Ngưng hoạt động
                </span>
              ),
            },
            {
              value: "maintenance",
              label: (
                <span className="text-yellow-500 font-medium">Bảo trì</span>
              ),
            },
          ]}
          className={`rounded-md ${
            status === "active"
              ? "border border-green-500 text-white bg-green-500"
              : status === "inactive"
              ? "border border-red-500 text-white bg-red-500"
              : "border border-yellow-500 text-white bg-yellow-500"
          }`}
        />
      ),
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 hover:scale-105 transition-all cursor-pointer"
            onClick={() => handleEditStudio(record._id)}
          >
            <EditOutlined /> Sửa
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 hover:scale-105 transition-all cursor-pointer"
            onClick={() => handleDeleteStudio(record._id, record.name)}
          >
            <DeleteOutlined /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 md:px-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="mb-1">
            Quản lý Studio
          </Title>
          <Text className="text-gray-600">
            Quản lý thông tin và trạng thái các studio
          </Text>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-400 hover:scale-105 transition-all cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <VideoCameraOutlined /> Thêm Studio
        </button>
      </div>

      {/* Table (responsive scroll) */}
      <Card className="overflow-x-auto rounded-lg shadow-sm">
        <div className="min-w-[800px]">
          <Table
            columns={studiosColumns.map((col) => ({
              ...col,
              onCell: () => ({
                style: { whiteSpace: "normal", wordBreak: "break-word" },
              }),
            }))}
            dataSource={studios.map((studio) => ({
              key: studio._id,
              ...studio,
            }))}
            pagination={{ pageSize: 10, responsive: true }}
            loading={loading}
            scroll={{ x: true }}
          />
        </div>
      </Card>

      {/* Modal Create */}
      <Modal
        title="Thêm Studio Mới"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
          setPreviewImagesCreate([]);
        }}
        footer={[
          <button
            key="cancel"
            className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Hủy
          </button>,
          <button
            key="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-all"
            onClick={handleCreateStudio}
          >
            Xác nhận
          </button>,
        ]}
        width="90%"
        style={{ maxWidth: 800, maxHeight: "75vh", overflowY: "auto" }}
      >
        <Form layout="vertical" form={createForm}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên Studio"
              rules={[{ required: true, message: "Vui lòng nhập tên studio" }]}
            >
              <Input placeholder="VD: Studio Premium A" />
            </Form.Item>
            <Form.Item
              name="basePricePerHour"
              label="Giá cơ bản / giờ (VND)"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber min={0} step={10000} className="w-full" />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Sức chứa"
              rules={[{ required: true, message: "Vui lòng nhập sức chứa" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Vị trí"
              className="sm:col-span-2"
              rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
            >
              <Input placeholder="VD: Quận 1, TP.HCM" />
            </Form.Item>
            <Form.Item
              name="amenities"
              label="Tiện nghi"
              className="sm:col-span-2"
              rules={[{ required: true, message: "Nhập ít nhất 1 tiện nghi" }]}
            >
              <Select mode="tags" placeholder="Nhập hoặc chọn tiện nghi" />
            </Form.Item>
            <Form.Item
              name="images"
              label="Hình ảnh (URL)"
              className="sm:col-span-2"
              rules={[{ required: true, message: "Nhập ít nhất 1 ảnh" }]}
            >
              <Select
                mode="tags"
                placeholder="Nhập URL ảnh"
                onChange={handlePreviewImagesCreate}
              />
            </Form.Item>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              {previewImagesCreate.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
            <Form.Item
              name="description"
              label="Mô tả"
              className="sm:col-span-2"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Sửa Studio"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          setEditingStudioId(null);
          setPreviewImagesEdit([]);
        }}
        footer={[
          <button
            key="cancel"
            className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
            onClick={() => setIsEditModalOpen(false)}
          >
            Hủy
          </button>,
          <button
            key="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-all"
            onClick={handleUpdateStudio}
          >
            Cập nhật
          </button>,
        ]}
        width="90%"
        style={{ maxWidth: 800, maxHeight: "75vh", overflowY: "auto" }}
      >
        {loadingEditModal ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Form layout="vertical" form={editForm}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Tên Studio"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="basePricePerHour"
                label="Giá cơ bản / giờ (VND)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={10000} className="w-full" />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="Sức chứa"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
              <Form.Item
                name="area"
                label="Diện tích (m²)"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
              <Form.Item
                name="location"
                label="Vị trí"
                className="sm:col-span-2"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="amenities"
                label="Tiện nghi"
                className="sm:col-span-2"
                rules={[{ required: true }]}
              >
                <Select mode="tags" />
              </Form.Item>
              <Form.Item
                name="images"
                label="Hình ảnh (URL)"
                className="sm:col-span-2"
                rules={[{ required: true }]}
              >
                <Select mode="tags" onChange={handlePreviewImagesEdit} />
              </Form.Item>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                {previewImagesEdit.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
              <Form.Item
                name="description"
                label="Mô tả"
                className="sm:col-span-2"
                rules={[{ required: true }]}
              >
                <TextArea rows={3} />
              </Form.Item>
            </div>
          </Form>
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

export default StaffStudiosPage;
