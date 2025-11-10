import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "antd";
import { 
  SearchOutlined, 
  MenuOutlined, 
  CloseOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  ContactsOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SPlusLogo from "../../assets/S+Logo.png";
import { NAV_LINKS } from "../../constants/navigation";
import { useScrollEffect } from "../../hooks/useScrollEffect";

const Navbar = () => {
  const scrolled = useScrollEffect(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    // Ensure header stays fixed on scroll
    const header = headerRef.current;
    if (header) {
      // Force fixed position immediately
      header.style.setProperty('position', 'fixed', 'important');
      header.style.setProperty('top', '0', 'important');
      header.style.setProperty('left', '0', 'important');
      header.style.setProperty('right', '0', 'important');
      header.style.setProperty('transform', 'translateY(0)', 'important');
      header.style.setProperty('z-index', '100', 'important');

      const observer = new MutationObserver(() => {
        if (header.style.position !== 'fixed') {
          header.style.setProperty('position', 'fixed', 'important');
        }
        if (header.style.top !== '0px' && header.style.top !== '0') {
          header.style.setProperty('top', '0', 'important');
        }
        // Remove any transform that might cause movement
        const currentTransform = header.style.transform || '';
        if (currentTransform && !currentTransform.includes('translateY(0)') && currentTransform !== 'none') {
          header.style.setProperty('transform', 'translateY(0)', 'important');
        }
      });

      observer.observe(header, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Also listen to scroll events to ensure it stays fixed
      const handleScroll = () => {
        if (header) {
          // Force remove any transform that Framer Motion might add
          const computedStyle = window.getComputedStyle(header);
          const transform = computedStyle.transform;
          
          header.style.setProperty('position', 'fixed', 'important');
          header.style.setProperty('top', '0', 'important');
          header.style.setProperty('left', '0', 'important');
          header.style.setProperty('right', '0', 'important');
          header.style.setProperty('transform', 'translateY(0) !important', 'important');
          header.style.setProperty('z-index', '100', 'important');
          
          // If Framer Motion added a transform, remove it
          if (transform && transform !== 'none' && !transform.includes('translateY(0)')) {
            header.style.setProperty('transform', 'translateY(0) !important', 'important');
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent body scroll when menu is open, but allow menu to scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Scroll menu to top immediately
      requestAnimationFrame(() => {
        if (navRef.current) {
          navRef.current.scrollTop = 0;
          navRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      });
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      layout={false}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        width: '100%',
        transform: 'translateY(0) !important',
        willChange: 'auto'
      }}
      onAnimationComplete={() => {
        // Force fixed position after animation completes and disable any further transforms
        if (headerRef.current) {
          headerRef.current.style.setProperty('position', 'fixed', 'important');
          headerRef.current.style.setProperty('top', '0', 'important');
          headerRef.current.style.setProperty('left', '0', 'important');
          headerRef.current.style.setProperty('right', '0', 'important');
          headerRef.current.style.setProperty('transform', 'translateY(0) !important', 'important');
          headerRef.current.style.setProperty('z-index', '100', 'important');
          // Disable Framer Motion transforms
          headerRef.current.setAttribute('data-fixed', 'true');
        }
      }}
      className={`w-full transition-all duration-300 pointer-events-auto ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-2 md:px-4 lg:px-6 py-1.5 md:py-2 relative z-[101] max-w-full">
        {/* Logo with 3D effect */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 relative z-10"
        >
          <Link to="/" className="flex items-center gap-1 md:gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <img
                src={SPlusLogo}
                alt="S+ Studio Logo"
                className="h-10 md:h-14 w-auto object-contain drop-shadow-lg"
                style={{ maxHeight: '56px' }}
              />
            </motion.div>
            <span
              className={`text-xs md:text-sm font-bold transition-colors whitespace-nowrap relative z-10 ${
                scrolled ? "text-gray-900" : "text-white"
              } group-hover:text-yellow-400`}
            >
              S+ Studio
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center min-w-0 flex-1 justify-center mx-1 md:mx-2 relative z-20">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, key: linkKey }, index) => (
              <motion.li
                key={linkKey}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `relative block px-1.5 md:px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap group cursor-pointer ${
                      isActive
                        ? scrolled
                          ? "text-gray-900 bg-yellow-400/20"
                          : "text-white bg-white/20"
                        : scrolled
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-lg backdrop-blur-sm pointer-events-none"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative" style={{ zIndex: 10 }}>{label}</span>
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right Actions - Push to right */}
        <div className="flex-shrink-0 flex items-center gap-1 md:gap-2 ml-auto">
          <div className="hidden xl:flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<SearchOutlined />}
                className={scrolled ? "text-gray-700" : "text-white"}
              />
            </motion.div>
          </div>
          <div className="hidden md:flex items-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="small"
                href="/register"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 font-semibold text-xs px-2 md:px-3"
              >
                Đăng ký
              </Button>
            </motion.div>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: mobileMenuOpen ? 90 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-3 rounded-full transition-all duration-300 ease-in-out ${
              scrolled 
                ? "text-gray-700 bg-gray-100 hover:bg-gray-200" 
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
            aria-label="Toggle menu"
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: scrolled 
                ? '0 2px 8px rgba(0,0,0,0.1)' 
                : '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <motion.div
              animate={{ 
                rotate: mobileMenuOpen ? 180 : 0,
                scale: mobileMenuOpen ? 1.1 : 1
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {mobileMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Render outside header to ensure proper z-index */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop - covers entire screen but behind menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                pointerEvents: 'auto',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
              className="lg:hidden"
            />
            {/* Mobile Menu - Must be above backdrop and header */}
            <motion.div
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              className="fixed top-0 left-0 h-full w-72 md:w-80 bg-white shadow-2xl lg:hidden flex flex-col rounded-r-2xl md:rounded-r-3xl overflow-hidden"
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '288px',
                maxWidth: '85vw',
                zIndex: 10000,
                backgroundColor: 'white',
                isolation: 'isolate',
                boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
                pointerEvents: 'auto',
                transform: 'translateZ(0)',
                willChange: 'transform',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                opacity: 1
              }}
              onClick={(e) => {
                // Prevent backdrop click when clicking inside menu
                e.stopPropagation();
              }}
            >
              {/* Header - Fixed at top */}
              <div className="flex-shrink-0 p-4 border-b-2 border-gray-200 flex items-center justify-between bg-white shadow-sm relative z-20" style={{ backgroundColor: 'white', opacity: 1 }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMobileMenu}
                  className="p-3 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
                  aria-label="Close menu"
                >
                  <CloseOutlined className="text-lg" />
                </motion.button>
              </div>
              
              {/* Navigation - Scrollable content distributed evenly */}
              <nav 
                ref={navRef}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white flex flex-col relative z-10" 
                style={{ 
                  scrollBehavior: 'auto',
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  minHeight: 0,
                  backgroundColor: 'white',
                  opacity: 1
                }}
              >
                <ul className="flex flex-col flex-1 justify-evenly gap-4 md:gap-6">
                  {NAV_LINKS.map(({ path, label, key: linkKey }, index) => {
                    const iconMap = {
                      home: <HomeOutlined />,
                      studio: <VideoCameraOutlined />,
                      equipment: <ToolOutlined />,
                      about: <InfoCircleOutlined />,
                      contact: <ContactsOutlined />,
                    };
                    const icon = iconMap[linkKey] || <HomeOutlined />;
                    const colors = [
                      { bg: "from-purple-400 to-pink-500", border: "border-purple-400/50", text: "text-white", iconBg: "bg-purple-500/20" },
                      { bg: "from-blue-400 to-cyan-500", border: "border-blue-400/50", text: "text-white", iconBg: "bg-blue-500/20" },
                      { bg: "from-green-400 to-emerald-500", border: "border-green-400/50", text: "text-white", iconBg: "bg-green-500/20" },
                      { bg: "from-orange-400 to-red-500", border: "border-orange-400/50", text: "text-white", iconBg: "bg-orange-500/20" },
                      { bg: "from-indigo-400 to-purple-500", border: "border-indigo-400/50", text: "text-white", iconBg: "bg-indigo-500/20" },
                    ];
                    const colorScheme = colors[index % colors.length];
                    
                    return (
                      <motion.li
                        key={linkKey}
                        initial={{ opacity: 0, x: -30, rotateY: -15 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex-1 flex"
                        style={{ perspective: 1000 }}
                      >
                        <NavLink
                          to={path}
                          onClick={closeMobileMenu}
                          className={({ isActive }) => {
                            if (isActive) {
                              return `group flex-1 flex items-center gap-4 px-5 py-6 md:py-8 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 cursor-pointer border-2 relative overflow-hidden bg-gradient-to-r ${colorScheme.bg} ${colorScheme.text} shadow-xl ${colorScheme.border}`;
                            }
                            return `group flex-1 flex items-center gap-4 px-5 py-6 md:py-8 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 cursor-pointer border-2 relative overflow-hidden bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:shadow-xl border-gray-200`;
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.classList.contains('active')) {
                              const gradients = [
                                'linear-gradient(to right, #a855f7, #ec4899)',
                                'linear-gradient(to right, #3b82f6, #06b6d4)',
                                'linear-gradient(to right, #10b981, #10b981)',
                                'linear-gradient(to right, #f97316, #ef4444)',
                                'linear-gradient(to right, #6366f1, #8b5cf6)'
                              ];
                              e.currentTarget.style.background = gradients[index % gradients.length];
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = gradients[index % gradients.length].includes('purple') ? 'rgba(168, 85, 247, 0.5)' : gradients[index % gradients.length].includes('blue') ? 'rgba(59, 130, 246, 0.5)' : gradients[index % gradients.length].includes('green') ? 'rgba(16, 185, 129, 0.5)' : gradients[index % gradients.length].includes('orange') ? 'rgba(249, 115, 22, 0.5)' : 'rgba(99, 102, 241, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.currentTarget.classList.contains('active')) {
                              e.currentTarget.style.background = '';
                              e.currentTarget.style.color = '';
                              e.currentTarget.style.borderColor = '';
                            }
                          }}
                        >
                          {({ isActive }) => (
                            <>
                              {/* Icon with animated background */}
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0 ${
                                  isActive
                                    ? "bg-white/20 backdrop-blur-sm"
                                    : `${colorScheme.iconBg} text-gray-600 group-hover:bg-white/20 group-hover:text-white`
                                }`}
                              >
                                {icon}
                              </motion.div>
                              
                              {/* Label */}
                              <span className={`flex-1 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-white'}`}>
                                {label}
                              </span>
                              
                              {/* Active indicator */}
                              {isActive && (
                                <motion.div
                                  layoutId="mobileActiveIndicator"
                                  className="absolute right-4 w-3 h-3 rounded-full bg-white shadow-lg"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                              
                              {/* Arrow indicator on hover */}
                              {!isActive && (
                                <motion.div
                                  className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                  initial={{ x: -10 }}
                                  whileHover={{ x: 0 }}
                                >
                                  <span className="text-white text-xl">→</span>
                                </motion.div>
                              )}
                              
                              {/* Decorative gradient overlay on hover - using inline style for dynamic colors */}
                              {!isActive && (
                                <motion.div
                                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                  style={{
                                    background: index === 0 
                                      ? 'linear-gradient(to right, #a855f7, #ec4899)'
                                      : index === 1
                                      ? 'linear-gradient(to right, #3b82f6, #06b6d4)'
                                      : index === 2
                                      ? 'linear-gradient(to right, #10b981, #10b981)'
                                      : index === 3
                                      ? 'linear-gradient(to right, #f97316, #ef4444)'
                                      : 'linear-gradient(to right, #6366f1, #8b5cf6)'
                                  }}
                                />
                              )}
                            </>
                          )}
                        </NavLink>
                      </motion.li>
                    );
                  })}
                </ul>
                
                {/* Register Button - Fixed at bottom with enhanced design */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t-2 border-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: NAV_LINKS.length * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      block
                      size="large"
                      href="/register"
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-2 border-yellow-500 shadow-2xl hover:shadow-yellow-500/50 font-extrabold rounded-2xl py-6 md:py-8 h-auto text-base md:text-lg relative overflow-hidden group"
                      style={{
                        backgroundSize: '200% 200%',
                        animation: 'gradient 3s ease infinite'
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>Đăng ký</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;