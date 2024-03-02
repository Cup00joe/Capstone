import './App.css';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Sidebar from './App/sidebar.js';
import renderCalendar from './App/HomeCalendar.js';

/**
 * App component is the main component of the entire application, responsible for rendering the entire page content.
 */
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
  const [selectedDate, setSelectedDate] = useState(null); // Add a state to store the selected date
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);

  const newYorkTimeZone = 'America/New_York';

  const session = useSession();
  const supabase = useSupabaseClient();

  const [searchQuery, setSearchQuery] = useState(""); // State to store search query

  const handleSearch = () => {
    // Perform search operation here
    // Build Google search URL based on search query and redirect user to search result page
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  useEffect(() => {
    async function fetchCalendars() {
      if (!session) {
        return;
      }
      if (session) {
        setPage('Home');
      }
    
      const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        }
      });
      const data = await response.json();
      setCalendars(data.items);
    }
    
    fetchCalendars();
  }, [session]);

  function handleSelectCalendar(calendarId) {
    setSelectedCalendarId(calendarId);
    const selectedCalendar = calendars.find(calendar => calendar.id === calendarId);
    setSelectedCalendarName(selectedCalendar ? selectedCalendar.summary : "");
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
  
    try {
      // Existing code
    } catch (error) {
      console.error("Error creating calendar event:", error);
      alert("An error occurred while creating the calendar event.");
    }

    if (start >= end) {
      alert("Start time should be earlier than end time.");
      return;
    }

    if (!selectedCalendarId) {
      alert("Please select a calendar first.");
      return;
    }
  
    const event = {
      "summary": eventName,
      "location": location,
      "description": description,
      "colorId": 3,
      "start": {
        "dateTime": start.toISOString(),
        "timeZone": newYorkTimeZone
      },
      "end": {
        "dateTime": end.toISOString(),
        "timeZone": newYorkTimeZone
      },
      "attendees": [
        { "email": inviteeEmail }
      ]
    }

    await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events`, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      alert("Event created.");
    });
  }

  async function deleteEvent(eventId) {
    try {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token,
        },
      });
      // After successful deletion, re-fetch all events on the selected date
      fetchEventsOnSelectedDate();
      console.log(`Event with ID ${eventId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  }

  // Create a function to handle confirmed delete operation
  function handleConfirmDelete() {
    if (!selectedCalendarId) {
      alert("Please select a calendar first.");
      return;
    }
    fetchEventsOnSelectedDate();
  }

  // Create a function to handle delete confirmation logic
  function handleDeleteConfirmation(eventId, eventName) {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete the event "${eventName}"?`);
    // If user confirms deletion, call delete event function
    if (isConfirmed) {
      deleteEvent(eventId);
    }
  }

  async function fetchEventsOnSelectedDate() {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
  
    const startDate = moment(selectedDate).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
    const endDate = moment(selectedDate).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
  
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events?timeMin=${startDate}&timeMax=${endDate}`, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token,
        },
      });
      const data = await response.json();
      setEventsOnSelectedDate(data.items);
    } catch (error) {
      console.error("Error fetching events on selected date:", error);
      alert("An error occurred while fetching events on selected date.");
    }
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
      />
  
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {session ? (
          <>
            {page === 'Settings' && (
              <div className="settings-container">
                <h2>Settings</h2>
                {/* Add search input and confirm search button */}
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter your search query" />
                <button onClick={handleSearch}>Search</button>
                {/* Add sign out button */}
                <button onClick={signOut} className="logout-button">Sign Out</button>
                {/* Other content of the page */}
                {/* For example, you can add some setting options here */}
              </div>
            )}
            {page === 'Home' && (
              <div className="home-container">
                <h2>Welcome!</h2>
                <p>{`Today is ${moment().format('YYYY-MM-DD')}`}</p>
                {/* Render calendar for the current month */}
                <div className="calendar-grid">
                  {renderCalendar()}
                </div>
              </div>
            )}
          </>
        ) : (
          <div></div>
        )}
      </div> {/* End of page content */}
    </div>
  );
}

export default App;
