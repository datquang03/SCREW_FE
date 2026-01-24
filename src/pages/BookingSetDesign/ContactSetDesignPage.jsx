// src/pages/CustomSetDesignRequestPage.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Select } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit, FiCheckCircle, FiImage, FiX } from "react-icons/fi";
import { customSetDesignRequest } from "../../features/setDesign/setDesignSlice";
import useToast from "../../hooks/useToast";
import ToastNotification from "../../components/ToastNotification";

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
  const { toast, success, error, closeToast } = useToast();

  const [form, setForm] = useState({
    description: preset?.name ? `Yêu cầu cho set design: ${preset.name}` : "",
    preferredCategory: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [successFly, setSuccessFly] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Append mới (giữ những file đã có)
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Tạo preview URLs và append
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Reset input value để chọn lại cùng file cũng trigger được
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    // Revoke URL để giải phóng memory
    URL.revokeObjectURL(previewUrls[index]);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async () => {
    if (!form.description) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return error("Vui lòng nhập mô tả!");
    }

    setLoading(true);

    try {
      const payload = {
        description: form.description,
        setDesignId: preset?.id,
        preferredCategory: form.preferredCategory,
        budget: form.budget,
        referenceImages: files, // Truyền File objects trực tiếp
      };

      const res = await dispatch(customSetDesignRequest(payload)).unwrap();

      if (res) {
        success("Gửi yêu cầu thành công!");

        // ICON BAY LÊN
        setSuccessFly(true);

        setTimeout(() => {
          navigate("/dashboard/customer/custom-requests");
        }, 1500);

        // Reset form và files
        setForm({
          description: "",
          preferredCategory: "",
          budget: "",
        });
        setFiles([]);
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
      }
    } catch (err) {
      error(err?.message || "Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] flex justify-center py-16 px-6 relative">
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={closeToast}
          duration={toast.duration}
        />
      )}
      {/* ICON BAY */}
      {successFly && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: -200, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 text-[#C5A267] text-7xl"
        >
          <FiCheckCircle />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] p-10 border border-slate-100 backdrop-blur"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold mb-4">
            Custom Request
          </p>
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">
            Yêu Cầu Set Design Theo Mong Muốn
          </h1>
          <p className="text-slate-600">
            Điền thông tin chi tiết để đội ngũ liên hệ với bạn
          </p>
        </div>

        <motion.div
          variants={shakeVariant}
          animate={shake ? "shake" : ""}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scroll"
        >
          {/* NAME */}
          
          {/* DESCRIPTION */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả yêu cầu <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors">
              <FiEdit className="text-indigo-500 text-xl mt-1 flex-shrink-0" />
              <textarea
                rows={6}
                placeholder="Mô tả chi tiết yêu cầu set design của bạn..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 resize-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* PREFERRED CATEGORY */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại set / phong cách
            </label>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors">
              <Select
                placeholder="Chọn loại set design"
                value={form.preferredCategory || undefined}
                onChange={(value) => updateField("preferredCategory", value)}
                className="w-full"
                size="large"
                options={[
                  { label: "Wedding (Cưới hỏi)", value: "wedding" },
                  { label: "Portrait (Chân dung)", value: "portrait" },
                  { label: "Corporate (Doanh nghiệp)", value: "corporate" },
                  { label: "Event (Sự kiện)", value: "event" },
                  { label: "Family (Gia đình)", value: "family" },
                  { label: "Graduation (Tốt nghiệp)", value: "graduation" },
                  { label: "Other (Khác)", value: "other" },
                ]}
              />
            </div>
          </div>

          {/* BUDGET */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngân sách dự kiến
            </label>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors">
              <input
                type="text"
                placeholder="VD: 5,000,000 - 10,000,000"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh tham khảo
            </label>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 transition-colors">
              <button
                type="button"
                className="w-full flex items-center gap-3 cursor-pointer text-left"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiImage className="text-indigo-500 text-xl flex-shrink-0" />
                <span className="text-gray-700 flex-1">Chọn ảnh tham khảo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* PREVIEW IMAGES */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden border-2 border-slate-200"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* BUTTON */}
        <div className="mt-24 mb-4">
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className="w-full py-5 text-lg font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: loading ? '#94a3b8' : '#A0826D',
              color: "#ffffff",
              letterSpacing: "0.5px",
              fontWeight: "700",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#8B7355';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#A0826D';
            }}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomSetDesignRequestPage;
