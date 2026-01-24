import React, { useEffect, useState, useRef } from "react";
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
  Form,
} from "antd";
import {
  FiUser,
  FiEye,
  FiUnlock,
  FiLock,
  FiMail,
  FiPhone,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
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
            icon: <FiEye />,
            onClick: () => handleView(record),
          },
          {
            key: "toggle",
            label: record?.isActive ? "Khóa" : "Mở khóa",
            icon: record?.isActive ? <FiLock /> : <FiUnlock />,
            onClick: () => handleToggleActive(record),
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

  return (
    <div ref={containerRef} className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · ADMIN</div>
        <h1 className="text-3xl font-bold mb-2">Quản lý nhân viên</h1>
        <p className="opacity-90">
          Theo dõi nhân sự, phân ca và trạng thái hoạt động
        </p>
        
        <div className="absolute top-8 right-8">
          <button
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 backdrop-blur transition"
            onClick={() => setAddModalVisible(true)}
          >
            <FiPlus /> Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Tổng nhân viên
          </p>
          <p className="text-4xl font-extrabold text-gray-900">
            {total?.toLocaleString() || safeStaffs.length}
          </p>
          <Text className="text-xs text-gray-500">Tổng bản ghi hiện có</Text>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Đang hoạt động
          </p>
          <p className="text-4xl font-extrabold text-emerald-600">
            {safeStaffs.filter((s) => s.isActive).length}
          </p>
          <Text className="text-xs text-gray-500">
            Tương đương{" "}
            {total
              ? `${Math.round(
                  (safeStaffs.filter((s) => s.isActive).length / total) * 100
                )}%`
              : "—"}
          </Text>
        </Card>
        <Card className="rounded-2xl border border-white/50 bg-white shadow-lg">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Tài khoản bị khóa
          </p>
          <p className="text-4xl font-extrabold text-rose-500">
            {safeStaffs.filter((s) => !s.isActive).length}
          </p>
          <Text className="text-xs text-gray-500">
            Cần xem xét kích hoạt lại
          </Text>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm tên, email, SĐT..."
          allowClear
          prefix={<FiSearch className="text-gray-400" />}
          className="w-full rounded-2xl border border-gray-200 bg-white/70 shadow-inner sm:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Vị trí"
          allowClear
          className="w-full rounded-2xl sm:w-56"
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
          className="w-full rounded-2xl sm:w-56"
          value={isActive || undefined}
          onChange={(v) => setIsActive(v ?? "")}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Bị khóa</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="rounded-3xl border border-white/60 bg-white shadow-lg">
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
        </Card>
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
        <div ref={detailRef} className="flex flex-col gap-5">
          {currentStaff ? (
            <>
              {/* header: avatar, name */}
              <div className="text-center">
                <Avatar
                  size={110}
                  src={currentStaff.avatar || undefined}
                  className="mx-auto cursor-pointer shadow-lg"
                  onClick={() => setPreviewImageOpen(true)}
                >
                  {!currentStaff.avatar && <FiUser />}
                </Avatar>

                <Title level={4} className="mt-3 font-bold">
                  {currentStaff.fullName ?? "—"}
                </Title>
                <Text className="text-sm text-gray-500">
                  {currentStaff.username ?? "—"}
                </Text>
              </div>

              {/* info grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Email",
                    value: currentStaff.email ?? "—",
                    icon: <FiMail />,
                  },
                  {
                    label: "Số điện thoại",
                    value: currentStaff.phone ?? "—",
                    icon: <FiPhone />,
                  },
                  {
                    label: "Vị trí",
                    value:
                      currentStaff.profile?.position ||
                      currentStaff.position ||
                      "—",
                    icon: <FiAward />,
                  },
                  {
                    label: "Trạng thái",
                    value: currentStaff.isActive ? "Hoạt động" : "Bị khóa",
                    icon: <FiCheckCircle />,
                    tag: currentStaff.isActive ? "green" : "red",
                  },
                  {
                    label: "Ngày tạo",
                    value: currentStaff.createdAt
                      ? new Date(currentStaff.createdAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "—",
                    icon: <FiClock />,
                  },
                  {
                    label: "Ngày cập nhật",
                    value: currentStaff.updatedAt
                      ? new Date(currentStaff.updatedAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "—",
                    icon: <FiClock />,
                  },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                  >
                    <span className="text-lg text-indigo-500">{info.icon}</span>
                    <div>
                      <Text strong className="text-gray-700">
                        {info.label}
                      </Text>
                      <div className="mt-1">
                        {info.tag ? (
                          <Tag color={info.tag}>{info.value}</Tag>
                        ) : (
                          <Text className="font-medium text-gray-900">
                            {info.value}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* actions */}
              <div className="mt-2 flex gap-3">
                <Button className="flex-1" onClick={handleCloseDetail}>
                  Đóng
                </Button>

                {currentStaff.isActive ? (
                  <Button
                    danger
                    className="flex-1"
                    onClick={() => handleToggleActive(currentStaff)}
                  >
                    Khóa tài khoản
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="flex-1"
                    onClick={() => handleToggleActive(currentStaff)}
                  >
                    Mở khóa tài khoản
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-10">
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
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <div className="py-10 text-center">
            <Text>Không có hình ảnh</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminStaffPage;
