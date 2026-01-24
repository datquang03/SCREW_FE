import React from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Tag,
  Row,
  Col,
  Avatar,
  Spin,
  message,
  Modal,
} from "antd";
import {
  FiUser,
  FiEdit,
  FiSave,
  FiPhone,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  changePassword,
  uploadAvatar,
} from "../../features/auth/authSlice";

const { Title, Text } = Typography;

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const fileInputRef = React.useRef(null);

  const [editing, setEditing] = React.useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [passwordModalVisible, setPasswordModalVisible] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState(null);

  React.useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        note: "",
      });
    }
  }, [user, form]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setUploadingAvatar(true);
    try {
      await dispatch(uploadAvatar({ avatar: file })).unwrap();
      message.success("Cập nhật avatar thành công");
      await dispatch(getCurrentUser()).unwrap();
      setAvatarPreview(null);
    } catch (err) {
      message.error(err?.message || "Upload avatar thất bại");
    } finally {
      setUploadingAvatar(false);
      e.target.value = null;
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.warning("Mật khẩu mới và xác nhận không khớp");
      return;
    }
    setChangingPassword(true);
    try {
      await dispatch(
        changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      ).unwrap();
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      setPasswordModalVisible(false);
    } catch (err) {
      message.error(err?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="w-full h-80 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · ADMIN</div>
        <h1 className="text-3xl font-bold mb-2">Hồ sơ quản trị viên</h1>
        <p className="opacity-90">
          Thông tin cá nhân và quản trị hệ thống S+ Studio
        </p>
      </div>
      <Row gutter={24}>
        {/* LEFT COLUMN - AVATAR & INFO */}
        <Col xs={24} md={8}>
          <Card className="text-center shadow-lg border border-slate-200">
            <div className="relative inline-block">
              <Avatar
                size={120}
                src={
                  avatarPreview &&
                  typeof avatarPreview === "string" &&
                  avatarPreview.startsWith("data:image")
                    ? avatarPreview
                    : user?.avatar || undefined
                }
                icon={<FiUser />}
                className="mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
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
            <Title level={4} className="mb-1">
              {user.fullName}
            </Title>
            <Tag color="purple" className="px-3 py-1">
              {user.role === "admin" ? "Quản trị viên" : user.role}
            </Tag>
            <div className="mt-6 space-y-3 text-left">
              <div className="flex justify-between">
                <Text className="text-gray-500">Trạng thái</Text>
                <Tag color={user.isActive ? "green" : "red"}>
                  {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </Tag>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Email xác thực</Text>
                <Tag color={user.isVerified ? "green" : "red"}>
                  {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                </Tag>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Ngày tạo</Text>
                <Text strong>
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        {/* RIGHT COLUMN */}
        <Col xs={24} md={16}>
          {/* Thông tin liên hệ */}
          <Card
            title="Thông tin liên hệ"
            className="shadow-lg border border-gray-100 rounded-2xl"
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <FiSave /> : <FiEdit />}
                onClick={() => {
                  if (editing) form.submit();
                  else setEditing(true);
                }}
              >
                {editing ? "Lưu" : "Chỉnh sửa"}
              </Button>
            }
          >
            <Form layout="vertical" form={form}>
              <Form.Item label="Họ và tên" name="fullName">
                <Input
                  prefix={<FiUser />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input
                  prefix={<FiMail />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone">
                <Input
                  prefix={<FiPhone />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea
                  rows={4}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>
            </Form>
          </Card>
          {/* Thông tin tài khoản */}
          <Card
            title="Thông tin tài khoản"
            className="mt-6 shadow-lg border border-gray-100 rounded-2xl"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Tên đăng nhập</Text>
                <Text strong>{user.username}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Mã ID</Text>
                <Text strong>{user._id}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Cập nhật gần nhất</Text>
                <Text strong>
                  {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
                </Text>
              </div>
            </div>
          </Card>
          {/* NÚT ĐỔI MẬT KHẨU */}
          <Card className="mt-6 shadow-lg border border-gray-100 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiLock className="text-indigo-600 text-xl" />
                <Title level={5} className="!mb-0">
                  Đổi mật khẩu
                </Title>
              </div>
              <Button
                type="primary"
                icon={<FiLock />}
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setPasswordModalVisible(true)}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      {/* MODAL ĐỔI MẬT KHẨU */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiLock className="text-indigo-600" />
            Đổi mật khẩu
          </div>
        }
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={520}
        centered
      >
        <Form
          layout="vertical"
          form={passwordForm}
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password
              prefix={<FiLock />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<FiLock />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ]}
          >
            <Input.Password
              prefix={<FiLock />}
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changingPassword}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfilePage;
