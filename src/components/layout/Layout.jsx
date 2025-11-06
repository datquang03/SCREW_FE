import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = ({children}) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main>
          {children || <Outlet />}
      </main>
    </div>
  )
}

export default Layout
