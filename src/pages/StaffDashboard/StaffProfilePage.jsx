import React, { useEffect, useState } from "react";
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
} from "antd";
import { FiUser, FiEdit, FiSave, FiPhone, FiMail, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, changePassword } from "../../features/auth/authSlice";

const { Title, Text } = Typography;

const StaffProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [changingPassword, setChangingPassword] = useState(false);

  // === GỌI GET CURRENT USER ===
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // === UPDATE FORM SAU KHI LẤY XONG USER ===
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        note: "",
      });
    }
  }, [user, form]);

  if (loading || !user) {
    return (
      <div className="w-full h-80 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-100 via-slate-50 to-white shadow-lg border border-indigo-200/50">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-2 text-gray-900">
            Hồ sơ nhân viên
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Thông tin cá nhân và lịch sử công việc tại S+ Studio
          </Text>
        </div>
      </div>

      <Row gutter={24}>
        {/* LEFT COLUMN */}
        <Col xs={24} md={8}>
          <Card className="text-center shadow-lg border border-gray-100 rounded-2xl">
            <Avatar
              size={120}
              src={user.avatar}
              icon={<FiUser />}
              className="mb-4"
            />
            <Title level={4} className="mb-1">
              {user.fullName}
            </Title>
            <Tag color="blue" className="px-3 py-1">
              {user.role === "staff" ? "Nhân viên Studio" : user.role}
            </Tag>

            <div className="mt-4 space-y-2 text-left">
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
          <Card
            title="Thông tin liên hệ"
            className="shadow-lg border border-gray-100 rounded-2xl"
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <FiSave /> : <FiEdit />}
                onClick={() => {
                  if (editing) {
                    form.submit();
                  } else {
                    setEditing(true);
                  }
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

          {/* ĐỔI MẬT KHẨU */}
          <Card
            className="mt-6 shadow-lg border border-gray-100 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-slate-50"
            title={
              <div className="flex items-center gap-2">
                <FiLock className="text-indigo-600" />
                <span>Đổi mật khẩu</span>
              </div>
            }
          >
            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={async (values) => {
                const { oldPassword, newPassword, confirmPassword } = values;
                if (newPassword !== confirmPassword) {
                  message.warning("Mật khẩu mới và xác nhận không khớp");
                  return;
                }
                setChangingPassword(true);
                try {
                  await dispatch(
                    changePassword({ oldPassword, newPassword })
                  ).unwrap();
                  message.success("Đổi mật khẩu thành công");
                  passwordForm.resetFields();
                } catch (err) {
                  message.error(
                    err?.message || err?.data?.message || "Đổi mật khẩu thất bại"
                  );
                } finally {
                  setChangingPassword(false);
                }
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
                    ]}
                  >
                    <Input.Password
                      prefix={<FiLock />}
                      className="rounded-lg"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới" },
                      {
                        min: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<FiLock />}
                      className="rounded-lg"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                    ]}
                  >
                    <Input.Password
                      prefix={<FiLock />}
                      className="rounded-lg"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={changingPassword}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-lg"
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffProfilePage;
