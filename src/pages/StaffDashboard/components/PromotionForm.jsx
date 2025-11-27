// src/components/promotion/PromotionForm.jsx
import React from "react";
import { Form, Input, Select, DatePicker, InputNumber } from "antd";
import {
  FiTag,
  FiPercent,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const PromotionForm = ({ form, initialValues = {} }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        discountType: "percentage",
        applicableFor: "all",
        isActive: true,
        minOrderValue: 0,
        ...initialValues,
        // Đảm bảo dateRange luôn là array dayjs
        dateRange: initialValues.startDate
          ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
          : undefined,
      }}
    >
      <Form.Item
        label="Tên chương trình"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên chương trình" }]}
      >
        <Input prefix={<FiTag />} placeholder="Giảm giá mùa hè 2024" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Mã code"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã code" }]}
          normalize={(value) => value?.toUpperCase().trim()}
        >
          <Input prefix={<FiPercent />} placeholder="SUMMER2024" />
        </Form.Item>

        <Form.Item
          label="Giới hạn số lần sử dụng"
          name="usageLimit"
          tooltip="Để trống = không giới hạn"
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Ví dụ: 100"
          />
        </Form.Item>
      </div>

      <Form.Item label="Mô tả chương trình" name="description">
        <Input.TextArea
          rows={2}
          placeholder="Giảm 20% tối đa 100,000đ cho đơn hàng từ 500,000đ..."
        />
      </Form.Item>

      <Form.Item
        label="Loại giảm giá"
        name="discountType"
        rules={[{ required: true }]}
      >
        <Select>
          <Select.Option value="percentage">Giảm theo phần trăm (%)</Select.Option>
          <Select.Option value="fixed">Giảm cố định (VNĐ)</Select.Option>
        </Select>
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Giá trị giảm"
          name="discountValue"
          rules={[{ required: true, message: "Nhập giá trị giảm" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            prefix={<FiDollarSign />}
            formatter={(value) => value && `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.discountType !== curr.discountType}
        >
          {({ getFieldValue }) =>
            getFieldValue("discountType") === "percentage" ? (
              <Form.Item
                label="Tối đa giảm (VNĐ)"
                name="maxDiscount"
                tooltip="Để trống = không giới hạn giảm"
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  prefix={<FiDollarSign />}
                  placeholder="Ví dụ: 100000"
                  formatter={(value) => value && `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </div>

      <Form.Item
        label="Đơn hàng tối thiểu (VNĐ)"
        name="minOrderValue"
        tooltip="0 = không yêu cầu"
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          prefix={<FiDollarSign />}
          placeholder="500000"
        />
      </Form.Item>

      <Form.Item label="Áp dụng cho" name="applicableFor">
        <Select>
          <Select.Option value="all">Tất cả khách hàng</Select.Option>
          <Select.Option value="first_time">Chỉ khách mới</Select.Option>
          <Select.Option value="return">Khách quay lại</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
        <Select>
          <Select.Option value={true}>Bật (Đang hoạt động)</Select.Option>
          <Select.Option value={false}>Tắt</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Thời gian hiệu lực"
        name="dateRange"
        rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
      >
        <RangePicker
          className="w-full"
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm"
          suffixIcon={<FiCalendar />}
          placeholder={["Bắt đầu", "Kết thúc"]}
        />
      </Form.Item>
    </Form>
  );
};

export default PromotionForm;