import React from "react";

const colorMap = {
  gold: "text-[#C5A267] bg-[#FCFBFA] border-slate-200",
  brown: "text-[#A0826D] bg-[#FCFBFA] border-slate-200",
  green: "text-[#10b981] bg-[#10b981]/5 border-[#10b981]/20",
  orange: "text-orange-600 bg-orange-50 border-orange-100",
  navy: "text-[#0F172A] bg-[#FCFBFA] border-slate-200",
};

const StaffStatCard = ({ icon: Icon, label, value, color = "gold" }) => {
  const colorCls = colorMap[color] || colorMap.gold;
  return (
    <div
      className={`border shadow-sm px-5 py-4 flex items-center gap-4 ${colorCls}`}
    >
      {Icon && (
        <div className="p-3 bg-white shadow text-xl text-[#C5A267]">
          <Icon />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-2xl font-extrabold text-[#0F172A]">{value}</span>
      </div>
    </div>
  );
};

export { StaffStatCard };
export default StaffStatCard;
