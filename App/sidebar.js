import React, { useState, useEffect, useRef } from 'react';
import homeIcon from '../picture/homeIcon.png'; // Import local image
import customerInputIcon from '../picture/customerInputIcon.png'; // Import local image
import customerInfoIcon from '../picture/customerInfoIcon.png'; // Import local image
import appointmentIcon from '../picture/appointmentIcon.png'; // Import local image
import SettingIcon from '../picture/SettingIcon.png'; // Import local image
import './sidebar.css';

function Sidebar({ calendars, handleSelectCalendar, session, signOut, setPage, googleSignIn, handleSelectPage }) {
  // State management
  const [collapsed, setCollapsed] = useState(true); // Control menu collapse state
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? storedPage : 'Home';
  });

  const sidebarRef = useRef(null);

  // Handle mouse enter event on the sidebar
  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  // Handle mouse leave event on the sidebar
  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  // Set page and close menu
  const setPageAndCloseMenu = (pageName) => {
    setPage(pageName);
    setCurrentPage(pageName);
    setCollapsed(true); // Close the menu
    handleSelectPage(pageName);
  };


  return (
    <div 
      className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3>HBA</h3>
      <div className="sidebar-content">
        {/* Add images */}
        {collapsed ? (
          <>
            {/* Check if session exists, render Google sign-in button if not */}
            {!session && (
              <button onClick={googleSignIn} className="menu-button">SIGN IN</button>
            )}
            {session && (
              <>
                <button
                  onClick={() => setPageAndCloseMenu('Home')}
                  className={`menu-button ${currentPage === 'Home' ? 'active' : ''}`}
                >
                  <img src={homeIcon} alt="Home" />
                </button>
                <button
                  onClick={() => setPageAndCloseMenu('Customer Information Input')}
                  className={`menu-button ${currentPage === 'Customer Information Input' ? 'active' : ''}`}
                >
                  <img src={customerInputIcon} alt="Customer Input" />
                </button>
                <button
                  onClick={() => setPageAndCloseMenu('Customer Information')}
                  className={`menu-button ${currentPage === 'Customer Information' ? 'active' : ''}`}
                >
                  <img src={customerInfoIcon} alt="Customer Info" />
                </button>
                <button
                  onClick={() => setPageAndCloseMenu('Appointment')}
                  className={`menu-button ${currentPage === 'Appointment' ? 'active' : ''}`}
                >
                  <img src={appointmentIcon} alt="Appointment" />
                </button>
                <button
                  onClick={() => setPageAndCloseMenu('Settings')}
                  className={`menu-button ${currentPage === 'Settings' ? 'active' : ''}`}
                >
                  <img src={SettingIcon} alt="Settings" />
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {/* Check if session exists, render Google sign-in button if not */}
            {!session && (
              <button onClick={googleSignIn} className="menu-button">Sign In With Google</button>
            )}
            {session && (
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
