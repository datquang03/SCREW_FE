// src/pages/Admin/AdminUserPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Avatar,
  Row,
  Col,
  Dropdown,
  Button,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  UnlockOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
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
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
          {
            key: "toggle",
            label: record.isActive ? "Khóa" : "Mở khóa",
            icon: record.isActive ? <LockOutlined /> : <UnlockOutlined />,
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
            <Button icon={<MoreOutlined />} />
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
          icon: <MailOutlined />,
        },
        {
          label: "Username",
          value: currentCustomer.username,
          icon: <UserOutlined />,
        },
        {
          label: "Phone",
          value: currentCustomer.phone,
          icon: <PhoneOutlined />,
        },
        {
          label: "Role",
          value: currentCustomer.role,
          icon: <CrownOutlined />,
          capitalize: true,
        },
        {
          label: "Trạng thái",
          value: currentCustomer.isActive ? "Hoạt động" : "Bị khóa",
          tag: true,
          color: currentCustomer.isActive ? "green" : "red",
          icon: <CheckCircleOutlined />,
        },
        {
          label: "Verified",
          value: currentCustomer.isVerified ? "Có" : "Chưa",
          icon: <CheckCircleOutlined />,
        },
        {
          label: "Loyalty points",
          value: currentCustomer.profile?.loyaltyPoints || 0,
          icon: <CrownOutlined />,
        },
        {
          label: "Ngày tạo",
          value: new Date(currentCustomer.createdAt).toLocaleDateString(
            "vi-VN"
          ),
          icon: <ClockCircleOutlined />,
        },
        {
          label: "Ngày cập nhật",
          value: new Date(currentCustomer.updatedAt).toLocaleDateString(
            "vi-VN"
          ),
          icon: <ClockCircleOutlined />,
        },
      ]
    : [];

  return (
    <div
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 24 }}
    >
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Quản lý khách hàng
          </Title>
          <Text style={{ color: "#666" }}>
            Xem, quản lý và chăm sóc khách thuê tại S+ Studio
          </Text>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 200 }}>
          <Title level={4}>Tổng khách hàng</Title>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {pagination.total?.toLocaleString() || 0}
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: 200 }}>
          <Title level={4}>Khách hàng hoạt động</Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#52c41a",
            }}
          >
            {pagination.total
              ? (
                  (customers.filter((c) => c.isActive).length /
                    pagination.total) *
                  100
                ).toFixed(0)
              : 0}
            %
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: 200 }}>
          <Title level={4}>Khách hàng VIP</Title>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {vipCount || "Chưa có khách VIP"}
          </div>
        </Card>
      </div>

      {/* FILTER */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Space.Compact style={{ width: 300 }}>
          <Input
            placeholder="Tìm tên, email, SĐT..."
            allowClear
            onPressEnter={(e) => setSearch(e.target.value)}
            onChange={(e) => !e.target.value && setSearch("")}
          />
        </Space.Compact>
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 160 }}
          onChange={(value) => setIsActive(value ?? "")}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Bị khóa</Option>
        </Select>
        <Select
          placeholder="Lọc verified"
          allowClear
          style={{ width: 160 }}
          onChange={(value) => setIsVerified(value ?? "")}
        >
          <Option value="true">Đã xác thực</Option>
          <Option value="false">Chưa xác thực</Option>
        </Select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
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
      )}

      {/* MODAL CUSTOMER DETAIL */}
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        style={{ padding: 24 }}
        centered
        maskClosable={true}
        afterOpenChange={(open) => {
          if (open && currentCustomer) {
            gsap.fromTo(
              ".customer-modal-content",
              { y: -50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
          }
        }}
        getContainer={false} // tránh portal → GSAP mượt
      >
        {currentCustomer ? (
          <div
            className="customer-modal-content"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {/* Avatar & Name */}
            <div style={{ textAlign: "center", position: "relative" }}>
              <Avatar
                size={120}
                src={currentCustomer.avatar}
                alt={currentCustomer.fullName}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onClick={() => {
                  Modal.info({
                    title: currentCustomer.fullName,
                    icon: null,
                    content: (
                      <img
                        src={currentCustomer.avatar}
                        style={{ width: "100%", borderRadius: 10 }}
                      />
                    ),
                    okText: "Đóng",
                  });
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.12)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
              />
              <Title level={4} style={{ marginTop: 12 }}>
                <span style={{ fontWeight: 700 }}>
                  {currentCustomer.fullName}
                </span>
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {currentCustomer.username}
              </Text>
            </div>

            {/* Info Grid */}
            <Row gutter={[16, 16]}>
              {infoItems.map((info, idx) => (
                <Col span={12} key={idx}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 14,
                      borderRadius: 12,
                      background: "#f9fafc",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.12)";
                      e.currentTarget.style.background = "#f0f5ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "#f9fafc";
                    }}
                  >
                    <span style={{ fontSize: 20, color: "#1890ff" }}>
                      {info.icon}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Text strong style={{ marginBottom: 2 }}>
                        {info.label}
                      </Text>
                      {info.tag ? (
                        <Tag color={info.color} style={{ fontWeight: 500 }}>
                          {info.value}
                        </Tag>
                      ) : (
                        <Text
                          style={{
                            textTransform: info.capitalize
                              ? "capitalize"
                              : "none",
                          }}
                        >
                          {info.value}
                        </Text>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Footer Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 24,
                gap: 12,
              }}
            >
              <Button
                onClick={handleCloseModal}
                style={{
                  flex: 1,
                  background: "#f0f0f0",
                  color: "#000",
                  fontWeight: 500,
                }}
              >
                Hủy
              </Button>

              {currentCustomer.isActive ? (
                <Button
                  danger
                  style={{ flex: 1, fontWeight: 500 }}
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
                  style={{ flex: 1, fontWeight: 500 }}
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
          <Spin style={{ display: "flex", justifyContent: "center" }} />
        )}
      </Modal>
    </div>
  );
};

export default AdminUserPage;
