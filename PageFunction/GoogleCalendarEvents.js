import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { useSession } from '@supabase/auth-helpers-react';
import './GoogleCalendarEvents.css';

const primaryCalendarId = 'primary';

function GoogleCalendarEvents({ selectedDate }) {
    const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
    const session = useSession();
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState(primaryCalendarId);
    const [selectedCalendarName, setSelectedCalendarName] = useState('Select Calendar');
    const [showCalendarList, setShowCalendarList] = useState(false);

    useEffect(() => {
        async function fetchCalendars() {
            try {
                const response = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + session.provider_token,
                    },
                });
                const data = await response.json();
                setCalendars(data.items.filter(calendar => calendar.accessRole !== "reader" && calendar.id !== "birthdays")); // 排除只读日历和生日日历
            } catch (error) {
                console.error("Error fetching calendars:", error);
            }
        }

        fetchCalendars();
    }, [session]);

    useEffect(() => {
        async function fetchEventsOnSelectedDate(date) {
            if (!date || !session || !session.provider_token) {
                return;
            }
        
            const startDate = moment(date).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
            const endDate = moment(date).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
        
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
            }
        }

        fetchEventsOnSelectedDate(selectedDate);
    }, [selectedDate, session, selectedCalendarId]);

    const handleSelectCalendar = (calendarId, calendarName) => {
        setSelectedCalendarId(calendarId);
        setSelectedCalendarName(calendarName);
        setShowCalendarList(false);
    };

    return (
        <div className="events-list">
            <button className="select-calendar-button" onClick={() => setShowCalendarList(true)}>{selectedCalendarName}</button>

            {showCalendarList && (
                <div className="calendar-list">
                    <h3>Calendar List</h3>
                    <ul>
                        {calendars.map(calendar => (
                            <li key={calendar.id}>
                                <button onClick={() => handleSelectCalendar(calendar.id, calendar.summary)}>{calendar.summary}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <p>------------------------------------</p>
            {eventsOnSelectedDate && eventsOnSelectedDate.map((event, index) => (
                <div key={index} className="event">
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{event.summary}</span>
                    <p>Start Time: {moment(event.start.dateTime).format('HH:mm')}</p>
                    <p>End Time: {moment(event.end.dateTime).format('HH:mm')}</p>
                </div>
            ))}
        </div>
    );
}

export default GoogleCalendarEvents;
