import React, { useState, useMemo } from "react";
import {
  Card,
  Typography,
  Input,
  Table,
  Button,
  Dropdown,
  Menu,
  Tag,
  Modal,
  Form,
  DatePicker,
  Select,
} from "antd";
import {
  FiPercent,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMoreHorizontal,
  FiCalendar,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const mockPromotions = [
  {
    key: "PM-001",
    name: "Giảm 20% Livestream",
    code: "LIVE20",
    type: "percentage",
    value: 20,
    start: "2025-02-01",
    end: "2025-03-01",
    status: "active",
  },
  {
    key: "PM-002",
    name: "Voucher studio B",
    code: "STUB50",
    type: "fixed",
    value: 500000,
    start: "2025-01-15",
    end: "2025-02-15",
    status: "expired",
  },
];

const StaffPromotionPage = () => {
  const [data, setData] = useState(mockPromotions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [form] = Form.useForm();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const openModal = (promotion) => {
    setEditingPromotion(promotion);
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        dateRange: [dayjs(promotion.start), dayjs(promotion.end)],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        start: values.dateRange[0].format("YYYY-MM-DD"),
        end: values.dateRange[1].format("YYYY-MM-DD"),
        key: editingPromotion?.key || `PM-${data.length + 1}`,
        status: editingPromotion?.status || "active",
      };

      if (editingPromotion) {
        setData((prev) => prev.map((item) => (item.key === payload.key ? payload : item)));
      } else {
        setData((prev) => [...prev, payload]);
      }

      setModalVisible(false);
      setEditingPromotion(null);
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa mã ${record.code}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setData((prev) => prev.filter((item) => item.key !== record.key));
      },
    });
  };

  const columns = [
    { title: "Tên chương trình", dataIndex: "name", key: "name" },
    { title: "Mã code", dataIndex: "code", key: "code" },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.type === "percentage" ? `${value}%` : `${value.toLocaleString()}đ`,
    },
    {
      title: "Thời gian",
      key: "date",
      render: (_, record) => (
        <span>
          {record.start} - {record.end}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang chạy" : "Hết hạn"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item icon={<FiEdit />} onClick={() => openModal(record)}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              icon={<FiTrash2 />}
              danger
              onClick={() => handleDelete(record)}
            >
              Xóa
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<FiMoreHorizontal />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-100 via-white to-white px-6 py-8 shadow-lg">
        <div className="absolute -top-10 -right-12 h-48 w-48 rounded-full bg-blue-200 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={2} className="mb-1 text-gray-900">
              Phiếu giảm giá & khuyến mãi
            </Title>
            <Text className="text-base text-gray-600">
              Theo dõi và quản lý các chương trình ưu đãi
            </Text>
          </div>
          <Button
            type="primary"
            icon={<FiPlus />}
            size="large"
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold shadow-lg"
            onClick={() => openModal(null)}
          >
            Tạo mã mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Tổng chương trình
          </p>
          <p className="text-3xl font-bold text-gray-900">{data.length}</p>
          <Text className="text-xs text-gray-500">bao gồm cả hết hạn</Text>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Đang hoạt động
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {data.filter((item) => item.status === "active").length}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm tên hoặc mã code..."
          prefix={<FiSearch className="text-gray-400" />}
          allowClear
          className="w-full rounded-2xl border border-gray-200 bg-white/70 shadow-inner sm:w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          className="w-full rounded-2xl sm:w-60"
          value={statusFilter || undefined}
          onChange={(val) => setStatusFilter(val ?? "")}
        >
          <Option value="active">Đang chạy</Option>
          <Option value="expired">Hết hạn</Option>
        </Select>
      </div>

      <Card className="rounded-3xl border border-white/60 bg-white shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        open={modalVisible}
        title={editingPromotion ? "Chỉnh sửa mã" : "Tạo mã khuyến mãi"}
        onCancel={() => {
          setModalVisible(false);
          setEditingPromotion(null);
        }}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        centered
        width={520}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên chương trình"
            name="name"
            rules={[{ required: true, message: "Nhập tên chương trình" }]}
          >
            <Input prefix={<FiTag />} />
          </Form.Item>
          <Form.Item
            label="Mã code"
            name="code"
            rules={[{ required: true, message: "Nhập mã code" }]}
          >
            <Input prefix={<FiPercent />} />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Chọn loại" }]}
          >
            <Select placeholder="Chọn loại khuyến mãi">
              <Option value="percentage">Giảm theo %</Option>
              <Option value="fixed">Giảm số tiền</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Giá trị"
            name="value"
            rules={[{ required: true, message: "Nhập giá trị" }]}
          >
            <Input type="number" prefix={<FiDollarSign />} />
          </Form.Item>
          <Form.Item
            label="Thời gian"
            name="dateRange"
            rules={[{ required: true, message: "Chọn thời gian" }]}
          >
            <DatePicker.RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              suffixIcon={<FiCalendar />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffPromotionPage;
