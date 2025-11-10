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
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 px-4 md:px-6 lg:px-16 overflow-hidden"
      title="Không gian Studio"
      subtitle="Xem qua các studio và thiết bị có sẵn tại S+ Studio"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.1) 10px, rgba(234, 179, 8, 0.1) 20px)'
        }} />
      </div>
      
      <div className="relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, z: 50 }}
            className="relative overflow-hidden rounded-2xl aspect-square cursor-pointer group"
          >
            {/* Image with fallback placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
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
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Placeholder when image fails */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-center text-white/60">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="text-sm font-medium">{image.title}</p>
                  <p className="text-xs text-white/40 mt-1">Thêm hình ảnh</p>
                </div>
              </div>
            </div>
            
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <Title level={5} className="text-white mb-0 text-sm font-bold">
                  {image.title}
                </Title>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </Section>
  );
};

export default GallerySection;

