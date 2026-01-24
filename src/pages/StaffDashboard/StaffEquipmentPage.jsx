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
  Upload,
} from "antd";
import {
  FiTool,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiUpload,
} from "react-icons/fi";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} from "../../features/equipment/equipmentSlice";

import {
  uploadImages,
  clearUploadError,
} from "../../features/upload/uploadSlice";

import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;
const { TextArea } = Input;

const StaffEquipmentPage = () => {
  const dispatch = useDispatch();

  const { equipments = [], loading, total = 0 } = useSelector(
    (state) => state.equipment
  );
  const { uploading } = useSelector((state) => state.upload);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [detailEquipment, setDetailEquipment] = useState(null);

  // Upload states
  const [createFileList, setCreateFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // ảnh hiện tại khi edit

  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Toast
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

  // Upload props chung
  const uploadButton = (
    <div>
      <FiUpload className="text-2xl" />
      <div className="mt-2">Click hoặc kéo thả</div>
    </div>
  );

  // CREATE: Upload config
  const createUploadProps = {
    name: "image",
    listType: "picture-card",
    maxCount: 1,
    fileList: createFileList,
    beforeUpload: (file) => {
      setCreateFileList([file]);
      return false; // ngăn upload tự động
    },
    onRemove: () => {
      setCreateFileList([]);
    },
  };

  // EDIT: Upload config (hiển thị ảnh hiện tại)
  const editUploadProps = {
    name: "image",
    listType: "picture-card",
    maxCount: 1,
    fileList: editFileList,
    beforeUpload: (file) => {
      setEditFileList([file]);
      return false;
    },
    onRemove: () => {
      setEditFileList([]);
      setCurrentImageUrl(""); // cho phép upload ảnh mới
    },
  };

  // === TẠO MỚI THIẾT BỊ ===
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (createFileList.length === 0) {
        message.error("Vui lòng chọn ảnh thiết bị");
        return;
      }

      // Bước 1: Tạo thiết bị (chưa có ảnh)
      const newEquipment = await dispatch(
        createEquipment({
          name: values.name,
          pricePerHour: values.pricePerHour,
          totalQty: values.totalQty,
          description: values.description || "",
        })
      ).unwrap();

      // Bước 2: Upload ảnh bằng uploadImages
      const file = createFileList[0];
      const uploadResult = await dispatch(uploadImages([file])).unwrap();

      // Bước 3: Cập nhật lại equipment với URL ảnh mới
      if (uploadResult && uploadResult.images && uploadResult.images.length > 0) {
        await dispatch(
          updateEquipment({
            equipmentId: newEquipment._id,
            updateData: { image: uploadResult.images[0].url },
          })
        ).unwrap();
      }

      displayToast("success", "Thêm thiết bị thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setCreateFileList([]);
      dispatch(getAllEquipments({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Thêm thiết bị thất bại!");
    }
  };

  // === CHỈNH SỬA ===
  const handleEdit = async (id) => {
    try {
      const eq = await dispatch(getEquipmentById(id)).unwrap();

      editForm.setFieldsValue({
        name: eq.name,
        pricePerHour: eq.pricePerHour,
        totalQty: eq.totalQty,
        description: eq.description,
      });

      setCurrentImageUrl(eq.image || "");
      setEditingEquipmentId(id);

      // Hiển thị ảnh hiện tại trong Upload
      if (eq.image) {
        setEditFileList([
          {
            uid: "-1",
            name: "image-current.jpg",
            status: "done",
            url: eq.image,
          },
        ]);
      } else {
        setEditFileList([]);
      }

      setIsEditModalOpen(true);
    } catch (err) {
      displayToast("error", "Không thể tải thông tin thiết bị");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      let finalImageUrl = currentImageUrl;

      // Nếu có file mới → upload
      if (editFileList.length > 0 && editFileList[0].originFileObj) {
        const file = editFileList[0].originFileObj;
        const res = await dispatch(
          uploadEquipmentImage({ equipmentId: editingEquipmentId, file })
        ).unwrap();
        finalImageUrl = res.image || res.url || res.data?.image;
      }

      await dispatch(
        updateEquipment({
          equipmentId: editingEquipmentId,
          updateData: {
            ...values,
            image: finalImageUrl,
          },
        })
      ).unwrap();

      displayToast("success", "Cập nhật thành công!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditFileList([]);
      setCurrentImageUrl("");
      dispatch(getAllEquipments({ page: 1, limit: 10 }));
    } catch (err) {
      displayToast("error", err?.message || "Cập nhật thất bại!");
    }
  };

  // === XÓA ===
  const handleDelete = (id, name) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: <>Bạn có chắc chắn muốn xóa thiết bị <strong>{name}</strong>?</>,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          await dispatch(deleteEquipment(id)).unwrap();
          displayToast("success", "Xóa thành công!");
          dispatch(getAllEquipments({ page: 1, limit: 10 }));
        } catch {
          displayToast("error", "Xóa thất bại!");
        }
      },
    });
  };

  // === XEM CHI TIẾT ===
  const handleViewDetail = async (id) => {
    try {
      const eq = await dispatch(getEquipmentById(id)).unwrap();
      setDetailEquipment(eq);
      setIsDetailModalOpen(true);
    } catch {
      displayToast("error", "Không thể tải chi tiết");
    }
  };

  // === CỘT BẢNG ===
  const columns = [
    {
      title: "Thiết bị",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.image ? (
            <img
              src={record.image}
              alt={record.name}
              className="w-12 h-12 object-cover rounded-lg shadow"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <FiTool className="text-gray-400" />
            </div>
          )}
          <Text strong>{record.name}</Text>
        </div>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (status) => {
        const map = {
          available: { color: "green", text: "Sẵn sàng" },
          in_use: { color: "orange", text: "Đang sử dụng" },
          maintenance: { color: "red", text: "Bảo trì" },
        };
        const item = map[status] || { color: "gray", text: "Không rõ" };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: "Giá/giờ",
      dataIndex: "pricePerHour",
      render: (value) => (
        <Text strong>{Number(value || 0).toLocaleString("vi-VN")}₫</Text>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Chi tiết",
                icon: <FiEye />,
                onClick: () => handleViewDetail(record._id),
              },
              {
                key: "edit",
                label: "Sửa",
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
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<FiMoreVertical />} type="text" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý thiết bị</h1>
        <p className="opacity-90">
          Theo dõi và quản lý toàn bộ thiết bị studio
        </p>

        <div className="absolute top-8 right-8">
          <button
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 backdrop-blur transition"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Thêm thiết bị
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
        <Card>
          <Text type="secondary">Tổng thiết bị</Text>
          <Title level={3} className="text-blue-600 mt-2">{total}</Title>
        </Card>
        <Card>
          <Text type="secondary">Sẵn sàng</Text>
          <Title level={3} className="text-green-600 mt-2">
            {equipments.filter((e) => e.status === "available").length}
          </Title>
        </Card>
        <Card>
          <Text type="secondary">Đang sử dụng</Text>
          <Title level={3} className="text-orange-600 mt-2">
            {equipments.filter((e) => e.inUseQty > 0).length}
          </Title>
        </Card>
        <Card>
          <Text type="secondary">Bảo trì</Text>
          <Title level={3} className="text-red-600 mt-2">
            {equipments.filter((e) => e.status === "maintenance").length}
          </Title>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={equipments.map((e) => ({ ...e, key: e._id }))}
          loading={loading}
          pagination={{ pageSize: 10, total, showSizeChanger: false }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* MODAL THÊM MỚI */}
      <Modal
        title={<Title level={4}>Thêm thiết bị mới</Title>}
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
          setCreateFileList([]);
        }}
        footer={null}
        width={800}
        centered
      >
        <Form form={createForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label="Tên thiết bị"
              rules={[{ required: true, message: "Vui lòng nhập tên thiết bị" }]}
            >
              <Input size="large" placeholder="Ví dụ: Sony A7IV" />
            </Form.Item>

            <Form.Item
              name="pricePerHour"
              label="Giá thuê/giờ (VND)"
              rules={[{ required: true, message: "Vui lòng nhập giá thuê" }]}
            >
              <InputNumber
                size="large"
                className="w-full"
                min={0}
                step={10000}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="totalQty"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber size="large" className="w-full" min={1} />
            </Form.Item>

            <div className="md:col-span-2">
              <Text strong className="block mb-3">
                Ảnh thiết bị <span className="text-red-500">*</span>
              </Text>
              <Upload.Dragger {...createUploadProps}>
                {createFileList.length === 0 ? uploadButton : null}
              </Upload.Dragger>
            </div>

            <Form.Item name="description" label="Mô tả" className="md:col-span-2">
              <TextArea rows={4} placeholder="Thông tin chi tiết về thiết bị..." />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              size="large"
              onClick={() => {
                setIsCreateModalOpen(false);
                createForm.resetFields();
                setCreateFileList([]);
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              loading={uploading}
              onClick={handleCreate}
            >
              Thêm thiết bị
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL CHỈNH SỬA */}
      <Modal
        title={<Title level={4}>Chỉnh sửa thiết bị</Title>}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          setEditFileList([]);
          setCurrentImageUrl("");
        }}
        footer={null}
        width={800}
        centered
      >
        <Form form={editForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item name="name" label="Tên thiết bị" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="pricePerHour" label="Giá thuê/giờ" rules={[{ required: true }]}>
              <InputNumber size="large" className="w-full" min={0} step={10000} />
            </Form.Item>

            <Form.Item name="totalQty" label="Số lượng" rules={[{ required: true }]}>
              <InputNumber size="large" className="w-full" min={1} />
            </Form.Item>

            <div className="md:col-span-2">
              <Text strong className="block mb-3">Ảnh thiết bị</Text>
              <Upload.Dragger {...editUploadProps}>
                {editFileList.length === 0 && uploadButton}
              </Upload.Dragger>
              {editFileList.length > 0 && editFileList[0].url && !editFileList[0].originFileObj && (
                <Text type="secondary" className="block mt-2">
                  Ảnh hiện tại – nhấn nút xóa để thay ảnh mới
                </Text>
              )}
            </div>

            <Form.Item name="description" label="Mô tả" className="md:col-span-2">
              <TextArea rows={4} />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button size="large" onClick={() => {
              setIsEditModalOpen(false);
              editForm.resetFields();
              setEditFileList([]);
            }}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              loading={uploading}
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL CHI TIẾT - giữ nguyên như cũ */}
      <Modal
        title={<Title level={4} className="flex items-center gap-2"><FiTool /> Chi tiết thiết bị</Title>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={900}
        centered
      >
        {detailEquipment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <img
              src={detailEquipment.image || "/placeholder.jpg"}
              alt={detailEquipment.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="space-y-6">
              <Title level={3}>{detailEquipment.name}</Title>
              <div className="grid grid-cols-2 gap-4">
                <Card><Text strong>Giá/giờ:</Text><Text className="block text-2xl text-blue-600">
                  {detailEquipment.pricePerHour.toLocaleString()}₫
                </Text></Card>
                <Card><Text strong>Số lượng:</Text><Text className="block text-2xl text-green-600">
                  {detailEquipment.totalQty}
                </Text></Card>
              </div>
              {detailEquipment.description && <Card title="Mô tả"><Text>{detailEquipment.description}</Text></Card>}
            </div>
          </div>
        )}
        <div className="mt-8 text-right">
          <Button size="large" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
        </div>
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