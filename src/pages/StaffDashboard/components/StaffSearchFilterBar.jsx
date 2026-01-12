import React from "react";
import { Input, Select } from "antd";
import { FiSearch } from "react-icons/fi";

const StaffSearchFilterBar = ({
  search,
  onSearchChange,
  selectValue,
  onSelectChange,
  selectPlaceholder = "Lọc trạng thái",
  selectOptions = [],
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        allowClear
        prefix={<FiSearch className="text-gray-400" />}
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="w-full sm:w-80 rounded-2xl border border-gray-200 shadow-inner"
      />
      {selectOptions.length > 0 && (
        <Select
          allowClear
          placeholder={selectPlaceholder}
          value={selectValue || undefined}
          onChange={(v) => onSelectChange?.(v || "")}
          className="w-full sm:w-64 rounded-2xl"
          options={selectOptions}
        />
      )}
    </div>
  );
};

export { StaffSearchFilterBar };
export default StaffSearchFilterBar;
