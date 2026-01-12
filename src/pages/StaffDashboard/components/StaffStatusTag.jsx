import React from "react";
import { Tag } from "antd";

const StaffStatusTag = ({
  status,
  map = {
    pending: { color: "orange", label: "Chờ xử lý" },
    processing: { color: "blue", label: "Đang xử lý" },
    completed: { color: "green", label: "Hoàn thành" },
    rejected: { color: "red", label: "Từ chối" },
    paid: { color: "green", label: "Đã thanh toán" },
    pending_payment: { color: "blue", label: "Chờ thanh toán" },
  },
  className = "",
}) => {
  const config = map[status] || { color: "default", label: status || "Không rõ" };
  return (
    <Tag color={config.color} className={`px-3 py-1 rounded-full ${className}`}>
      {config.label}
    </Tag>
  );
};

export { StaffStatusTag };
export default StaffStatusTag;
