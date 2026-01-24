// src/pages/Message/components/MessageHeader.jsx
const MessageHeader = ({ conversation, isTyping }) => {
  const name = conversation?.name || conversation?.receiverName || "Cuộc trò chuyện";

  return (
    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase text-[#C5A267] font-bold tracking-wider">Chat</p>
        <div className="flex items-center gap-2">
           <h2 className="text-xl font-bold text-[#0F172A]">{name}</h2>
           {isTyping && (
             <div className="flex items-center gap-1 bg-[#FCFBFA] px-2 py-1 border border-slate-200 animate-pulse">
                <span className="w-1.5 h-1.5 bg-[#C5A267] animate-bounce" style={{   animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 bg-[#C5A267] animate-bounce" style={{   animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-[#C5A267] animate-bounce" style={{   animationDelay: '0.4s' }}></span>
             </div>
           )}
        </div>
        {conversation?.bookingId && (
          <p className="text-xs text-[#10b981] font-bold mt-1">
            Booking: {conversation.bookingId}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;