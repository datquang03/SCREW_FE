// src/pages/AdminDashboard/AdminDashboardPage.jsx
import React from "react";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Đây là trang chính của Admin. Tại đây bạn có thể quản lý user, staff, đơn hàng, và cài đặt hệ thống.
      </p>

      {/* Ví dụ một số cards / widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Users</h2>
          <p className="text-gray-500">Số lượng user hiện tại: 120</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Staff</h2>
          <p className="text-gray-500">Số lượng nhân viên: 25</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Orders</h2>
          <p className="text-gray-500">Đơn hàng mới: 10</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
