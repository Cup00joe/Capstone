import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './PageFunction/sidebar';
import RenderCalendar from './PageFunction/HomeCalendar';
import Register from './PageFunction/register';
import SunriseSunsetComponent from './PageFunction/SunriseSunsetComponent';
import moment from 'moment-timezone';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import AddressInput from './PageFunction/Address'; // 导入 AddressInput 组件

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [page, setPage] = useState('Home');
  const [coordinates, setCoordinates] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // 默认为当天日期

  const session = useSession();
  const supabase = useSupabaseClient();

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
      setIsGoogleLoggedIn(true);
      localStorage.setItem('isGoogleLoggedIn', 'true');
    }
  };

  async function googlesignOut() {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsGoogleLoggedIn(false);
    localStorage.removeItem('isGoogleLoggedIn');
    window.location.reload();
  }

  const handleDateSelect = (date) => {
    console.log('Selected date:', date.format('YYYY-MM-DD'));
    setSelectedDate(date.format('YYYY-MM-DD'));
  };

  // 处理地址提交
  const handleAddressSubmit = (newCoords) => {
    console.log('坐标:', newCoords); // 修正此处的变量名为 newCoords
    setCoordinates(newCoords);
  };

  return (
    <div className="App">
      <Sidebar isLoggedIn={isLoggedIn} setPage={setPage}/>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {isLoggedIn ? (
          <>
            {isGoogleLoggedIn ? (
              <>
                {page === 'Settings' && (
                  <div className="settings-container">
                    <h2>Settings</h2>
                    <Register username/>
                  </div>
                )}
                {page === 'Customer Information Input' && (
                  <div className="home-container">
                    <h2>Welcome, !</h2>
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
              style={{ backgroundColor: isGoogleLoggedIn ? 'green' : 'red' }}
            >
              {isGoogleLoggedIn ? 'Google Sign Out' : 'Google Sign In'}
            </button>
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
