import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import moment from 'moment';

function GoogleCalendarEvent({ selectedDate2, sunrise, sunset, parentTime, selectedLocation }) {
    const session = useSession();
    const sunriseMoment = moment(sunrise, 'HH:mm:ss');
    const sunsetMoment = moment(sunset, 'HH:mm:ss');
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const wasButtonPreviouslyPressed = useRef(false);
    const meetingTime = parentTime === 'AM' ? sunriseMoment : sunsetMoment;
    const date = selectedDate2.format('YYYY-MM-DD');
    const formattedMeetingTime = meetingTime.format('HH:mm:ss');

    let formattedTime = null;
    try {
        formattedTime = moment(formattedMeetingTime, 'h:mm A').format('HH:mm:ss');
    } catch (error) {
        console.error('Error parsing formattedMeetingTime:', error.message);
    }
    console.log(date, formattedMeetingTime, selectedLocation);

    const handleButtonPress = () => {
        if (formattedTime) {
            setIsButtonPressed(true);
        }
    };

    const handleButtonRelease = () => {
        setIsButtonPressed(false);
    };

    useEffect(() => {
        if (isButtonPressed && !wasButtonPreviouslyPressed.current && formattedTime && session && session.provider_token) {
            createGoogleCalendarEvent();
        }
        wasButtonPreviouslyPressed.current = isButtonPressed;
    }, [isButtonPressed, formattedTime, session]);

    async function createGoogleCalendarEvent() {
        try {
            const event = {
                'summary': `${selectedLocation} Appointment`,
                'location': selectedLocation,
                'colorId': 3,
                'start': {
                    'dateTime': `${date}T${formattedTime}`,
                    'timeZone': 'America/New_York'
                },
                'end': {
                    'dateTime': `${date}T${formattedTime}`,
                    'timeZone': 'America/New_York'
                },
                'reminders': {
                    'useDefault': true
                }
            };

            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.provider_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(`Failed to create Google Calendar event: ${data.error.message}`);
            }

            const data = await response.json();
            console.log('Google Calendar event created successfully!', data);
        } catch (error) {
            console.error('Error creating Google Calendar event:', error.message);
        }
    }

    return (
        <button onMouseDown={handleButtonPress} onMouseUp={handleButtonRelease}>
            Create Google Calendar Event
        </button>
    );
}

export default GoogleCalendarEvent;
