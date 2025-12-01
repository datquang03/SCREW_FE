// src/pages/Staff/StaffSetDesignPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Input, Select, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import ToastNotification from "../../components/ToastNotification";

import {
  getAllSetDesigns,
  createSetDesign,
  updateSetDesign,
  deleteSetDesign,
  uploadSetDesignImages,
} from "../../features/setDesign/setDesignSlice";

const { Option } = Select;

const StaffSetDesignPage = () => {
  const dispatch = useDispatch();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // DELETE MODAL STATE
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: null,
    name: "",
  });

  // TOAST STATE
  const [toast, setToast] = useState(null);

  // IMAGE UPLOAD STATE (for both add & edit)
  const [previewImages, setPreviewImages] = useState([]); // array of base64 strings for UI preview
  const [uploadPayload, setUploadPayload] = useState([]); // array of { base64Image, fileName }

  const { setDesigns, total } = useSelector((state) => state.setDesign);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchSetDesigns = (page = 1) => {
    dispatch(getAllSetDesigns({ page, limit: 6 }));
  };

  useEffect(() => {
    fetchSetDesigns(1);
  }, []);

  // helper: convert File -> base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // handle select images (used for both add & edit)
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const results = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          base64Image: base64,
          fileName: file.name,
        };
      })
    );

    setUploadPayload((prev) => [...prev, ...results]);
    setPreviewImages((prev) => [...prev, ...results.map((r) => r.base64Image)]);
    // reset input value if needed (so same file can be selected again)
    e.target.value = null;
  };

  const removePreviewAt = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setUploadPayload((prev) => prev.filter((_, i) => i !== index));
  };

  // CREATE
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      // 1) upload images if any
      let uploadedImages = [];
      if (uploadPayload.length > 0) {
        const resImg = await dispatch(
          uploadSetDesignImages({ images: uploadPayload })
        );
        if (resImg.error) {
          setToast({
            type: "error",
            message: resImg.error?.message || "Upload ảnh thất bại",
          });
          return;
        }
        // backend may return { images: [...] } or { data: { images: [...] } }
        uploadedImages =
          resImg.payload?.images ||
          resImg.payload?.data ||
          resImg.payload ||
          [];
      }

      // 2) create set design with images (if any)
      const payload = {
        ...values,
        images: uploadedImages,
      };

      const res = await dispatch(createSetDesign(payload));
      if (res.error) {
        setToast({
          type: "error",
          message: res.error?.message || "Tạo thất bại",
        });
      } else {
        setToast({ type: "success", message: "Tạo Set Design thành công!" });
        // clear form & previews
        addForm.resetFields();
        setPreviewImages([]);
        setUploadPayload([]);
        fetchSetDesigns(1);
      }
      setAddModalVisible(false);
    } catch (err) {
      // validation error or other
      setToast({ type: "error", message: err.message || "Có lỗi xảy ra" });
    }
  };

  // EDIT
  const openEditModal = (record) => {
    setCurrentEdit(record);
    setEditModalVisible(true);

    editForm.setFieldsValue({
      name: record.name,
      category: record.category,
      description: record.description,
    });

    // preload existing images into preview (but treat them as existing URLs, not upload payload)
    setPreviewImages(record.images || []); // existing URLs or base64 depending on your backend
    setUploadPayload([]); // new uploads only
  };

  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      // upload new images if any
      let uploadedNewImages = [];
      if (uploadPayload.length > 0) {
        const resImg = await dispatch(
          uploadSetDesignImages({ images: uploadPayload })
        );
        if (resImg.error) {
          setToast({
            type: "error",
            message: resImg.error?.message || "Upload ảnh thất bại",
          });
          return;
        }
        uploadedNewImages =
          resImg.payload?.images ||
          resImg.payload?.data ||
          resImg.payload ||
          [];
      }

      // merge existing images (which are in previewImages but may be URLs) with uploadedNewImages
      // assume currentEdit.images holds existing images (URLs)
      const existingFromRecord = Array.isArray(currentEdit?.images)
        ? currentEdit.images
        : [];
      const mergedImages = [...existingFromRecord, ...uploadedNewImages];

      const updateData = {
        ...values,
        images: mergedImages,
      };

      const res = await dispatch(
        updateSetDesign({ setDesignId: currentEdit._id, updateData })
      );

      if (res.error) {
        setToast({
          type: "error",
          message: res.error?.message || "Cập nhật thất bại",
        });
      } else {
        setToast({ type: "success", message: "Cập nhật thành công!" });
        setEditModalVisible(false);
        setPreviewImages([]);
        setUploadPayload([]);
        fetchSetDesigns(currentPage);
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Có lỗi xảy ra" });
    }
  };

  // DELETE CONFIRM
  const confirmDelete = async () => {
    const res = await dispatch(deleteSetDesign(deleteModal.id));
    if (res.error) {
      setToast({
        type: "error",
        message: res.error?.message || "Xóa thất bại",
      });
    } else {
      setToast({ type: "success", message: "Xóa thành công!" });
      fetchSetDesigns(currentPage);
    }
    setDeleteModal({ visible: false, id: null, name: "" });
  };

  // OPEN DELETE MODAL
  const handleDelete = (record) => {
    setDeleteModal({
      visible: true,
      id: record._id,
      name: record.name,
    });
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Loại",
      dataIndex: "category",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button onClick={() => openEditModal(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Set Design</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setAddModalVisible(true);
            addForm.resetFields();
            setPreviewImages([]);
            setUploadPayload([]);
          }}
        >
          Thêm Set Design
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={setDesigns}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: 6,
          total,
          onChange: (page) => {
            setCurrentPage(page);
            fetchSetDesigns(page);
          },
        }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Thêm Set Design"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setPreviewImages([]);
          setUploadPayload([]);
        }}
        onOk={handleAdd}
        okText="Tạo mới"
        width={700}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="wedding">Đám cưới</Option>
              <Option value="portrait">Chân dung</Option>
              <Option value="corporate">Doanh nghiệp</Option>
              <Option value="event">Sự kiện</Option>
              <Option value="family">Gia đình</Option>
              <Option value="graduation">Lễ tốt nghiệp</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* IMAGE UPLOAD UI */}
          <Form.Item label="Hình ảnh Set Design">
            <div className="flex flex-wrap gap-3 items-start">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-lg overflow-hidden border"
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePreviewAt(idx)}
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400">
                <div className="text-center">
                  <PlusOutlined className="text-2xl text-gray-500" />
                  <div className="text-xs text-gray-500">Thêm ảnh</div>
                </div>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title="Sửa Set Design"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setPreviewImages([]);
          setUploadPayload([]);
        }}
        onOk={handleEdit}
        okText="Cập nhật"
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="wedding">Đám cưới</Option>
              <Option value="portrait">Chân dung</Option>
              <Option value="corporate">Doanh nghiệp</Option>
              <Option value="event">Sự kiện</Option>
              <Option value="family">Gia đình</Option>
              <Option value="graduation">Lễ tốt nghiệp</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* IMAGE UPLOAD UI (EDIT) */}
          <Form.Item label="Hình ảnh Set Design">
            <div className="flex flex-wrap gap-3 items-start">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-lg overflow-hidden border"
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePreviewAt(idx)}
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400">
                <div className="text-center">
                  <PlusOutlined className="text-2xl text-gray-500" />
                  <div className="text-xs text-gray-500">Thêm ảnh</div>
                </div>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        title="Xác nhận xóa"
        open={deleteModal.visible}
        onCancel={() => setDeleteModal({ visible: false, id: null, name: "" })}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc muốn xóa Set Design:
          <span className="font-semibold text-red-600">
            {" "}
            {deleteModal.name}
          </span>
          ?
        </p>
      </Modal>

      {/* TOAST */}
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
