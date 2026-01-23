import React from "react";
import { Typography, Image } from "antd";
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
  return (
    <Section
      className="relative bg-[#FCFBFA] py-24 px-4 md:px-6 lg:px-16"
      title="Không gian Studio"
      subtitle="Xem qua các studio và thiết bị có sẵn tại S+ Studio"
    >
      <p className="text-xs font-semibold text-[#C5A267] uppercase tracking-[0.3em] text-center mb-6">GALLERY</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden aspect-square bg-slate-100 border border-slate-100 hover:border-[#C5A267] transition-all duration-300 group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-500"
              preview={false}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent">
              <Title level={5} className="text-white mb-0 text-sm font-semibold uppercase tracking-[0.2em]">
                {image.title}
              </Title>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default GallerySection;

