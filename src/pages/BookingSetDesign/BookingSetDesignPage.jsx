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
} from "../../features/setDesign/setDesignSlice";
import { message } from "antd";
import { createOrderSetDesign } from "../../features/setDesignPayment/setDesignPayment";

const BookingSetDesignPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSetDesign, loading } = useSelector((state) => state.setDesign);

  // FORM CUSTOM REQUEST
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });

  const handleBookSetDesign = async () => {
    try {
      const result = await dispatch(
        createOrderSetDesign({
          setDesignId: currentSetDesign._id,
          customerName: form.customerName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          description: form.description,
        })
      ).unwrap();
      message.success("Đặt set design thành công!");
      navigate(`/set-design-order/detail/${result._id}`);
    } catch (err) {
      message.error(err?.message || "Đặt set design thất bại!");
    }
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
                    {currentSetDesign.avgRating || 0} / 5.0
                  </span>
                  <span className="text-slate-400">
                    ({currentSetDesign.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* ẢNH SET DESIGN */}
              {Array.isArray(currentSetDesign.images) && currentSetDesign.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {currentSetDesign.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`set-design-img-${idx}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              <div className="mt-6">
                <p className="text-slate-500 text-sm mb-2">Mô tả</p>
                <p className="text-slate-700 leading-relaxed bg-[#FCFBFA] p-4">
                  {currentSetDesign.description}
                </p>
              </div>
            </motion.div>

            {/* BUTTON TO BOOK SET DESIGN */}
            <motion.button
              className="w-full py-4 mt-4 text-white font-medium text-lg shadow-md bg-[#C5A267] border-2 border-[#C5A267] hover:bg-[#b08d57] hover:border-[#b08d57] transition"
              whileTap={{ scale: 0.97 }}
              onClick={handleBookSetDesign}
            >
              Đặt ngay
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BookingSetDesignPage;
