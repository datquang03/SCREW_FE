// src/pages/CustomSetDesignRequestPage.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiEdit, FiCheckCircle } from "react-icons/fi";
import { customSetDesignRequest } from "../../features/setdesign/setDesignSlice";
// Upload ảnh tạm thời bỏ dùng theo yêu cầu

const shakeVariant = {
  shake: {
    x: [-8, 8, -8, 8, 0],
    transition: { duration: 0.4 },
  },
};

const CustomSetDesignRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const preset = location.state?.fromSetDesign;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    description: preset?.name ? `Yêu cầu cho set design: ${preset.name}` : "",
    preferredCategory: "",
    budgetRange: "",
  });

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [successFly, setSuccessFly] = useState(false);
  // Không dùng upload ảnh theo yêu cầu, referenceImages để trống

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.customerName ||
      !form.email ||
      !form.phoneNumber ||
      !form.description
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return message.error("Vui lòng nhập đầy đủ thông tin!");
    }

    setLoading(true);

    const payload = {
      ...form,
      setDesignId: preset?.id,
      preferredCategory: form.preferredCategory,
      budgetRange: form.budgetRange,
      referenceImages: [],
    };

    const res = await dispatch(customSetDesignRequest(payload));

    setLoading(false);

    if (res?.meta?.requestStatus === "fulfilled") {
      message.success("Gửi yêu cầu thành công!");

      // ICON BAY LÊN
      setSuccessFly(true);

      setTimeout(() => {
        navigate("/dashboard/customer/custom-requests");
      }, 1500);

      setForm({
        customerName: "",
        email: "",
        phoneNumber: "",
        description: "",
      });
      setLocalFile(null);
    } else {
      message.error("Gửi yêu cầu thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex justify-center py-16 px-6 relative">
      {/* ICON BAY */}
      {successFly && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: -200, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 text-indigo-600 text-7xl"
        >
          <FiCheckCircle />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-10 border border-white/50 backdrop-blur"
      >
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          Yêu Cầu Set Design Theo Mong Muốn
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Điền thông tin chi tiết để đội ngũ liên hệ với bạn
        </p>

        <motion.div
          variants={shakeVariant}
          animate={shake ? "shake" : ""}
          className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scroll"
        >
          {/* NAME */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
            <FiUser className="text-indigo-500 text-xl" />
            <input
              type="text"
              placeholder="Họ và tên"
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
            <FiMail className="text-indigo-500 text-xl" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
            <FiPhone className="text-indigo-500 text-xl" />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex items-start gap-3 bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
            <FiEdit className="text-indigo-500 text-xl mt-1" />
            <textarea
              rows={6}
              placeholder="Mô tả yêu cầu chi tiết..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 resize-none placeholder:text-gray-400"
            />
          </div>

          {/* PREFERRED CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
              <p className="text-sm text-gray-500">Loại set / phong cách</p>
              <input
                type="text"
                placeholder="VD: Wedding, Vintage, Studio..."
                value={form.preferredCategory}
                onChange={(e) =>
                  updateField("preferredCategory", e.target.value)
                }
                className="w-full mt-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* BUDGET RANGE */}
            <div className="bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition">
              <p className="text-sm text-gray-500">Ngân sách dự kiến</p>
              <input
                type="text"
                placeholder="VD: 5,000,000 - 10,000,000"
                value={form.budgetRange}
                onChange={(e) => updateField("budgetRange", e.target.value)}
                className="w-full mt-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* BUTTON */}
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-10 py-5 text-lg rounded-xl font-semibold text-white shadow-lg 
          bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95 transition"
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CustomSetDesignRequestPage;
