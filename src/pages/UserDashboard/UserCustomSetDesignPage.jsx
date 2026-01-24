import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyCustomSetDesign,
  deleteMyCustomSetDesign,
} from "../../features/setDesign/setDesignSlice";
import { Card, Tag, Spin, Modal, Button, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import DataTable from "../../components/dashboard/DataTable";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiImage,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import useToast from "../../hooks/useToast";
import ToastNotification from "../../components/ToastNotification";

const { Title, Text } = Typography;

const UserCustomSetDesignPage = () => {
  const dispatch = useDispatch();
  const { myCustomRequests = [], loading } = useSelector(
    (s) => s.setDesign || {}
  );
  const [detail, setDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { toast, success, error, closeToast } = useToast();

  const formatBudget = (budget) => {
    if (!budget) return "Không rõ";
    if (typeof budget === "string") return budget;
    if (
      typeof budget === "object" &&
      budget.min !== undefined &&
      budget.max !== undefined
    ) {
      return `${budget.min} - ${budget.max}`;
    }
    return (
      `${budget.min || ""}${budget.max ? ` - ${budget.max}` : ""}`.trim() ||
      "Không rõ"
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
        className: "hidden 2xl:table-cell",
        render: (id) => (
          <span className="font-mono font-semibold text-gray-800">
            #{id?.slice(-6) || "--"}
          </span>
        ),
      },
      {
        title: "Loại set",
        dataIndex: "preferredCategory",
        className: "whitespace-nowrap",
        render: (v) => <span className="font-medium">{v || "Không rõ"}</span>,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        className: "hidden xl:table-cell min-w-[200px]",
        width: 250,
        render: (v) => (
          <div className="text-gray-700 text-sm line-clamp-2 max-w-[250px] whitespace-normal">
            {v || "Không có mô tả"}
          </div>
        ),
      },
      {
        title: "Ngân sách",
        dataIndex: "budget",
        className: "whitespace-nowrap",
        render: (b) => (b ? `${b.toLocaleString("vi-VN")}₫` : "Không rõ"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        className: "whitespace-nowrap",
        render: (v) => {
          const cfg = statusConfig[v] || statusConfig.pending;
          return (
            <Tag color={cfg.color} className="px-3 py-1 rounded-full border-0">
              {cfg.label}
            </Tag>
          );
        },
      },
      {
        title: "Nhân viên",
        dataIndex: "processedBy",
        className: "hidden 2xl:table-cell",
        render: (p) => (
          <span className="text-sm">
            {p?.email || <span className="text-gray-400">Chưa có</span>}
          </span>
        ),
      },
      {
        title: "Design ID",
        dataIndex: "convertedToDesignId",
        className: "hidden xl:table-cell",
        render: (design) => (
          design ? (
            <div className="space-y-1">
              <div className="font-medium text-xs text-gray-800 line-clamp-1">
                {design.name}
              </div>
              <div className="text-xs font-semibold text-green-600">
                {design.price?.toLocaleString('vi-VN')}₫
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-xs">Chưa có</span>
          )
        ),
      },
      {
        title: "Ảnh",
        dataIndex: "referenceImages",
        className: "hidden lg:table-cell",
        width: 60,
        render: (imgs = [], record) => {
          const firstImg = imgs[0];
          const remain = imgs.length > 1 ? imgs.length - 1 : 0;

          return (
            <div
              className="relative w-10 h-10 cursor-pointer"
              onClick={() => setDetail(record)}
            >
              {firstImg ? (
                <img
                  src={firstImg.url || firstImg}
                  alt="reference"
                  className="w-full h-full object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400">
                  -
                </div>
              )}

              {remain > 0 && (
                <div className="absolute -top-1 -right-1 bg-black/70 text-white text-[8px] font-semibold px-1 py-0.5 rounded-full">
                  +{remain}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        className: "hidden 2xl:table-cell whitespace-nowrap",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "Thao tác",
        key: "actions",
        className: "whitespace-nowrap text-right sticky right-0 bg-white shadow-xl md:shadow-none",
        render: (_, record) => (
          <div className="flex justify-end gap-2">
            <Button 
                size="small" 
                icon={<FiEye />}
                className="flex items-center justify-center border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600"
                onClick={() => setDetail(record)}
            />
            <Button
              size="small"
              danger
              icon={<FiTrash2 />}
              className="flex items-center justify-center"
              loading={deletingId === record._id}
              onClick={async () => {
                setDeletingId(record._id);
                try {
                  await dispatch(deleteMyCustomSetDesign(record._id)).unwrap();
                  success("Đã xóa yêu cầu");
                } catch (err) {
                  error(err?.message || "Xóa thất bại");
                } finally {
                  setDeletingId(null);
                }
              }}
            />
          </div>
        ),
      },
    ],
    [deletingId, dispatch]
  );


  const total = myCustomRequests.length;
  const pending = myCustomRequests.filter((r) => r.status === "pending").length;
  const processing = myCustomRequests.filter(
    (r) => r.status === "processing"
  ).length;
  const completed = myCustomRequests.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={closeToast}
          duration={toast.duration}
        />
      )}
      <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
        <div className="text-sm opacity-90 mb-2">DASHBOARD · USER</div>
        <h1 className="text-3xl font-bold mb-2">Yêu cầu Set Design của bạn</h1>
        <p className="opacity-90">
          Theo dõi các yêu cầu custom set design đã gửi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng yêu cầu",
            value: total,
            color: "blue",
            icon: FiPackage,
          },
          {
            label: "Chờ xử lý",
            value: pending,
            color: "orange",
            icon: FiClock,
          },
          {
            label: "Đang xử lý",
            value: processing,
            color: "purple",
            icon: FiPackage,
          },
          {
            label: "Hoàn thành",
            value: completed,
            color: "green",
            icon: FiCheckCircle,
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <item.icon
              className={`text-4xl text-${item.color}-500 mb-3 mx-auto`}
            />
            <div className="text-3xl font-extrabold text-gray-900 mb-1">
              {item.value}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {item.label}
            </div>
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
        width={960}
        centered
        className="rounded-2xl"
      >
        {detail && (
          <div className="space-y-8">
            {/* ================= HEADER ================= */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Title level={3} className="!mb-1">
                  Yêu cầu Custom Set Design
                </Title>
                <Text type="secondary">
                  #{detail._id?.slice(-6)} ·{" "}
                  {dayjs(detail.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>

              <Tag
                color={statusConfig[detail.status]?.color || "orange"}
                className="px-4 py-1.5 text-sm font-semibold rounded-full"
              >
                {statusConfig[detail.status]?.label || "Chờ xử lý"}
              </Tag>
            </div>

            {/* ================= INFO GRID ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CUSTOMER */}
              <Card className="rounded-xl border border-gray-100">
                <Title level={5}>Thông tin khách hàng</Title>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text type="secondary">Tên</Text>
                    <div className="font-medium">
                      {detail.customerName || "—"}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Email</Text>
                    <div className="font-medium">{detail.email || "—"}</div>
                  </div>
                  <div>
                    <Text type="secondary">Điện thoại</Text>
                    <div className="font-medium">
                      {detail.phoneNumber || "—"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* REQUEST */}
              <Card className="rounded-xl border border-gray-100">
                <Title level={5}>Thông tin yêu cầu</Title>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text type="secondary">Phân loại</Text>
                    <div className="font-medium">
                      {detail.preferredCategory || "Không rõ"}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Ngân sách</Text>
                    <div className="text-lg font-bold text-amber-600">
                      {detail.budget
                        ? `${detail.budget.toLocaleString("vi-VN")}₫`
                        : "Không rõ"}
                    </div>
                  </div>
                  {detail.estimatedPrice && (
                    <div>
                      <Text type="secondary">Giá ước tính</Text>
                      <div className="text-base font-semibold text-blue-600">
                        {detail.estimatedPrice.toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  )}
                  <div>
                    <Text type="secondary">Nhân viên xử lý</Text>
                    <div className="font-medium">
                      {detail.processedBy?.email || "Chưa có"}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">AI Model</Text>
                    <div className="font-mono text-xs text-gray-600">
                      {detail.aiModel || "N/A"}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ================= DESCRIPTION ================= */}
            <Card className="rounded-xl border border-gray-100">
              <Title level={5}>Mô tả chi tiết</Title>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {detail.description || "Không có mô tả"}
              </div>
            </Card>

            {/* ================= CONVERTED DESIGN ================= */}
            {detail.convertedToDesignId && (
              <Card className="rounded-xl border border-green-200 bg-green-50/30">
                <Title level={5} className="!text-green-700">
                  ✓ Đã chuyển đổi thành Set Design
                </Title>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text type="secondary">Tên Design</Text>
                    <div className="font-semibold text-base">
                      {detail.convertedToDesignId.name}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Giá</Text>
                    <div className="text-xl font-bold text-green-600">
                      {detail.convertedToDesignId.price?.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Design ID</Text>
                    <div className="font-mono text-xs text-gray-600">
                      {detail.convertedToDesignId._id}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* ================= STAFF NOTES ================= */}
            {detail.staffNotes && (
              <Card className="rounded-xl border border-gray-100 bg-amber-50/30">
                <Title level={5}>Ghi chú từ nhân viên</Title>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {detail.staffNotes}
                </div>
              </Card>
            )}

            {/* ================= IMAGES ================= */}
            {detail.referenceImages?.length > 0 && (
              <Card
                className="rounded-xl border border-gray-100"
                title={
                  <span className="flex items-center gap-2">
                    <FiImage />
                    Ảnh tham khảo ({detail.referenceImages.length})
                  </span>
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {detail.referenceImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden group border border-gray-200"
                    >
                      <img
                        src={img.url || img}
                        alt={`ref-${idx}`}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                      {/* filename */}
                      {img.filename && (
                        <div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 truncate">
                          {img.filename}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserCustomSetDesignPage;
