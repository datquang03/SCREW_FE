import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "antd";
import { SearchOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
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
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop - covers entire screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99] lg:hidden"
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99
              }}
            />
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl lg:hidden overflow-y-auto"
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '256px',
                zIndex: 102,
                backgroundColor: 'white',
                isolation: 'isolate',
                boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
              }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white relative z-10">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <CloseOutlined />
                </motion.button>
              </div>
              <nav className="p-4 bg-white relative z-10">
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map(({ path, label, key: linkKey }, index) => (
                    <motion.li
                      key={linkKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg text-base font-medium transition-all cursor-pointer relative z-10 ${
                            isActive
                              ? "bg-yellow-400/20 text-gray-900"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: NAV_LINKS.length * 0.1 }}
                    className="mt-2"
                  >
                    <Button
                      type="primary"
                      block
                      href="/register"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-none"
                    >
                      Đăng ký
                    </Button>
                  </motion.li>
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;