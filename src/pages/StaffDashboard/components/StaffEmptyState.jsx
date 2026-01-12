import React from "react";
import { MdOutlineInbox } from "react-icons/md";

const StaffEmptyState = ({ title = "Không có dữ liệu", subtitle }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center text-gray-500 gap-2">
    <MdOutlineInbox className="text-4xl text-gray-300" />
    <p className="text-base font-semibold text-gray-700">{title}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

export default StaffEmptyState;

