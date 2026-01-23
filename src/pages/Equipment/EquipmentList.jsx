import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Skeleton,
  Button,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Empty,
  Modal,
  Divider,
  Progress,
  Tag,
} from "antd";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import {
  CalendarOutlined,
  InfoCircleOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import Section from "../../components/common/Section";
import {
  getAvailableEquipment,
  clearEquipmentError,
} from "../../features/equipment/equipmentSlice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function EquipmentListPage() {
  const dispatch = useDispatch();
  const { availableEquipments = [], loading, error } = useSelector(
    (state) => state.equipment
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    dispatch(getAvailableEquipment());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearEquipmentError()), 4000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const filteredEquipments = useMemo(() => {
    let data = [...availableEquipments];

    if (searchTerm) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        data.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-desc":
        data.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "name-asc":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return data;
  }, [availableEquipments, searchTerm, sortBy]);

  const visibleEquipments = filteredEquipments.slice(0, visibleCount);

  const getStockPercent = (available, total) =>
    total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className="bg-[#FCFBFA] min-h-screen selection:bg-[#C5A267]/20">
      <Section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* EXECUTIVE HEADER */}
          <div className="text-center mb-20 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C5A267] font-bold">
              Luxe Equipment Rental
            </p>
            <Title
              level={1}
              className="!text-5xl md:!text-6xl !font-semibold !text-[#0F172A] !mb-0"
            >
              Danh sách thiết bị thuê
            </Title>
            <div className="h-px w-24 bg-[#C5A267] mx-auto mt-8 opacity-40"></div>
          </div>

          {/* REFINED SEARCH & SORT */}
          <div className="max-w-5xl mx-auto mb-20 flex flex-col md:flex-row gap-6 p-2 bg-white border border-slate-100 shadow-sm">
            <Input
              size="large"
              allowClear
              prefix={<FiSearch className="text-slate-400" />}
              placeholder="TÌM KIẾM THEO TÊN THIẾT BỊ..."
              value={searchTerm}
              className="!border-none !shadow-none !text-[10px] !uppercase !tracking-widest !font-bold flex-1 !h-14"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(6);
              }}
            />
            <div className="w-px h-10 bg-slate-100 hidden md:block self-center"></div>
            <Select
              size="large"
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setVisibleCount(6);
              }}
              className="md:w-[240px] !border-none custom-select-luxury"
              variant="borderless"
            >
              <Option value="default">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Mặc định
                </span>
              </Option>
              <Option value="price-asc">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Giá thấp → cao
                </span>
              </Option>
              <Option value="price-desc">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Giá cao → thấp
                </span>
              </Option>
              <Option value="name-asc">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Tên A → Z
                </span>
              </Option>
            </Select>
          </div>

          {/* LISTING GRID */}
          {loading ? (
            <Row gutter={[32, 48]}>
              {[...Array(6)].map((_, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <div className="bg-white border border-slate-100 p-4 h-[500px]">
                    <Skeleton active paragraph={{ rows: 6 }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : filteredEquipments.length === 0 ? (
            <Empty
              description={
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Không tìm thấy thiết bị nào phù hợp
                </span>
              }
            />
          ) : (
            <>
              <Row gutter={[32, 64]}>
                {visibleEquipments.map((equip, index) => {
                  const stockPercent = getStockPercent(
                    equip.availableQty,
                    equip.totalQty
                  );
                  return (
                    <Col xs={24} sm={12} lg={8} key={equip._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: (index % 3) * 0.1,
                        }}
                        viewport={{ once: true }}
                      >
                        <div
                          onClick={() => {
                            setSelectedEquipment(equip);
                            setIsModalOpen(true);
                          }}
                          className="group cursor-pointer bg-white border border-slate-100 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden"
                        >
                          <div className="aspect-[4/5] overflow-hidden transition-all duration-1000">
                            <img
                              src={equip.image}
                              alt={equip.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                          </div>
                          <div className="p-8 space-y-6">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-2xl text-[#0F172A] leading-tight group-hover:text-[#C5A267] transition-colors">
                                {equip.name}
                              </h3>
                              <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed h-10">
                                {equip.description}
                              </p>
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-300">
                                  Tính khả dụng
                                </span>
                                <span className="text-[9px] font-bold text-[#C5A267] uppercase tracking-widest">
                                  {equip.availableQty} Sẵn sàng
                                </span>
                              </div>
                              <Progress
                                percent={stockPercent}
                                showInfo={false}
                                strokeColor="#C5A267"
                                trailColor="#F8F9FA"
                                size={[null, 2]}
                                className="m-0"
                              />
                              <div className="flex flex-wrap gap-2 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] uppercase tracking-widest font-bold border border-slate-100 px-2 py-1">
                                  TỔNG: {equip.totalQty}
                                </span>
                                <span className="text-[8px] uppercase tracking-widest font-bold border border-slate-100 px-2 py-1 text-blue-400">
                                  DÙNG: {equip.inUseQty}
                                </span>
                                {equip.maintenanceQty > 0 && (
                                  <span className="text-[8px] uppercase tracking-widest font-bold border border-rose-50 px-2 py-1 text-rose-300">
                                    BẢO TRÌ: {equip.maintenanceQty}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-slate-300 font-bold mb-1">
                                  Chi phí niêm yết
                                </p>
                                <span className="text-xl font-light text-[#0F172A]">
                                  {formatPrice(equip.pricePerHour)}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#C5A267]">
                                / giờ
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>

              {visibleCount < filteredEquipments.length && (
                <div className="text-center mt-24">
                  <Button
                    onClick={() =>
                      setVisibleCount((p) =>
                        Math.min(p + 6, filteredEquipments.length)
                      )
                    }
                    className="!h-16 !px-16 !bg-[#0F172A] hover:!bg-[#C5A267] !text-white !rounded-none !border-none !shadow-2xl !text-[10px] !uppercase !tracking-[0.3em] !font-bold transition-all duration-500"
                  >
                    Xem thêm danh mục
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>

      {/* EXECUTIVE DETAIL MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        centered
        className="executive-modal"
      >
        {selectedEquipment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={selectedEquipment.image}
                alt={selectedEquipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A267] font-bold mb-4">
                  Thông số thiết bị
                </p>
                <Title
                  level={2}
                  className="!text-4xl !font-semibold !text-[#0F172A] !m-0"
                >
                  {selectedEquipment.name}
                </Title>
              </div>

              <Paragraph className="text-slate-400 text-sm font-light leading-relaxed">
                {selectedEquipment.description}
              </Paragraph>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <LayoutOutlined className="text-[#C5A267]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    Dữ liệu kho vận
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-300 block mb-1">
                      Tổng thiết bị
                    </span>
                    <span className="text-sm font-bold text-[#0F172A]">
                      {selectedEquipment.totalQty}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A267] block mb-1">
                      Đang sẵn sàng
                    </span>
                    <span className="text-sm font-bold text-[#C5A267]">
                      {selectedEquipment.availableQty}
                    </span>
                  </div>
                </div>
                <Progress
                  percent={getStockPercent(
                    selectedEquipment.availableQty,
                    selectedEquipment.totalQty
                  )}
                  showInfo={false}
                  strokeColor="#C5A267"
                  size={[null, 2]}
                />
              </div>

              <div className="pt-10 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                    Giá thuê đặc quyền
                  </span>
                  <Title
                    level={1}
                    className="!text-[#0F172A] !m-0 !font-light !text-4xl"
                  >
                    {formatPrice(selectedEquipment.pricePerHour)}{" "}
                    <span className="text-sm text-[#C5A267]">/ giờ</span>
                  </Title>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
