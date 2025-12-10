import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyCustomSetDesign,
  deleteMyCustomSetDesign,
} from "../../features/setdesign/setDesignSlice";
import {
  Card,
  Tag,
  Spin,
  Modal,
  Button,
  message,
  Descriptions,
  Typography,
} from "antd";
import dayjs from "dayjs";
import DataTable from "../../components/dashboard/DataTable";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const { Title, Text } = Typography;

const UserCustomSetDesignPage = () => {
  const dispatch = useDispatch();
  const { myCustomRequests = [], loading } = useSelector((s) => s.setDesign || {});
  const [detail, setDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const formatBudget = (budget) => {
    if (!budget) return "Không rõ";
    if (typeof budget === "string") return budget;
    if (typeof budget === "object" && budget.min !== undefined && budget.max !== undefined) {
      return `${budget.min} - ${budget.max}`;
    }
    return (
      `${budget.min || ""}${budget.max ? ` - ${budget.max}` : ""}`.trim() || "Không rõ"
    );
  };

  const statusConfig = {
    pending: { color: "orange", label: "Chờ xử lý", icon: FiClock },
    processing: { color: "blue", label: "Đang xử lý", icon: FiPackage },
    completed: { color: "green", label: "Hoàn thành", icon: FiCheckCircle },
    rejected: { color: "red", label: "Từ chối", icon: FiXCircle },
  };

  useEffect(() => {
    dispatch(getMyCustomSetDesign({ page: 1, limit: 10 }));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        title: "Mã yêu cầu",
        dataIndex: "_id",
        render: (id) => (
          <span className="font-mono font-semibold text-gray-800">
            #{id?.slice(-6) || "--"}
          </span>
        ),
      },
      {
        title: "Loại set",
        dataIndex: "preferredCategory",
        render: (v) => v || "Không rõ",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        render: (v) => (
          <span className="text-gray-700 text-sm line-clamp-2">
            {v || "Không có mô tả"}
          </span>
        ),
      },
      {
        title: "Ngân sách",
        dataIndex: "budgetRange",
        render: (b) => formatBudget(b),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (v) => {
          const cfg = statusConfig[v] || statusConfig.pending;
          return (
            <Tag color={cfg.color} className="px-3 py-1 rounded-full">
              {cfg.label}
            </Tag>
          );
        },
      },
      {
        title: "Nhân viên",
        dataIndex: "processedBy",
        render: (p) => p?.email || "Chưa có",
      },
      {
        title: "Ảnh tham khảo",
        dataIndex: "referenceImages",
        render: (imgs) => (imgs?.length || 0) + " ảnh",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button size="small" onClick={() => setDetail(record)}>
              Xem
            </Button>
            <Button
              size="small"
              danger
              loading={deletingId === record._id}
              onClick={async () => {
                setDeletingId(record._id);
                try {
                  await dispatch(deleteMyCustomSetDesign(record._id)).unwrap();
                  message.success("Đã xóa yêu cầu");
                } catch (err) {
                  message.error(err?.message || "Xóa thất bại");
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    [deletingId, dispatch]
  );

  const total = myCustomRequests.length;
  const pending = myCustomRequests.filter((r) => r.status === "pending").length;
  const processing = myCustomRequests.filter((r) => r.status === "processing").length;
  const completed = myCustomRequests.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-blue-100 via-indigo-50 to-white shadow-lg border border-blue-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="relative z-10">
          <Title level={2} className="mb-3 text-gray-900">
            Yêu cầu Set Design của bạn
          </Title>
          <Text className="text-base text-gray-700 font-medium">
            Theo dõi các yêu cầu custom set design đã gửi
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng yêu cầu", value: total, color: "blue", icon: FiPackage },
          { label: "Chờ xử lý", value: pending, color: "orange", icon: FiClock },
          { label: "Đang xử lý", value: processing, color: "purple", icon: FiPackage },
          { label: "Hoàn thành", value: completed, color: "green", icon: FiCheckCircle },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <item.icon className={`text-4xl text-${item.color}-500 mb-3 mx-auto`} />
            <div className="text-3xl font-extrabold text-gray-900 mb-1">
              {item.value}
            </div>
            <div className="text-sm font-medium text-gray-600">{item.label}</div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : myCustomRequests.length === 0 ? (
        <p className="text-gray-500">Chưa có yêu cầu nào.</p>
      ) : (
        <DataTable
          title="Danh sách yêu cầu custom"
          columns={columns}
          data={myCustomRequests}
        />
      )}

      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        title="Chi tiết yêu cầu"
      >
        {detail && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Tên">{detail.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{detail.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Phân loại">
              {detail.preferredCategory || "Không rõ"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân sách">
              {formatBudget(detail.budgetRange)}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {detail.description}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[detail.status]?.color || "orange"}>
                {statusConfig[detail.status]?.label || "Chờ xử lý"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tạo lúc">
              {dayjs(detail.createdAt).format("HH:mm, DD/MM/YYYY")}
            </Descriptions.Item>
            {detail.referenceImages?.length > 0 && (
              <Descriptions.Item label="Ảnh tham khảo">
                <div className="grid grid-cols-3 gap-2">
                  {detail.referenceImages.map((img, idx) => {
                    const src = img?.url || img?.secure_url || img;
                    return (
                      <img
                        key={idx}
                        src={src}
                        alt="ref"
                        className="w-full h-20 object-cover rounded"
                      />
                    );
                  })}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserCustomSetDesignPage;
