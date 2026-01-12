import React from "react";

const colorMap = {
  purple: "text-purple-600 bg-purple-50 border-purple-100",
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  green: "text-emerald-600 bg-emerald-50 border-emerald-100",
  orange: "text-orange-600 bg-orange-50 border-orange-100",
  pink: "text-pink-600 bg-pink-50 border-pink-100",
};

const StaffStatCard = ({ icon: Icon, label, value, color = "purple" }) => {
  const colorCls = colorMap[color] || colorMap.purple;
  return (
    <div
      className={`rounded-2xl border shadow-sm px-5 py-4 flex items-center gap-4 ${colorCls}`}
    >
      {Icon && (
        <div className="p-3 rounded-xl bg-white shadow text-xl text-gray-700">
          <Icon />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-2xl font-extrabold text-gray-900">{value}</span>
      </div>
    </div>
  );
};

export { StaffStatCard };
export default StaffStatCard;
