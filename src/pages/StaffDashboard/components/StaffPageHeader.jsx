import React from "react";

const StaffPageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 shadow-xl bg-white">
      <div
        className={`bg-gradient-to-r ${gradient} px-6 md:px-8 py-8 text-white`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">
              Dashboard · Staff
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm md:text-base opacity-90 mt-2">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {badge && (
              <span className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-semibold">
                {badge}
              </span>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StaffPageHeader };
export default StaffPageHeader;
