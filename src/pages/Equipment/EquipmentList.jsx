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
                  <div className="bg-white border border-slate-100 p-4 h-[260px] rounded-md">
                    <Skeleton.Image style={{ width: '100%', height: 100, marginBottom: 16 }} active />
                    <Skeleton active paragraph={{ rows: 3 }} title={false} />
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
              <Row gutter={[24, 32]} justify="start">
                {visibleEquipments.map((equip, index) => {
                  const stockPercent = getStockPercent(
                    equip.availableQty,
                    equip.totalQty
                  );
                  let status = '';
                  let statusColor = '';
                  if (equip.availableQty === 0) {
                    status = 'Hết hàng';
                    statusColor = 'red';
                  } else if (equip.availableQty <= 2) {
                    status = 'Sắp hết';
                    statusColor = 'orange';
                  } else {
                    status = 'Sẵn sàng';
                    statusColor = 'green';
                  }
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={equip._id}>
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
                          className="group cursor-pointer bg-white border border-slate-100 transition-all duration-700 hover:shadow-xl rounded-xl overflow-hidden flex flex-col h-full relative"
                          style={{ minHeight: 370, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)' }}
                        >
                          <div className="w-full h-40 bg-slate-50 flex items-center justify-center overflow-hidden">
                            <img
                              src={equip.image}
                              alt={equip.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                              style={{ maxHeight: 160, objectFit: 'cover' }}
                            />
                          </div>
                          <div className="absolute left-4 top-4 z-10">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full bg-${statusColor}-100 text-${statusColor}-600 uppercase tracking-widest shadow-sm`}>
                              {status}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col justify-between p-5">
                            <div>
                              <h3 className="font-bold text-lg text-[#0F172A] mb-1 group-hover:text-[#C5A267] transition-colors">
                                {equip.name}
                              </h3>
                              <p className="text-sm text-slate-400 font-light line-clamp-2 mb-3 min-h-[32px]">
                                {equip.description}
                              </p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tình trạng</span>
                                <span className={`text-[11px] font-bold uppercase tracking-widest text-${statusColor}-600`}>{equip.availableQty} Sẵn sàng</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded">Tổng: {equip.totalQty}</span>
                                <span className="text-[10px] font-bold text-blue-400 border border-slate-100 px-2 py-0.5 rounded">Dùng: {equip.inUseQty}</span>
                                {equip.maintenanceQty > 0 && (
                                  <span className="text-[10px] font-bold text-rose-400 border border-rose-100 px-2 py-0.5 rounded">Bảo trì: {equip.maintenanceQty}</span>
                                )}
                              </div>
                              <Progress
                                percent={stockPercent}
                                showInfo={false}
                                strokeColor="#C5A267"
                                trailColor="#F8F9FA"
                                size={[null, 2]}
                                className="m-0 mb-2"
                              />
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chi phí niêm yết</span>
                                <span className="text-base font-bold text-[#0F172A]">{formatPrice(equip.pricePerHour)}</span>
                                <span className="text-[11px] text-[#C5A267] font-bold">/ giờ</span>
                              </div>
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
        width={900}
        centered
        className="executive-modal"
        bodyStyle={{ borderRadius: 32, padding: 0, background: '#fff' }}
        style={{ borderRadius: 32, overflow: 'hidden', background: 'transparent' }}
      >
        {selectedEquipment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ borderRadius: 32, overflow: 'hidden' }}>
            {/* Ảnh lớn bên trái */}
            <div className="bg-[#181A1B] flex items-center justify-center" style={{ borderTopLeftRadius: 32, borderBottomLeftRadius: 32, minHeight: 420 }}>
              <img
                src={selectedEquipment.image}
                alt={selectedEquipment.name}
                className="object-contain w-full h-full max-h-[420px]"
                style={{ borderTopLeftRadius: 32, borderBottomLeftRadius: 32, background: '#181A1B' }}
              />
            </div>
            {/* Nội dung bên phải */}
            <div className="flex flex-col justify-between p-10 bg-white" style={{ borderTopRightRadius: 32, borderBottomRightRadius: 32, minHeight: 420 }}>
              <div>
                <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A267] font-bold mb-4">Thông số thiết bị</p>
                <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">{selectedEquipment.name}</h2>
                <p className="text-base text-slate-500 mb-6 leading-relaxed">{selectedEquipment.description}</p>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <LayoutOutlined className="text-[#C5A267] text-lg" />
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Dữ liệu kho vận</span>
                  </div>
                  <div className="flex gap-8 mb-2">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-slate-300 block mb-1">Tổng thiết bị</span>
                      <span className="text-xl font-bold text-[#0F172A]">{selectedEquipment.totalQty}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#C5A267] block mb-1">Đang sẵn sàng</span>
                      <span className="text-xl font-bold text-[#C5A267]">{selectedEquipment.availableQty}</span>
                    </div>
                  </div>
                  <Progress
                    percent={getStockPercent(selectedEquipment.availableQty, selectedEquipment.totalQty)}
                    showInfo={false}
                    strokeColor="#C5A267"
                    size={[null, 2]}
                    className="mb-2"
                  />
                </div>
              </div>
              <div className="flex items-end justify-between mt-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-2">Giá thuê đặc quyền</span>
                  <span className="text-3xl font-extrabold text-[#0F172A]">{formatPrice(selectedEquipment.pricePerHour)}</span>
                  <span className="text-base text-[#C5A267] font-bold ml-2">/ giờ</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
