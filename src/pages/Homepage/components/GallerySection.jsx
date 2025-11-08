import React, { useRef } from "react";
import { Typography, Image } from "antd";
import { motion, useInView } from "framer-motion";
import Section from "../../../components/common/Section";

const { Title } = Typography;

const galleryImages = [
  {
    id: 1,
    src: "/src/assets/room100m2(360).jpg",
    alt: "Studio 100m²",
    title: "Studio 100m²",
  },
  {
    id: 2,
    src: "/src/assets/SCONGSTUDIO.jpg",
    alt: "Studio Interior",
    title: "Không gian studio",
  },
  {
    id: 3,
    src: "/src/assets/S+Logo.png",
    alt: "Equipment Setup",
    title: "Thiết bị ánh sáng",
  },
  {
    id: 4,
    src: "/src/assets/S+Logo.png",
    alt: "Set Design",
    title: "Set design đa dạng",
  },
  {
    id: 5,
    src: "/src/assets/S+Logo.png",
    alt: "Studio Workspace",
    title: "Không gian làm việc",
  },
  {
    id: 6,
    src: "/src/assets/S+Logo.png",
    alt: "Professional Setup",
    title: "Setup chuyên nghiệp",
  },
];

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section
      ref={ref}
      className="relative bg-white py-12 md:py-16 px-4 md:px-6 lg:px-16"
      title="Thư viện ảnh"
      subtitle="Khám phá không gian và thiết bị của chúng tôi"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, z: 50 }}
            className="relative overflow-hidden rounded-2xl aspect-square cursor-pointer group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              preview={{
                mask: (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Title level={5} className="text-white mb-0">
                      {image.title}
                    </Title>
                  </div>
                ),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <Title level={5} className="text-white mb-0 text-sm">
                  {image.title}
                </Title>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default GallerySection;

