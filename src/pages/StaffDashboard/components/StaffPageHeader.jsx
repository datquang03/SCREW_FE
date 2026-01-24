import React from "react";

const StaffPageHeader = ({
  title,
  subtitle,
  badge,
  actions,
}) => {
  return (
    <div className="relative w-full bg-[#C5A267] p-10 text-white shadow-md">
      <div className="text-sm opacity-90 mb-2">DASHBOARD · STAFF</div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && (
        <p className="opacity-90">{subtitle}</p>
      )}
      
      {(badge || actions) && (
        <div className="absolute top-8 right-8 flex items-center gap-3">
          {badge && (
            <span className="px-4 py-2 bg-white/20 border border-white/30 text-sm font-semibold">
              {badge}
            </span>
          )}
          {actions}
        </div>
      )}
    </div>
  );
};

export { StaffPageHeader };
export default StaffPageHeader;
