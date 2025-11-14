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
} from "antd";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Layout from "../../components/layout/Layout";
import Section from "../../components/common/Section";
import {
  getAvailableEquipment,
  clearEquipmentError,
} from "../../features/equipment/equipmentSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const EquipmentListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { equipments, loading, error } = useSelector(
    (state) => state.equipment
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    dispatch(getAvailableEquipment());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearEquipmentError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const filteredAndSortedEquipments = useMemo(() => {
    let filtered = [...equipments];

    // Search
    if (searchTerm) {
      filtered = filtered.filter((equip) =>
        equip.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
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
  }, [equipments, searchTerm, sortBy]);

  const visibleEquipments = filteredAndSortedEquipments.slice(0, visibleCount);
  const totalFiltered = filteredAndSortedEquipments.length;

  const handleViewMore = () =>
    setVisibleCount((prev) => Math.min(prev + 6, totalFiltered));
  const handleCardClick = (id) => navigate(`/equipment/${id}`);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <Layout>
      <Section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Title
              level={1}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Danh sách thiết bị
            </Title>
          </div>

          {/* Search + Sort */}
          <div className="max-w-6xl mx-auto mb-10 gap-10 flex flex-col md:flex-row">
            <Space className="w-full" wrap>
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
                className="rounded-lg flex-1"
              />
              <Select
                placeholder="Sắp xếp theo"
                size="large"
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setVisibleCount(6);
                }}
                className="rounded-lg min-w-[180px]"
              >
                <Option value="default">Tất cả</Option>
                <Option value="price-asc">Giá: Thấp → Cao</Option>
                <Option value="price-desc">Giá: Cao → Thấp</Option>
                <Option value="name-asc">Tên: A → Z</Option>
                <Option value="name-desc">Tên: Z → A</Option>
              </Select>
            </Space>
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error.message || "Không thể tải thiết bị"}
            </div>
          )}

          {loading ? (
            <Row gutter={[24, 32]}>
              {[...Array(6)].map((_, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <Card className="h-full rounded-2xl overflow-hidden">
                    <Skeleton.Image className="w-full h-56 !rounded-t-2xl" />
                    <Skeleton active paragraph={{ rows: 3 }} className="p-5" />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : totalFiltered === 0 ? (
            <Empty
              description="Không tìm thấy thiết bị phù hợp"
              className="py-20"
            />
          ) : (
            <>
              <Row gutter={[24, 32]}>
                {visibleEquipments.map((equip, index) => {
                  const progress = (
                    (equip.availableQty / equip.totalQty) *
                    100
                  ).toFixed(0);

                  return (
                    <Col xs={24} sm={12} lg={8} key={equip._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Card
                          hoverable
                          onClick={() => handleCardClick(equip._id)}
                          className="h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer group"
                          cover={
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                              {equip.image ? (
                                <img
                                  alt={equip.name}
                                  src={equip.image}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="p-5">
                            <Title
                              level={4}
                              className="mb-2 text-lg font-bold text-gray-900 line-clamp-1"
                            >
                              {equip.name}
                            </Title>

                            {equip.description && (
                              <Text className="text-gray-600 text-sm block mb-3 line-clamp-2">
                                {equip.description}
                              </Text>
                            )}

                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Còn lại</span>
                                <span>
                                  {equip.availableQty} / {equip.totalQty}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    progress > 70
                                      ? "bg-green-500"
                                      : progress > 30
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <Text strong className="text-lg text-blue-600">
                                {formatPrice(equip.pricePerHour)}{" "}
                                <span className="text-xs">/ giờ</span>
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>

              {visibleCount < totalFiltered && (
                <div className="text-center mt-12">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleViewMore}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
                  >
                    Xem thêm ({totalFiltered - visibleCount} thiết bị)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>
    </Layout>
  );
};

export default EquipmentListPage;
