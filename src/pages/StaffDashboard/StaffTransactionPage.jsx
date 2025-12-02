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
  Divider,
} from "antd";
import {
  FiEye,
  FiSearch,
  FiMoreHorizontal,
  FiTag,
  FiDollarSign,
  FiFileText,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiUser,
  FiHome,
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

const StaffTransactionPage = () => {
  const dispatch = useDispatch();
  const {
    transactions = [],
    total = 0,
    loading,
  } = useSelector((state) => state.transaction);

  // STATE
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  // Modal chi tiết
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Fetch transactions
  const fetchTransactions = (page = 1) => {
    dispatch(getAllTransactions({ page, limit: 10 }));
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  useEffect(() => {
    if (currentPage !== 1) fetchTransactions(currentPage);
  }, [currentPage]);

  // FILTER + SORT
  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionId?.toLowerCase().includes(lower) ||
          t.paymentCode?.toLowerCase().includes(lower)
      );
    }

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (sortOption) {
      const [field, dir] = sortOption.split("-");
      result.sort((a, b) => {
        const valA =
          field === "amount"
            ? a.amount
            : field === "date"
            ? new Date(a.createdAt)
            : 0;
        const valB =
          field === "amount"
            ? b.amount
            : field === "date"
            ? new Date(b.createdAt)
            : 0;
        return dir === "asc" ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [transactions, search, statusFilter, sortOption]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredAndSorted.slice(start, start + 10);
  }, [filteredAndSorted, currentPage]);

  const clientTotal = filteredAndSorted.length;

  // Toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // STATUS TAG
  const statusTag = (status) => {
    switch (status) {
      case "success":
        return <Tag color="green">Thành công</Tag>;
      case "pending":
        return <Tag color="blue">Đang xử lý</Tag>;
      case "failed":
        return <Tag color="red">Thất bại</Tag>;
      default:
        return <Tag>Khác</Tag>;
    }
  };

  // View transaction detail
  const handleView = async (record) => {
    try {
      const data = await dispatch(getTransactionById(record._id)).unwrap();

      setCurrentTransaction(data);
      setDetailModalVisible(true);
    } catch (error) {
      showToast("error", "Không thể tải chi tiết giao dịch");
    }
  };

  // Mapped data để Table
  const mappedData = useMemo(
    () =>
      paginated.map((t) => ({
        key: t._id,
        ...t,
        transactionNo: t.transactionId || t.paymentCode || t._id,
        studioName: t.bookingId?.scheduleId?.studioId?.name || "Không có",
        userName: t.bookingId?.userId?.fullName || "Không rõ",
      })),
    [paginated]
  );

  // COLUMNS
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionNo",
      key: "transactionNo",
      render: (txt) => <Text strong>{txt}</Text>,
    },
    {
      title: "Studio",
      dataIndex: "studioName",
      key: "studioName",
      render: (txt) => <Text>{txt}</Text>,
    },
    {
      title: "Người dùng",
      dataIndex: "userName",
      key: "userName",
      render: (txt) => <Text>{txt}</Text>,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (price) => (
        <Text strong className="text-blue-600">
          {price.toLocaleString("vi-VN")}₫
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: statusTag,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
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
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              icon={<FiMoreHorizontal />}
              className="hover:bg-gray-100 rounded-full"
            />
          </Dropdown>
        );
      },
    },
  ];

  // Render Policies
  const renderPolicies = (policies) => {
    if (!policies) return null;

    return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Cancellation */}
        {policies.cancellation && (
          <Card className="rounded-2xl border-l-4 border-blue-400 bg-blue-50 shadow-sm">
            <Title level={5} className="mb-2">
              {policies.cancellation.name}
            </Title>
            {policies.cancellation.refundTiers.map((tier) => (
              <div key={tier._id} className="mb-1">
                <Text>
                  {tier.hoursBeforeBooking}h trước: {tier.refundPercentage}% -{" "}
                  {tier.description}
                </Text>
              </div>
            ))}
          </Card>
        )}
        {/* No-Show */}
        {policies.noShow && (
          <Card className="rounded-2xl border-l-4 border-red-400 bg-red-50 shadow-sm">
            <Title level={5} className="mb-2">
              {policies.noShow.name}
            </Title>
            <Text>
              Loại phạt: {policies.noShow.noShowRules.chargeType},{" "}
              {policies.noShow.noShowRules.chargePercentage}%. Grace time:{" "}
              {policies.noShow.noShowRules.graceMinutes} phút, Max forgiveness:{" "}
              {policies.noShow.noShowRules.maxForgivenessCount}.
            </Text>
          </Card>
        )}
      </div>
    );
  };

  // Modal info items
  const infoItems = currentTransaction
    ? [
        {
          label: "Mã giao dịch",
          value: currentTransaction.transactionId || currentTransaction._id,
          icon: <FiTag />,
        },
        {
          label: "Loại thanh toán",
          value:
            currentTransaction.payType === "full"
              ? "Thanh toán đầy đủ"
              : "Thanh toán một phần",
          icon: <FiDollarSign />,
        },
        {
          label: "Người dùng",
          value: (
            <div className="flex flex-col gap-1">
              <Text>
                {currentTransaction.bookingId?.userId?.fullName || "Không rõ"}
              </Text>
              <Text type="secondary">
                {currentTransaction.bookingId?.userId?.username}
              </Text>
              <Text type="secondary">
                {currentTransaction.bookingId?.userId?.email}
              </Text>
              <Text type="secondary">
                {currentTransaction.bookingId?.userId?.phone}
              </Text>
            </div>
          ),
          icon: <FiUser />,
          fullWidth: true,
        },
        {
          label: "Studio",
          value: (
            <div className="flex flex-col gap-1">
              <Text>
                {currentTransaction.bookingId?.scheduleId?.studioId?.name ||
                  "Không có"}
              </Text>
              <Text type="secondary">
                Diện tích:{" "}
                {currentTransaction.bookingId?.scheduleId?.studioId?.area} m²
              </Text>
              <Text type="secondary">
                Giá cơ bản/giờ:{" "}
                {currentTransaction.bookingId?.scheduleId?.studioId?.basePricePerHour.toLocaleString(
                  "vi-VN"
                )}
                ₫
              </Text>
            </div>
          ),
          icon: <FiHome />,
          fullWidth: true,
        },
        {
          label: "Thời gian đặt",
          value: (
            <>
              <Text>
                {new Date(
                  currentTransaction.bookingId?.scheduleId?.startTime
                ).toLocaleString("vi-VN")}{" "}
                →{" "}
                {new Date(
                  currentTransaction.bookingId?.scheduleId?.endTime
                ).toLocaleString("vi-VN")}
              </Text>
            </>
          ),
          icon: <FiCalendar />,
        },
        {
          label: "Số tiền",
          value: (
            <div className="flex flex-col gap-1">
              <Text>
                Trước giảm giá:{" "}
                {currentTransaction.bookingId?.totalBeforeDiscount.toLocaleString(
                  "vi-VN"
                )}
                ₫
              </Text>
              <Text>
                Giảm giá:{" "}
                {currentTransaction.bookingId?.discountAmount.toLocaleString(
                  "vi-VN"
                )}
                ₫
              </Text>
              <Text strong>
                Thanh toán: {currentTransaction.amount.toLocaleString("vi-VN")}₫
              </Text>
            </div>
          ),
          icon: <FiDollarSign />,
          fullWidth: true,
        },
        {
          label: "Trạng thái",
          value: statusTag(currentTransaction.status),
          icon: <FiTag />,
        },
        {
          label: "Ngày tạo",
          value: new Date(currentTransaction.createdAt).toLocaleString("vi-VN"),
          icon: <FiCalendar />,
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

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-100 via-white to-white px-6 py-8 shadow-lg">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-rose-200 blur-3xl" />
        <div className="relative z-10">
          <Title level={2} className="text-gray-900">
            Quản lý giao dịch
          </Title>
          <Text className="text-base text-gray-600">
            Theo dõi thanh toán & trạng thái giao dịch
          </Text>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl bg-white shadow-lg">
          <p className="text-sm text-gray-500">Tổng giao dịch</p>
          <p className="text-4xl font-extrabold text-purple-600">{total}</p>
        </Card>
        <Card className="rounded-2xl bg-white shadow-lg">
          <p className="text-sm text-gray-500">Giao dịch lớn nhất</p>
          <p className="text-3xl font-bold text-gray-900">
            {transactions.length
              ? `${Math.max(
                  ...transactions.map((t) => t.amount)
                ).toLocaleString("vi-VN")}₫`
              : "—"}
          </p>
        </Card>
        <Card className="rounded-2xl bg-white shadow-lg">
          <p className="text-sm text-gray-500">Giao dịch nhỏ nhất</p>
          <p className="text-3xl font-bold text-gray-900">
            {transactions.length
              ? `${Math.min(
                  ...transactions.map((t) => t.amount)
                ).toLocaleString("vi-VN")}₫`
              : "—"}
          </p>
        </Card>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm mã giao dịch..."
          prefix={<FiSearch className="text-gray-400" />}
          className="w-full rounded-2xl border border-gray-200 sm:w-80"
          allowClear
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          className="w-full rounded-2xl sm:w-48"
          value={statusFilter || undefined}
          onChange={(v) => {
            setStatusFilter(v || "");
            setCurrentPage(1);
          }}
        >
          <Option value="success">Thành công</Option>
          <Option value="pending">Đang xử lý</Option>
          <Option value="failed">Thất bại</Option>
        </Select>
        <Select
          placeholder="Sắp xếp"
          allowClear
          className="w-full rounded-2xl sm:w-64"
          value={sortOption || undefined}
          onChange={(v) => {
            setSortOption(v || "");
            setCurrentPage(1);
          }}
        >
          <Option value="amount-asc">
            <FiArrowUp /> Số tiền: Tăng dần
          </Option>
          <Option value="amount-desc">
            <FiArrowDown /> Số tiền: Giảm dần
          </Option>
          <Option value="date-asc">
            <FiArrowUp /> Ngày: Cũ → Mới
          </Option>
          <Option value="date-desc">
            <FiArrowDown /> Ngày: Mới → Cũ
          </Option>
        </Select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="rounded-3xl bg-white shadow-lg">
          <Table
            columns={columns}
            dataSource={mappedData}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: clientTotal,
              showSizeChanger: false,
            }}
            onChange={(p) => setCurrentPage(p.current)}
          />
        </Card>
      )}

      {/* MODAL CHI TIẾT */}
      <Modal
        open={detailModalVisible}
        footer={null}
        onCancel={() => setDetailModalVisible(false)}
        width={700}
        centered
        afterOpenChange={(open) => {
          if (open) {
            gsap.fromTo(
              ".transaction-modal",
              { y: -40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
            );
          }
        }}
      >
        {currentTransaction && (
          <div className="transaction-modal flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
                <FiTag className="text-3xl" />
              </div>
              <Title level={3}>
                {currentTransaction.transactionId || currentTransaction._id}
              </Title>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {infoItems.map((info, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-2xl border p-4 ${
                    info.fullWidth ? "sm:col-span-2" : ""
                  }`}
                >
                  <span className="text-xl text-indigo-500">{info.icon}</span>
                  <div>
                    <Text strong className="block">
                      {info.label}
                    </Text>
                    <div>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Chính sách */}
            {renderPolicies(currentTransaction.bookingId?.policySnapshots)}

            <div className="flex justify-end mt-4">
              <Button size="large" onClick={() => setDetailModalVisible(false)}>
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
