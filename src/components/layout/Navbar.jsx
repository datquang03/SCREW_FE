import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NavLink, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import SPlusLogo from "../../assets/S+Logo.png";

const Navbar = () => {
  const navRef = useRef(null);
  const navLinksRef = useRef(null);
  const centerContainerRef = useRef(null);
  const searchFormRef = useRef(null);
  const searchInputRef = useRef(null);
  const rightActionsRef = useRef(null);
  const indicatorRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (!searchFormRef.current || !navLinksRef.current || !rightActionsRef.current)
      return;
  
    if (isSearchOpen) {
      // Thu nhỏ nhẹ toàn bộ cụm nav để vẫn giữ hàng ngang
      gsap.to(navLinksRef.current, {
        duration: 0.35,
        ease: "power2.out",
        scale: 0.92,
        opacity: 0.75,
        transformOrigin: "center center",
      });
  
      gsap.to(rightActionsRef.current, {
        duration: 0.35,
        ease: "power2.out",
        opacity: 0.8,
        scale: 0.95,
      });
  
      gsap.fromTo(
        searchFormRef.current,
        { width: 0, opacity: 0 },
        {
          width: window.innerWidth < 768 ? 320 : 560,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () =>
            searchInputRef.current && searchInputRef.current.focus(),
        }
      );
    } else {
      // Khôi phục lại kích thước nav
      gsap.to(navLinksRef.current, {
        duration: 0.35,
        ease: "power2.inOut",
        scale: 1,
        opacity: 1,
        clearProps: "transform",
      });
      gsap.to(searchFormRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
      gsap.to(rightActionsRef.current, {
        duration: 0.35,
        ease: "power2.inOut",
        opacity: 1,
        scale: 1,
      });
    }
  }, [isSearchOpen]);

  // Active indicator animation between nav items (no scroll jump)
  useEffect(() => {
    if (!navLinksRef.current || !indicatorRef.current) return;
    const active = navLinksRef.current.querySelector('a.active');
    const parentRect = (centerContainerRef.current || indicatorRef.current.parentElement).getBoundingClientRect();
    if (active) {
      const rect = active.getBoundingClientRect();
      const x = rect.left - parentRect.left;
      const w = rect.width;
      gsap.to(indicatorRef.current, {
        x,
        width: w,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  });
  
  const handleSearchToggle = () => setIsSearchOpen((prev) => !prev);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav
      ref={navRef}
      className="w-full h-[90px] flex items-center justify-center overflow-x-clip bg-[#0b1220] bg-opacity-95 py-6 md:py-7 shadow-[0_10px_30px_rgba(0,0,0,0.35)] border-b border-slate-800/80 backdrop-blur-md"
    >
      <div className="w-full px-10 md:px-16 lg:px-20 flex items-center justify-between gap-6 md:gap-10">
        {/* Logo */}
        <Link
          to="/"
          className="md:ml-12 flex items-center justify-start cursor-pointer"
        >
          <div className="w-[150px] h-[80px] rounded-xl overflow-hidden flex items-center justify-center bg-[#0a0f1c] shadow-[0_0_12px_rgba(0,0,0,0.4)] ml-4">
            <img
              src={SPlusLogo}
              alt="S+ Studio Logo"
              className="w-full h-full object-cover object-center scale-[1.0] p-[2px]"
              loading="eager"
              decoding="async"
            />
          </div>
        </Link>

         {/* Nav Links + Search */}
         <div ref={centerContainerRef} className="relative flex-1 flex items-center justify-center gap-4 md:gap-8 overflow-hidden">
          <ul
            ref={navLinksRef}
             className="relative z-10 hidden md:flex items-center gap-8 lg:gap-12 text-[18px] font-semibold text-slate-200 whitespace-nowrap"
          >
            {[
              { path: "/", label: "Trang chủ" },
              { path: "/studio", label: "Studio" },
              { path: "/equipment", label: "Dụng cụ" },
              { path: "/about", label: "Về chúng tôi" },
              { path: "/contact", label: "Liên hệ" },
            ].map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `skew-x-6 inline-flex items-center justify-center rounded-xl border-2 border-transparent transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "active text-[#FBBF24] border-slate-700/70"
                        : "hover:bg-slate-800/50 hover:text-[#FBBF24] hover:border-slate-600/60 hover:shadow-[0_6px_18px_rgba(2,6,23,0.35)]"
                    }`
                }
                style={{
                  height: "60px",
                  paddingLeft: "52px",
                  paddingRight: "52px",
                }}
              >
                <span className="-skew-x-6 inline-flex items-center text-[20px]">
                  {label}
                </span>
              </NavLink>
             ))}
          </ul>
           {/* Active indicator */}
           <span
             ref={indicatorRef}
             style={{ transform: 'translateX(0)', width: 0, opacity: 0 }}
             className="pointer-events-none hidden md:block absolute z-0 top-1/2 -translate-y-1/2 left-0 h-[48px] rounded-xl border border-slate-600/40 bg-slate-800/50 shadow-[0_10px_26px_rgba(2,6,23,0.35)]"
           />

          {/* Search Form */}
          <form
            ref={searchFormRef}
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center overflow-hidden rounded-full border-2 border-slate-700/60 bg-slate-900/70 backdrop-blur px-4 ring-1 ring-transparent focus-within:ring-[#FBBF24]/30 shadow-[0_6px_20px_rgba(2,6,23,0.35)]"
            style={{ width: 0, opacity: 0 }}
          >
            <span className="ml-1.5 mr-2 inline-flex items-center justify-center w-10 h-10 text-slate-300">
              <span className="relative inline-block w-4 h-4 border-2 border-current rounded-full" />
          </span>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="bg-transparent outline-none text-slate-200 placeholder-slate-400 text-[15px] py-3.5 w-full"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div
          ref={rightActionsRef}
          className="flex items-center gap-4 md:gap-6 pr-8 md:pr-12 lg:pr-16"
        >
          {/* Search Button */}
          <button
            onClick={handleSearchToggle}
            className={`skew-x-6 hidden md:inline-flex items-center justify-center rounded-2xl border-2 text-slate-200 cursor-pointer
              bg-slate-900/70 hover:bg-slate-800/60 hover:text-[#FBBF24] hover:border-slate-600 transition-all duration-200
              ${
                isSearchOpen
                  ? "bg-slate-800/70 text-[#FBBF24] border-slate-700/70 shadow-[0_8px_24px_rgba(2,6,23,0.35)]"
                  : "shadow-[0_6px_18px_rgba(2,6,23,0.25)]"
              }`}
            style={{ height: "60px", width: "60px" }}
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
          >
            <FaSearch className="-skew-x-6 w-5 h-5" />
          </button>

          {/* Register Button */}
          <Link
            to="/register"
            className="skew-x-6 inline-flex items-center justify-center rounded-2xl font-semibold
              border-2 text-black cursor-pointer
              bg-gradient-to-r from-[#FBBF24] to-[#ffd666] hover:brightness-105 transition-all duration-200 shadow-[0_14px_34px_rgba(251,191,36,0.45)] mr-6 md:mr-10"
            style={{
              height: "60px",
              paddingLeft: "38px",
              paddingRight: "38px",
            }}
          >
            <span className="-skew-x-6 inline-block text-[15px]">Đăng ký</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
