import React, { useState } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Tag,
  Timeline,
  Row,
  Col,
  Avatar,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const onFinish = () => {
    setEditing(false);
  };

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
        <Col xs={24} md={8}>
          <Card className="text-center shadow-lg border border-gray-100 rounded-2xl">
            <Avatar size={120} icon={<UserOutlined />} className="mb-4" />
            <Title level={4} className="mb-1">
              Lê Minh Quân
            </Title>
            <Tag color="blue">Nhân viên Studio</Tag>
            <div className="mt-4 space-y-2 text-left">
              <div className="flex justify-between">
                <Text className="text-gray-500">Thâm niên</Text>
                <Text strong>3 năm</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Ca trực/tuần</Text>
                <Text strong>5 ca</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-500">Đánh giá</Text>
                <Text strong>4.9/5</Text>
              </div>
            </div>
          </Card>

          <Card title="Lịch sử công việc" className="mt-4 shadow-lg border border-gray-100 rounded-2xl">
            <Timeline
              items={[
                {
                  color: "green",
                  children: "12/11 - Hoàn thành set up Studio A (Livestream)",
                },
                {
                  color: "green",
                  children: "10/11 - Quản lý shoot chụp thời trang Studio C",
                },
                {
                  color: "blue",
                  children: "08/11 - Hỗ trợ thiết bị Studio B",
                },
              ]}
            />
          </Card>
        </Col>

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
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                fullName: "Lê Minh Quân",
                email: "leminhquan@splusstudio.vn",
                phone: "0902 556 678",
                note: "Chuyên gia ánh sáng, kinh nghiệm xử lý các setup phức tạp.",
              }}
              onFinish={onFinish}
            >
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

          <Card title="Kỹ năng" className="mt-6 shadow-lg border border-gray-100 rounded-2xl">
            <div className="flex flex-wrap gap-2">
              <Tag color="gold">Ánh sáng</Tag>
              <Tag color="cyan">Set decor</Tag>
              <Tag color="purple">Quay video</Tag>
              <Tag color="green">Quản lý thiết bị</Tag>
              <Tag color="blue">Dịch vụ khách hàng</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffProfilePage;

