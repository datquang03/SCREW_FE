import React from "react";

const StaffDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Staff Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Đây là trang chính của Staff. Bạn có thể xem đơn hàng, quản lý khách hàng, và cập nhật thông tin cá nhân.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Orders</h2>
          <p className="text-gray-500">Đơn hàng mới: 5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Customers</h2>
          <p className="text-gray-500">Khách hàng đang quản lý: 20</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Tasks</h2>
          <p className="text-gray-500">Công việc hôm nay: 3</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
