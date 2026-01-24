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
    <div className="min-h-screen bg-[#FCFBFA] flex justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-10 border border-slate-100"
      >
        {loading || !currentSetDesign ? (
          <div className="w-full flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
                Custom Request
              </p>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-3">
                Yêu cầu Set Design theo mong muốn
              </h1>
              <p className="text-slate-600">
                Hãy điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn.
              </p>
            </div>

            {/* THÔNG TIN SET DESIGN */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 p-6 mb-10"
            >
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">
                Set Design bạn đang yêu cầu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Tên gói</p>
                  <p className="font-semibold text-[#0F172A] text-lg">
                    {currentSetDesign.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm mb-1">Giá</p>
                  <p className="font-semibold text-[#C5A267] text-lg">
                    {currentSetDesign.price?.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm mb-1">Loại set</p>
                  <Tag color="gold" className="mt-1 border-[#C5A267] text-[#C5A267]">
                    {currentSetDesign.category}
                  </Tag>
                </div>

                <div className="flex items-center gap-2">
                  <FiStar className="text-[#C5A267]" />
                  <span className="text-[#0F172A] font-semibold">
                    {currentSetDesign.avgRating} / 5.0
                  </span>
                  <span className="text-slate-400">
                    ({currentSetDesign.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-slate-500 text-sm mb-2">Mô tả</p>
                <p className="text-slate-700 leading-relaxed bg-[#FCFBFA] p-4">
                  {currentSetDesign.description}
                </p>
              </div>
            </motion.div>

            {/* FORM CUSTOM REQUEST */}
            <h2 className="text-xl font-semibold text-[#0F172A] mb-6">
              Thông tin của bạn
            </h2>

            <div className="space-y-6">
              {/* FULL NAME */}
              <div className="flex items-center gap-3 bg-white p-4 border-2 border-slate-200 focus-within:border-[#C5A267] transition">
                <FiUser className="text-[#C5A267] text-xl" />
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
                  className="w-full bg-transparent outline-none text-[#0F172A] placeholder-slate-400"
                />
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3 bg-white p-4 border-2 border-slate-200 focus-within:border-[#C5A267] transition">
                <FiMail className="text-[#C5A267] text-xl" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-transparent outline-none text-[#0F172A] placeholder-slate-400"
                />
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3 bg-white p-4 border-2 border-slate-200 focus-within:border-[#C5A267] transition">
                <FiPhone className="text-[#C5A267] text-xl" />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  className="w-full bg-transparent outline-none text-[#0F172A] placeholder-slate-400"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex items-start gap-3 bg-white p-4 border-2 border-slate-200 focus-within:border-[#C5A267] transition">
                <FiMessageSquare className="text-[#C5A267] text-xl mt-1" />
                <textarea
                  rows={4}
                  placeholder="Mô tả yêu cầu set design mong muốn..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-transparent outline-none text-[#0F172A] resize-none placeholder-slate-400"
                />
              </div>

              {/* UPLOAD IMAGES */}
              <div className="bg-white p-4 border-2 border-dashed border-slate-200 hover:border-[#C5A267] transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#0F172A]">
                      Hình ảnh tham khảo
                    </p>
                    <p className="text-sm text-slate-500">
                      Tải lên 1-5 ảnh (jpg, png). Ảnh sẽ gửi kèm yêu cầu.
                    </p>
                  </div>
                  <label
                    className="px-3 py-2 bg-[#A0826D] text-white text-sm cursor-pointer hover:bg-[#8B7355] transition"
                    style={{ backgroundColor: '#A0826D' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8B7355'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A0826D'}
                  >
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
                  <p className="text-sm text-[#C5A267]">Đang tải ảnh...</p>
                )}

                {localFile && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                    <img
                      src={URL.createObjectURL(localFile)}
                      alt="upload"
                      className="w-full h-24 object-cover border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON SEND REQUEST */}
            <motion.button
              className="w-full py-5 mt-10 text-white font-semibold text-lg shadow-lg transition-all"
              style={{ backgroundColor: '#A0826D' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8B7355'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A0826D'}
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
              className="w-full py-4 mt-4 text-[#0F172A] font-medium text-lg shadow-md bg-white border-2 border-slate-200 hover:border-[#C5A267] hover:bg-slate-50 transition"
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
