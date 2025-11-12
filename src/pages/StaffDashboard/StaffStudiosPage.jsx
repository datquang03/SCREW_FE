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
        backgroundColor: "rgba(0,0,0,0)",
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
              className="w-20 h-20 sm:w-16 sm:h-16 md:w-24 md:h-24 object-cover rounded"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "inactive" || status === "Ngưng hoạt động"
            ? "red"
            : "green";
        const text =
          status === "inactive" || status === "Ngưng hoạt động"
            ? "Ngưng hoạt động"
            : "Hoạt động";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center gap-2 px-4 py-1 bg-green-500 text-white rounded shadow hover:bg-green-400 hover:scale-105 transition-all cursor-pointer"
            onClick={() => handleEditStudio(record._id)}
          >
            <EditOutlined /> Sửa
          </button>
          <button
            className="flex items-center gap-2 px-4 py-1 bg-red-500 text-white rounded shadow hover:bg-red-400 hover:scale-105 transition-all cursor-pointer"
            onClick={() => handleDeleteStudio(record._id, record.name)}
          >
            <DeleteOutlined /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="mb-2">
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

      {/* Table */}
      <Card>
        <Table
          columns={studiosColumns.map((col) => ({
            ...col,
            onCell: () => ({
              style: { whiteSpace: "normal", wordBreak: "break-word" },
            }),
          }))}
          dataSource={studios.map((studio) => ({ key: studio._id, ...studio }))}
          pagination={{ pageSize: 10, responsive: true }}
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Modal Thêm Studio */}
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
            className="px-4 py-1 bg-gray-300 text-white rounded shadow hover:bg-gray-400 cursor-pointer transition-all"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Hủy
          </button>,
          <button
            key="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-400 hover:scale-105 transition-all cursor-pointer"
            onClick={handleCreateStudio}
          >
            Xác nhận
          </button>,
        ]}
        width="90%"
        style={{ maxWidth: 800, maxHeight: "70vh", overflowY: "auto" }}
      >
        <Form
          layout="vertical"
          form={createForm}
          initialValues={{ amenities: [], images: [] }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Các input giống code trước, giữ nguyên */}
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
              <InputNumber
                min={0}
                step={10000}
                className="w-full"
                placeholder="500000"
              />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Sức chứa (người)"
              rules={[{ required: true, message: "Vui lòng nhập sức chứa" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="20" />
            </Form.Item>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="50" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Vị trí"
              rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
              className="sm:col-span-2"
            >
              <Input placeholder="VD: Quận 1, TP.HCM" />
            </Form.Item>
            <Form.Item
              name="amenities"
              label="Tiện nghi"
              rules={[{ required: true, message: "Chọn ít nhất 1 tiện nghi" }]}
              className="sm:col-span-2"
            >
              <Select mode="tags" placeholder="Nhập hoặc chọn tiện nghi" />
            </Form.Item>
            <Form.Item
              name="images"
              label="Hình ảnh (URL)"
              rules={[
                { required: true, message: "Nhập ít nhất 1 đường dẫn ảnh" },
              ]}
              className="sm:col-span-2"
            >
              <Select
                mode="tags"
                placeholder="Nhập URL ảnh"
                onChange={handlePreviewImagesCreate}
              />
            </Form.Item>
            <div className="flex flex-wrap gap-2">
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
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              className="sm:col-span-2"
            >
              <TextArea rows={3} placeholder="Mô tả ngắn gọn về studio" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Modal Sửa Studio */}
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
            className="px-4 py-1 bg-gray-300 text-white rounded shadow hover:bg-gray-400 cursor-pointer transition-all"
            onClick={() => {
              setIsEditModalOpen(false);
              editForm.resetFields();
              setEditingStudioId(null);
              setPreviewImagesEdit([]);
            }}
          >
            Hủy
          </button>,
          <button
            key="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-400 hover:scale-105 transition-all cursor-pointer"
            onClick={handleUpdateStudio}
          >
            Cập nhật
          </button>,
        ]}
        width="90%"
        style={{ maxWidth: 800, maxHeight: "70vh", overflowY: "auto" }}
      >
        {loadingEditModal ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            layout="vertical"
            form={editForm}
            initialValues={{ amenities: [], images: [] }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Các input giữ nguyên */}
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
                label="Sức chứa (người)"
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
                rules={[{ required: true }]}
                className="sm:col-span-2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="amenities"
                label="Tiện nghi"
                rules={[{ required: true }]}
                className="sm:col-span-2"
              >
                <Select mode="tags" />
              </Form.Item>
              <Form.Item
                name="images"
                label="Hình ảnh (URL)"
                rules={[{ required: true }]}
                className="sm:col-span-2"
              >
                <Select mode="tags" onChange={handlePreviewImagesEdit} />
              </Form.Item>
              <div className="flex flex-wrap gap-2">
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
                rules={[{ required: true }]}
                className="sm:col-span-2"
              >
                <TextArea rows={3} />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>

      {/* Toast Notification */}
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
