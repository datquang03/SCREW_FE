import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";


const SDGallery = React.memo(({ images = [] }) => {
const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);


if (!images || images.length === 0) {
return (
<div className="w-full rounded-lg overflow-hidden">
<div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">Không có hình ảnh</div>
</div>
);
}


  return (
    <div className="space-y-3">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
      >
        {images.slice(0, 6).map((src, i) => (
          <motion.img
            key={i}
            src={src}
            loading="lazy"
            alt={`img-${i}`}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="object-cover w-full h-48 sm:h-56 rounded-xl cursor-pointer shadow-sm"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          />
        ))}
      </motion.div>

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        width={1000}
        bodyStyle={{ padding: 0, background: "#000" }}
      >
        <div className="w-full h-[80vh] flex items-center justify-center bg-black">
          <img
            src={images[index]}
            alt="lightbox"
            className="max-h-[78vh] max-w-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
});


export default SDGallery;

