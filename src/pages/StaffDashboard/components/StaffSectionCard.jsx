import React from "react";

const StaffSectionCard = ({ title, extra, children, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white shadow-md ${className}`}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {extra}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export { StaffSectionCard };
export default StaffSectionCard;
