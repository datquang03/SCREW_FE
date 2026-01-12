// src/pages/Staff/StaffSetDesignPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Card,
  Typography,
  Dropdown,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FiEdit, FiEye, FiTrash2, FiMoreVertical, FiImage } from "react-icons/fi";
import TextArea from "antd/es/input/TextArea";

import ToastNotification from "../../components/ToastNotification";

import {
  getAllSetDesigns,
  createSetDesign,
  updateSetDesign,
  deleteSetDesign,
  uploadSetDesignImages,
  deleteUploadedFile,
  getSetDesignById,
} from "../../features/setDesign/setDesignSlice";

const { Option } = Select;
const { Title, Text } = Typography;

// Mapping category value sang tiếng Việt
const getCategoryLabel = (value) => {
  const categoryMap = {
    wedding: "Đám cưới",
    portrait: "Chân dung",
    corporate: "Doanh nghiệp",
    event: "Sự kiện",
    family: "Gia đình",
    graduation: "Lễ tốt nghiệp",
    other: "Khác",
  };
  return categoryMap[value] || value;
};

const StaffSetDesignPage = () => {
  const dispatch = useDispatch();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState(false);

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
  const [uploadPayload, setUploadPayload] = useState([]); // array of File objects

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

    // Create preview images (base64 for display)
    const previews = await Promise.all(
      files.map(async (file) => await fileToBase64(file))
    );

    // Store File objects for upload
    setUploadPayload((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
    // reset input value if needed (so same file can be selected again)
    e.target.value = null;
  };

  const removePreviewAt = (index) => {
    setPreviewImages((prevImages) => {
      const target = prevImages[index];

      // Nếu đang chỉnh sửa (edit) và ảnh là URL đã upload (không phải base64 mới)
      if (
        currentEdit &&
        typeof target === "string" &&
        !target.startsWith("data:")
      ) {
        // Gửi request xóa file dùng chung
        dispatch(
          deleteUploadedFile({
            publicId: target,
          })
        );
      }

      return prevImages.filter((_, i) => i !== index);
    });

    // Nếu là ảnh mới chọn (có File tương ứng), chỉ cần bỏ khỏi payload (chưa upload nên không cần call API xóa)
    setUploadPayload((prev) => prev.filter((_, i) => i !== index));
  };

  // CREATE
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      // Convert price to number if it's a string
      const payload = {
        ...values,
        price: values.price ? Number(values.price) : 0,
      };

      // 1) Create set design trước để có setDesignId
      const res = await dispatch(createSetDesign(payload));
      if (res.error) {
        setToast({
          type: "error",
          message: res.error?.message || "Tạo thất bại",
        });
        return;
      }

      const createdSetDesign = res.payload;

      // 2) Upload images (nếu có) dùng API mới /upload/set-design/:setDesignId/images
      if (uploadPayload.length > 0 && createdSetDesign?._id) {
        const resImg = await dispatch(
          uploadSetDesignImages({
            setDesignId: createdSetDesign._id,
            images: uploadPayload,
          })
        );
        if (resImg.error) {
          setToast({
            type: "error",
            message:
              "Tạo Set Design thành công nhưng upload ảnh thất bại: " +
              (resImg.error?.message || "Lỗi không xác định"),
          });
        }
      }

      setToast({ type: "success", message: "Tạo Set Design thành công!" });
      // clear form
      addForm.resetFields();
      setPreviewImages([]);
      setUploadPayload([]);
      fetchSetDesigns(1);
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
      price: record.price || "",
      description: record.description,
    });

    // preload existing images into preview (but treat them as existing URLs, not upload payload)
    setPreviewImages(record.images || []); // existing URLs or base64 depending on your backend
    setUploadPayload([]); // new uploads only
  };

  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      // Convert price to number if it's a string
      const payload = {
        ...values,
        price: values.price ? Number(values.price) : 0,
      };

      // 1) Update set design first
      const res = await dispatch(
        updateSetDesign({ setDesignId: currentEdit._id, updateData: payload })
      );

      if (res.error) {
        setToast({
          type: "error",
          message: res.error?.message || "Cập nhật thất bại",
        });
        return;
      }

      // 2) Upload new images if any (after update, we have the ID)
      if (uploadPayload.length > 0 && currentEdit._id) {
        const resImg = await dispatch(
          uploadSetDesignImages({
            setDesignId: currentEdit._id,
            images: uploadPayload,
          })
        );
        if (resImg.error) {
          setToast({
            type: "error",
            message:
              "Cập nhật Set Design thành công nhưng upload ảnh thất bại: " +
              (resImg.error?.message || "Lỗi không xác định"),
          });
        }
      }

        setToast({ type: "success", message: "Cập nhật thành công!" });
        setEditModalVisible(false);
        setPreviewImages([]);
        setUploadPayload([]);
        fetchSetDesigns(currentPage);
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

  // VIEW DETAIL
  const handleView = async (record) => {
    try {
      setLoadingDetail(true);
      setViewModalVisible(true);
      const result = await dispatch(getSetDesignById(record._id)).unwrap();
      setCurrentView(result);
    } catch (err) {
      console.error("Lỗi tải chi tiết:", err);
      // Nếu API fail, vẫn hiển thị với data từ record
      setCurrentView(record);
    } finally {
      setLoadingDetail(false);
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Hình ảnh",
      key: "images",
      width: 120,
      responsive: ["lg"],
      render: (_, record) => {
        const defaultImage =
          "https://via.placeholder.com/48x48?text=No+Image";
        const firstImage =
          Array.isArray(record.images) && record.images.length > 0
            ? record.images[0]
            : null;
        const imageCount = Array.isArray(record.images) ? record.images.length : 0;

        return (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={firstImage || defaultImage}
              alt={record.name || "Set Design"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
            {imageCount > 1 && (
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {imageCount}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="font-semibold text-gray-900 max-w-[150px] md:max-w-[200px] truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      render: (text) => <Tag color="blue">{getCategoryLabel(text)}</Tag>,
      responsive: ["md"],
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div className="font-semibold text-green-600">
          {price && price > 0
            ? `${Number(price).toLocaleString("vi-VN")}₫`
            : <Tag color="default">Miễn phí</Tag>}
        </div>
      ),
      responsive: ["md"],
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div 
          className="max-w-[200px] md:max-w-[300px] lg:max-w-[400px] truncate" 
          title={text}
        >
          {text || "-"}
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "",
      key: "actions",
      width: 70,
      fixed: "right",
      render: (_, record) => {
        const menuItems = [
          {
            key: "view",
            label: (
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <FiEye /> Xem chi tiết
              </div>
            ),
            onClick: () => handleView(record),
          },
          {
            key: "edit",
            label: (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <FiEdit /> Sửa Set Design
              </div>
            ),
            onClick: () => openEditModal(record),
          },
          {
            key: "delete",
            label: (
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <FiTrash2 /> Xóa Set Design
              </div>
            ),
            onClick: () => handleDelete(record),
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<FiMoreVertical className="text-xl text-gray-600" />}
              className="hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            />
          </Dropdown>
        );
      },
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
              Quản lý Set Design
            </Title>
            <Text className="text-base text-gray-700 font-medium">
              Quản lý thông tin và hình ảnh các Set Design
            </Text>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer font-semibold"
            onClick={() => {
              setAddModalVisible(true);
              addForm.resetFields();
              setPreviewImages([]);
              setUploadPayload([]);
            }}
          >
            <FiImage /> Thêm Set Design
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
        <Table
          columns={columns}
          dataSource={setDesigns.map((s) => ({ key: s._id, ...s }))}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: 10,
            total,
            responsive: true,
            showSizeChanger: false,
            onChange: (page) => {
              setCurrentPage(page);
              fetchSetDesigns(page);
            },
          }}
          scroll={{ x: 800 }}
          className="responsive-table"
        />
      </Card>

      {/* ADD MODAL */}
      <Modal
        title="Thêm Set Design"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
          setPreviewImages([]);
          setUploadPayload([]);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setAddModalVisible(false);
            addForm.resetFields();
            setPreviewImages([]);
            setUploadPayload([]);
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleAdd}>
            Tạo mới
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 700, maxHeight: "75vh", overflowY: "auto" }}
      >
        <Form form={addForm} layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item 
              name="name" 
              label="Tên Set Design" 
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              className="sm:col-span-2"
            >
              <Input size="large" placeholder="VD: Vintage Wedding Set Design" />
            </Form.Item>

            <Form.Item 
              name="category" 
              label="Loại" 
              rules={[{ required: true, message: "Vui lòng chọn loại" }]}
            >
              <Select size="large" placeholder="Chọn loại">
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
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              className="sm:col-span-2"
            >
              <TextArea rows={4} placeholder="Mô tả chi tiết về Set Design..." />
            </Form.Item>

            {/* IMAGE UPLOAD UI (ADD) */}
            <Form.Item label="Hình ảnh Set Design" className="sm:col-span-2">
              <div className="flex flex-wrap gap-3 items-start">
                {previewImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePreviewAt(idx)}
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <div className="text-center">
                    <PlusOutlined className="text-2xl text-gray-500" />
                    <div className="text-xs text-gray-500 mt-1">Thêm ảnh</div>
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
          </div>
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
          setCurrentEdit(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setEditModalVisible(false);
            setPreviewImages([]);
            setUploadPayload([]);
            setCurrentEdit(null);
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 700, maxHeight: "75vh", overflowY: "auto" }}
      >
        <Form form={editForm} layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item 
              name="name" 
              label="Tên Set Design" 
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              className="sm:col-span-2"
            >
              <Input size="large" placeholder="VD: Vintage Wedding Set Design" />
            </Form.Item>

            <Form.Item 
              name="category" 
              label="Loại" 
              rules={[{ required: true, message: "Vui lòng chọn loại" }]}
            >
              <Select size="large" placeholder="Chọn loại">
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
              name="price"
              label="Giá (VND)"
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                { 
                  pattern: /^[0-9]+$/, 
                  message: "Giá phải là số nguyên dương" 
                }
              ]}
            >
              <Input
                size="large"
                type="number"
                placeholder="VD: 8500000"
                addonAfter="₫"
                min={0}
                step={1000}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              className="sm:col-span-2"
            >
              <TextArea rows={4} placeholder="Mô tả chi tiết về Set Design..." />
            </Form.Item>

            {/* IMAGE UPLOAD UI (EDIT) */}
            <Form.Item label="Hình ảnh Set Design" className="sm:col-span-2">
              <div className="flex flex-wrap gap-3 items-start">
                {previewImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePreviewAt(idx)}
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <div className="text-center">
                    <PlusOutlined className="text-2xl text-gray-500" />
                    <div className="text-xs text-gray-500 mt-1">Thêm ảnh</div>
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
          </div>
        </Form>
      </Modal>

      {/* VIEW DETAIL MODAL */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiEye className="text-blue-600" />
            <span>Chi tiết Set Design</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setCurrentView(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setCurrentView(null);
          }}>
            Đóng
          </Button>,
        ]}
        width={900}
        centered
      >
        {loadingDetail ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : currentView ? (
          <div className="space-y-4">
            {/* Header */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Title level={3} className="!mb-2 text-purple-700">
                    {currentView.name}
                  </Title>
                  <div className="flex items-center gap-2">
                    <Tag color={currentView.isActive ? "green" : "orange"}>
                      {currentView.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                    </Tag>
                    <Tag color="blue">{getCategoryLabel(currentView.category)}</Tag>
                  </div>
                </div>
              </div>
            </Card>

            {/* Thông tin chính */}
            <Card className="border-purple-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <Text type="secondary" className="text-xs block mb-1">
                    Giá
                  </Text>
                  <Text strong className="text-xl text-green-600 font-bold">
                    {currentView.price && currentView.price > 0
                      ? `${Number(currentView.price).toLocaleString("vi-VN")}₫`
                      : "Miễn phí"}
                  </Text>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Text type="secondary" className="text-xs block mb-1">
                    Danh mục
                  </Text>
                  <Tag color="blue" className="!text-base !px-3 !py-1">
                    {getCategoryLabel(currentView.category)}
                  </Tag>
                </div>
              </div>

              {currentView.description && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Text type="secondary" className="text-sm block mb-2 font-medium">
                    Mô tả:
                  </Text>
                  <Text className="text-base whitespace-pre-wrap">
                    {currentView.description}
                  </Text>
                </div>
              )}

              {currentView.tags && currentView.tags.length > 0 && (
                <div className="mb-4">
                  <Text type="secondary" className="text-sm block mb-2 font-medium">
                    Tags:
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {currentView.tags.map((tag, idx) => (
                      <Tag key={idx} color="purple" className="!px-3 !py-1 !rounded-full">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Hình ảnh */}
              {currentView.images && currentView.images.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Text type="secondary" className="text-sm block mb-3 font-medium">
                    Hình ảnh ({currentView.images.length}):
                  </Text>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentView.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Set Design ${idx + 1}`}
                        className="rounded-lg object-cover w-full h-40 border-2 border-purple-200 hover:border-purple-400 transition cursor-pointer"
                        onClick={() => window.open(img, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin Set Design
          </div>
        )}
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