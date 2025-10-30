import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import PageTransition from '../PageTransition'

const Layout = ({children}) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main>
        <PageTransition>
          {children || <Outlet />}
        </PageTransition>
      </main>
    </div>
  )
}

export default Layout
