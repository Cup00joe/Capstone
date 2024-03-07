import React, { useState, useEffect, useRef } from 'react';
import homeIcon from '../picture/homeIcon.png';
import customerInputIcon from '../picture/customerInputIcon.png';
import customerInfoIcon from '../picture/customerInfoIcon.png';
import appointmentIcon from '../picture/appointmentIcon.png';
import SettingIcon from '../picture/SettingIcon.png';
import SignOut from '../picture/SignOut.png';
import './sidebar.css';
import { supabase } from '../supabase.js'; // Adjust the path here according to your actual setup
import Settings from './settings.js';

function Login({ 
  handleLoginFormSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  loginErrorMessage
}) {
  return (
    <div className="login-popup">
      {/* Login form */}
      <form onSubmit={handleLoginFormSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {loginErrorMessage && <div className="error-message">{loginErrorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Sidebar({ setPage }) {
  // State management
  const [collapsed, setCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? storedPage : 'Home';
  });
  const [showLoginPage, setShowLoginPage] = useState(false); // Controls the display state of the login page
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true'); // Login state
  const [loginErrorMessage, setLoginErrorMessage] = useState(''); // Login error message
  const [isLoginSuccessVisible, setIsLoginSuccessVisible] = useState(false); // State to manage login success message visibility

  const [showSettings, setShowSettings] = useState(false); // 控制设置组件的显示状态
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in from local storage when component mounts
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    // If user is not logged in, show login page
    if (!isLoggedIn) {
      setShowLoginPage(true);
    }
  }, []);

  useEffect(() => {
    // Update username and login status in local storage
    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [username, isLoggedIn]);

  useEffect(() => {
    // Check if user is logged in from local storage when component mounts
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  const setPageAndCloseMenu = (pageName) => {
    setPage(pageName);
    setCurrentPage(pageName);
    setCollapsed(true);
    setShowSettings(false); // 将设置组件隐藏
    // 隐藏登录页面
    setShowLoginPage(false);
  };

  // Show the login page when the user clicks the "Sign In" button
  const handleShowLoginPage = () => {
    setShowLoginPage(true);
  };

  // Handle changes in username input
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Handle changes in password input
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle login form submission
  // Handle login form submission
  // Handle login form submission
  const handleLoginFormSubmit = async (event) => {
  event.preventDefault();

  let login; // Define login variable here
  let error; // Define error variable here

  try {
    // Perform login authentication
    ({ data: login, error } = await supabase
      .from('login')
      .select('name, pin')
      .eq('name', username) // Assuming username is the username
      .single());

    if (error) {
      throw error;
    }

    // Check if a matching user record is found
    if (!login || login.pin !== password) {
      throw new Error('Incorrect username or password');
    }

    // Login successful
    setLoginErrorMessage('');
    setIsLoggedIn(true); // Set login status to true

    // Set current page to Home page
    setCurrentPage('Home');

    // Close the login window
    setShowLoginPage(false);

    // Display success message
    setIsLoginSuccessVisible(true);

    // Hide the success message after 5 seconds
    setTimeout(() => {
      setIsLoginSuccessVisible(false);
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    if (!login) {
      setLoginErrorMessage('Incorrect username or password');
    } else {
      setLoginErrorMessage(error.message);
    }
    setIsLoggedIn(false); // Login failed, set login status to false
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user's login status and related information
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    
    // Refresh the page
    window.location.reload();
  };
  
  return (
    <div>
      {!isLoggedIn && showLoginPage && (
        <Login
          handleLoginFormSubmit={handleLoginFormSubmit}
          username={username}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          loginErrorMessage={loginErrorMessage}
        />
      )}
  
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
                    onClick={handleLogout}
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
            {showSettings && <Settings username={username} />}
          </>
        </div>
      )}
    </div>
  );
  
}

export default Sidebar;
