import { motion } from "framer-motion";

const GallerySlider = ({ images = [] }) => {
  return (
    <div className="relative w-full overflow-hidden py-10">
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {images.concat(images).map((img, i) => (
          <motion.img
            key={i}
            src={img}
            className="w-80 h-56 object-cover rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GallerySlider;
