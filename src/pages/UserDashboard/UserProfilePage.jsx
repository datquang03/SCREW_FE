// src/pages/User/UserProfilePage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Avatar,
  Divider,
  Row,
  Col,
  Spin,
  Modal,
} from "antd";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit,
  FiSave,
  FiLock,
  FiTrash2,
  FiLink,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Thêm để redirect

import {
  getMyProfile,
  updateProfile,
  deleteMyAccount,
} from "../../features/customer/customerSlice";
import {
  changePassword,
  logout,
  uploadAvatar,
  getCurrentUser,
} from "../../features/auth/authSlice";
import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // === SELECTORS ===
  const {
    customer,
    loading: customerLoading,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.customer);
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);

  // === STATE ===
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [toast, setToast] = useState(null);
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // === EFFECTS ===
  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getCurrentUser()); // Load user data để lấy avatar
  }, [dispatch]);

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      });
    }
  }, [customer, form]);

  // Helper function để lấy avatar URL từ object hoặc string
  const getAvatarUrl = (avatar) => {
    if (!avatar) return undefined;
    if (typeof avatar === "string") return avatar;
    if (typeof avatar === "object" && avatar.url) return avatar.url;
    return undefined;
  };

  // Debug: Log avatar values
  useEffect(() => {
    console.log("User avatar:", user?.avatar);
    console.log("Customer avatar:", customer?.avatar);
    console.log("Avatar preview:", avatarPreview);
    console.log(
      "Resolved avatar URL:",
      getAvatarUrl(user?.avatar) || getAvatarUrl(customer?.avatar)
    );
  }, [user?.avatar, customer?.avatar, avatarPreview]);

  // === TOAST: từ customerSlice ===
  useEffect(() => {
    if (successMessage) {
      setToast({ type: "success", message: successMessage });
    }
    if (errorMessage) {
      setToast({ type: "error", message: errorMessage });
    }
  }, [successMessage, errorMessage]);

  // === TOAST: từ authSlice (changePassword) ===
  useEffect(() => {
    if (authError) {
      setToast({
        type: "error",
        message: authError.message || "Đổi mật khẩu thất bại",
      });

      // Nếu backend trả 401 → token hết hạn → logout
      if (authError.status === 401) {
        setTimeout(() => {
          dispatch(logout());
          navigate("/login", { replace: true });
        }, 1500); // Cho toast hiện 1.5s
      }
    }
  }, [authError, dispatch, navigate]);

  // === HANDLERS ===
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({
        type: "error",
        message: "Vui lòng chọn file ảnh",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        type: "error",
        message: "Kích thước ảnh không được vượt quá 5MB",
      });
      return;
    }

    // Tạo preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setUploadingAvatar(true);
    try {
      await dispatch(uploadAvatar({ avatar: file })).unwrap();
      setToast({ type: "success", message: "Cập nhật avatar thành công" });

      // Refresh cả user và customer data từ server để lấy avatar URL mới
      await Promise.all([dispatch(getCurrentUser()), dispatch(getMyProfile())]);

      // Clear preview để dùng URL từ server
      setAvatarPreview(null);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Upload avatar thất bại",
      });
      // Giữ preview nếu upload thất bại
    } finally {
      setUploadingAvatar(false);
      // Reset input để có thể chọn lại file giống nhau
      e.target.value = null;
    }
  };

  const handleSave = (values) => {
    const payload = {
      ...values,
      avatarURL: avatarURL || undefined,
    };
    dispatch(updateProfile(payload));
    setEditing(false);
  };

  // === ĐỔI MẬT KHẨU ===
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const { oldPassword, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        setToast({
          type: "error",
          message: "Mật khẩu mới và xác nhận không khớp",
        });
        return;
      }

      const result = await dispatch(
        changePassword({ oldPassword, newPassword })
      ).unwrap();

      // Thành công
      setToast({
        type: "success",
        message: result.message || "Đổi mật khẩu thành công!",
      });
      setIsPasswordModal(false);
      passwordForm.resetFields();
    } catch (err) {
      // Lỗi đã được xử lý trong useEffect authError
      // Không cần setToast ở đây
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa tài khoản?",
      content: "Tài khoản sẽ bị xoá vĩnh viễn và không thể khôi phục.",
      okText: "Xóa tài khoản",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk: () => dispatch(deleteMyAccount()),
    });
  };

  // === RENDER LOADING ===
  if (customerLoading || !customer) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TOAST */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Hồ sơ của tôi</h1>
        <p className="opacity-90">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
        </p>
      </div>

      <Row gutter={24}>
        {/* LEFT CARD */}
        <Col xs={24} md={8}>
          <Card className="text-center p-5 shadow-lg border border-slate-200 bg-white">
            <div className="relative inline-block">
              <Avatar
                key={`${getAvatarUrl(user?.avatar) || ""}-${
                  getAvatarUrl(customer?.avatar) || ""
                }`}
                size={130}
                src={
                  avatarPreview &&
                  typeof avatarPreview === "string" &&
                  avatarPreview.startsWith("data:image")
                    ? avatarPreview
                    : getAvatarUrl(user?.avatar) ||
                      getAvatarUrl(customer?.avatar) ||
                      undefined
                }
                icon={<FiUser />}
                className="mb-4 border-4 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderRadius: "999px", transition: "0.25s" }}
                onClick={handleAvatarClick}
                onError={(e) => {
                  console.error("Avatar load error:", e.target.src);
                  e.target.src = undefined;
                }}
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Spin size="small" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <div className="mt-3">
              <Input
                placeholder="Dán link ảnh avatar..."
                prefix={<FiLink />}
                value={avatarURL}
                onChange={(e) => {
                  setAvatarURL(e.target.value);
                  setAvatarPreview(e.target.value);
                }}
                disabled={!editing}
                className="rounded-lg"
              />
            </div>

            <Title level={4} className="font-bold mt-3">
              {customer.fullName}
            </Title>
            <Text className="text-gray-500 capitalize text-sm">
              {customer.role}
            </Text>

            <Divider className="my-5" />

            <div className="space-y-3 text-left px-2">
              <div>
                <Text className="text-gray-600">Username</Text>
                <div className="font-medium">{customer.username}</div>
              </div>
              <div>
                <Text className="text-gray-600">Thành viên từ</Text>
                <div className="font-medium">
                  {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div>
                <Text className="text-gray-600">Loyalty Points</Text>
                <div className="font-medium">
                  {customer.profile?.loyaltyPoints ?? 0} điểm
                </div>
              </div>
            </div>

            <Divider className="my-5" />

            <Button
              danger
              icon={<FiTrash2 />}
              className="w-full py-2 rounded-lg shadow-md hover:opacity-90 transition-all"
              onClick={handleDeleteAccount}
            >
              Xóa tài khoản
            </Button>
          </Card>
        </Col>

        {/* RIGHT CARD */}
        <Col xs={24} md={16}>
          <Card
            title={
              <span className="font-semibold text-lg text-gray-900">
                Thông tin cá nhân
              </span>
            }
            className="shadow-lg border border-slate-200 bg-white"
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <FiSave /> : <FiEdit />}
                onClick={() => (editing ? form.submit() : setEditing(true))}
                className="hover:scale-105 transition-all"
              >
                {editing ? "Lưu" : "Chỉnh sửa"}
              </Button>
            }
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input prefix={<FiUser />} disabled={!editing} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input prefix={<FiMail />} disabled={!editing} />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input prefix={<FiPhone />} disabled={!editing} />
              </Form.Item>
            </Form>
          </Card>

          {/* SECURITY */}
          <Card
            title={
              <span className="font-semibold text-lg text-gray-900">
                Bảo mật
              </span>
            }
            className="mt-6 shadow-lg border border-slate-200 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Đổi mật khẩu</Text>
                <div className="text-gray-500 text-sm">
                  Giúp bảo vệ tài khoản tốt hơn
                </div>
              </div>
              <Button
                icon={<FiLock />}
                type="primary"
                className="hover:scale-105 transition-all"
                onClick={() => setIsPasswordModal(true)}
                disabled={authLoading}
              >
                Thay đổi
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* PASSWORD MODAL */}
      <Modal
        title={<span className="font-semibold text-lg">Thay đổi mật khẩu</span>}
        open={isPasswordModal}
        centered
        okText="Cập nhật"
        cancelText="Hủy"
        onCancel={() => {
          setIsPasswordModal(false);
          passwordForm.resetFields();
        }}
        onOk={handleChangePassword}
        confirmLoading={authLoading}
        okButtonProps={{ disabled: authLoading }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password prefix={<FiLock />} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password prefix={<FiLock />} />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ]}
          >
            <Input.Password prefix={<FiLock />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
