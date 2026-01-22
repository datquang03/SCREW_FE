// src/pages/Message/components/MessageHeader.jsx
const MessageHeader = ({ conversation, isTyping }) => {
  const name = conversation?.name || conversation?.receiverName || "Cuộc trò chuyện";

  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase text-amber-600 font-bold">Chat</p>
        <div className="flex items-center gap-2">
           <h2 className="text-xl font-bold text-gray-900">{name}</h2>
           {isTyping && (
             <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{   animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{   animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{   animationDelay: '0.4s' }}></span>
             </div>
           )}
        </div>
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