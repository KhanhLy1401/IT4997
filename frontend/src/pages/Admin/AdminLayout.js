import React from 'react'
import SideBar from '../../components/Admin/SideBar/SideBar'
import Dashboard from './Dashboard/Dashboard'
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        <div className='side-bar'><SideBar/></div>
        
        <div className='admin-main-layout'>
            <Dashboard />
        </div>
    </div>
  )
}

export default AdminLayout