/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import SPlusLogo from "../../assets/S+Logo.png";

const Navbar = () => {
  const navRef = useRef(null);
  const navLinksRef = useRef(null);
  const searchFormRef = useRef(null);
  const searchInputRef = useRef(null);
  const indicatorRef = useRef(null);
  const centerContainerRef = useRef(null);
  const rightActionsRef = useRef(null);
  const logoRef = useRef(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFixed, setIsFixed] = useState(false); // Chỉ kích hoạt 1 lần
  const [hasTriggered, setHasTriggered] = useState(false);

  const location = useLocation();

  // --- SCROLL DETECT: CHỈ KÍCH HOẠT 1 LẦN KHI QUA NGƯỠNG ---
  useEffect(() => {
    let ticking = false;
    const threshold = 100; // Scroll bao nhiêu px thì kích hoạt

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Chỉ kích hoạt khi scroll xuống qua ngưỡng và chưa từng fixed
          if (currentY > threshold && !hasTriggered) {
            setIsFixed(true);
            setHasTriggered(true);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasTriggered]);

  // --- ANIMATION: TRƯỢT XUỐNG MƯỢT KHI LẦN ĐẦU FIXED ---
  useEffect(() => {
    if (!isFixed || hasTriggered === false) return;

    const nav = navRef.current;
    const bg = nav.querySelector(".nav-bg");
    const logo = logoRef.current;

    const tl = gsap.timeline();

    // Bắt đầu từ trên cùng, ẩn ngoài màn hình
    gsap.set(nav, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      y: "-100%",
      height: 76,
    });

    // Trượt nhẹ xuống
    tl.to(nav, {
      y: 0,
      height: 68,
      duration: 0.7,
      ease: "power3.out",
    })
      .to(
        bg,
        {
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.98), rgba(8,8,8,0.96), rgba(12,12,12,0.94))",
          boxShadow: "0 12px 32px rgba(0,0,0,0.65)",
          duration: 0.8,
          ease: "power3.out",
        },
        0
      )
      .to(
        logo,
        {
          scale: 0.88,
          y: -1,
          duration: 0.7,
          ease: "back.out(1.5)",
        },
        0.1
      );
  }, [isFixed, hasTriggered]);

  // --- SEARCH ANIMATION ---
  useEffect(() => {
    const form = searchFormRef.current;
    const navLinks = navLinksRef.current;
    const rightActions = rightActionsRef.current;
    if (!form || !navLinks || !rightActions) return;

    if (isSearchOpen) {
      gsap.to(rightActions, { opacity: 0, scale: 0.85, duration: 0.3 });
      gsap.fromTo(
        form,
        { scaleX: 0, opacity: 0, x: 60, pointerEvents: "none" },
        {
          scaleX: 1,
          opacity: 1,
          x: 0,
          pointerEvents: "auto",
          duration: 0.55,
          ease: "back.out(1.7)",
          onStart: () => {
            form.style.display = "flex";
            form.style.position = "absolute";
          },
          onComplete: () => searchInputRef.current?.focus(),
        }
      );
      gsap.to(navLinks, { opacity: 0.15, filter: "blur(2px)", duration: 0.4 });
    } else {
      gsap.to(form, {
        scaleX: 0,
        opacity: 0,
        x: 60,
        pointerEvents: "none",
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => {
          form.style.display = "none";
        },
      });
      gsap.to(navLinks, { opacity: 1, filter: "blur(0px)", duration: 0.5 });
      gsap.to(rightActions, { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 });
    }
  }, [isSearchOpen]);

  // --- INDICATOR ---
  useEffect(() => {
    const updateIndicator = () => {
      if (!navLinksRef.current || !indicatorRef.current || !centerContainerRef.current)
        return;
      const active = navLinksRef.current.querySelector("a.active");
      if (!active) return;

      const parentRect = centerContainerRef.current.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      gsap.to(indicatorRef.current, {
        x: activeRect.left - parentRect.left,
        width: activeRect.width,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location]);

  // --- CLICK OUTSIDE & KEYBOARD ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchFormRef.current &&
        !searchFormRef.current.contains(e.target) &&
        !e.target.closest(".search-btn")
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearchToggle = () => setIsSearchOpen((prev) => !prev);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="w-full left-0 z-50"
      style={{
        position: hasTriggered ? "fixed" : "relative",
        top: 0,
        height: hasTriggered ? 68 : 76,
      }}
    >
      {/* BACKGROUND LAYER */}
      <div className="nav-bg absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.97),rgba(10,10,10,0.94),rgba(20,20,20,0.92))] backdrop-blur-[14px] -z-10" />

      {/* MAIN CONTAINER */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full relative">
        
        {/* LOGO */}
        <Link to="/" className="flex-shrink-0 z-10">
          <div
            ref={logoRef}
            className="rounded-xl overflow-hidden bg-[#0a0f1c] shadow-[0_0_15px_rgba(0,0,0,0.4)] w-[140px] h-[70px] flex items-center justify-center"
          >
            <img
              src={SPlusLogo}
              alt="S+ Studio Logo"
              className="w-full h-full object-cover p-1"
            />
          </div>
        </Link>

        {/* CENTER: NAV LINKS */}
        <div ref={centerContainerRef} className="flex-1 flex justify-center items-center px-4">
          <ul
            ref={navLinksRef}
            className="hidden md:flex items-center gap-8 lg:gap-12 text-slate-200"
          >
            {[
              { path: "/", label: "Trang chủ" },
              { path: "/studio", label: "Studio" },
              { path: "/equipment", label: "Dụng cụ" },
              { path: "/about", label: "Về chúng tôi" },
              { path: "/contact", label: "Liên hệ" },
            ].map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `relative px-6 py-3 text-base lg:text-lg font-medium transition-all duration-300 rounded-xl border-2 border-transparent flex items-center justify-center min-w-[100px] ${
                      isActive
                        ? "text-[#FBBF24]"
                        : "hover:bg-white/5 hover:text-[#FBBF24]"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            ref={indicatorRef}
            className="absolute bottom-3 left-0 h-1 bg-[#FBBF24] rounded-full shadow-lg"
            style={{ width: 0, opacity: 0 }}
          />
        </div>

        {/* RIGHT ACTIONS */}
        <div ref={rightActionsRef} className="flex items-center gap-3 z-10">
          <button
            onClick={handleSearchToggle}
            className="search-btn hidden sm:flex items-center justify-center w-12 h-12 rounded-xl border border-slate-700/60 bg-slate-900/70 text-slate-200 hover:bg-slate-800/80 hover:text-[#FBBF24] transition-all duration-300"
          >
            <FaSearch className="w-5 h-5" />
          </button>

          <Link
            to="/register"
            className="hidden sm:inline-flex items-center justify-center h-12 px-10 rounded-xl font-bold text-black bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#EAB308] transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] text-base min-w-[140px]"
          >
            Đăng ký
          </Link>
        </div>

        {/* SEARCH FORM */}
        <form
          ref={searchFormRef}
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl"
          style={{
            position: "absolute",
            right: "80px",
            top: "50%",
            transform: "translateY(-50%) scaleX(0)",
            transformOrigin: "right center",
            width: "380px",
            height: "52px",
            display: "none",
            zIndex: 20,
            padding: "0 16px",
          }}
        >
          <FaSearch className="text-slate-400 w-5 h-5 mr-6 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="bg-transparent outline-none text-slate-200 placeholder-slate-500 text-base w-full py-3"
            style={{ letterSpacing: "0.3px" }}
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;