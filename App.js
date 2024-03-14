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
  const [page, setPage] = useState(localStorage.getItem('currentPage') || 'Home'); // 从本地存储中获取当前页面状态，默认为 'Home'
  const [coordinates, setCoordinates] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // 默认为当天日期

  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  setIsLoggedIn(storedIsLoggedIn);

  // 检查谷歌登录状态
  if (session?.user?.id) {
    setIsGoogleLoggedIn(true);
    console.log('Google is logged in');
  } else {
    setIsGoogleLoggedIn(false);
    console.log('Google is not logged in');
  }

  // 检查本地存储中的谷歌登录状态
  const storedGoogleLoggedIn = localStorage.getItem('isGoogleLoggedIn') === 'true';
  setIsGoogleLoggedIn(storedGoogleLoggedIn);

  // 检查本地存储中的当前页面状态
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
        throw new Error(error.message); // 抛出错误以处理登录失败
      } else {
        setIsGoogleLoggedIn(true);
        setIsLoggedIn(true); // 在谷歌登录成功后设置为已登录状态
        localStorage.setItem('isGoogleLoggedIn', 'true');
      }
    } catch (error) {
      alert("Error logging in to Google provider with Supabase: " + error.message); // 提示用户登录失败
      console.log(error);
    }
  }

  async function googlesignOut() {
    await supabase.auth.signOut();
    setIsLoggedIn(false); // 添加这行代码
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
                    <Register setPage={setPage} />
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
