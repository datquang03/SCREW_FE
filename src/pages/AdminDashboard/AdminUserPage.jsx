// src/pages/Admin/AdminUserPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Tag,
  Modal,
  Avatar,
  Dropdown,
  Button,
} from "antd";
import {
  FiEye,
  FiUnlock,
  FiLock,
  FiMail,
  FiPhone,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiMoreHorizontal,
  FiUsers,
  FiSearch,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomers,
  getCustomerById,
  banCustomer,
  unbanCustomer,
  clearCurrentCustomer,
} from "../../features/admin/admin.customerSlice";
import DataTable from "../../components/dashboard/DataTable";
import ToastNotification from "../../components/ToastNotification";
import { gsap } from "gsap";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUserPage = () => {
  const dispatch = useDispatch();
  const {
    customers,
    pagination,
    loading,
    successMessage,
    error,
    currentCustomer,
  } = useSelector((state) => state.adminCustomer);

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [toast, setToast] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCustomers = (page = 1) => {
    dispatch(
      getAllCustomers({ page, limit: 10, search, isActive, isVerified })
    );
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search, isActive, isVerified]);

  useEffect(() => {
    if (successMessage) setToast({ type: "success", message: successMessage });
  }, [successMessage]);

  useEffect(() => {
    if (error)
      setToast({
        type: "error",
        message: error.message || "Thao tác thất bại",
      });
  }, [error]);

  const handleTableChange = (pagination) => fetchCustomers(pagination.current);

  const handleView = (record) => {
    dispatch(getCustomerById(record._id));
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    dispatch(clearCurrentCustomer());
  };

  const handleToggleActive = (record) => {
    if (record.isActive) {
      dispatch(banCustomer(record._id));
    } else {
      dispatch(unbanCustomer(record._id));
    }
  };

  const vipCount = customers.filter(
    (c) => c.profile?.loyaltyPoints >= 100
  ).length;

  const columns = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <FiEye />,
            onClick: () => handleView(record),
          },
          {
            key: "toggle",
            label: record.isActive ? "Khóa" : "Mở khóa",
            icon: record.isActive ? <FiLock /> : <FiUnlock />,
            onClick: () =>
              Modal.confirm({
                title: "Xác nhận",
                content: `Bạn có chắc chắn muốn ${
                  record.isActive ? "khóa" : "mở khóa"
                } tài khoản ${record.fullName}?`,
                okText: record.isActive ? "Khóa" : "Mở khóa",
                okType: record.isActive ? "danger" : "primary",
                cancelText: "Hủy",
                centered: true,
                onOk: () => handleToggleActive(record),
              }),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button icon={<FiMoreHorizontal />} />
          </Dropdown>
        );
      },
    },
  ];

  const infoItems = currentCustomer
    ? [
        {
          label: "Email",
          value: currentCustomer.email,
          icon: <FiMail />,
        },
        {
          label: "Username",
          value: currentCustomer.username,
          icon: <FiUsers />,
        },
        {
          label: "Phone",
          value: currentCustomer.phone,
          icon: <FiPhone />,
        },
        {
          label: "Role",
          value: currentCustomer.role,
          icon: <FiAward />,
          capitalize: true,
        },
        {
          label: "Trạng thái",
          value: currentCustomer.isActive ? "Hoạt động" : "Bị khóa",
          tag: true,
          color: currentCustomer.isActive ? "green" : "red",
          icon: <FiCheckCircle />,
        },
        {
          label: "Verified",
          value: currentCustomer.isVerified ? "Có" : "Chưa",
          icon: <FiCheckCircle />,
        },
        {
          label: "Loyalty points",
          value: currentCustomer.profile?.loyaltyPoints || 0,
          icon: <FiAward />,
        },
        {
          label: "Ngày tạo",
          value: new Date(currentCustomer.createdAt).toLocaleDateString(
            "vi-VN"
          ),
          icon: <FiClock />,
        },
        {
          label: "Ngày cập nhật",
          value: new Date(currentCustomer.updatedAt).toLocaleDateString(
            "vi-VN"
          ),
          icon: <FiClock />,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-100 via-white to-white px-6 py-8 shadow-lg">
        <div className="absolute -top-10 -right-12 h-48 w-48 rounded-full bg-indigo-200 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={2} className="mb-1 text-gray-900">
              Quản lý khách hàng
            </Title>
            <Text className="text-base text-gray-600">
              Xem, quản lý và chăm sóc khách thuê tại S+ Studio
            </Text>
          </div>
          <Button
            type="primary"
            icon={<FiUsers />}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg"
          >
            Thêm khách hàng
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Tổng khách hàng
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {pagination.total?.toLocaleString() || 0}
          </p>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Khách hàng hoạt động
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {pagination.total
              ? (
                  (customers.filter((c) => c.isActive).length /
                    pagination.total) *
                  100
                ).toFixed(0)
              : 0}
            %
          </p>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Khách hàng VIP
          </p>
          <p className="text-3xl font-bold text-purple-600">{vipCount || 0}</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm tên, email, SĐT..."
          allowClear
          prefix={<FiSearch className="text-gray-400" />}
          className="w-full rounded-2xl border border-gray-200 bg-white/70 shadow-inner sm:w-96"
          onPressEnter={(e) => setSearch(e.target.value)}
          onChange={(e) => !e.target.value && setSearch("")}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          className="w-full rounded-2xl sm:w-60"
          onChange={(value) => setIsActive(value ?? "")}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Bị khóa</Option>
        </Select>
        <Select
          placeholder="Verified"
          allowClear
          className="w-full rounded-2xl sm:w-60"
          onChange={(value) => setIsVerified(value ?? "")}
        >
          <Option value="true">Đã xác thực</Option>
          <Option value="false">Chưa xác thực</Option>
        </Select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="rounded-3xl border border-white/60 bg-white shadow-lg">
          <DataTable
            title="Danh sách khách hàng"
            columns={columns}
            data={Array.isArray(customers) ? customers : []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: false,
            }}
            onChange={handleTableChange}
            loading={loading}
          />
        </Card>
      )}

      {/* MODAL CUSTOMER DETAIL */}
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        centered
        maskClosable
        className="customer-detail-modal"
        afterOpenChange={(open) => {
          if (open && currentCustomer) {
            gsap.fromTo(
              ".customer-modal-content",
              { y: -40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
            );
          }
        }}
      >
        {currentCustomer ? (
          <div className="customer-modal-content flex flex-col gap-6">
            <div className="text-center">
              <Avatar
                size={120}
                src={currentCustomer.avatar}
                alt={currentCustomer.fullName}
                className="mx-auto cursor-pointer shadow-lg"
                onClick={() => {
                  Modal.info({
                    title: currentCustomer.fullName,
                    icon: null,
                    content: (
                      <img
                        src={currentCustomer.avatar}
                        className="w-full rounded-xl object-cover"
                      />
                    ),
                    okText: "Đóng",
                  });
                }}
              />
              <Title level={4} className="mt-3 font-bold">
                {currentCustomer.fullName}
              </Title>
              <Text className="text-sm text-gray-500">
                {currentCustomer.username}
              </Text>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {infoItems.map((info, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white"
                >
                  <span className="text-xl text-indigo-500">{info.icon}</span>
                  <div>
                    <Text strong className="text-gray-700">
                      {info.label}
                    </Text>
                    <div className="mt-1">
                      {info.tag ? (
                        <Tag color={info.color}>{info.value}</Tag>
                      ) : (
                        <Text
                          className={`font-medium text-gray-900 ${
                            info.capitalize ? "capitalize" : ""
                          }`}
                        >
                          {info.value}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleCloseModal}>
                Hủy
              </Button>

              {currentCustomer.isActive ? (
                <Button
                  danger
                  className="flex-1"
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận",
                      content: `Bạn có chắc chắn muốn khóa tài khoản ${currentCustomer.fullName}?`,
                      okText: "Khóa",
                      okType: "danger",
                      cancelText: "Hủy",
                      centered: true,
                      onOk: () => handleToggleActive(currentCustomer),
                    })
                  }
                >
                  Khóa tài khoản
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="flex-1"
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận",
                      content: `Bạn có chắc chắn muốn mở khóa tài khoản ${currentCustomer.fullName}?`,
                      okText: "Mở khóa",
                      okType: "primary",
                      cancelText: "Hủy",
                      centered: true,
                      onOk: () => handleToggleActive(currentCustomer),
                    })
                  }
                >
                  Mở khóa tài khoản
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <Spin />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUserPage;
