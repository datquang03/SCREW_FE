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
import { FiVideo, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
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

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailStudio, setDetailStudio] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const [previewImagesEdit, setPreviewImagesEdit] = useState([]);
  const [existingImagesEdit, setExistingImagesEdit] = useState([]); // Ảnh cũ từ server (URLs)

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
  const handleSelectImagesEdit = (e) => {
    const files = Array.from(e.target.files);
    const currentFiles = editForm.getFieldValue("images") || [];
    const allFiles = [...currentFiles, ...files];
    editForm.setFieldValue("images", allFiles);
    // Preview chỉ hiển thị ảnh mới (Files), ảnh cũ đã có trong existingImagesEdit
    setPreviewImagesEdit(allFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemovePreviewEdit = (index) => {
    // Chỉ xóa ảnh mới (từ form), không xóa ảnh cũ
    const updatedFiles = editForm
      .getFieldValue("images")
      .filter((_, i) => i !== index);
    editForm.setFieldValue("images", updatedFiles);
    setPreviewImagesEdit(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveExistingImageEdit = (index) => {
    // Xóa ảnh cũ khỏi preview UI
    // Lưu ý: Ảnh vẫn còn trên server, chỉ ẩn khỏi UI
    // Để xóa thật sự khỏi server, cần có API riêng để xóa ảnh cụ thể
    const updated = existingImagesEdit.filter((_, i) => i !== index);
    setExistingImagesEdit(updated);
  };

  // --- CREATE STUDIO ---
  const handleCreateStudio = async () => {
    try {
      const values = await createForm.validateFields();
      // Tạo studio không có ảnh (ảnh sẽ được thêm sau khi sửa)
      await dispatch(createStudio(values)).unwrap();

      displayToast("success", "Tạo studio thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
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

      // Update studio info (KHÔNG gửi images để tránh replace)
      await dispatch(
        updateStudio({ studioId: editingStudioId, updateData })
      ).unwrap();

      // Upload ảnh mới (nếu có) - backend sẽ APPEND vào danh sách hiện có
      // Không xóa ảnh cũ, chỉ thêm ảnh mới vào
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
      setExistingImagesEdit([]);
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
        images: [], // Ảnh mới sẽ được thêm vào đây
      });
      // Lưu ảnh cũ (URLs từ server) riêng
      setExistingImagesEdit(result.images || []);
      // Reset ảnh mới
      setPreviewImagesEdit([]);
      setEditingStudioId(studioId);
      setIsEditModalOpen(true);
    } catch (err) {
      displayToast("error", err?.message || "Không thể tải dữ liệu studio!");
    } finally {
      setLoadingEditModal(false);
    }
  };

  // --- XEM CHI TIẾT ---
  const handleViewDetail = async (studioId) => {
    setLoadingDetail(true);
    try {
      const result = await dispatch(getStudioById(studioId)).unwrap();
      setDetailStudio(result);
      setIsDetailModalOpen(true);
    } catch (err) {
      displayToast(
        "error",
        err?.message || "Không thể tải thông tin chi tiết!"
      );
    } finally {
      setLoadingDetail(false);
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
      render: (images) => {
        const defaultImage = "https://via.placeholder.com/64x64?text=No+Image";
        const hasImages = Array.isArray(images) && images.length > 0;
        const imageCount = hasImages ? images.length : 0;

        if (!hasImages) {
          return (
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
              <img
                src={defaultImage}
                alt="No Image"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          );
        }

        // Hiển thị logic:
        // - 1 ảnh: hiển thị 1 ảnh
        // - 2 ảnh: hiển thị 2 ảnh nằm ngang
        // - 3+ ảnh: hiển thị 2 ảnh đầu + "+ số còn lại" với badge rõ ràng
        return (
          <div className="flex items-center gap-1.5">
            {images.slice(0, 2).map((url, idx) => (
              <div
                key={idx}
                className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
              >
                <img
              src={url}
                  alt={`Studio ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </div>
            ))}
            {imageCount > 2 && (
              <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg border-2 border-blue-400 shadow-md cursor-pointer group hover:from-blue-600 hover:to-blue-700 transition-all">
                <div className="text-center">
                  <div className="text-white font-bold text-xs leading-tight">
                    +{imageCount - 2}
                  </div>
                  <div className="text-white/90 text-[10px] leading-tight mt-0.5">
                    ảnh
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors"></div>
              </div>
            )}
        </div>
        );
      },
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
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
            onClick={() => handleViewDetail(record._id)}
          >
            <FiEye /> Xem
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 transition-colors"
            onClick={() => handleEditStudio(record._id)}
          >
            <FiEdit /> Sửa
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
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
          setExistingImagesEdit([]);
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
                  {/* Hiển thị ảnh cũ (từ server) */}
                  {existingImagesEdit.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative">
                      <img
                        src={url}
                        alt="Existing"
                        className="w-20 h-20 object-cover rounded border-2 border-blue-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                        Cũ
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImageEdit(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {/* Hiển thị ảnh mới (sẽ upload) */}
                  {previewImagesEdit.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative">
                      <img
                    src={url}
                        alt="New Preview"
                        className="w-20 h-20 object-cover rounded border-2 border-green-300"
                  />
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-0.5">
                        Mới
                      </div>
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

      {/* MODAL CHI TIẾT */}
      <Modal
        title={
          <Title level={4} className="mb-0 flex items-center gap-2">
            <FiVideo /> Chi tiết Studio
          </Title>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setDetailStudio(null);
        }}
        footer={null}
        width={800}
        centered
      >
        {loadingDetail ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : detailStudio ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {detailStudio.images && detailStudio.images.length > 0 ? (
                  <img
                    src={detailStudio.images[0]}
                    alt={detailStudio.name}
                    className="w-64 h-64 object-cover rounded-xl shadow-lg border"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/256?text=No+Image";
                    }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/256?text=No+Image"
                    alt="No Image"
                    className="w-64 h-64 object-cover rounded-xl shadow-lg border"
                  />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <Title level={3} className="mb-1">
                  {detailStudio.name}
                </Title>
                <Select
                  value={detailStudio.status}
                  style={{ width: 160 }}
                  disabled
                  options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngưng hoạt động" },
                    { value: "maintenance", label: "Bảo trì" },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <Text strong className="text-blue-700">
                      Giá cơ bản / giờ
                    </Text>
                    <Text className="block text-xl font-bold text-blue-600">
                      {detailStudio.basePricePerHour?.toLocaleString("vi-VN") ||
                        0}
                      ₫
                    </Text>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <Text strong className="text-green-700">
                      Sức chứa
                    </Text>
                    <Text className="block text-xl font-bold text-green-600">
                      {detailStudio.capacity || 0}
                    </Text>
                  </Card>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="text-center bg-emerald-50 border-emerald-200">
                <Text type="secondary" className="block">
                  Diện tích
                </Text>
                <Text className="text-2xl font-bold text-emerald-600">
                  {detailStudio.area || 0} m²
                </Text>
              </Card>
              <Card className="text-center bg-amber-50 border-amber-200">
                <Text type="secondary" className="block">
                  Tổng số ảnh
                </Text>
                <Text className="text-2xl font-bold text-amber-600">
                  {detailStudio.images?.length || 0}
                </Text>
              </Card>
            </div>

            {/* Hiển thị tất cả ảnh */}
            {detailStudio.images && detailStudio.images.length > 0 && (
              <Card title="Hình ảnh Studio" className="bg-gray-50">
                <div className="flex flex-wrap gap-3">
                  {detailStudio.images.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`Studio ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/128?text=Error";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {detailStudio.description && (
              <Card title="Mô tả" className="bg-gray-50">
                <Text className="text-gray-700 whitespace-pre-wrap">
                  {detailStudio.description}
                </Text>
              </Card>
            )}

            <Card title="Thông tin hệ thống" className="bg-gray-50 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Text type="secondary">ID Studio:</Text>
                  <Text className="block font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                    {detailStudio._id}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Ngày tạo:</Text>
                  <Text className="block">
                    {detailStudio.createdAt
                      ? new Date(detailStudio.createdAt).toLocaleString("vi-VN")
                      : "-"}
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

export default StaffStudiosPage;
