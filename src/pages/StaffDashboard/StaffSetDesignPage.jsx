import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Tag,
  Button,
  Dropdown,
  Modal,
  Form,
  Input,
  Select,
  Typography,
} from "antd";
import {
  FiMoreVertical,
  FiImage,
  FiLayers,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";

import ToastNotification from "../../components/ToastNotification";

import {
  getAllSetDesigns,
  createSetDesign,
  updateSetDesign,
  deleteSetDesign,
} from "../../features/setDesign/setDesignSlice";
import { uploadImages as uploadImagesAction } from "../../features/upload/uploadSlice";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffSetDesignPage = () => {
  const dispatch = useDispatch();
  const { setDesigns, total } = useSelector((state) => state.setDesign);

  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllSetDesigns({ page, limit: 10 }));
  }, [page]);

  const totalFree = setDesigns?.filter((s) => s.price === 0).length || 0;
  const totalPaid = setDesigns?.filter((s) => s.price > 0).length || 0;

  const columns = [
    {
      title: "Hình ảnh",
      width: 120,
      render: (_, r) => (
        <div className="w-12 h-12 rounded-xl overflow-hidden border">
          <img
            src={r.images?.[0] || "https://via.placeholder.com/48"}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (t) => <span className="font-semibold">{t}</span>,
    },
    {
      title: "Loại",
      dataIndex: "category",
      render: (c) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (p) =>
        p > 0 ? (
          <span className="text-green-600 font-semibold">
            {p.toLocaleString("vi-VN")}₫
          </span>
        ) : (
          <Tag>Miễn phí</Tag>
        ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerAvatar",
      width: 220,
      render: (customerAvatar, r) =>
        r.customerName || r.customerAvatar ? (
          <div className="flex items-center gap-2">
            <img
              src={customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName || "User")}`}
              alt="customerAvatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <div className="flex flex-col">
              <span className="font-medium">{r.customerName || "Ẩn danh"}</span>
              <span className="text-xs text-gray-500">{r.email || ""}</span>
              <span className="text-xs text-gray-500">{r.phoneNumber || ""}</span>
            </div>
          </div>
        ) : null,
    },
    {
      title: "",
      width: 60,
      render: (_, r) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Chỉnh sửa",
                onClick: () => {
                  setCurrentEdit(r);
                  form.setFieldsValue(r);
                  setEditOpen(true);
                },
              },
              {
                key: "delete",
                label: "Xóa",
                danger: true,
                onClick: async () => {
                  await dispatch(deleteSetDesign(r._id));
                  setToast({ type: "success", message: "Đã xóa Set Design" });
                  dispatch(getAllSetDesigns({ page, limit: 10 }));
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<FiMoreVertical />} />
        </Dropdown>
      ),
    },
  ];

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = { ...values, price: Number(values.price || 0) };
    const res = currentEdit
      ? await dispatch(
          updateSetDesign({
            setDesignId: currentEdit._id,
            updateData: payload,
          })
        )
      : await dispatch(createSetDesign(payload));
    // Sử dụng uploadImages thay cho uploadSetDesignImages
    if (uploadImages.length) {
      // uploadImages là tên state, bị trùng với action uploadImages
      const uploadRes = await dispatch(
        uploadImagesAction(uploadImages)
      ).unwrap();
      if (uploadRes && uploadRes.images && uploadRes.images.length > 0) {
        await dispatch(updateSetDesign({
          setDesignId: res.payload._id,
          updateData: { $push: { images: uploadRes.images.map(img => img.url) } },
        }));
      }
    }
    setToast({
      type: "success",
      message: currentEdit ? "Cập nhật thành công" : "Tạo thành công",
    });
    setAddOpen(false);
    setEditOpen(false);
    setCurrentEdit(null);
    setUploadImages([]);
    form.resetFields();
    dispatch(getAllSetDesigns({ page, limit: 10 }));
  };

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* ===== HEADER DASHBOARD ===== */}
      <div className="relative w-full rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-10 text-white shadow-lg">
        <div className="text-sm opacity-80 mb-2">DASHBOARD · STAFF</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý Set Design</h1>
        <p className="opacity-90">
          Quản lý thông tin và hình ảnh các Set Design trong studio
        </p>

        <div className="absolute top-8 right-8">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur transition"
          >
            <FiPlus /> Thêm Set Design
          </button>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <FiLayers className="text-2xl text-purple-600" />
            <div>
              <Text type="secondary">Tổng Set</Text>
              <div className="text-2xl font-bold">{total}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <FiImage className="text-2xl text-blue-600" />
            <div>
              <Text type="secondary">Miễn phí</Text>
              <div className="text-2xl font-bold">{totalFree}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <FiDollarSign className="text-2xl text-green-600" />
            <div>
              <Text type="secondary">Có phí</Text>
              <div className="text-2xl font-bold">{totalPaid}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* ===== TABLE ===== */}
      <Card className="rounded-3xl shadow">
        <Table
          columns={columns}
          dataSource={setDesigns}
          rowKey="_id"
          pagination={{
            current: page,
            total,
            onChange: setPage,
          }}
        />
      </Card>

      {/* ===== MODAL ===== */}
      <Modal
        open={addOpen || editOpen}
        title={currentEdit ? "Chỉnh sửa Set Design" : "Thêm Set Design"}
        onCancel={() => {
          setAddOpen(false);
          setEditOpen(false);
          setCurrentEdit(null);
          form.resetFields();
          setUploadImages([]);
        }}
        onOk={handleSubmit}
        okText={currentEdit ? "Cập nhật" : "Tạo mới"}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên Set" rules={[{ required: true }]}>
            <Input size="large" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="category" label="Loại">
            <Select size="large" className="rounded-xl">
              <Option value="wedding">Đám cưới</Option>
              <Option value="portrait">Chân dung</Option>
              <Option value="event">Sự kiện</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Giá">
            <Input type="number" size="large" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} className="rounded-xl" />
          </Form.Item>

          <Form.Item label="Hình ảnh Set Design">
            <div className="flex flex-wrap gap-3 items-start">
              {uploadImages.length > 0 &&
                Array.from(uploadImages).map((file, idx) => {
                  const url = file.previewUrl || URL.createObjectURL(file);
                  file.previewUrl = url;
                  return (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-200 shadow"
                    >
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setUploadImages((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                <div className="text-center">
                  <FiImage className="text-2xl text-purple-400" />
                  <div className="text-xs text-gray-500 mt-1">Thêm ảnh</div>
                </div>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setUploadImages((prev) => [
                        ...prev,
                        ...Array.from(e.target.files),
                      ]);
                    }
                  }}
                />
              </label>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default StaffSetDesignPage;
