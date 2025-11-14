// src/pages/User/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Row,
  Col,
  Spin,
  Modal,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Thêm để redirect

import {
  getMyProfile,
  updateProfile,
  deleteMyAccount,
} from "../../features/customer/customerSlice";
import { changePassword, logout } from "../../features/auth/authSlice";
import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // === SELECTORS ===
  const { customer, loading: customerLoading, errorMessage, successMessage } = useSelector(
    (state) => state.customer
  );
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);

  // === STATE ===
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [toast, setToast] = useState(null);
  const [isPasswordModal, setIsPasswordModal] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // === EFFECTS ===
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      });
      setAvatarPreview(customer.avatar);
    }
  }, [customer, form]);

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
      setToast({ type: "error", message: authError.message || "Đổi mật khẩu thất bại" });

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
  const uploadProps = {
    beforeUpload: (file) => {
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      form.setFieldsValue({ avatar: file });
      return false;
    },
    showUploadList: false,
  };

  const handleSave = (values) => {
    const payload = {
      ...values,
      avatarURL: avatarURL || undefined,
    };
    dispatch(updateProfile(payload));
    setEditing(false);
  };

  // === ĐỔI MẬT KHẨU - ĐÃ SỬA ===
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const result = await dispatch(changePassword(values)).unwrap();

      // Thành công
      setToast({ type: "success", message: result.message || "Đổi mật khẩu thành công!" });
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

      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-sky-100 via-blue-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-12 -left-8 w-48 h-48 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-60 h-60 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="relative z-10">
          <Title level={2} className="font-semibold mb-2 text-gray-900">
            Hồ sơ của tôi
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
          </Text>
        </div>
      </div>

      <Row gutter={24}>
        {/* LEFT CARD */}
        <Col xs={24} md={8}>
          <Card className="text-center rounded-2xl p-5 shadow-lg border border-gray-100 bg-white">
            <Upload {...uploadProps}>
              <div className="relative inline-block cursor-pointer group">
                <Avatar
                  size={130}
                  src={avatarPreview}
                  icon={<UserOutlined />}
                  className="mb-4 border-4 border-white shadow-md"
                  style={{ borderRadius: "999px", transition: "0.25s" }}
                />
                <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-20 transition-all"></div>
              </div>
            </Upload>

            <div className="mt-3">
              <Input
                placeholder="Dán link ảnh avatar..."
                prefix={<LinkOutlined />}
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
              icon={<DeleteOutlined />}
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
            title={<span className="font-semibold text-lg text-gray-900">Thông tin cá nhân</span>}
            className="shadow-lg rounded-2xl border border-gray-100 bg-white"
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
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
                <Input prefix={<UserOutlined />} disabled={!editing} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input prefix={<MailOutlined />} disabled={!editing} />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input prefix={<PhoneOutlined />} disabled={!editing} />
              </Form.Item>
            </Form>
          </Card>

          {/* SECURITY */}
          <Card
            title={<span className="font-semibold text-lg text-gray-900">Bảo mật</span>}
            className="mt-6 shadow-lg rounded-2xl border border-gray-100 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Đổi mật khẩu</Text>
                <div className="text-gray-500 text-sm">
                  Giúp bảo vệ tài khoản tốt hơn
                </div>
              </div>
              <Button
                icon={<LockOutlined />}
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
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;