// src/pages/Staff/StaffStudiosPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Spin,
} from "antd";
import { FiVideo, FiEdit, FiTrash2 } from "react-icons/fi";
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
  uploadStudioImage,
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

  const inputFileCreateRef = useRef(null);
  const inputFileEditRef = useRef(null);

  useEffect(() => {
    dispatch(getAllStudios({ page: 1, limit: 10 }));
  }, [dispatch]);

  const displayToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };
  const closeToast = () => setShowToast(false);

  // --- IMAGE HANDLERS ---
  const handleSelectImagesCreate = (e) => {
    const files = Array.from(e.target.files);
    const currentFiles = createForm.getFieldValue("images") || [];
    const allFiles = [...currentFiles, ...files];
    createForm.setFieldValue("images", allFiles);
    setPreviewImagesCreate(allFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSelectImagesEdit = (e) => {
    const files = Array.from(e.target.files);
    const currentFiles = editForm.getFieldValue("images") || [];
    const allFiles = [...currentFiles, ...files];
    editForm.setFieldValue("images", allFiles);
    setPreviewImagesEdit(allFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemovePreviewCreate = (index) => {
    const updatedFiles = createForm
      .getFieldValue("images")
      .filter((_, i) => i !== index);
    createForm.setFieldValue("images", updatedFiles);
    setPreviewImagesCreate(
      updatedFiles.map((file) => URL.createObjectURL(file))
    );
  };

  const handleRemovePreviewEdit = (index) => {
    const updatedFiles = editForm
      .getFieldValue("images")
      .filter((_, i) => i !== index);
    editForm.setFieldValue("images", updatedFiles);
    setPreviewImagesEdit(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  // --- CREATE STUDIO ---
  const handleCreateStudio = async () => {
    try {
      const values = await createForm.validateFields();
      // Tách dữ liệu tạo studio, bỏ images
      const { images, ...studioData } = values;

      const newStudio = await dispatch(createStudio(studioData)).unwrap();

      if (images && images.length > 0) {
        await dispatch(
          uploadStudioImage({ studioId: newStudio._id, files: images })
        ).unwrap();
      }

      displayToast("success", "Tạo studio thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setPreviewImagesCreate([]);
      dispatch(getAllStudios({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Tạo studio thất bại!");
    }
  };

  // --- UPDATE STUDIO ---
  const handleUpdateStudio = async () => {
    try {
      const values = await editForm.validateFields();
      const { images, ...updateData } = values;

      await dispatch(
        updateStudio({ studioId: editingStudioId, updateData })
      ).unwrap();

      if (images && images.length > 0) {
        await dispatch(
          uploadStudioImage({ studioId: editingStudioId, files: images })
        ).unwrap();
      }

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
        area: result.area,
        capacity: result.capacity,
        basePricePerHour: result.basePricePerHour,
        images: [],
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

  // --- DELETE STUDIO ---
  const handleDeleteStudio = (studioId, studioName) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa studio "${studioName}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { className: "bg-red-500 text-white hover:bg-red-400" },
      centered: true,
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

  // --- STATUS CHANGE ---
  const handleStatusChange = async (studioId, value) => {
    try {
      if (value === "active") await dispatch(setActivate(studioId)).unwrap();
      else if (value === "inactive")
        await dispatch(setDeactivate(studioId)).unwrap();
      else if (value === "maintenance")
        await dispatch(setMaintenance(studioId)).unwrap();

      displayToast("success", "Cập nhật trạng thái thành công!");
      dispatch(getAllStudios({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Cập nhật trạng thái thất bại!");
    }
  };

  // --- TABLE COLUMNS ---
  const studiosColumns = [
    { title: "Tên Studio", dataIndex: "name", key: "name" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <div className="max-w-[250px] break-words">{text}</div>,
    },
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
          {images?.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Studio"
              className="w-20 h-20 object-cover rounded"
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
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Ngưng hoạt động" },
            { value: "maintenance", label: "Bảo trì" },
          ]}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
            onClick={() => handleEditStudio(record._id)}
          >
            <FiEdit /> Sửa
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400"
            onClick={() => handleDeleteStudio(record._id, record.name)}
          >
            <FiTrash2 /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 md:px-6 overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-violet-100 via-purple-50 to-white shadow-lg border border-violet-200/50">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title level={2} className="mb-2 text-gray-900">
              Quản lý Studio
            </Title>
            <Text className="text-base text-gray-700 font-medium">
              Quản lý thông tin và trạng thái các studio
            </Text>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer font-semibold"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FiVideo /> Thêm Studio
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
        <Table
          columns={studiosColumns}
          dataSource={studios.map((s) => ({ key: s._id, ...s }))}
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: true }}
        />
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
          <Button key="cancel" onClick={() => setIsCreateModalOpen(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateStudio}>
            Xác nhận
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 800, maxHeight: "75vh", overflowY: "auto" }}
      >
        <Form layout="vertical" form={createForm}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên Studio"
              rules={[{ required: true }]}
            >
              <Input placeholder="VD: Studio Premium A" />
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

            {/* Images */}
            <Form.Item
              name="images"
              label="Hình ảnh"
              className="sm:col-span-2"
              rules={[{ required: true }]}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                  onClick={() => inputFileCreateRef.current.click()}
                >
                  Chọn ảnh
                </button>
                <input
                  type="file"
                  ref={inputFileCreateRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectImagesCreate}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {previewImagesCreate.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewCreate(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </Form.Item>

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
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateStudio}>
            Cập nhật
          </Button>,
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

              {/* Images */}
              <Form.Item
                name="images"
                label="Hình ảnh"
                className="sm:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                    onClick={() => inputFileEditRef.current.click()}
                  >
                    Chọn ảnh
                  </button>
                  <input
                    type="file"
                    ref={inputFileEditRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectImagesEdit}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewImagesEdit.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePreviewEdit(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </Form.Item>

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
