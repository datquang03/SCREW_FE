// src/pages/Equipment/EquipmentListPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Skeleton,
  Button,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Space,
  Empty,
  Modal,
  Divider,
  Progress,
} from "antd";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Section from "../../components/common/Section";
import {
  getAvailableEquipment,
  clearEquipmentError,
} from "../../features/equipment/equipmentSlice";

const { Title, Text } = Typography;
const { Option } = Select;

export default function EquipmentListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { availableEquipments, loading, error } = useSelector(
    (state) => state.equipment
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    dispatch(getAvailableEquipment());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearEquipmentError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Filter & Sort
  const filteredAndSortedEquipments = useMemo(() => {
    let filtered = [...availableEquipments];

    if (searchTerm) {
      filtered = filtered.filter((equip) =>
        equip.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [availableEquipments, searchTerm, sortBy]);

  const visibleEquipments = filteredAndSortedEquipments.slice(0, visibleCount);
  const totalFiltered = filteredAndSortedEquipments.length;

  const handleViewMore = () =>
    setVisibleCount((prev) => Math.min(prev + 6, totalFiltered));

  const handleCardClick = (equip) => {
    setSelectedEquipment(equip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Hàm giả lập progress hợp lý (vì không có totalQty)
  const getStockStatus = (qty) => {
    if (qty >= 10) return { percent: 90, color: "#52c41a", text: "Còn rất nhiều" };
    if (qty >= 7) return { percent: 70, color: "#13c2c2", text: "Còn nhiều" };
    if (qty >= 4) return { percent: 50, color: "#faad14", text: "Còn hàng" };
    if (qty >= 2) return { percent: 25, color: "#ff4d4f", text: "Sắp hết" };
    if (qty === 1) return { percent: 10, color: "#f5222d", text: "Chỉ còn 1!" };
    return { percent: 0, color: "#d9d9d9", text: "Hết hàng" };
  };

  return (
    <>
      <Section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <Title level={1} className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Danh sách thiết bị thuê
            </Title>
          </motion.div>

          {/* Search & Sort */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Input
                placeholder="Tìm kiếm thiết bị..."
                prefix={<FiSearch className="text-gray-400" />}
                size="large"
                allowClear
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(6);
                }}
                className="flex-1 rounded-xl shadow-sm border-amber-100 focus:border-amber-400"
              />
              <Select
                placeholder="Sắp xếp"
                size="large"
                value={sortBy}
                onChange={(v) => {
                  setSortBy(v);
                  setVisibleCount(6);
                }}
                className="w-full sm:w-[200px] rounded-xl border-amber-100"
              >
                <Option value="default">Mặc định</Option>
                <Option value="price-asc">Giá thấp nhất</Option>
                <Option value="price-desc">Giá cao nhất</Option>
                <Option value="name-asc">Tên A → Z</Option>
              </Select>
            </div>
          </motion.div>

          {/* Loading */}
          {loading ? (
            <Row gutter={[16, 24]} className="!mx-0">
              {[...Array(6)].map((_, i) => (
                <Col xs={24} sm={12} md={12} lg={8} xl={8} key={i} className="!px-2">
                  <Card className="rounded-2xl overflow-hidden shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] border border-amber-100 h-full">
                    <Skeleton.Image className="w-full h-64" />
                    <Skeleton active paragraph={{ rows: 3 }} className="p-5" />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : totalFiltered === 0 ? (
            <Empty description="Không tìm thấy thiết bị nào" className="py-20" />
          ) : (
            <>
              <Row gutter={[16, 24]} className="!mx-0">
                {visibleEquipments.map((equip, index) => {
                  const stock = getStockStatus(equip.availableQty || 0);

                  return (
                    <Col xs={24} sm={12} md={12} lg={8} xl={8} key={equip._id} className="!px-2">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                      >
                        <Card
                          hoverable
                          onClick={() => handleCardClick(equip)}
                          className="h-full rounded-2xl overflow-hidden shadow-[0_12px_35px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer group border border-amber-100 bg-white flex flex-col"
                          styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' } }}
                          cover={
                            <div className="relative h-64 bg-gray-100 overflow-hidden flex-shrink-0">
                              {equip.image ? (
                                <img
                                  src={equip.image}
                                  alt={equip.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-50">
                                  <div className="w-24 h-24 bg-amber-200 border-2 border-amber-300 border-dashed rounded-xl" />
                                </div>
                              )}
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-black/70 backdrop-blur-sm border border-white/20">
                                  Còn {equip.availableQty}
                                </span>
                              </div>
                            </div>
                          }
                        >
                          <div className="flex flex-col h-full">
                            <Title level={4} className="!mb-2 !text-lg line-clamp-2 font-bold text-gray-900 min-h-[56px]">
                              {equip.name}
                            </Title>
                            <Text className="text-gray-600 text-sm line-clamp-2 block mb-4 flex-shrink-0 min-h-[40px]">
                              {equip.description || "Không có mô tả"}
                            </Text>

                            <div className="mb-4 flex-shrink-0">
                              <Progress
                                percent={stock.percent}
                                strokeColor={stock.color}
                                showInfo={false}
                                size="small"
                                className="!mb-1"
                              />
                              <Text className="text-xs text-gray-500">{stock.text}</Text>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                              <div className="flex justify-between items-end">
                                <div>
                                  <Text className="text-2xl font-bold text-amber-600">
                                    {formatPrice(equip.pricePerHour)}
                                  </Text>
                                  <Text className="text-gray-500 text-sm block">/ giờ</Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>

              {visibleCount < totalFiltered && (
                <div className="text-center mt-16">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleViewMore}
                    className="px-12 py-6 text-lg font-medium rounded-xl shadow-lg"
                  >
                    Xem thêm ({totalFiltered - visibleCount} thiết bị nữa)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>

      {/* ==================== MODAL CHI TIẾT ==================== */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
        centered
        destroyOnClose
        maskClosable={true}
        className="rounded-2xl"
      >
        {selectedEquipment && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ảnh */}
            <div className="lg:w-1/2">
              {selectedEquipment.image ? (
                <img
                  src={selectedEquipment.image}
                  alt={selectedEquipment.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-96 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">Không có ảnh</span>
                </div>
              )}
            </div>

            {/* Nội dung */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="space-y-6">
                <div>
                  <Title level={2} className="!mb-2 !text-3xl font-bold text-gray-900">
                    {selectedEquipment.name}
                  </Title>
                  <Text className="text-gray-600 text-base leading-relaxed block">
                    {selectedEquipment.description || "Không có mô tả chi tiết."}
                  </Text>
                </div>

                <Divider className="!my-6" />

                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <Text className="text-sm font-semibold text-gray-600 block mb-2">
                      Số lượng còn lại
                    </Text>
                    <Title level={3} className="!mb-0 !text-4xl font-extrabold text-green-600">
                      {selectedEquipment.availableQty} thiết bị
                    </Title>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Text className="text-sm font-semibold text-gray-600 block mb-3">
                      Tình trạng tồn kho
                    </Text>
                    <Progress
                      percent={getStockStatus(selectedEquipment.availableQty).percent}
                      strokeColor={getStockStatus(selectedEquipment.availableQty).color}
                      size="large"
                      className="!mb-2"
                    />
                    <Text className="text-sm font-medium text-gray-700">
                      {getStockStatus(selectedEquipment.availableQty).text}
                    </Text>
                  </div>

                  {/* Highlight giá */}
                  <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-4 border-amber-300 shadow-[0_8px_30px_rgba(251,191,36,0.3)]">
                    <Text className="text-sm font-semibold text-amber-700 block mb-2 uppercase tracking-wide">
                      Giá thuê
                    </Text>
                    <div className="flex items-baseline gap-2">
                      <Title level={1} className="!mb-0 !text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                        {formatPrice(selectedEquipment.pricePerHour)}
                      </Title>
                      <Text className="text-xl text-amber-700 font-semibold">/ giờ</Text>
                    </div>
                    <Text className="text-xs text-amber-600 mt-2 block">
                      Giá cơ bản, chưa bao gồm phụ phí (nếu có)
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}