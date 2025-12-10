import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyCustomSetDesign,
  deleteMyCustomSetDesign,
} from "../../features/setdesign/setDesignSlice";
import { Card, Tag, Spin, Modal, Button, message, Descriptions } from "antd";
import dayjs from "dayjs";

const UserCustomSetDesignPage = () => {
  const dispatch = useDispatch();
  const {
    myCustomRequests = [],
    myCustomPagination,
    loading,
  } = useSelector((s) => s.setDesign || {});
  const [detail, setDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    dispatch(getMyCustomSetDesign({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Yêu cầu Set Design của bạn</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : myCustomRequests.length === 0 ? (
        <p className="text-gray-500">Chưa có yêu cầu nào.</p>
      ) : (
        <div className="space-y-4">
          {myCustomRequests.map((item) => (
            <Card key={item._id} className="shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.preferredCategory || "Set Design"}{" "}
                    {item.setDesignId && <Tag color="blue">Set đã chọn</Tag>}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <div>Ngân sách: {formatBudget(item.budgetRange)}</div>
                    <div>Email: {item.email}</div>
                    <div>Điện thoại: {item.phoneNumber}</div>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-2">
                  <div>{dayjs(item.createdAt).format("HH:mm, DD/MM/YYYY")}</div>
                  <div className="flex gap-2 justify-end">
                    <Button size="small" onClick={() => setDetail(item)}>
                      Xem chi tiết
                    </Button>
                    <Button
                      size="small"
                      danger
                      loading={deletingId === item._id}
                      onClick={async () => {
                        setDeletingId(item._id);
                        try {
                          await dispatch(
                            deleteMyCustomSetDesign(item._id)
                          ).unwrap();
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        title="Chi tiết yêu cầu"
      >
        {detail && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Tên">
              {detail.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">
              {detail.phoneNumber}
            </Descriptions.Item>
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
              <Tag color="orange">{detail.status || "pending"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tạo lúc">
              {dayjs(detail.createdAt).format("HH:mm, DD/MM/YYYY")}
            </Descriptions.Item>
            {detail.referenceImages?.length > 0 && (
              <Descriptions.Item label="Ảnh tham khảo">
                <div className="grid grid-cols-3 gap-2">
                  {detail.referenceImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url || img.secure_url || img}
                      alt="ref"
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
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
