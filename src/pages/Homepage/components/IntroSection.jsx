import React from "react";
import { Button } from "antd";

const IntroSection = () => {
  return (
    <>
      {/* HERO SECTION - Navy Background */}
      <div className="relative min-h-[420px] flex flex-col justify-center items-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80"
          alt="studio-bg"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-30"
          style={{ filter: 'brightness(0.55)' }}
        />
        <div className="absolute inset-0 bg-[#0F172A] z-0" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-16 md:py-24 lg:py-28">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight break-words">
            Tìm không gian sáng tạo lý tưởng cho bạn
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-2 font-normal">
            Đặt studio chụp ảnh, thu âm, quay phim chuyên nghiệp chỉ trong vài giây cùng S Cộng Studio.
          </p>
        </div>
      </div>
      <div className="bg-[#FCFBFA] py-24 mx-2 md:mx-6 lg:mx-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* LEFT: TEXT & CTA */}
            <div className="space-y-6">
              <p className="text-xs font-semibold text-[#C5A267] uppercase tracking-[0.3em] mb-4">KHÁM PHÁ</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0F172A] mb-2 leading-tight">
                Khám phá cùng  <span className="text-[#C5A267]">S Cộng Studio</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-6 max-w-xl">
                Đăng không gian studio của bạn lên S Cộng để kết nối với hàng ngàn khách hàng sáng tạo tại thành phố của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: '#A0826D', borderColor: '#A0826D', color: 'white' }}
                  className="px-8 h-12 text-base font-semibold shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] uppercase tracking-[0.2em] hover:!bg-[#8B7355] hover:!border-[#8B7355]"
                  onClick={() => (window.location.href = "/studio")}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8B7355'; e.currentTarget.style.borderColor = '#8B7355'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#A0826D'; e.currentTarget.style.borderColor = '#A0826D'; }}
                >
                  Tìm Studio
                </Button>
                <Button
                  size="large"
                  style={{ borderColor: '#A0826D', color: '#A0826D', backgroundColor: 'white' }}
                  className="px-8 h-12 text-base font-semibold uppercase tracking-[0.2em]"
                  onClick={() => (window.location.href = "/set-designs")}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#A0826D'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#A0826D'; }}
                >
                  Tìm Set Design
                </Button>
              </div>
            </div>
            {/* RIGHT: IMAGE GRID - Executive */}
            <div className="grid grid-cols-2 grid-rows-3 gap-3 sm:gap-4 h-full">
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="studio1" className="object-cover w-full h-28 sm:h-32 md:h-36 lg:h-40 col-span-2 row-span-1 border border-slate-100 transition-all duration-500" />
              <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" alt="studio2" className="object-cover w-full h-28 sm:h-32 md:h-36 lg:h-40 col-span-1 row-span-2 border border-slate-100 transition-all duration-500" />
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="studio3" className="object-cover w-full h-28 sm:h-32 md:h-36 lg:h-40 col-span-1 row-span-1 border border-slate-100 transition-all duration-500" />
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="studio4" className="object-cover w-full h-28 sm:h-32 md:h-36 lg:h-40 col-span-2 row-span-1 border border-slate-100 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroSection;
