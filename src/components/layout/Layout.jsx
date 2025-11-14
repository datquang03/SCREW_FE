import React from 'react'
import NavbarWrapper from './NavbarWrapper'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-visible">
      <NavbarWrapper />
      <main className="flex-grow pt-24 md:pt-28 relative z-0 overflow-visible">
          {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default Layout