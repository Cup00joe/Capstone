import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './PageFunction/sidebar';
import RenderCalendar from './PageFunction/HomeCalendar';
import Register from './PageFunction/register';
import ChangePIN from './PageFunction/changePIN';
import Appointment from './PageFunction/Appointment1';
import SunriseSunsetComponent from './PageFunction/SunriseSunsetComponent';
import moment from 'moment-timezone';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

import PageTitle from './PageFunction/pageTitle';
import Toggle from './PageFunction/Toggle';
import GoogleCalendarEvents from './PageFunction/GoogleCalendarEvents';
import Address from './PageFunction/Address';
import GoogleCalendarEventCreate from './PageFunction/GoogleCalendarEventCreate';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [page, setPage] = useState(localStorage.getItem('currentPage') || 'Home');
  const [selectedDate, setSelectedDate] = useState(moment()); // 默认为当天日期
  const [selectedDate2, setSelectedDate2] = useState(moment());
  const [selectedLocation, setSelectedLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [isDark, setDark] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();

  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [parentTime, setParentTime] = useState('AM');

    const handleTimeChange = (newTime) => {
        setParentTime(newTime);
    };
    console.log(parentTime);

    // 定义处理日出日落时间的函数
    const handleSunriseSunsetTime = (sunriseTime, sunsetTime) => {
        setSunrise(sunriseTime);
        setSunset(sunsetTime);
    };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);

    const storedGoogleLoggedIn = localStorage.getItem('isGoogleLoggedIn') === 'true';
    setIsGoogleLoggedIn(storedGoogleLoggedIn);

    if (session?.provider_token) {
      setIsGoogleLoggedIn(true);
      console.log('Google is logged in');
    } else {
      if (isGoogleLoggedIn) {
        console.log("LOGGED IN BUT TOKEN EXPIRED");
      }
      console.log('Google is not logged in');
    }

    const storedIsDark = localStorage.getItem('isDark') === 'true';
    const storedIsLight = localStorage.getItem('isLight') === 'true';

    if (storedIsDark || storedIsLight) {
      setDark(storedIsDark);
    } else {
      const defaultDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(defaultDarkMode);
    }

    document.body.classList.add(isDark ? 'dark' : 'light');
    const storedPage = localStorage.getItem('currentPage') || 'Home';
    setPage(storedPage);  
  }, [session, setPage]);

  useEffect(() => {
    console.log('Login status changed(App):', isLoggedIn);
  }, [isLoggedIn]);

  async function googleSignIn() {
    try {
        const { user, session, error: gmailError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: [
                    'https://www.googleapis.com/auth/gmail.send',
                    'https://www.googleapis.com/auth/calendar'
                ]
            }
        });

        if (gmailError) {
            alert("Error logging in to Google provider with Supabase for Gmail API");
            console.error(gmailError);
            return;
        }

        if (user && session) {
            setIsGoogleLoggedIn(true);
            localStorage.setItem('isGoogleLoggedIn', 'true');
           
        } else {
            alert("Error logging in to Google provider with Supabase");
        }
    } catch (error) {
        console.error("Error logging in to Google provider with Supabase:", error.message);
        alert("Error logging in to Google provider with Supabase");
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
    setSelectedDate(date);
  };

  const handleDateSelect2 = (date) => {
    console.log('Selected date:', date.format('YYYY-MM-DD'));
    setSelectedDate2(date);
  };

  const handleDarkToggle = () => {
    if (isDark) {
      localStorage.removeItem('isDark');
      localStorage.setItem('isLight', 'true');
    } else {
      localStorage.removeItem('isLight');
      localStorage.setItem('isDark', 'true');
    }

    document.body.classList.remove(isDark ? 'dark' : 'light');
    document.body.classList.add(isDark ? 'light' : 'dark');
    setDark(!isDark);
  }

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
                {page === 'Home' ? (
                  <div className="home-container">
                    <PageTitle page={page}/>
                    {/*<Accordion icon={"qbIcon"} status={"Online"}/>*/}
                    <div className="calendar-parent-container">
                        <RenderCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                        <div className="side-content-container">
                          <GoogleCalendarEvents selectedDate={selectedDate}>
                            <Address onAddressSubmit={handleAddressSubmit} setSelectedLocation={setSelectedLocation}/>
                            <SunriseSunsetComponent 
                            coordinates={coordinates} 
                            selectedDate={selectedDate} 
                            selectedLocation={selectedLocation}
                            onSunriseSunsetTime={handleSunriseSunsetTime}/>
                          </GoogleCalendarEvents>
                        </div>
                    </div>
                  </div>
                ) : (
                  <PageTitle page={page}/>
                )}
                {page === 'Settings' && (
                  <div className="settings-container">
                    <h2>Settings</h2>
                    <Register />
                    <ChangePIN />
                  </div>
                )}
                {page === 'Customer Information Input' && (
                  <div className="home-container">
                    <h2>Welcome, !</h2>
                    <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                  </div>
                )}
                {page === 'Appointment' && (
                  <div>
                  <div className="calendar-parent-container">
                    <RenderCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect2} />
                    <Appointment selectedDate2={selectedDate2} 
                    sunrise={sunrise} 
                    sunset={sunset}
                    selectedLocation={selectedLocation}
                    parentTime={parentTime}
                    onTimeChange={handleTimeChange}/>
                  </div>
                  <div className="side_appointment_page">
                  <Address onAddressSubmit={handleAddressSubmit} setSelectedLocation={setSelectedLocation}/>
                  <SunriseSunsetComponent 
  coordinates={coordinates} 
  selectedDate={selectedDate2} 
  selectedLocation={selectedLocation} 
  onSunriseSunsetTime={handleSunriseSunsetTime}
/>
<GoogleCalendarEventCreate 
                    parentTime={parentTime}
                    selectedDate2={selectedDate2}
                    selectedLocation={selectedLocation}
                    sunrise={sunrise} 
                    sunset={sunset}/>
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
            <div className="account-container">
              <button 
                onClick={isGoogleLoggedIn ? googlesignOut : googleSignIn} 
                className="google-signin-button"
                style={{ backgroundColor: isGoogleLoggedIn ? 'green' : 'red' }}
              >
                {isGoogleLoggedIn ? 'Google Sign Out' : 'Google Sign In'}
              </button>
              <button
                className="qb-signin-button">
                  QuickBooks Sign In
              </button>
              <Toggle status={ isDark } method={ handleDarkToggle }/>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default App;