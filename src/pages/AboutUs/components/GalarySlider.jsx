import { motion } from "framer-motion";

const GallerySlider = ({ images = [] }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-6">
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {images.concat(images).map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={`Gallery image ${i + 1}`}
            className="w-80 h-64 object-cover rounded-xl shadow-[0_8px_20px_-10px_rgba(0,0,0,0.2)] border border-amber-100"
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GallerySlider;
