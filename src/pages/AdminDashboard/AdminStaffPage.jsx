import React, { useEffect, useState, useRef } from "react";
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
  Form,
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
  getAllStaffs,
  getStaffById,
  deactivateStaff,
  activateStaff,
  clearCurrentStaff,
} from "../../features/admin/admin.staffSlice";
import { registerStaff } from "../../features/auth/authSlice";
import DataTable from "../../components/dashboard/DataTable";
import ToastNotification from "../../components/ToastNotification";
import { gsap } from "gsap";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminStaffPage = () => {
  const dispatch = useDispatch();
  const {
    staffs,
    page = 1,
    limit = 10,
    total = 0,
    loading,
    successMessage,
    error,
    currentStaff, // populated by getStaffById
  } = useSelector((state) => state.adminStaff);

  const authLoading = useSelector((state) => state.auth.loading);

  // UI state
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [position, setPosition] = useState(""); // keep for future
  const [toast, setToast] = useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);

  const [form] = Form.useForm();
  const containerRef = useRef(null);
  const detailRef = useRef(null);

  // initial animate
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, []);

  // watchers
  useEffect(() => {
    fetchStaffs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isActive, position]);

  useEffect(() => {
    if (successMessage) {
      setToast({ type: "success", message: successMessage });
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setToast({
        type: "error",
        message: error.message || "Thao tác thất bại",
      });
    }
  }, [error]);

  // fetch
  const fetchStaffs = (p = 1) => {
    // ensure we never pass undefined for position or isActive
    dispatch(
      getAllStaffs({
        page: p,
        limit,
        search: search || "",
        position: position || "",
        isActive: isActive || "",
      })
    );
  };

  // table change
  const handleTableChange = (pagination) => fetchStaffs(pagination.current);

  // view staff (detail modal)
  const handleView = (record) => {
    if (!record?._id) return;
    dispatch(getStaffById(record._id));
    setDetailModalVisible(true);
  };

  // animate modal content when opened
  useEffect(() => {
    if (detailModalVisible && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    }
  }, [detailModalVisible, currentStaff]);

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    dispatch(clearCurrentStaff());
    setPreviewImageOpen(false);
  };

  // toggle active
  const handleToggleActive = (record) => {
    if (!record?._id) return;
    Modal.confirm({
      title: record.isActive ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt",
      content: `Bạn có chắc chắn muốn ${
        record.isActive ? "vô hiệu hóa" : "kích hoạt"
      } tài khoản ${record.fullName}?`,
      okText: record.isActive ? "Vô hiệu hóa" : "Kích hoạt",
      okType: record.isActive ? "danger" : "primary",
      cancelText: "Hủy",
      centered: true,
      onOk: () => {
        if (record.isActive) dispatch(deactivateStaff(record._id));
        else dispatch(activateStaff(record._id));
      },
    });
  };

  // add staff
  const handleAddStaff = () => {
    form.validateFields().then((values) => {
      dispatch(registerStaff(values)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setToast({ type: "success", message: "Thêm nhân viên thành công" });
          fetchStaffs(1);
          setAddModalVisible(false);
          form.resetFields();
        } else {
          setToast({
            type: "error",
            message: res.payload?.message || "Thêm nhân viên thất bại",
          });
        }
      });
    });
  };

  // defensive: ensure staffs is array
  const safeStaffs = Array.isArray(staffs) ? staffs : [];

  // columns (defensive rendering)
  const columns = [
    {
      title: "Nhân viên",
      key: "staff",
      render: (_, record) => {
        const avatar = record?.avatar || "";
        const name = record?.fullName || record?.username || "—";
        const pos =
          record?.profile?.position || record?.position || "nhân viên";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar src={avatar} size={40} />
            <div>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {pos}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      render: (p) => p || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (e) => e || "—",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Tag color={record?.isActive ? "green" : "orange"}>
          {record?.isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—"),
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
            label: record?.isActive ? "Khóa" : "Mở khóa",
            icon: record?.isActive ? <LockOutlined /> : <UnlockOutlined />,
            onClick: () => handleToggleActive(record),
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

  return (
    <div
      ref={containerRef}
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Toast */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 6 }}>
            Quản lý nhân viên
          </Title>
          <Text type="secondary">Xem và quản lý thông tin nhân viên</Text>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => setAddModalVisible(true)}>
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* Stats (small cards) */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 180 }}>
          <Title level={5}>Tổng nhân viên</Title>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {total?.toLocaleString() || safeStaffs.length}
          </div>
          <Text type="secondary">Tổng bản ghi</Text>
        </Card>

        <Card style={{ flex: 1, minWidth: 180 }}>
          <Title level={5}>Nhân viên đang hoạt động</Title>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#52c41a" }}>
            {total
              ? Math.round(
                  (safeStaffs.filter((s) => s.isActive).length / total) * 100
                ) + "%"
              : (safeStaffs.filter((s) => s.isActive).length || 0) + " người"}
          </div>
          <Text type="secondary">Tỷ lệ hoạt động</Text>
        </Card>
      </div>

      {/* Filters */}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Space.Compact>

        <Select
          placeholder="Vị trí"
          allowClear
          style={{ width: 160 }}
          value={position || undefined}
          onChange={(v) => setPosition(v || "")}
        >
          <Option value="">Tất cả</Option>
          <Option value="staff">Staff</Option>
          <Option value="admin">Admin</Option>
        </Select>

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 160 }}
          value={isActive || undefined}
          onChange={(v) => setIsActive(v ?? "")}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Bị khóa</Option>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <DataTable
          title="Danh sách nhân viên"
          columns={columns}
          data={safeStaffs}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      )}

      {/* ADD STAFF MODAL */}
      <Modal
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        title="Thêm nhân viên"
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={authLoading}
        onOk={handleAddStaff}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Nhập username" }]}
          >
            <Input placeholder="staff01" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="staff01@example.com" />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Nhập họ và tên" }]}
          >
            <Input placeholder="Trần Thị Staff" />
          </Form.Item>

          <Form.Item
            label="Vị trí"
            name="position"
            rules={[{ required: true, message: "Chọn vị trí" }]}
          >
            <Select>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input placeholder="0907654321" />
          </Form.Item>
        </Form>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        open={detailModalVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={640}
        centered
        maskClosable
      >
        {/* detailRef used for GSAP animation */}
        <div
          ref={detailRef}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {currentStaff ? (
            <>
              {/* header: avatar, name */}
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={110}
                  src={currentStaff.avatar || undefined}
                  style={{
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  }}
                  onClick={() => setPreviewImageOpen(true)}
                >
                  {!currentStaff.avatar && <UserOutlined />}
                </Avatar>

                <Title level={4} style={{ marginTop: 12 }}>
                  <span style={{ fontWeight: 800 }}>
                    {currentStaff.fullName ?? "—"}
                  </span>
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {currentStaff.username ?? "—"}
                </Text>
              </div>

              {/* info grid */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Email</Text>
                    <div>{currentStaff.email ?? "—"}</div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Số điện thoại</Text>
                    <div>{currentStaff.phone ?? "—"}</div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Vị trí</Text>
                    <div style={{ textTransform: "capitalize" }}>
                      {currentStaff.profile?.position ??
                        currentStaff.position ??
                        "—"}
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Trạng thái</Text>
                    <div style={{ marginTop: 6 }}>
                      <Tag color={currentStaff.isActive ? "green" : "red"}>
                        {currentStaff.isActive ? "Hoạt động" : "Bị khóa"}
                      </Tag>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Ngày tạo</Text>
                    <div>
                      {currentStaff.createdAt
                        ? new Date(currentStaff.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "—"}
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "#fafafa",
                    }}
                  >
                    <Text strong>Ngày cập nhật</Text>
                    <div>
                      {currentStaff.updatedAt
                        ? new Date(currentStaff.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "—"}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* actions */}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Button style={{ flex: 1 }} onClick={handleCloseDetail}>
                  Đóng
                </Button>

                {currentStaff.isActive ? (
                  <Button
                    danger
                    style={{ flex: 1 }}
                    onClick={() => handleToggleActive(currentStaff)}
                  >
                    Khóa tài khoản
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    style={{ flex: 1 }}
                    onClick={() => handleToggleActive(currentStaff)}
                  >
                    Mở khóa tài khoản
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 40 }}
            >
              <Spin />
            </div>
          )}
        </div>
      </Modal>

      {/* preview image modal */}
      <Modal
        open={previewImageOpen}
        onCancel={() => setPreviewImageOpen(false)}
        footer={null}
        centered
        width={720}
      >
        {currentStaff?.avatar ? (
          <img
            src={currentStaff.avatar}
            alt={currentStaff?.fullName || "avatar"}
            style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
          />
        ) : (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Text>Không có hình ảnh</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminStaffPage;
