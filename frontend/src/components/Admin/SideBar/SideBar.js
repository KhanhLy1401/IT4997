// import React from 'react'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleUser, faFile, faUsers, faMotorcycle, faFileCircleCheck, faMoneyBill, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
// import './Sidebar.css';
// import {NavLink} from 'react-router-dom';

// const SideBar = () => {
//   return (
//     <div className='sidebar'>
//         <div className='avatar'>
//             <div className='avatar-img'>
//               <FontAwesomeIcon icon={faCircleUser} />
//             </div>
//             <div className='avatar-email'>
//               avatar@gmail.com
//             </div>
//         </div>
//         <NavLink to="/admin" className="dashboard" activeclassname="active">
//           Dashboard
//         </NavLink>
//         <div className='sidebar-menu'>
//             <div className='menu-item'>
//               <div><FontAwesomeIcon icon={faFile} /></div>
//               <div>Thống kê & báo cáo</div>
//             </div>
//             <div className='menu-item'><FontAwesomeIcon icon={faUsers} />Quản lý người dùng</div>
//             <div className='menu-item'><FontAwesomeIcon icon={faMotorcycle} />Quản lý xe</div>
//             <div className='menu-item'><FontAwesomeIcon icon={faFileCircleCheck} />Duyệt đăng ký xe</div>
//             <div className='menu-item'><FontAwesomeIcon icon={faMoneyBill} />Quản lý giao dịch</div>
//         </div>
//         <div className='logout'> <FontAwesomeIcon icon={faRightFromBracket} />Đăng xuất</div>
//     </div>
//   )
// }

// export default SideBar;

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faFile, faUsers, faMotorcycle, faFileCircleCheck, faMoneyBill, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='avatar'>
        <div className='avatar-img'>
          <FontAwesomeIcon icon={faCircleUser} />
        </div>
        <div className='avatar-email'>
          avatar@gmail.com
        </div>
      </div>

      <NavLink to="/admin" className="menu-item" activeclassname="active">
        <FontAwesomeIcon icon={faFile} />
        <span>Dashboard</span>
      </NavLink>

      <div className='sidebar-menu'>
        <NavLink to="/admin/reports" className='menu-item' activeclassname="active">
          <FontAwesomeIcon icon={faFile} />
          <span>Thống kê & báo cáo</span>
        </NavLink>
        <NavLink to="/admin/users" className='menu-item' activeclassname="active">
          <FontAwesomeIcon icon={faUsers} />
          <span>Quản lý người dùng</span>
        </NavLink>
        <NavLink to="/admin/vehicles" className='menu-item' activeclassname="active">
          <FontAwesomeIcon icon={faMotorcycle} />
          <span>Quản lý xe</span>
        </NavLink>
        <NavLink to="/admin/approvals" className='menu-item' activeclassname="active">
          <FontAwesomeIcon icon={faFileCircleCheck} />
          <span>Duyệt đăng ký xe</span>
        </NavLink>
        <NavLink to="/admin/transactions" className='menu-item' activeclassname="active">
          <FontAwesomeIcon icon={faMoneyBill} />
          <span>Quản lý giao dịch</span>
        </NavLink>
      </div>

      <NavLink to="/logout" className='logout'>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span>Đăng xuất</span>
      </NavLink>
    </div>
  );
}

export default SideBar;
