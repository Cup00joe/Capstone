import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import './HomeCalendar.css';
import { useSession } from '@supabase/auth-helpers-react';
import GoogleCalendarEvents from './GoogleCalendarEvents';

function RenderCalendar({ onDateSelect }) {
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment());
    const session = useSession();

    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week');

    const handleDateClick = (date) => {
        setSelectedDate(date.clone());
        setShowPopup(true);
        onDateSelect(date);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const calendar = [];
    let currentDay = startOfWeek.clone();

    while (currentDay.isSameOrBefore(endOfWeek, 'day')) {
        const buttonClassName = classNames('calendar-button', {
            'not-this-month': !currentDay.isSame(currentMonth, 'month'),
            'before-today': currentDay.isBefore(moment(), 'day'),
            'today': currentDay.isSame(moment(), 'day')
        });

        calendar.push({
            date: currentDay.clone(),
            buttonClassName: buttonClassName
        });

        currentDay.add(1, 'day');
    }

    while (currentDay.day() !== startOfWeek.day()) {
        calendar.push({
            date: currentDay.clone(),
            buttonClassName: 'calendar-button'
        });
        currentDay.add(1, 'day');
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(prevMonth => prevMonth.clone().subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentMonth(prevMonth => prevMonth.clone().add(1, 'month'));
    };
    
    return (
        <div className="calendar-container">
            <div className="calendar-header"></div>
            <table>
                <thead>
                    <tr>
                        <th colSpan="7">
                            <button onClick={goToPreviousMonth}>🢀</button>
                            {currentMonth.format('MMMM YYYY')}
                            <button onClick={goToNextMonth}>🢂</button>
                        </th>
                    </tr>
                    <tr>
                        <th>SUN</th>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th>SAT</th>
                    </tr>
                </thead>
                <tbody>
                    {calendar.reduce((rows, key, index) => (index % 7 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((day) => (
                                <td key={day.date.format('YYYY-MM-DD')}>
                                    <button className={`${day.buttonClassName} hovered`} onClick={() => handleDateClick(day.date)}>
                                        {day.date.date()}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={`popup${showPopup ? ' show' : ''}`}>
                <div className="popup-content">
                    <p>Selected Date: {selectedDate && selectedDate.format('YYYY-MM-DD')}</p>
                    <p>------------------------------------</p>
                    <button className="close-btn" onClick={handleClosePopup}>X</button>
                    <GoogleCalendarEvents selectedDate={selectedDate} />
                </div>
            </div>
        </div>
    );
}

export default RenderCalendar;
