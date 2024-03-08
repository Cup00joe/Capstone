import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './PageFunction/sidebar';
import RenderCalendar from './PageFunction/HomeCalendar';
import Settings from './PageFunction/register';
import moment from 'moment-timezone';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user login status
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false); // State to manage Google login status
  const [page, setPage] = useState('Home'); // State to manage current page

  const session = useSession(); // Get session information using auth-helpers-react
  const supabase = useSupabaseClient(); // Get Supabase client object
  const [appUsername, setAppUsername] = useState('');

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);

    const storedGoogleLoggedIn = localStorage.getItem('isGoogleLoggedIn') === 'true';
    setIsGoogleLoggedIn(storedGoogleLoggedIn);

    if (session?.provider_token) {
        setIsGoogleLoggedIn(true);
        console.log('Google is logged in');
    } else {
        console.log('Google is not logged in');
    }
}, [session]);

useEffect(() => {
  console.log('Login status changed(App):', isLoggedIn);
}, [isLoggedIn]);

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            scopes: 'https://www.googleapis.com/auth/calendar'
        }
    });
    if (error) {
        alert("Error logging in to Google provider with Supabase");
        console.log(error);
    } else {
        // Set Google login status to true after successful login
        setIsGoogleLoggedIn(true);
        // Save Google login status to local storage
        localStorage.setItem('isGoogleLoggedIn', 'true');
    }
};

async function googlesignOut() {
    await supabase.auth.signOut();
    // Reset isLoggedIn and isGoogleLoggedIn states after successful logout
    setIsLoggedIn(false);
    setIsGoogleLoggedIn(false);
    // Clear Google login status from local storage
    localStorage.removeItem('isGoogleLoggedIn');
    window.location.reload();
}

const handleUsernameChange = (username) => {
  setAppUsername(username);
};

  return (
    <div className="App">
      {/* Pass isLoggedIn state and handling methods to Sidebar component */}
      <Sidebar isLoggedIn={isLoggedIn} setPage={setPage}/>
      
      {/* Render content based on page state */}
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {isLoggedIn ? (
          <>
            {isGoogleLoggedIn ? (
              <>
                {page === 'Settings' && (
                  <div className="settings-container">
                    <h2>Settings</h2>
                    <Settings />
                    <button onClick={googlesignOut} className="logout-button" style={{ position: 'absolute', bottom: '20px', right: '20px' }}>Sign Out</button>
                  </div>
                )}
                {page === 'Customer Information Input' && (
                  <div className="home-container">
                    <h2>Welcome, !</h2>
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
                <button onClick={googleSignIn} className="logon-button">Sign In</button>
              </div>
            )}
          </>
        ) : (
          <div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;