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
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../features/auth/authSlice";

const { Title, Text } = Typography;

const StaffProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

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
      <div>
        <Title level={2} className="mb-2">
          Hồ sơ nhân viên
        </Title>
        <Text className="text-gray-600">
          Thông tin cá nhân và lịch sử công việc tại S+ Studio
        </Text>
      </div>

      <Row gutter={24}>
        {/* LEFT COLUMN */}
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Avatar
              size={120}
              src={user.avatar}
              icon={<UserOutlined />}
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
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
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
                  prefix={<UserOutlined />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input
                  prefix={<MailOutlined />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone">
                <Input
                  prefix={<PhoneOutlined />}
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

          <Card title="Thông tin tài khoản" className="mt-6">
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
        </Col>
      </Row>
    </div>
  );
};

export default StaffProfilePage;
