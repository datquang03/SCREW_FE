// src/pages/Staff/StaffTransactionPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Modal,
  Dropdown,
  Button,
  Table,
  Tag,
  Tabs,
} from "antd";
import {
  FiEye,
  FiSearch,
  FiMoreHorizontal,
  FiTag,
  FiDollarSign,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiUser,
  FiHome,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";

import ToastNotification from "../../components/ToastNotification";
import {
  getAllTransactions,
  getTransactionById,
} from "../../features/transaction/transactionSlice";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const StaffTransactionPage = () => {
  const dispatch = useDispatch();
  const {
    transactions = [],
    loading,
    pagination = {},
    summary = {},
  } = useSelector((state) => state.transaction);

  const totalTransactions =
    summary?.totalTransactions || pagination?.total || 0;

  // STATE
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Fetch
  const fetchTransactions = (page = 1) => {
    dispatch(getAllTransactions({ page, limit: 10 }));
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  useEffect(() => {
    if (currentPage !== 1) fetchTransactions(currentPage);
  }, [currentPage]);

  // Xác định trạng thái thực tế
  const getEffectiveStatus = (t) => {
    if (t.status === "paid") return "paid";
    if (t.status !== "pending") return t.status;
    if (t.expiresAt && new Date(t.expiresAt) < new Date()) return "expired";
    return "pending";
  };

  // Lọc giao dịch hết hạn
  const expiredTransactions = useMemo(() => {
    return transactions.filter((t) => getEffectiveStatus(t) === "expired");
  }, [transactions]);

  // Tính doanh thu từ các giao dịch đã thanh toán
  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.status === "paid")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // STATUS TAG
  const statusTag = (status) => {
    switch (status) {
      case "paid":
        return (
          <Tag color="green" className="font-medium">
            Đã thanh toán
          </Tag>
        );
      case "pending":
        return (
          <Tag color="orange" className="font-medium">
            Chờ thanh toán
          </Tag>
        );
      case "expired":
        return (
          <Tag color="red" className="font-medium">
            Hết hạn
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // FILTER + SORT
  const processedTransactions = useMemo(() => {
    let list =
      activeTab === "expired" ? expiredTransactions : [...transactions];

    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.transactionId?.toLowerCase().includes(lower) ||
          t.paymentCode?.toLowerCase().includes(lower) ||
          t._id.toLowerCase().includes(lower)
      );
    }

    if (statusFilter && activeTab !== "expired") {
      list = list.filter((t) => getEffectiveStatus(t) === statusFilter);
    }

    if (sortOption) {
      const [field, dir] = sortOption.split("-");
      list.sort((a, b) => {
        let valA, valB;
        if (field === "amount") {
          valA = a.amount;
          valB = b.amount;
        } else if (field === "date") {
          valA = new Date(a.createdAt);
          valB = new Date(b.createdAt);
        } else if (field === "expires") {
          valA = a.expiresAt ? new Date(a.expiresAt) : Infinity;
          valB = b.expiresAt ? new Date(b.expiresAt) : Infinity;
        }
        return dir === "asc" ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [
    transactions,
    expiredTransactions,
    search,
    statusFilter,
    sortOption,
    activeTab,
  ]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return processedTransactions.slice(start, start + 10);
  }, [processedTransactions, currentPage]);

  const clientTotal = processedTransactions.length;

  // Mapped data
  const mappedData = useMemo(
    () =>
      paginated.map((t) => ({
        key: t._id,
        ...t,
        transactionNo: t.transactionId || t.paymentCode || t._id,
        studioName: t.bookingId?.scheduleId?.studioId?.name || "Không có",
        userName: t.bookingId?.userId?.fullName || "Không rõ",
        effectiveStatus: getEffectiveStatus(t),
      })),
    [paginated]
  );

  // COLUMNS
  const columns = [
    {
      title: "Mã GD",
      dataIndex: "transactionNo",
      key: "transactionNo",
      render: (txt) => <Text strong>{txt}</Text>,
    },
    { title: "Studio", dataIndex: "studioName", key: "studioName" },
    { title: "Khách hàng", dataIndex: "userName", key: "userName" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (p) => (
        <Text strong className="text-blue-600">
          {p.toLocaleString("vi-VN")}₫
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "effectiveStatus",
      key: "status",
      render: (_, r) => statusTag(r.effectiveStatus),
    },
    {
      title: "Hết hạn lúc",
      key: "expiresAt",
      render: (_, r) => {
        if (!r.expiresAt || r.status === "paid") return "—";
        const isExpired = new Date(r.expiresAt) < new Date();
        return (
          <div className="flex items-center gap-1">
            <FiClock className={isExpired ? "text-red-500" : "text-gray-500"} />
            <Text type={isExpired ? "danger" : "secondary"}>
              {new Date(r.expiresAt).toLocaleString("vi-VN")}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <FiEye />,
                onClick: () => handleView(r),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            icon={<FiMoreHorizontal />}
            className="hover:bg-gray-100 rounded-full"
          />
        </Dropdown>
      ),
    },
  ];

  const rowClassName = (r) => {
    if (r.effectiveStatus === "expired")
      return "bg-red-50 hover:bg-red-100 border-l-4 border-red-500";
    if (r.effectiveStatus === "pending")
      return "bg-orange-50 hover:bg-orange-100";
    return "";
  };

  const handleView = async (record) => {
    try {
      const data = await dispatch(getTransactionById(record._id)).unwrap();
      setCurrentTransaction(data);
      setDetailModalVisible(true);
    } catch {
      setToast({ type: "error", message: "Không tải được chi tiết" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
    setSearch("");
    setStatusFilter("");
    setSortOption("");
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-100 via-white to-white px-6 py-8 shadow-lg">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-rose-200 blur-3xl" />
        <div className="relative z-10">
          <Title level={2}>Quản lý giao dịch</Title>
          <Text className="text-base text-gray-600">
            Theo dõi thanh toán và xử lý giao dịch hết hạn
          </Text>
        </div>
      </div>

      {/* SUMMARY - ĐÃ CÓ DOANH THU */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl bg-white shadow-lg">
          <p className="text-sm text-gray-500">Tổng giao dịch</p>
          <p className="text-4xl font-extrabold text-purple-600">
            {totalTransactions}
          </p>
        </Card>
        <Card className="rounded-2xl bg-white shadow-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Đã thanh toán</p>
          <p className="text-3xl font-bold text-green-600">
            {transactions.filter((t) => t.status === "paid").length}
          </p>
        </Card>
        <Card className="rounded-2xl bg-white shadow-lg border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Chờ thanh toán</p>
          <p className="text-3xl font-bold text-orange-600">
            {
              transactions.filter((t) => getEffectiveStatus(t) === "pending")
                .length
            }
          </p>
        </Card>
        <Card className="rounded-2xl bg-white shadow-lg border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Hết hạn cần xử lý</p>
          <p className="text-3xl font-bold text-red-600 flex items-center gap-2">
            <FiAlertTriangle />
            {expiredTransactions.length}
          </p>
        </Card>
      </div>

      {/* DOANH THU RIÊNG - ĐẸP & RÕ RÀNG */}
      <Card className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng doanh thu thực tế</p>
            <p className="text-4xl font-extrabold">
              {totalRevenue.toLocaleString("vi-VN")}₫
            </p>
          </div>
          <FiDollarSign className="text-6xl opacity-30" color="green" />
        </div>
      </Card>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm mã giao dịch..."
          prefix={<FiSearch />}
          className="w-full sm:w-80 rounded-2xl"
          allowClear
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        {activeTab !== "expired" && (
          <Select
            placeholder="Trạng thái"
            allowClear
            className="w-48 rounded-2xl"
            value={statusFilter || undefined}
            onChange={(v) => {
              setStatusFilter(v || "");
              setCurrentPage(1);
            }}
          >
            <Option value="paid">Đã thanh toán</Option>
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="expired">Hết hạn</Option>
          </Select>
        )}
        <Select
          placeholder="Sắp xếp"
          allowClear
          className="w-64 rounded-2xl"
          value={sortOption || undefined}
          onChange={(v) => {
            setSortOption(v || "");
            setCurrentPage(1);
          }}
        >
          <Option value="amount-desc">Số tiền: Cao → Thấp</Option>
          <Option value="amount-asc">Số tiền: Thấp → Cao</Option>
          <Option value="date-desc">Mới nhất</Option>
          <Option value="expires-asc">Hết hạn sớm nhất</Option>
        </Select>
      </div>

      {/* TABS + TABLES */}
      <Card className="rounded-3xl bg-white shadow-lg overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={[
            {
              key: "all",
              label: `Tất cả (${totalTransactions})`,
              children: loading ? (
                <div className="py-16 text-center">
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={mappedData}
                  rowClassName={rowClassName}
                  pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: clientTotal,
                    showSizeChanger: false,
                  }}
                  onChange={(p) => setCurrentPage(p.current)}
                />
              ),
            },
            {
              key: "expired",
              label: (
                <span className="flex items-center gap-2">
                  <FiAlertTriangle className="text-red-500" />
                  Hết hạn cần xử lý ({expiredTransactions.length})
                </span>
              ),
              children:
                expiredTransactions.length === 0 ? (
                  <div className="py-20 text-center text-gray-500">
                    <FiAlertTriangle className="mx-auto text-6xl text-green-500 mb-4" />
                    <Text strong className="text-xl">
                      Chúc mừng! Hiện không có giao dịch nào hết hạn.
                    </Text>
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={mappedData}
                    rowClassName="bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                    pagination={{
                      current: currentPage,
                      pageSize: 10,
                      total: clientTotal,
                    }}
                    onChange={(p) => setCurrentPage(p.current)}
                  />
                ),
            },
          ]}
        />
      </Card>

      {/* MODAL CHI TIẾT */}
      <Modal
        open={detailModalVisible}
        footer={null}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        centered
      >
        {currentTransaction && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
                <FiTag className="text-3xl" />
              </div>
              <Title level={3}>
                {currentTransaction.transactionId || currentTransaction._id}
              </Title>
              <Text type="secondary">
                Mã thanh toán: {currentTransaction.paymentCode}
              </Text>
            </div>
            <div className="flex justify-end">
              <Button
                type="primary"
                size="large"
                onClick={() => setDetailModalVisible(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffTransactionPage;
