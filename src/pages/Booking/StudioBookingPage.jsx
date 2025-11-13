import React, { useMemo, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import {
  Button,
  Card,
  Divider,
  Radio,
  Tag,
  Tooltip,
  DatePicker,
  Avatar,
  Steps,
} from "antd";
import {
  CameraOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
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
    description:
      "Tone đen sang trọng, hệ thống đèn RGB tạo chiều sâu đầy nghệ thuật.",
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
    description: "Chuyên gia trang điểm riêng cho 2 khách, bao gồm tóc.",
    price: "800.000đ",
    icon: <CustomerServiceOutlined />,
  },
  {
    id: "lighting",
    name: "Trọn bộ Lighting Pro",
    description: "6 đèn flash Godox AD600PRO, softbox, stripbox, beauty dish.",
    price: "550.000đ",
    icon: <SafetyCertificateOutlined />,
  },
  {
    id: "props",
    name: "Gói Props Premium",
    description: "40 đạo cụ cao cấp theo concept, thay đổi linh hoạt trong buổi.",
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

const faqs = [
  {
    question: "Tôi có thể dời lịch đã đặt không?",
    answer:
      "Bạn có thể dời lịch trước 24 giờ hoàn toàn miễn phí. Trong vòng 12 giờ sẽ tính phụ phí 20% tổng đơn.",
  },
  {
    question: "Đơn đặt bao gồm bao nhiêu người?",
    answer:
      "Mỗi đơn đặt tiêu chuẩn bao gồm tối đa 6 thành viên. Từ người thứ 7 phụ thu 120.000đ/người để đảm bảo chất lượng phục vụ.",
  },
  {
    question: "Studio có hỗ trợ concept riêng?",
    answer:
      "Đội ngũ creative sẽ hỗ trợ lên moodboard và setup theo concept riêng của bạn. Vui lòng gửi brief trước tối thiểu 3 ngày.",
  },
];

const testimonials = [
  {
    name: "Linh Trần",
    role: "Fashion Stylist",
    comment:
      "Không gian tuyệt đẹp, ánh sáng tự nhiên đỉnh và đội ngũ hỗ trợ setup rất chuyên nghiệp. Khách hàng của mình cực kỳ hài lòng.",
  },
  {
    name: "Theo Nguyễn",
    role: "Commercial Photographer",
    comment:
      "Thiết bị chuẩn quốc tế, sàn studio sạch sẽ và bố trí hợp lý. Quy trình đặt lịch cực kỳ rõ ràng, tiết kiệm thời gian.",
  },
];

const keyMetrics = [
  { label: "Studio trong hệ thống", value: "08+", accent: "text-amber-500" },
  { label: "Concept tùy chỉnh", value: "32", accent: "text-pink-500" },
  { label: "Đánh giá 5⭐", value: "1.2k+", accent: "text-emerald-500" },
];

const timelineMilestones = [
  {
    title: "Chọn studio phù hợp concept",
    time: "02 phút",
  },
  {
    title: "Đặt lịch & xác nhận",
    time: "05 phút",
  },
  {
    title: "Chuẩn bị trước buổi chụp",
    time: "Tự động",
  },
];

const premiumHighlights = [
  "Đội ngũ art-director tư vấn concept trước buổi chụp.",
  "Checklist chuẩn bị gửi qua email & Zalo ngay sau khi hoàn tất.",
  "Bảo hiểm thiết bị và hỗ trợ kỹ thuật viên xuyên suốt buổi chụp.",
  "Không gian lounge cho khách nghỉ, set đồ uống signature miễn phí.",
];

const bookingPerks = [
  {
    title: "Bảo lưu lịch linh hoạt",
    description: "Thay đổi thời gian trước 24 giờ, không phụ phí.",
    icon: <ClockCircleOutlined className="text-lg text-amber-500" />,
  },
  {
    title: "Stylist đồng hành",
    description: "Stylist và makeup artist theo sát concept của bạn.",
    icon: <CustomerServiceOutlined className="text-lg text-purple-500" />,
  },
  {
    title: "Setup chuyên sâu",
    description: "Từ lighting cho tới props đều được chuẩn bị sẵn sàng.",
    icon: <SafetyCertificateOutlined className="text-lg text-emerald-500" />,
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
  const [selectedAddOns, setSelectedAddOns] = useState([addOnServices[1].id]);
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
            className="max-w-3xl space-y-6"
          >
            <Tag
              color="gold"
              className="text-xs uppercase tracking-[0.4em] bg-white/10 px-4 py-1 rounded-full border border-white/30"
            >
              Booking Experience
            </Tag>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Lên lịch chụp tại S+ Studio trong{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-300 bg-clip-text text-transparent">
                3 bước hoàn hảo
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl">
              Chọn không gian, thời gian lý tưởng và dịch vụ bổ sung chỉ trong
              vài phút. Quy trình trực quan, minh bạch chi phí và được đội ngũ
              hỗ trợ 24/7.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              {keyMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl bg-white/10 border border-white/20 px-5 py-4 backdrop-blur-sm"
                >
                  <p
                    className={`text-3xl font-bold tracking-tight ${metric.accent}`}
                  >
                    {metric.value}
                  </p>
                  <p className="text-sm text-white/70">{metric.label}</p>
                </div>
              ))}
            </motion.div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <CheckCircleOutlined className="text-emerald-400" />
                Cam kết đúng giờ
              </span>
              <span className="flex items-center gap-2">
                <SafetyCertificateOutlined className="text-amber-300" />
                Bảo hiểm thiết bị
              </span>
              <span className="flex items-center gap-2">
                <CustomerServiceOutlined className="text-purple-300" />
                Stylist đồng hành
              </span>
            </div>
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
            <div className="px-6 md:px-10 py-6 border-b border-gray-100 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
                    Quy trình đặt lịch
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-2">
                    Chỉ cần 3 bước để sẵn sàng cho buổi chụp hoàn hảo
                  </h2>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-inner">
                  <SafetyCertificateOutlined className="text-amber-400 text-xl" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                      Tư vấn 1:1
                    </p>
                    <p className="text-sm font-medium">
                      Hỗ trợ chuyên gia trong suốt quá trình
                    </p>
                  </div>
                </div>
              </div>

              <Steps
                current={1}
                responsive
                items={[
                  { title: "Chọn studio", icon: <CameraOutlined /> },
                  { title: "Chọn lịch", icon: <CalendarOutlined /> },
                  { title: "Thông tin & thanh toán", icon: <InfoCircleOutlined /> },
                ]}
              />

              <div className="grid gap-4 md:grid-cols-3">
                {timelineMilestones.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-100 bg-slate-50 px-5 py-4"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Thời lượng dự kiến:{" "}
                      <span className="font-medium text-amber-600">
                        {item.time}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 md:px-10 py-8 space-y-10">
              <div className="grid gap-6 xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                      <EnvironmentOutlined className="text-amber-500" />
                      <span className="text-base font-semibold text-gray-900">
                        Không gian nổi bật
                      </span>
                    </div>
                    <div className="px-4 md:px-6 py-5 space-y-4">
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
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            {studio.highlights.map((item) => (
                              <Tag key={item} color="gold" className="bg-amber-50">
                                {item}
                              </Tag>
                            ))}
                          </div>
                          <Divider className="my-3" />
                          <div className="flex items-center justify-between text-sm text-gray-700">
                            <span>Giá gói:</span>
                            <span className="font-semibold text-amber-600">
                              {studio.price}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                      <GiftOutlined className="text-purple-500" />
                      <span className="text-base font-semibold text-gray-900">
                        Dịch vụ bổ sung
                      </span>
                    </div>
                    <div className="px-4 md:px-6 py-5 space-y-4">
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
                            className={`w-full text-left rounded-xl border transition-all duration-300 p-4 ${
                              isActive
                                ? "border-purple-400 bg-purple-50 shadow"
                                : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/40"
                            }`}
                            style={{
                              transformStyle: "preserve-3d",
                              perspective: 1000,
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-lg text-purple-500">
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-base font-semibold text-gray-900">
                                    {item.name}
                                  </h4>
                                  {isActive && <Tag color="purple">Đã chọn</Tag>}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                                <div className="mt-3 text-sm font-medium text-purple-600">
                                  {item.price}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 text-amber-500">
                      <ClockCircleOutlined />
                      <span className="text-base font-semibold text-gray-900">
                        Chọn ngày & khung giờ
                      </span>
                    </div>
                    <div className="px-4 md:px-6 py-5 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Chọn ngày chụp
                          </p>
                          <DatePicker
                            size="large"
                            className="w-full"
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày phù hợp"
                            onChange={(date) => setSelectedDate(date)}
                          />
                        </div>
                        <Tooltip title="Giờ cao điểm: 9h-11h & 14h-16h">
                          <Tag color="gold" className="px-3 py-2 rounded-full">
                            Gợi ý: Cuối tuần nên đặt trước 5 ngày
                          </Tag>
                        </Tooltip>
                      </div>

                      <div className="space-y-5">
                        {timeSlots.map((group) => (
                          <div key={group.label}>
                            <div className="text-sm font-semibold text-gray-700 mb-2">
                              {group.label}
                            </div>
                            <Radio.Group
                              className="flex flex-wrap gap-3"
                              value={selectedSlot}
                              onChange={(e) => setSelectedSlot(e.target.value)}
                            >
                              {group.slots.map((slot) => (
                                <Radio.Button
                                  key={slot}
                                  value={slot}
                                  className="!px-4 !py-2 rounded-lg shadow-sm"
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

                  <motion.div 
                    className="rounded-2xl border border-gray-900/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      rotateY: 3,
                      rotateX: -2,
                      z: 30,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                  >
                    <div className="px-6 py-6 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                            S+ Signature Experience
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            Set up concept độc quyền theo brief của bạn
                          </h3>
                        </div>
                        <Button
                          size="large"
                          type="primary"
                          className="bg-gradient-to-r from-amber-500 to-pink-500 border-none shadow-lg"
                        >
                          Nhờ đội ngũ tư vấn
                        </Button>
                      </div>
                      <Divider className="border-white/20 my-6" />
                      <div className="flex items-center gap-6">
                        <Avatar.Group
                          maxCount={3}
                          size="large"
                          maxStyle={{
                            color: "#fff",
                            backgroundColor: "#f59e0b",
                            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          <Avatar src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" />
                          <Avatar src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg" />
                          <Avatar src="https://images.pexels.com/photos/2748530/pexels-photo-2748530.jpeg" />
                          <Avatar src="https://images.pexels.com/photos/1647636/pexels-photo-1647636.jpeg" />
                        </Avatar.Group>
                        <p className="text-sm text-white/70">
                          “Team concept của S+ luôn làm mình bất ngờ với khả năng
                          biến ý tưởng thành hiện thực chỉ trong một buổi chụp.”
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <span className="text-base font-semibold text-gray-900">
                        Trải nghiệm cao cấp
                      </span>
                    </div>
                    <div className="px-6 py-5 space-y-3 text-sm text-gray-600">
                      {premiumHighlights.map((line) => (
                        <div
                          key={line}
                          className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 border border-gray-100"
                        >
                          <CheckCircleOutlined className="text-emerald-500 mt-0.5" />
                          <p>{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
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
                          Tóm tắt đặt chỗ
                        </span>
                      </div>
                    <div className="px-5 py-5 space-y-4 text-sm text-gray-700">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Studio đã chọn
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {summaryInfo.studio.name}
                        </p>
                        <p className="text-gray-500">
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
                        <span>Khung giờ</span>
                        <Tag color="green">{selectedSlot}</Tag>
                      </div>
                      <div>
                        <span className="block mb-2">Dịch vụ thêm</span>
                        <div className="space-y-1">
                          {summaryInfo.addons.length > 0 ? (
                            summaryInfo.addons.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-gray-600"
                              >
                                <span>{item.name}</span>
                                <span className="font-medium text-gray-800">
                                  {item.price}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">
                              Chưa chọn dịch vụ thêm
                            </p>
                          )}
                        </div>
                      </div>
                      <Divider className="my-3" />
                      <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                        <span>Tổng tạm tính</span>
                        <span>~ 2.000.000đ</span>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 border-none shadow-lg hover:shadow-xl"
                      >
                        Tiếp tục nhập thông tin
                      </Button>
                      <p className="text-xs text-gray-400 text-center">
                        Bạn sẽ không bị trừ phí cho đến khi xác nhận cuối cùng.
                      </p>
                    </div>
                    </motion.div>
                  </Card3D>

                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <span className="text-base font-semibold text-gray-900">
                        Khách hàng nói gì?
                      </span>
                    </div>
                    <div className="px-5 py-5 space-y-4 text-sm text-gray-600">
                      {testimonials.map((item) => (
                        <div
                          key={item.name}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <p className="text-gray-800 font-medium mb-1">
                            {item.name} · {item.role}
                          </p>
                          <p className="text-gray-600">{item.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="px-6 py-6 border-b border-gray-100">
                  <span className="text-base font-semibold text-gray-900">
                    Câu hỏi thường gặp
                  </span>
                </div>
                <div className="px-6 py-6 grid gap-6 md:grid-cols-3">
                  {faqs.map((item) => (
                    <div key={item.question} className="space-y-2">
                      <h4 className="text-base font-semibold text-gray-900">
                        {item.question}
                      </h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </motion.div>
          </Card3D>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {bookingPerks.map((perk) => (
              <Card3D key={perk.title} intensity={10}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05,
                    z: 25,
                  }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                  viewport={{ once: true }}
                  className="h-full rounded-3xl border border-white bg-white/60 backdrop-blur shadow-[0_15px_60px_rgba(15,23,42,0.08)] p-6"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                <div className="flex items-center gap-3 mb-4">
                  {perk.icon}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {perk.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{perk.description}</p>
                </motion.div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudioBookingPage;


