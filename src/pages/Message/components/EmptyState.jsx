// src/pages/Message/components/EmptyState.jsx
import { MessageOutlined } from "@ant-design/icons";

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center text-gray-400">
    <div className="text-center">
      <MessageOutlined className="text-6xl mb-4 opacity-20" />
      <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
    </div>
  </div>
);

export default EmptyState;