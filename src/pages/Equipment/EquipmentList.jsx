// src/pages/Equipment/EquipmentListPage.jsx
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
import Section from "../../components/common/Section";
import {
  getAvailableEquipment,
  clearEquipmentError,
} from "../../features/equipment/equipmentSlice";

const { Title, Text } = Typography;
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
    <>
      <Section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 pb-32">
        <div className="container mx-auto px-4">
          <Title level={1} className="text-center mb-12 font-extrabold">
            Danh sách thiết bị thuê
          </Title>

          {/* Search & Sort */}
          <div className="max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row gap-4">
            <Input
              size="large"
              allowClear
              prefix={<FiSearch />}
              placeholder="Tìm kiếm thiết bị..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(6);
              }}
            />
            <Select
              size="large"
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setVisibleCount(6);
              }}
              className="sm:w-[200px]"
            >
              <Option value="default">Mặc định</Option>
              <Option value="price-asc">Giá thấp → cao</Option>
              <Option value="price-desc">Giá cao → thấp</Option>
              <Option value="name-asc">Tên A → Z</Option>
            </Select>
          </div>

          {/* ===== LOADING SKELETON ===== */}
          {loading ? (
            <Row gutter={[16, 24]}>
              {[...Array(6)].map((_, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <Card className="rounded-2xl h-[520px]">
                    <Skeleton.Image className="w-full h-[220px] rounded-xl" />
                    <Skeleton active paragraph={{ rows: 4 }} className="mt-4" />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : filteredEquipments.length === 0 ? (
            <Empty description="Không tìm thấy thiết bị nào" />
          ) : (
            <>
              <Row gutter={[16, 24]}>
                {visibleEquipments.map((equip, index) => {
                  const stockPercent = getStockPercent(
                    equip.availableQty,
                    equip.totalQty
                  );

                  return (
                    <Col xs={24} sm={12} lg={8} key={equip._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="h-full"
                      >
                        <Card
                          hoverable
                          onClick={() => {
                            setSelectedEquipment(equip);
                            setIsModalOpen(true);
                          }}
                          className="h-[520px] rounded-2xl flex flex-col"
                          styles={{
                            body: {
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                            },
                          }}
                          cover={
                            <div className="h-[220px] overflow-hidden">
                              <img
                                src={equip.image}
                                alt={equip.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          }
                        >
                          {/* CONTENT */}
                          <Title level={4} className="mb-1 line-clamp-2">
                            {equip.name}
                          </Title>
                          <Text className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {equip.description}
                          </Text>

                          {/* STOCK */}
                          <Progress percent={stockPercent} size="small" />
                          <div className="flex flex-wrap gap-2 text-xs mt-2">
                            <Tag color="green">
                              Còn: {equip.availableQty}
                            </Tag>
                            <Tag color="blue">Tổng: {equip.totalQty}</Tag>
                            <Tag color="orange">
                              Đang dùng: {equip.inUseQty}
                            </Tag>
                            {equip.maintenanceQty > 0 && (
                              <Tag color="red">
                                Bảo trì: {equip.maintenanceQty}
                              </Tag>
                            )}
                          </div>

                          {/* PRICE */}
                          <div className="mt-auto pt-4 border-t">
                            <Text className="text-2xl font-bold text-amber-600">
                              {formatPrice(equip.pricePerHour)}
                            </Text>
                            <Text className="block text-sm text-gray-500">
                              / giờ
                            </Text>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>

              {visibleCount < filteredEquipments.length && (
                <div className="text-center mt-16">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() =>
                      setVisibleCount((p) =>
                        Math.min(p + 6, filteredEquipments.length)
                      )
                    }
                  >
                    Xem thêm
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>

      {/* ================= MODAL CHI TIẾT ================= */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        centered
      >
        {selectedEquipment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <img
              src={selectedEquipment.image}
              alt={selectedEquipment.name}
              className="w-full h-[360px] object-cover rounded-xl"
            />

            <div>
              <Title level={2}>{selectedEquipment.name}</Title>
              <Text>{selectedEquipment.description}</Text>

              <Divider />

              <Progress
                percent={getStockPercent(
                  selectedEquipment.availableQty,
                  selectedEquipment.totalQty
                )}
              />

              <div className="flex flex-wrap gap-3 mt-4">
                <Tag color="blue">Tổng: {selectedEquipment.totalQty}</Tag>
                <Tag color="green">
                  Còn: {selectedEquipment.availableQty}
                </Tag>
                <Tag color="orange">
                  Đang dùng: {selectedEquipment.inUseQty}
                </Tag>
                <Tag color="red">
                  Bảo trì: {selectedEquipment.maintenanceQty}
                </Tag>
              </div>

              <Divider />

              <Title level={1} className="text-amber-600">
                {formatPrice(selectedEquipment.pricePerHour)} / giờ
              </Title>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
