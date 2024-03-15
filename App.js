import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './PageFunction/sidebar';
import RenderCalendar from './PageFunction/HomeCalendar';
import Register from './PageFunction/register';
import SunriseSunsetComponent from './PageFunction/SunriseSunsetComponent';
import moment from 'moment-timezone';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import AddressInput from './PageFunction/Address'; 
import Google from './picture/Google.png';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [page, setPage] = useState(localStorage.getItem('currentPage') || 'Home'); 
  const [coordinates, setCoordinates] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);

    if (session?.user?.id) {
      setIsGoogleLoggedIn(true);
    } else {
      setIsGoogleLoggedIn(false);
    }

    const storedGoogleLoggedIn = localStorage.getItem('isGoogleLoggedIn') === 'true';
    setIsGoogleLoggedIn(storedGoogleLoggedIn);

    const storedPage = localStorage.getItem('currentPage') || 'Home';
    setPage(storedPage);
  }, [session, setPage]);

  useEffect(() => {
    console.log('Login status changed(App):', isLoggedIn);
  }, [isLoggedIn]);

  async function googleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar'
        }
      });
      if (error) {
        throw new Error(error.message);
      } else {
        setIsGoogleLoggedIn(true);
        setIsLoggedIn(true);
        localStorage.setItem('isGoogleLoggedIn', 'true');
      }
    } catch (error) {
      alert("Error logging in to Google provider with Supabase: " + error.message);
      console.log(error);
    }
  }

  async function googlesignOut() {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsGoogleLoggedIn(false);
    localStorage.removeItem('isGoogleLoggedIn');
    window.location.reload();
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
  };

  const handleAddressSubmit = (newCoords) => {
    setCoordinates(newCoords);
  };

  return (
    <div className="App">
      <Sidebar isLoggedIn={isLoggedIn} setPage={setPage}/>
      <div className="main-content">
        {isLoggedIn ? (
          <>
            {isGoogleLoggedIn ? (
              <>
                {page === 'Settings' && (
                  <div className="settings-container">
                    <h2>Settings</h2>
                    <Register setPage={setPage} />
                  </div>
                )}
                {page === 'Customer Information Input' && (
                  <div className="home-container">
                    <h2>Welcome!</h2>
                    <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                  </div>
                )}
                {page === 'Home' && (
                  <div className="calendar-parent-container">
                    <div className="calendar-container">
                      <RenderCalendar onDateSelect={handleDateSelect} />
                    </div>
                    <div className="address-wooster-container">
                      <div className="address-container">
                        <AddressInput onAddressSubmit={handleAddressSubmit} />
                      </div>
                      <div className="wooster-time-container pointer-events-none">
                        <SunriseSunsetComponent
                          coordinates={coordinates}
                          selectedDate={selectedDate}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="login-container">
                <h2>Please Login</h2>
                <button onClick={googleSignIn} className="logon-button">Google Sign In</button>
              </div>
            )}
            <button 
              onClick={isGoogleLoggedIn ? googlesignOut : googleSignIn} 
              className="google-signin-button"
              style={{
                backgroundImage: `linear-gradient(to right, ${isGoogleLoggedIn ? '#006400' : '#8B0000'}, ${isGoogleLoggedIn ? '#006400' : '#8B0000'})`,
              }}
            >
              <img src={Google} alt="Google" style={{ marginRight: '5px' }} />
              <span style={{ verticalAlign: 'middle' }}>{isGoogleLoggedIn ? 'Google Sign Out' : 'Google Sign In'}</span>
            </button>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default App;
