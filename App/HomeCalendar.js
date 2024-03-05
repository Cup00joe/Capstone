import React, { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import './HomeCalendar.css';

function RenderCalendar() {
    const today = moment();
    const startOfMonth = today.clone().startOf('month');
    const endOfMonth = today.clone().endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week');

    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (date) => {
        setSelectedDate(date.clone());
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const calendar = [];

    let currentDay = startOfWeek.clone();

    while (currentDay.isSameOrBefore(endOfWeek, 'day')) {
        const buttonClassName = classNames('calendar-button', {
            'not-this-month': !currentDay.isSame(today, 'month'),
            'before-today': currentDay.isBefore(today, 'day'),
            'today': currentDay.isSame(today, 'day')
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

    return (
        <div className="calendar-container">
            <table>
                <thead>
                    <tr>
                        <th colSpan="7">{startOfMonth.format('MMMM YYYY')}</th>
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
                    <button className="close-btn" onClick={handleClosePopup}>X</button>
                </div>
            </div>
        </div>
    );
}

export default RenderCalendar;
