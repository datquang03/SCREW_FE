/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiHome, FiCalendar, FiClock, FiUsers, FiMapPin } from "react-icons/fi";
import { Form, Select, DatePicker, Button, Divider } from "antd";
import roomImage from "../../../assets/room100m2(360).jpg";

const { Option } = Select;

const IntroSection = () => {
  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 md:px-12"
      style={{
        backgroundImage: `url("${roomImage}")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left text-white max-w-md sm:max-w-lg"
        >
          <div className="bg-yellow-400/20 border border-yellow-500/40 px-4 sm:px-6 py-3 rounded-xl shadow-xl mb-6 flex items-center justify-center">
            <span className="text-yellow-400 font-semibold tracking-wide text-sm sm:text-md text-center">
              • Studio chuyên nghiệp cùng đội ngũ Set Design giàu kinh nghiệm
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-2 leading-tight drop-shadow-lg">
            S <br />
            <span className="text-yellow-400">CỘNG</span> <br /> STUDIO
          </h1>

          <p className="mt-4 sm:mt-6 text-gray-300 text-base sm:text-lg leading-relaxed">
            Đặt phòng tiện nghi hiện đại với giá cả hợp lý và chỉ với vài chạm!
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8 mt-8 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <FiClock className="text-yellow-400 text-lg" />
              <p>Đặt tối thiểu 8 tiếng</p>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-yellow-400 text-lg" />
              <p>Ngay tại Quận 4, TP.HCM</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION - FORM */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] mt-10 md:mt-14"
        >
          <div className="p-[2px] rounded-[24px] bg-gradient-to-tr from-slate-400/40 via-slate-500/10 to-yellow-400/30 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <div className="rounded-[22px] bg-[#0b1120]/85 backdrop-blur-xl border border-slate-700/50 p-5 sm:p-6 md:p-7">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight text-center">
                <span className="text-yellow-400">Tìm Phòng</span> Studio
              </h2>

              <Divider className="border-slate-700/60 my-5" />

              <Form
                layout="vertical"
                className="text-white space-y-3 sm:space-y-4"
                onFinish={(values) => console.log(values)}
              >
                <Form.Item
                  label={
                    <span className="flex items-center gap-2 text-slate-300 text-[12px] sm:text-[13px] uppercase tracking-wide">
                      <FiHome className="text-yellow-400" /> Loại phòng
                    </span>
                  }
                  name="roomType"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại phòng!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại phòng"
                    size="middle"
                    className="rounded-xl bg-[#0e172a] border-slate-600 text-slate-200"
                  >
                    <Option value="100">Phòng 100m²</Option>
                    <Option value="180">Phòng 180m²</Option>
                    <Option value="300">Phòng 300m²</Option>
                    <Option value="350">Phòng 350m²</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="flex items-center gap-2 text-slate-300 text-[12px] sm:text-[13px] uppercase tracking-wide">
                      <FiCalendar className="text-yellow-400" /> Ngày thuê
                    </span>
                  }
                  name="date"
                  rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                >
                  <DatePicker
                    size="middle"
                    className="w-full rounded-xl bg-[#0e172a] border-slate-600 text-slate-200"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="flex items-center gap-2 text-slate-300 text-[12px] sm:text-[13px] uppercase tracking-wide">
                      <FiClock className="text-yellow-400" /> Thời lượng thuê
                    </span>
                  }
                  name="duration"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời lượng!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn thời lượng"
                    size="middle"
                    className="rounded-xl bg-[#0e172a] border-slate-600 text-slate-200"
                  >
                    <Option value="8h">8 tiếng</Option>
                    <Option value="16h">16 tiếng</Option>
                    <Option value="24h">24 tiếng</Option>
                    <Option value="custom">Thương lượng</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="flex items-center gap-2 text-slate-300 text-[12px] sm:text-[13px] uppercase tracking-wide">
                      <FiUsers className="text-yellow-400" /> Quy mô nhóm
                    </span>
                  }
                  name="groupSize"
                  rules={[
                    { required: true, message: "Vui lòng chọn quy mô nhóm!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quy mô nhóm"
                    size="middle"
                    className="rounded-xl bg-[#0e172a] border-slate-600 text-slate-200"
                  >
                    <Option value="small">1–3 người</Option>
                    <Option value="medium">4–6 người</Option>
                    <Option value="large">7+ người</Option>
                  </Select>
                </Form.Item>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    className="w-full h-[48px] sm:h-[52px] font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 border-none text-black shadow-[0_16px_36px_rgba(251,191,36,0.32)] hover:brightness-105 transition-all"
                  >
                    Tìm phòng ngay
                  </Button>
                </motion.div>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroSection;
