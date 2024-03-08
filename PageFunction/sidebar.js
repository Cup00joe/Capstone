import React, { useState, useEffect, useRef } from 'react';
import homeIcon from '../picture/homeIcon.png';
import customerInputIcon from '../picture/customerInputIcon.png';
import customerInfoIcon from '../picture/customerInfoIcon.png';
import appointmentIcon from '../picture/appointmentIcon.png';
import SettingIcon from '../picture/SettingIcon.png';
import SignOut from '../picture/SignOut.png';
import './sidebar.css'; // 根据您的实际设置调整路径
import Login from './Login';

function Sidebar({ setPage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [collapsed, setCollapsed] = useState(false); // 默认为false，您可以根据实际情况修改
  const sidebarRef = useRef(null);
  const [username, setUsername] = useState(''); // 添加用户名状态
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || ''); // 从本地存储中获取当前页面状态

  useEffect(() => {
    // 更新本地存储的登录状态
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 更新登录状态为false
    window.location.reload();
    localStorage.removeItem('isLoggedIn'); // 从本地存储中移除登录状态
    setUsername(''); // 清空用户名
    setCurrentPage(''); // 清空当前页面
  };

  const setPageAndCloseMenu = (pageName) => {
    setPage(pageName);
    setCurrentPage(pageName);
    setCollapsed(false);
  };

  const [isLoginSuccessVisible, setIsLoginSuccessVisible] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginSuccessVisible(true); // 登录成功时显示登录成功浮窗
    setTimeout(() => {
      setIsLoginSuccessVisible(false);
      window.location.reload();
    }, 2000);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('currentPage', 'Home');
  };

  return (
    <div>
      {!isLoggedIn && <Login onSuccess={handleLoginSuccess} />}
      {isLoggedIn && (
        <div 
          className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
          ref={sidebarRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <>
            <h3>HBA</h3>
            <div className="sidebar-content">
              {collapsed ? (
                <>
                  <button
                    className={`menu-button ${currentPage === 'Home' ? 'active' : ''}`}
                  >
                    <img src={homeIcon} alt="Home" />
                  </button>
                  <button
                    className={`menu-button ${currentPage === 'Customer Information Input' ? 'active' : ''}`}
                  >
                    <img src={customerInputIcon} alt="Customer Input" />
                  </button>
                  <button
                    className={`menu-button ${currentPage === 'Customer Information' ? 'active' : ''}`}
                  >
                    <img src={customerInfoIcon} alt="Customer Info" />
                  </button>
                  <button
                    className={`menu-button ${currentPage === 'Appointment' ? 'active' : ''}`}
                  >
                    <img src={appointmentIcon} alt="Appointment" />
                  </button>
                  <button
                    className={`menu-button ${currentPage === 'Settings' ? 'active' : ''}`}
                  >
                    <img src={SettingIcon} alt="Settings" />
                  </button>
                  <button
                    className={`menu-button ${currentPage === 'SignOut' ? 'active' : ''}`}
                  >
                    <img src={SignOut} alt="SignOut" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPageAndCloseMenu('Home')} className={`expanded-menu-button ${currentPage === 'Home' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={homeIcon} alt="Home" />
                      <span>Home</span>
                    </div>
                  </button>
                  <button onClick={() => setPageAndCloseMenu('Customer Information Input')} className={`expanded-menu-button ${currentPage === 'Customer Information Input' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={customerInputIcon} alt="Customer Input" />
                      <span>Customer Input</span>
                    </div>
                  </button>
                  <button onClick={() => setPageAndCloseMenu('Customer Information')} className={`expanded-menu-button ${currentPage === 'Customer Information' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={customerInfoIcon} alt="Customer Info" />
                      <span>Customer Info</span>
                    </div>
                  </button>
                  <button onClick={() => setPageAndCloseMenu('Appointment')} className={`expanded-menu-button ${currentPage === 'Appointment' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={appointmentIcon} alt="Appointment" />
                      <span>Appointment</span>
                    </div>
                  </button>
                  <button onClick={() => setPageAndCloseMenu('Settings')} className={`expanded-menu-button ${currentPage === 'Settings' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={SettingIcon} alt="Settings" />
                      <span>Setting</span>
                    </div>
                  </button>
                  <button onClick={handleLogout} className={`expanded-menu-button ${currentPage === 'SignOut' ? 'active' : ''}`}>
                    <div className="button-content">
                      <img src={SignOut} alt="SignOut" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </>
              )}
            </div>
            {/* Display success or error message for login */}
            {isLoginSuccessVisible && <div className="login-success-message">Login successful!</div>}
          </>
        </div>
      )}
    </div>
  );
  
}

export default Sidebar;
