import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './App/sidebar';
import RenderCalendar from './App/HomeCalendar'
import moment from 'moment-timezone';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user login status
  const [page, setPage] = useState('Home'); // State to manage current page
  const [searchQuery, setSearchQuery] = useState(''); // State to manage search query input

  const session = useSession(); // Get session information using auth-helpers-react
  const supabase = useSupabaseClient(); // Get Supabase client object

  useEffect(() => {
    // Check if user is logged in from local storage when component mounts
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  const handleLogin = async () => {
    // Function to handle user login
    const { error } = await supabase.auth.signIn({
      provider: 'google'
    });
    if (error) {
      // Handle login error
      alert("Error logging in with Supabase");
      console.log(error);
      return;
    }

    // Set isLoggedIn state to true after successful login
    setIsLoggedIn(true);
    // Save login status to local storage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = async () => {
    // Function to handle user logout
    await supabase.auth.signOut(); // Call Supabase's signOut method to log the user out
    setIsLoggedIn(false); // Set isLoggedIn state to false after logout
    localStorage.removeItem('isLoggedIn'); // Remove login status from local storage
  };

  const handleSearch = () => {
    // Function to handle search button click
    // Redirect to Google search page with the search query
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="App">
      {/* Pass isLoggedIn state and handling methods to Sidebar component */}
      <Sidebar isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} setPage={setPage} />
      
      {/* Render content based on page state */}
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {isLoggedIn ? (
          <>
            {page === 'Settings' && (
              <div className="settings-container">
                <h2>Settings</h2>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter your search query" />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleLogout} className="logout-button">Sign Out</button>
              </div>
            )}
            {page === 'Customer Information Input' && (
              <div className="home-container">
                <h2>Welcome!</h2>
                <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                {/* Add user input component here */}
              </div>
            )}
            {page === 'Home' && (
              <div className="home-container">
                <h2>Welcome!</h2>
                <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                {/* Add calendar component here */}
                <RenderCalendar />
              </div>
            )}
          </>
        ) : (
          // Content when not logged in, can be adjusted as needed
          <div className="login-container">
            <h2>Please Login</h2>
            <button onClick={handleLogin} className="logon-button">Sign In</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
