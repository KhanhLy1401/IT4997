import { Route, Routes } from 'react-router-dom';
import SideBar from '../../components/Admin/SideBar/SideBar.js'
import Dashboard from './Dashboard/Dashboard.js'
import './AdminLayout.css';
import UserManagement from './UserManagement/UserManagement.js';
import BikeManagement from './Bike/BikeManagement.js';
import ApprovalsOwner from './ApprovalsOwner/ApprovalsOwner.js';
import ApprovalsLicense from './ApprovalsLicense/ApprovalsLicense.js';
import ApprovalsBike from './ApprovalsBike/ApprovalsBike.js';

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