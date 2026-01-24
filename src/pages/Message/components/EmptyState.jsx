// src/pages/Message/components/EmptyState.jsx
import { MessageOutlined } from "@ant-design/icons";

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center h-full min-h-[360px] text-slate-400 bg-[#FCFBFA]">
    <div className="text-center">
      <MessageOutlined className="text-6xl mb-4 opacity-30 text-[#C5A267]" />
      <p className="text-lg font-medium text-slate-500">
        Chọn một cuộc trò chuyện để bắt đầu
      </p>
    </div>
  </div>
);

export default EmptyState;