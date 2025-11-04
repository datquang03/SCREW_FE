import React from 'react';
import NavbarWrapper from './NavbarWrapper';
import { Outlet } from 'react-router-dom';
import PageTransition from '../PageTransition';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <NavbarWrapper />
      <main className="pt-[70px] md:pt-[76px]">
        <PageTransition>
          {children || <Outlet />}
        </PageTransition>
      </main>
    </div>
  );
};

export default Layout;