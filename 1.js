import './App.css';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Sidebar from './App/sidebar.js';
import RenderCalendar from './App/HomeCalendar.js';
import UserPage from './App/customerInput.js';

function LoadingIndicator() {
  return <div className="loading">Loading...</div>;
}

function App() {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [selectedCalendarName, setSelectedCalendarName] = useState("");
  const [page, setPage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'Home';
  });

  const newYorkTimeZone = 'America/New_York';

  const session = useSession();
  const supabase = useSupabaseClient();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟异步加载，延迟2秒后设置 loading 为 false
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // 清除定时器以避免内存泄漏
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage) {
      setCurrentPage(storedPage);
    } else {
      // 如果本地存储中没有保存currentPage，则设置默认值为'Home'
      setCurrentPage('Home');
    }
  }, []);

  function handleSelectCalendar(calendarId) {
    setSelectedCalendarId(calendarId);
    const selectedCalendar = calendars.find(calendar => calendar.id === calendarId);
    setSelectedCalendarName(selectedCalendar ? selectedCalendar.summary : "");
  }


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
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  const handleSelectPage = (pageName) => {
    setCurrentPage(pageName);
  };

  // 在组件卸载前保存当前页面到 localStorage
  useEffect(() => {
      localStorage.setItem('currentPage', currentPage);
      console.log('Current page stored:', currentPage);
  }, [currentPage]);

  return (
    <div className="App">
      <Sidebar
        calendars={calendars}
        handleSelectCalendar={handleSelectCalendar}
        session={session}
        signOut={signOut}
        setPage={setPage}
        googleSignIn={googleSignIn}
        selectedCalendarName={selectedCalendarName}
        handleSelectPage={handleSelectPage}
      />
      {loading ? (
        <LoadingIndicator />
      ) : (
        // 加载完成后显示页面内容
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {session ? (
          <>
            {page === 'Settings' && (
              <div className="settings-container">
                <h2>Settings</h2>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter your search query" />
                <button onClick={handleSearch}>Search</button>
                <button onClick={signOut} className="logout-button">Sign Out</button>
              </div>
            )}
            {page === 'Customer Information Input' && (
              <div className="home-container">
                <h2>Welcome!</h2>
                <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                <UserPage />
              </div>
            )}
            {page === 'Home' && (
              <div className="home-container">
                <h2>Welcome!</h2>
                <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                <div className="calendar-grid">
                  <RenderCalendar />
                </div>
              </div>
            )}
          </>
        ) : (
          <div></div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;
