import React from 'react'
import { Route, Routes } from 'react-router-dom';
import SideBar from '../../components/Admin/SideBar/SideBar'
import Dashboard from './Dashboard/Dashboard'
import './AdminLayout.css';
import UserManagement from './UserManagement/UserManagement';
import BikeManagement from './Bike/BikeManagement';
import ApprovalsOwner from './ApprovalsOwner/ApprovalsOwner';
import ApprovalsLicense from './ApprovalsLicense/ApprovalsLicense';
import ApprovalsBike from './ApprovalsBike/ApprovalsBike';

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        <div className='side-bar'><SideBar/></div>
        
        <div className='admin-main-layout'>
            <Routes>
              <Route path='/' element={<Dashboard />}/>
              <Route path='/user-management' element={<UserManagement/>}/>
              <Route path='/bike-management' element={<BikeManagement/>}/>
              <Route path='/approvals-owner' element={<ApprovalsOwner/>}/>
              <Route path='/approvals-bike' element={<ApprovalsBike/>}/>
              <Route path='/approvals-license' element={<ApprovalsLicense/>}/>
            </Routes>
            
        </div>
    </div>
  )
}

export default AdminLayout