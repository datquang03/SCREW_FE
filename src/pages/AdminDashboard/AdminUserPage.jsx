// src/pages/Admin/AdminUserPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Dropdown,
  Menu,
  message,
  Spin,
  Input,
  Select,
  Space,
} from "antd";
import {
  UserAddOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons"; // ĐÃ SỬA: XÓA "to"
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomers,
  getCustomerById,
  banCustomer,
  unbanCustomer,
} from "../../features/admin/admin.customerSlice";
import DataTable from "../../components/dashboard/DataTable";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUserPage = () => {
  const dispatch = useDispatch();
  const { customers, pagination, loading } = useSelector(
    (state) => state.adminCustomer
  );

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");

  const fetchCustomers = (page = 1) => {
    dispatch(getAllCustomers({ page, limit: 10, search, isActive }));
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search, isActive]);

  const handleTableChange = (pagination) => {
    fetchCustomers(pagination.current);
  };

  const handleBan = async (customerId, isBanned) => {
    const action = isBanned ? unbanCustomer : banCustomer;
    const result = await dispatch(action(customerId));
    if (action.fulfilled.match(result)) {
      message.success(isBanned ? "Đã bỏ cấm" : "Đã cấm");
    } else {
      message.error(result.payload?.message || "Thao tác thất bại");
    }
  };

  const getMenu = (record) => (
    <Menu>
      <Menu.Item
        key="ban"
        danger={!record.isBanned}
        onClick={() => handleBan(record._id, record.isBanned)}
      >
        {record.isBanned ? "Bỏ cấm" : "Cấm tài khoản"}
      </Menu.Item>
      <Menu.Item
        key="view"
        onClick={() => {
          dispatch(getCustomerById(record._id));
          message.info(`Xem chi tiết: ${record.fullName}`);
        }}
      >
        Xem chi tiết
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isBanned ? "red" : "green"}>
          {record.isBanned ? "Bị cấm" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={getMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const totalCustomers = pagination.total || 0;
  const activeCustomers = safeCustomers.filter((c) => !c.isBanned).length;
  const vipCustomers = safeCustomers.filter(
    (c) => c.profile?.loyaltyPoints >= 100
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-100 via-blue-50 to-white shadow-lg border border-indigo-200/50">
        <div className="absolute -top-10 -right-12 w-48 h-48 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title level={2} className="mb-2 text-gray-900">
              Quản lý khách hàng
            </Title>
            <Text className="text-base text-gray-700 font-medium">
              Xem, quản lý và chăm sóc khách thuê tại S+ Studio
            </Text>
          </div>
          <Button type="primary" icon={<UserAddOutlined />} size="large" className="font-semibold shadow-lg">
            Thêm khách hàng
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Tổng khách hàng</Title>
          <div className="text-3xl font-bold">
            {totalCustomers.toLocaleString()}
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Khách hàng hoạt động</Title>
          <div className="flex items-center gap-2 text-green-500 text-xl font-semibold">
            <CheckCircleOutlined />
            <span>
              {totalCustomers > 0
                ? ((activeCustomers / totalCustomers) * 100).toFixed(0)
                : 0}
              %
            </span>
          </div>
        </Card>
        <Card className="shadow-lg border border-gray-100 rounded-2xl">
          <Title level={4}>Khách hàng VIP</Title>
          <div className="text-3xl font-bold">{vipCustomers}</div>
        </Card>
      </div>

      {/* FILTERS – DÙNG Space.Compact */}
      <div className="flex flex-wrap gap-3 items-center">
        <Space.Compact style={{ width: 300 }}>
          <Input
            placeholder="Tìm tên, email, SĐT..."
            allowClear
            onPressEnter={(e) => setSearch(e.target.value)}
            onChange={(e) => !e.target.value && setSearch("")}
          />
          <Button type="primary" icon={<SearchOutlined />} />
        </Space.Compact>

        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 160 }}
          onChange={(value) => setIsActive(value ?? "")}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Bị cấm</Option>
        </Select>
      </div>

      {/* TABLE – SPIN KHÔNG TIP */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <DataTable
          title="Danh sách khách hàng"
          columns={columns}
          data={safeCustomers}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminUserPage;
