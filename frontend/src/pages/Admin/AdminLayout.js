import React from 'react'
import { Route, Routes } from 'react-router-dom';
import SideBar from '../../components/Admin/SideBar/SideBar'
import Dashboard from './Dashboard/Dashboard'
import './AdminLayout.css';
import Approvals from './Approvals/Approvals';
import UserManagement from './UserManagement/UserManagement';
import BikeManagement from './Bike/BikeManagement';
import ApprovalsOwner from './ApprovalsOwner/ApprovalsOwner';

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        <div className='side-bar'><SideBar/></div>
        
        <div className='admin-main-layout'>
            <Routes>
              <Route path='/' element={<Dashboard />}/>
              <Route path='/approvals' element={<Approvals />}/>
              <Route path='/user-management' element={<UserManagement/>}/>
              <Route path='/bike-management' element={<BikeManagement/>}/>
              <Route path='/approvals-owner' element={<ApprovalsOwner/>}/>
            </Routes>
            
        </div>
    </div>
  )
}

export default AdminLayout