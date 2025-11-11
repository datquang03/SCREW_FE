import React from "react";
import { Card, Typography, Switch, Form, Input, Button, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminSettingsPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">
          Cài đặt hệ thống
        </Title>
        <Text className="text-gray-600">
          Quản lý brand, quy trình và thông báo của S+ Studio
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Brand identity">
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

        <Card title="Thông báo & quy trình">
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


