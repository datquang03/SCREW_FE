import React, { useMemo, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import {
  Button,
  Divider,
  Radio,
  Tag,
  DatePicker,
  Steps,
} from "antd";
import {
  CameraOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Layout from "../../components/layout/Layout";

const studioPackages = [
  {
    id: "studio-a",
    name: "Studio Aurora",
    description: "Không gian ánh sáng tự nhiên cùng hệ thống softbox cao cấp.",
    price: "1.200.000đ / 2 giờ",
    highlights: ["120m²", "Ánh sáng tự nhiên", "5 góc chụp preset"],
    badge: "Phổ biến",
    color: "blue",
  },
  {
    id: "studio-b",
    name: "Studio Noir",
    description: "Tone đen sang trọng, hệ thống đèn RGB tạo chiều sâu đầy nghệ thuật.",
    price: "1.450.000đ / 2 giờ",
    highlights: ["90m²", "Đèn RGB", "Phông vô cực"],
    badge: "Mới",
    color: "purple",
  },
  {
    id: "studio-c",
    name: "Studio Solstice",
    description: "Concept mùa, phụ kiện phong phú, phù hợp lookbook thời trang.",
    price: "1.650.000đ / 2 giờ",
    highlights: ["110m²", "Backdrop 4 mùa", "Stylist hỗ trợ"],
    badge: "Luxury",
    color: "gold",
  },
];

const addOnServices = [
  {
    id: "makeup",
    name: "Stylist & Makeup Artist",
    price: "800.000đ",
    icon: <CustomerServiceOutlined />,
  },
  {
    id: "lighting",
    name: "Trọn bộ Lighting Pro",
    price: "550.000đ",
    icon: <GiftOutlined />,
  },
  {
    id: "props",
    name: "Gói Props Premium",
    price: "320.000đ",
    icon: <GiftOutlined />,
  },
];

const timeSlots = [
  {
    label: "Buổi sáng",
    slots: ["08:00 - 10:00", "09:00 - 11:00", "10:30 - 12:30"],
  },
  {
    label: "Buổi chiều",
    slots: ["13:00 - 15:00", "14:00 - 16:00", "15:30 - 17:30"],
  },
  {
    label: "Buổi tối",
    slots: ["18:00 - 20:00", "19:00 - 21:00"],
  },
];

// Component 3D Card với tilt effect
const Card3D = ({ children, className = "", intensity = 15 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX / rect.width);
    y.set(distanceY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StudioBookingPage = () => {
  const [selectedStudio, setSelectedStudio] = useState(studioPackages[0].id);
  const [selectedSlot, setSelectedSlot] = useState("09:00 - 11:00");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const summaryInfo = useMemo(() => {
    const studio = studioPackages.find((item) => item.id === selectedStudio);
    const addons = addOnServices.filter((item) =>
      selectedAddOns.includes(item.id)
    );
    return { studio, addons };
  }, [selectedAddOns, selectedStudio]);

  const toggleAddon = (id) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div ref={heroRef} className="relative bg-slate-950 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,226,133,0.2),_transparent_60%)]"
          style={{ y, opacity }}
        />
        <motion.div 
          className="absolute inset-y-0 -right-32 w-[420px] bg-gradient-to-b from-amber-500/20 via-transparent to-purple-500/20 blur-3xl"
          style={{ y: y2, opacity }}
        />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ y, opacity }}
            className="max-w-3xl space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Đặt lịch chụp tại{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-300 bg-clip-text text-transparent">
                S+ Studio
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/80">
              Chọn studio, thời gian và dịch vụ bổ sung trong vài phút.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="relative bg-[#f5f6fb] pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 md:-mt-20">
          <Card3D intensity={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_35px_120px_rgba(15,23,42,0.18)] border border-white/60 overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="px-6 md:px-10 py-6 border-b border-gray-100">
                <Steps
                  current={1}
                  responsive
                  items={[
                    { title: "Chọn studio", icon: <CameraOutlined /> },
                    { title: "Chọn lịch", icon: <CalendarOutlined /> },
                    { title: "Thông tin & thanh toán", icon: <InfoCircleOutlined /> },
                  ]}
                />
              </div>

              <div className="px-6 md:px-10 py-8">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_0.8fr]">
                  {/* Chọn Studio */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <EnvironmentOutlined className="text-amber-500" />
                      <span className="text-base font-semibold text-gray-900">
                        Chọn studio
                      </span>
                    </div>
                    <div className="space-y-3">
                      {studioPackages.map((studio) => (
                        <motion.button
                          key={studio.id}
                          onClick={() => setSelectedStudio(studio.id)}
                          whileHover={{ 
                            scale: 1.02,
                            rotateY: selectedStudio === studio.id ? 0 : 2,
                            rotateX: selectedStudio === studio.id ? 0 : -2,
                            z: selectedStudio === studio.id ? 0 : 20,
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`w-full text-left rounded-2xl border transition-all duration-300 p-4 ${
                            selectedStudio === studio.id
                              ? "border-amber-400 bg-amber-50/80 shadow-lg"
                              : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/40"
                          }`}
                          style={{
                            transformStyle: "preserve-3d",
                            perspective: 1000,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {studio.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {studio.description}
                              </p>
                            </div>
                            <Tag color={studio.color}>{studio.badge}</Tag>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                            {studio.highlights.map((item) => (
                              <Tag key={item} color="gold" className="bg-amber-50">
                                {item}
                              </Tag>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-700">
                            <span>Giá:</span>
                            <span className="font-semibold text-amber-600">
                              {studio.price}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Dịch vụ bổ sung */}
                    <div className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GiftOutlined className="text-purple-500" />
                        <span className="text-base font-semibold text-gray-900">
                          Dịch vụ bổ sung
                        </span>
                      </div>
                      <div className="space-y-2">
                        {addOnServices.map((item) => {
                          const isActive = selectedAddOns.includes(item.id);
                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => toggleAddon(item.id)}
                              whileHover={{ 
                                scale: 1.02,
                                rotateY: isActive ? 0 : 2,
                                rotateX: isActive ? 0 : -1,
                                z: isActive ? 0 : 15,
                              }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className={`w-full text-left rounded-xl border transition-all duration-300 p-3 flex items-center justify-between ${
                                isActive
                                  ? "border-purple-400 bg-purple-50 shadow"
                                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/40"
                              }`}
                              style={{
                                transformStyle: "preserve-3d",
                                perspective: 1000,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-lg text-purple-500">
                                  {item.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-purple-600">
                                {item.price}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Chọn lịch */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ClockCircleOutlined className="text-amber-500" />
                      <span className="text-base font-semibold text-gray-900">
                        Chọn lịch
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Chọn ngày
                        </p>
                        <DatePicker
                          size="large"
                          className="w-full"
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày"
                          onChange={(date) => setSelectedDate(date)}
                        />
                      </div>

                      <div className="space-y-4">
                        {timeSlots.map((group) => (
                          <div key={group.label}>
                            <div className="text-sm font-semibold text-gray-700 mb-2">
                              {group.label}
                            </div>
                            <Radio.Group
                              className="flex flex-wrap gap-2"
                              value={selectedSlot}
                              onChange={(e) => setSelectedSlot(e.target.value)}
                            >
                              {group.slots.map((slot) => (
                                <Radio.Button
                                  key={slot}
                                  value={slot}
                                  className="!px-3 !py-1.5 rounded-lg"
                                >
                                  {slot}
                                </Radio.Button>
                              ))}
                            </Radio.Group>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tóm tắt */}
                  <div>
                    <Card3D intensity={12}>
                      <motion.div 
                        className="rounded-2xl border border-gray-100 bg-white shadow-lg sticky top-28"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                          <InfoCircleOutlined className="text-amber-500" />
                          <span className="text-base font-semibold text-gray-900">
                            Tóm tắt
                          </span>
                        </div>
                        <div className="px-5 py-5 space-y-4 text-sm text-gray-700">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Studio</p>
                            <p className="text-base font-semibold text-gray-900">
                              {summaryInfo.studio.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {summaryInfo.studio.price}
                            </p>
                          </div>
                          <Divider className="my-2" />
                          <div className="flex items-center justify-between">
                            <span>Ngày</span>
                            <Tag color="blue">
                              {selectedDate
                                ? selectedDate.format("DD/MM/YYYY")
                                : "Chưa chọn"}
                            </Tag>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Giờ</span>
                            <Tag color="green">{selectedSlot}</Tag>
                          </div>
                          {summaryInfo.addons.length > 0 && (
                            <>
                              <Divider className="my-2" />
                              <div>
                                <span className="block mb-2 text-xs text-gray-400">Dịch vụ thêm</span>
                                <div className="space-y-1">
                                  {summaryInfo.addons.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between text-gray-600 text-xs"
                                    >
                                      <span>{item.name}</span>
                                      <span className="font-medium">{item.price}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          <Divider className="my-3" />
                          <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                            <span>Tổng</span>
                            <span>~ 2.000.000đ</span>
                          </div>
                          <Button
                            type="primary"
                            size="large"
                            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 border-none shadow-lg"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      </motion.div>
                    </Card3D>
                  </div>
                </div>
              </div>
            </motion.div>
          </Card3D>
        </div>
      </section>
    </Layout>
  );
};

export default StudioBookingPage;
