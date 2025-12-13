
import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const Feed = () => {
  return (
    <div className='w-full flex h-screen'>
      <Sidebar />
      <div className='flex-1 bg-slate-50'>
        <Outlet />
      </div>
    </div>
  )
}

export default Feed