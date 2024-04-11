import React, { useState, useEffect, useRef } from 'react';
import homeIcon from '../picture/homeIcon.png';
import customerInputIcon from '../picture/customerInputIcon.png';
import customerInfoIcon from '../picture/customerInfoIcon.png';
import appointmentIcon from '../picture/appointmentIcon.png';
import SettingIcon from '../picture/SettingIcon.png';
import SignOut from '../picture/SignOut.png';
import './sidebar.css'; // Adjust the path according to your actual settings
import Login from './Login';

function Sidebar({ setPage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [collapsed, setCollapsed] = useState(true); // Default is false, you can modify this according to your actual situation
  const sidebarRef = useRef(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Get username state from local storage
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || ''); // Get current page state from local storage
  
  useEffect(() => {
    // Update the local storage with the login status
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login status to false
    window.location.reload();
    localStorage.removeItem('isLoggedIn'); // Remove login status from local storage
    localStorage.removeItem('username'); // Remove username from local storage
    localStorage.removeItem('currentPage'); // Remove current page from local storage
    setUsername(''); // Clear username
    setCurrentPage(''); // Clear current page
  };

  const setPageAndCloseMenu = (pageName) => {
    setPage(pageName);
    setCurrentPage(pageName);
    setCollapsed(false);
  
    // Update the currentPage value in local storage
    localStorage.setItem('currentPage', pageName);
  };

  const [isLoginSuccessVisible, setIsLoginSuccessVisible] = useState(false);

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setIsLoginSuccessVisible(true); // Show login success popup when login succeeds
    setUsername(username); // Set the username
    console.log('Logged in as:', username); // Print the username to the console
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('username', username); // Store the username in local storage
    localStorage.setItem('currentPage', 'Home');
    setTimeout(() => {
      setIsLoginSuccessVisible(false);
      window.location.reload();
    }, 2000);
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
