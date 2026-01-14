// src/pages/BookingSetDesignPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Tag, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getSetDesignById,
  customSetDesignRequest,
} from "../../features/setDesign/setDesignSlice";
import { uploadImage } from "../../features/upload/uploadSlice";
import { message } from "antd";

const BookingSetDesignPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSetDesign, loading } = useSelector((state) => state.setDesign);
  const { uploading } = useSelector((s) => s.upload || {});
  const [localFile, setLocalFile] = useState(null);

  // FORM CUSTOM REQUEST
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (id) dispatch(getSetDesignById(id));
  }, [id, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 border border-white/60"
      >
        {loading || !currentSetDesign ? (
          <div className="w-full flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Yêu cầu Set Design theo mong muốn
            </h1>

            <p className="text-center text-gray-600 mb-10">
              Hãy điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn.
            </p>

            {/* THÔNG TIN SET DESIGN */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border rounded-2xl p-6 mb-10 shadow-inner"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Set Design bạn đang yêu cầu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500">Tên gói</p>
                  <p className="font-semibold text-gray-800 text-lg">
                    {currentSetDesign.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Giá</p>
                  <p className="font-semibold text-indigo-600 text-lg">
                    {currentSetDesign.price?.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Loại set</p>
                  <Tag color="purple" className="mt-1">
                    {currentSetDesign.category}
                  </Tag>
                </div>

                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-500" />
                  <span className="text-gray-700">
                    {currentSetDesign.avgRating} / 5.0
                  </span>
                  <span className="text-gray-400">
                    ({currentSetDesign.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-500 mb-1">Mô tả</p>
                <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl shadow-sm">
                  {currentSetDesign.description}
                </p>
              </div>
            </motion.div>

            {/* FORM CUSTOM REQUEST */}
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Thông tin của bạn
            </h2>

            <div className="space-y-6">
              {/* FULL NAME */}
              <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border border-gray-100">
                <FiUser className="text-indigo-500 text-xl" />
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gradient"
                />
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border border-gray-100">
                <FiMail className="text-indigo-500 text-xl" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gradient"
                />
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border border-gray-100">
                <FiPhone className="text-indigo-500 text-xl" />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gradient"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex items-start gap-3 bg-white rounded-xl shadow p-4 border border-gray-100">
                <FiMessageSquare className="text-indigo-500 text-xl mt-1" />
                <textarea
                  rows={4}
                  placeholder="Mô tả yêu cầu set design mong muốn..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 resize-none placeholder-gradient"
                />
              </div>

              {/* UPLOAD IMAGES */}
              <div className="bg-white rounded-xl shadow p-4 border border-dashed border-indigo-200 hover:border-indigo-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Hình ảnh tham khảo
                    </p>
                    <p className="text-sm text-gray-500">
                      Tải lên 1-5 ảnh (jpg, png). Ảnh sẽ gửi kèm yêu cầu.
                    </p>
                  </div>
                  <label className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm cursor-pointer hover:bg-indigo-700">
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLocalFile(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {uploading && (
                  <p className="text-sm text-indigo-600">Đang tải ảnh...</p>
                )}

                {localFile && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                    <img
                      src={URL.createObjectURL(localFile)}
                      alt="upload"
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON SEND REQUEST */}
            <motion.button
              className="w-full py-5 mt-10 rounded-xl text-white font-semibold text-lg shadow-lg bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95 transition-all"
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
              onClick={async () => {
                if (
                  !form.customerName ||
                  !form.email ||
                  !form.phoneNumber ||
                  !form.description
                ) {
                  return message.error("Vui lòng nhập đầy đủ thông tin");
                }
                setSubmitting(true);
                try {
                  let uploaded = [];
                  if (localFile) {
                    const resUp = await dispatch(
                      uploadImage(localFile)
                    ).unwrap();
                    const img =
                      resUp?.image ||
                      resUp?.url ||
                      resUp?.secure_url ||
                      resUp?.data?.image ||
                      resUp;
                    uploaded = img ? [img] : [];
                  }
                  const payload = {
                    ...form,
                    setDesignId: id,
                    images: uploaded,
                  };
                  const res = await dispatch(
                    customSetDesignRequest(payload)
                  ).unwrap();
                  message.success("Gửi yêu cầu thiết kế thành công");
                  setForm({
                    customerName: "",
                    email: "",
                    phoneNumber: "",
                    description: "",
                  });
                  setLocalFile(null);
                  navigate("/dashboard/customer/custom-request");
                } catch (err) {
                  message.error(err?.message || "Gửi yêu cầu thất bại");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? "Đang gửi..." : "Gửi yêu cầu thiết kế"}
            </motion.button>

            {/* BUTTON TO BOOK NORMAL SET DESIGN */}
            <motion.button
              className="w-full py-4 mt-4 rounded-xl text-gray-800 font-medium text-lg shadow bg-gray-100 hover:bg-gray-200 transition"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/set-design/${id}`)}
            >
              Quay lại trang gói chụp
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BookingSetDesignPage;
