import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { useSession } from '@supabase/auth-helpers-react';
import './GoogleCalendarEvents.css';

function GoogleCalendarEvents({ selectedDate }) {
    const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
    const session = useSession();
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendars, setSelectedCalendars] = useState([]);
    const [selectedCalendarIds, setSelectedCalendarIds] = useState([]); // 定义选择的日历ID数组
    const [selectedCalendarNames, setSelectedCalendarNames] = useState([]); // 定义选择的日历名称数组

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
        async function fetchEventsOnSelectedDate() {
            if (!selectedDate || !session || !session.provider_token || selectedCalendarIds.length === 0) {
                return;
            }
        
            const startDate = moment(selectedDate).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
            const endDate = moment(selectedDate).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
            
            const allEvents = [];

            // Fetch events for each selected calendar
            for (const calendarId of selectedCalendarIds) {
                try {
                    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${startDate}&timeMax=${endDate}`, {
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + session.provider_token,
                        },
                    });
                    const data = await response.json();

                    // Add calendar name to each event
                    const eventsWithCalendarName = data.items.map(event => {
                        return {
                            ...event,
                            calendarName: selectedCalendarNames[selectedCalendarIds.indexOf(calendarId)]
                        };
                    });

                    allEvents.push(...eventsWithCalendarName);
                } catch (error) {
                    console.error("Error fetching events on selected date:", error);
                }
            }

            // Sort events by start time
            allEvents.sort((a, b) => moment(a.start.dateTime).valueOf() - moment(b.start.dateTime).valueOf());

            setEventsOnSelectedDate(allEvents);
        }

        fetchEventsOnSelectedDate();
    }, [selectedDate, session, selectedCalendarIds, selectedCalendarNames]);

    const handleSelectCalendar = (calendarId, calendarName) => {
        if (!selectedCalendarIds.includes(calendarId)) {
            let updatedIds = [...selectedCalendarIds, calendarId];
            let updatedNames = [...selectedCalendarNames, calendarName];
            
            // 更新selectedCalendars
            let updatedCalendars = [...selectedCalendars, calendars.find(calendar => calendar.id === calendarId)];
    
            setSelectedCalendarIds(updatedIds);
            setSelectedCalendarNames(updatedNames);
            setSelectedCalendars(updatedCalendars); // 更新selectedCalendars
        } else {
            // Remove calendarName if already selected
            const updatedIds = selectedCalendarIds.filter(id => id !== calendarId);
            const updatedNames = selectedCalendarNames.filter(name => name !== calendarName);
            
            // 更新selectedCalendars
            let updatedCalendars = selectedCalendars.filter(calendar => calendar.id !== calendarId);
    
            setSelectedCalendarIds(updatedIds);
            setSelectedCalendarNames(updatedNames);
            setSelectedCalendars(updatedCalendars); // 更新selectedCalendars
        }
    };
    

    return (
        <div className="events-list">
            <div className="calendar-list">
                <ul>
                    {calendars.map(calendar => (
                        <li key={calendar.id}>
                            <input
                                type="checkbox"
                                id={calendar.id}
                                checked={selectedCalendars.some(selected => selected.id === calendar.id)}
                                onChange={() => handleSelectCalendar(calendar.id, calendar.summary)}
                            />
                            <label htmlFor={calendar.id}>{calendar.summary}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <p>------------------------------------</p>
            {selectedCalendars.length > 0 && (
                eventsOnSelectedDate.length > 0 ? (
                    eventsOnSelectedDate.map((event, index) => (
                        <div key={index} className="event">
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{event.calendarName}: {event.summary}</span>
                            <p>Start Time: {moment(event.start.dateTime).format('HH:mm')}</p>
                            <p>End Time: {moment(event.end.dateTime).format('HH:mm')}</p>
                        </div>
                    ))
                ) : (
                    <div>No events found</div>
                )
            )}
        </div>
    );
}

export default GoogleCalendarEvents;
