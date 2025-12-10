// src/pages/Message/components/MessageHeader.jsx
const MessageHeader = ({ conversation }) => {
  const name = conversation?.name || conversation?.receiverName || "Cuộc trò chuyện";

  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase text-amber-600 font-bold">Chat</p>
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        {conversation?.bookingId && (
          <p className="text-xs text-emerald-600 font-bold mt-1">
            Booking: {conversation.bookingId}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;