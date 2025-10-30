import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

// Simple sliding page transition that moves left/right based on route order
const routeOrder = [
  '/',
  '/studio',
  '/equipment',
  '/about',
  '/contact',
  '/login',
  '/register',
];

const getIndex = (path) => {
  const i = routeOrder.indexOf(path);
  return i >= 0 ? i : 0;
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    const dir = Math.sign(getIndex(curr) - getIndex(prev)) || 1; // 1: right, -1: left

    // Prepare
    gsap.set(wrapperRef.current, { overflow: 'hidden' });
    gsap.fromTo(
      contentRef.current,
      { xPercent: -8 * dir, opacity: 0.0 },
      { xPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );

    prevPathRef.current = curr;
  }, [location.pathname]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;



