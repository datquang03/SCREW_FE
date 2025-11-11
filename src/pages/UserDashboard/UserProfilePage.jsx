import React, { useState } from "react";
import { Card, Typography, Form, Input, Button, Upload, Avatar, Divider, Row, Col } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const uploadProps = {
    name: "avatar",
    listType: "picture-circle",
    showUploadList: false,
    beforeUpload: () => false,
  };

  const handleSave = (values) => {
    console.log("Saved:", values);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">
          Hồ sơ của tôi
        </Title>
        <Text className="text-gray-600">
          Quản lý thông tin cá nhân và tài khoản của bạn
        </Text>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Upload {...uploadProps}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="mb-4"
                src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
              />
            </Upload>
            <Title level={4} className="mb-1">
              Nguyễn Văn A
            </Title>
            <Text className="text-gray-500">Khách hàng</Text>
            <Divider />
            <div className="space-y-2 text-left">
              <div>
                <Text className="text-gray-600">Thành viên từ</Text>
                <div className="font-semibold">01/01/2024</div>
              </div>
              <div>
                <Text className="text-gray-600">Tổng đơn đã đặt</Text>
                <div className="font-semibold">12 đơn</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="Thông tin cá nhân"
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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                fullName: "Nguyễn Văn A",
                email: "nguyenvana@example.com",
                phone: "0901234567",
                address: "123 Đường ABC, Quận 4, TP.HCM",
              }}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input.TextArea
                  rows={3}
                  disabled={!editing}
                  className="rounded-lg"
                />
              </Form.Item>
            </Form>
          </Card>

          <Card title="Bảo mật" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Text strong>Mật khẩu</Text>
                  <div className="text-gray-500 text-sm">
                    Đã cập nhật 3 tháng trước
                  </div>
                </div>
                <Button type="link">Đổi mật khẩu</Button>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <Text strong>Xác thực 2 bước</Text>
                  <div className="text-gray-500 text-sm">
                    Bảo vệ tài khoản của bạn
                  </div>
                </div>
                <Button type="link">Bật</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfilePage;

