import React from "react";
import { Card, Typography, Switch, Form, Input, Button, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminSettingsPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-yellow-100 via-white to-white shadow-lg border border-yellow-200/50">
        <div className="absolute -top-10 -right-12 w-48 h-48 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-2 text-gray-900">
            Cài đặt hệ thống
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Quản lý brand, quy trình và thông báo của S+ Studio
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Brand identity" className="shadow-lg border border-gray-100 rounded-2xl">
          <Form
            layout="vertical"
            initialValues={{
              brandName: "S+ Studio",
              contactEmail: "booking@splusstudio.vn",
              hotline: "0903 888 123",
              defaultStudio: "Studio A",
            }}
            form={form}
          >
            <Form.Item label="Tên thương hiệu" name="brandName">
              <Input className="rounded-lg" />
            </Form.Item>
            <Form.Item label="Email liên hệ" name="contactEmail">
              <Input className="rounded-lg" />
            </Form.Item>
            <Form.Item label="Hotline hỗ trợ" name="hotline">
              <Input className="rounded-lg" />
            </Form.Item>
            <Form.Item label="Studio mặc định" name="defaultStudio">
              <Select
                className="rounded-lg"
                options={[
                  { label: "Studio A", value: "Studio A" },
                  { label: "Studio B", value: "Studio B" },
                  { label: "Studio C", value: "Studio C" },
                ]}
              />
            </Form.Item>
            <Button type="primary" icon={<SaveOutlined />}>
              Lưu cài đặt
            </Button>
          </Form>
        </Card>

        <Card title="Thông báo & quy trình" className="shadow-lg border border-gray-100 rounded-2xl">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Thông báo email</Text>
                <div className="text-sm text-gray-500">
                  Gửi email xác nhận khi booking thành công
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Thông báo staff</Text>
                <div className="text-sm text-gray-500">
                  Gửi notification khi có booking khẩn
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Auto assign studio</Text>
                <div className="text-sm text-gray-500">
                  Tự động gợi ý studio theo nhu cầu khách hàng
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;


