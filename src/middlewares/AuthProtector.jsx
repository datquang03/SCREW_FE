import React from "react";
import { Navigate } from "react-router-dom";

// === COMMON UTIL ===
const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

// === GENERIC PROTECTOR ===
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// === SPECIFIC PROTECTORS ===

// 🧑‍🏫 Dành cho customer
export const ProtectedRouteForInstructor = ({ children }) => (
  <ProtectedRoute allowedRoles={["customer"]}>{children}</ProtectedRoute>
);


// 👩‍💼 Dành cho staff (quản lý nhân viên)
export const ProtectedRouteForStaff = ({ children }) => (
  <ProtectedRoute allowedRoles={["staff"]}>
    {children}
  </ProtectedRoute>
);

// 🛠 Dành cho admin
export const ProtectedRouteForAdmin = ({ children }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);

// ✅ Cho phép cả customer + staff (VD: message page)
export const ProtectedRouteForStudentAndInstructor = ({ children }) => (
  <ProtectedRoute allowedRoles={["customer", "staff"]}>{children}</ProtectedRoute>
);

// 🪶 Mặc định (chỉ cần login, không cần role cụ thể)
export const ProtectedRouteForAll = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

// === EXPORT DEFAULT ===
export default ProtectedRoute;
