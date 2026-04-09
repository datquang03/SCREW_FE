import React from "react";
import { Typography, Image } from "antd";
import Section from "../../../components/common/Section";
import image5 from "../../../assets/image5.jpg";
import image6 from "../../../assets/image6.jpg";
import image7 from "../../../assets/image7.jpg";
import image8 from "../../../assets/image8.jpg";

const { Title } = Typography;

const galleryImages = [
  {
    id: 1,
    src: image5,
    alt: "Studio 100m²",
    title: "Studio 100m²",
  },
  {
    id: 2,
    src: image6,
    alt: "Studio Interior",
    title: "Không gian studio",
  },
  {
    id: 3,
    src: image7,
    alt: "Equipment Setup",
    title: "Thiết bị ánh sáng",
  },
  {
    id: 4,
    src: image8,
    alt: "Set Design",
    title: "Set design đa dạng",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    alt: "Studio Workspace",
    title: "Không gian làm việc",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
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
      <p className="text-xs font-semibold text-[#C5A267] uppercase tracking-[0.3em] text-center mb-6">
        GALLERY
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden bg-slate-100 border border-slate-100 hover:border-[#C5A267] transition-all duration-300 group flex items-center justify-center"
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "320px",
              margin: "0 auto",
              aspectRatio: "1 / 1",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-500"
              preview={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent">
              <Title
                level={5}
                className="text-white mb-0 text-sm font-semibold uppercase tracking-[0.2em]"
              >
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
