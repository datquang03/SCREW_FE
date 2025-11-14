// src/pages/equipment/EquipmentDetailPage.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, Alert, Tag, Typography, Button, Row, Col } from "antd";
import { ArrowLeftOutlined, ToolOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Section from "../../components/common/Section";
import { getEquipmentById, clearEquipmentError } from "../../features/equipment/equipmentSlice";

const { Title, Text, Paragraph } = Typography;

const EquipmentDetailPage = () => {
  const { equipmentId } = useParams();
  const dispatch = useDispatch();
  const { currentEquipment, loading, error } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(getEquipmentById(equipmentId));
  }, [dispatch, equipmentId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearEquipmentError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <Layout>
        <Section className="py-20">
          <div className="flex justify-center">
            <Spin size="large" tip="Đang tải chi tiết thiết bị..." />
          </div>
        </Section>
      </Layout>
    );
  }

  if (error || !currentEquipment) {
    return (
      <Layout>
        <Section className="py-20">
          <Alert
            message="Không tìm thấy"
            description={error?.message || "Thiết bị không tồn tại hoặc đã bị xóa"}
            type="error"
            showIcon
          />
          <div className="text-center mt-6">
            <Link to="/equipment">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </Section>
      </Layout>
    );
  }

  const equip = currentEquipment;

  return (
    <Layout>
      <Section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-5xl">
          <Link to="/equipment" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeftOutlined className="mr-2" />
            Quay lại danh sách
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-xl rounded-2xl overflow-hidden">
              <Row gutter={[32, 32]}>
                {/* Hình ảnh */}
                <Col xs={24} md={10}>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden h-64 md:h-80 flex items-center justify-center">
                    {equip.image ? (
                      <img
                        src={equip.image}
                        alt={equip.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ToolOutlined style={{ fontSize: 80, color: "#ccc" }} />
                    )}
                  </div>
                </Col>

                {/* Thông tin */}
                <Col xs={24} md={14}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Title level={2} className="text-2xl md:text-3xl font-bold text-gray-900 mb-0">
                        {equip.name}
                      </Title>
                      <Tag color={equip.status === "active" ? "green" : "red"} className="text-sm">
                        {equip.status === "active" ? "Sẵn có" : "Bảo trì"}
                      </Tag>
                    </div>

                    <div className="space-y-3 text-gray-600">
                      {equip.code && (
                        <p>
                          <strong>Mã thiết bị:</strong> <span className="font-mono">{equip.code}</span>
                        </p>
                      )}
                      {equip.category && (
                        <p>
                          <strong>Loại:</strong>{" "}
                          {equip.category.charAt(0).toUpperCase() + equip.category.slice(1)}
                        </p>
                      )}
                      {equip.brand && (
                        <p>
                          <strong>Hãng:</strong> {equip.brand}
                        </p>
                      )}
                      {equip.serial && (
                        <p>
                          <strong>Serial:</strong> <span className="font-mono text-sm">{equip.serial}</span>
                        </p>
                      )}
                      {equip.purchaseDate && (
                        <p>
                          <strong>Ngày mua:</strong>{" "}
                          {new Date(equip.purchaseDate).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>

                    {equip.description && (
                      <>
                        <Title level={4} className="mt-6 mb-3 text-gray-800">
                          Mô tả
                        </Title>
                        <Paragraph className="text-gray-600 whitespace-pre-wrap">
                          {equip.description}
                        </Paragraph>
                      </>
                    )}

                    <div className="mt-8 pt-6 border-t">
                      <Text type="secondary" className="text-sm">
                        Cập nhật lần cuối: {new Date(equip.updatedAt).toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </div>
      </Section>
    </Layout>
  );
};

export default EquipmentDetailPage;