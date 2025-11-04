/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NavLink, Link } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaUser, FaSignInAlt } from "react-icons/fa";
import SPlusLogo from "../../assets/S+Logo.png";

const NavbarMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const searchInputRef = useRef(null);

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- MENU ANIMATION ---
  useEffect(() => {
    const menu = menuRef.current;
    const overlay = overlayRef.current;
    if (!menu || !overlay) return;

    if (isMenuOpen) {
      gsap.to(overlay, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
      gsap.fromTo(menu, { x: "-100%" }, { x: 0, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(menu, {
        x: "-100%",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => gsap.to(overlay, { opacity: 0, pointerEvents: "none", duration: 0.2 }),
      });
    }
  }, [isMenuOpen]);

  // --- SEARCH FOCUS ---
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [isSearchOpen]);

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    const handleClick = (e) => {
      if (isMenuOpen && overlayRef.current?.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/studio", label: "Studio" },
    { path: "/equipment", label: "Dụng cụ" },
    { path: "/about", label: "Về chúng tôi" },
    { path: "/contact", label: "Liên hệ" },
  ];

  return (
    <>
      {/* MOBILE NAVBAR - FIXED + SCROLL EFFECT */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 h-[70px] transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-[#0a0f1c]/95 to-[#141414]/95 backdrop-blur-2xl shadow-2xl border-b border-slate-800/60"
            : "bg-gradient-to-r from-[#0a0f1c]/90 to-[#141414]/90 backdrop-blur-xl"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <div className="w-[110px] h-[55px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] shadow-lg">
              <div className="w-full h-full bg-[#0a0f1c] rounded-lg flex items-center justify-center">
                <img src={SPlusLogo} alt="Logo" className="w-full h-full object-cover p-1 rounded-lg" />
              </div>
            </div>
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">

            {/* SEARCH ICON */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-slate-300 hover:text-[#FBBF24] flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md border border-slate-700/50"
            >
              <FaSearch className="w-4 h-4" />
              {isSearchOpen && (
                <div className="absolute inset-0 rounded-xl bg-[#FBBF24]/10 animate-ping"></div>
              )}
            </button>

            {/* MENU ICON */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-slate-300 hover:text-[#FBBF24] flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md border border-slate-700/50"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEARCH INPUT - NHỎ GỌN, TRÊN NAVBAR */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-[#0a0f1c] to-[#141414] backdrop-blur-xl border-b border-slate-800/60 shadow-2xl px-4 py-3 animate-in slide-in-from-top duration-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Tìm:", searchQuery);
                setIsSearchOpen(false);
              }}
              className="flex items-center w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-xl px-4 py-3 border border-slate-700/60 shadow-inner"
            >
              <FaSearch className="text-slate-400 w-5 h-5 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="bg-transparent outline-none text-slate-200 placeholder-slate-500 flex-1 text-base font-light"
                style={{ letterSpacing: "0.4px" }}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* MENU DRAWER - HIỆN ĐẠI, NEUMORPHISM + GRADIENT */}
      <>
        <div
          ref={overlayRef}
          className="md:hidden fixed inset-0 bg-black/70 opacity-0 pointer-events-none z-40 backdrop-blur-sm"
        />

        <div
          ref={menuRef}
          className="md:hidden fixed top-0 left-0 h-full w-[300px] bg-gradient-to-br from-[#0f172a]/98 to-[#1e293b]/98 backdrop-blur-2xl z-50 shadow-2xl border-r border-slate-700/50 -translate-x-full"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="w-[100px] h-[50px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] shadow-lg">
                <div className="w-full h-full bg-[#0a0f1c] rounded-lg flex items-center justify-center">
                  <img src={SPlusLogo} alt="Logo" className="w-full h-full object-cover p-1" />
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white flex items-center justify-center backdrop-blur-md border border-slate-700/50"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="p-6 space-y-2">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-md border ${
                    isActive
                      ? "bg-gradient-to-r from-[#FBBF24]/20 to-[#FACC15]/20 text-[#FBBF24] border-[#FBBF24]/50 shadow-lg"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-[#FBBF24] border-transparent"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] opacity-0 transition-opacity" />
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 bg-gradient-to-t from-[#0a0f1c] to-transparent">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 backdrop-blur-md border border-slate-700/50 transition-all shadow-md"
            >
              <FaSignInAlt className="w-4 h-4" />
              Đăng nhập
            </Link>

            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-full py-3.5 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#EAB308] transition-all shadow-lg"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </>
    </>
  );
};

export default NavbarMobile;