import React from 'react';
import moment from 'moment'; // Importing moment.js library for date manipulation
import classNames from 'classnames'; // Importing classNames library for conditional CSS class application

/**
 * Function to render a calendar component.
 * @returns {JSX.Element} Calendar component JSX
 */
function renderCalendar() {
    const today = moment(); // Current date
    const startOfMonth = today.clone().startOf('month'); // First day of the current month
    const endOfMonth = today.clone().endOf('month'); // Last day of the current month
    const startOfWeek = startOfMonth.clone().startOf('week'); // First day of the week containing the first day of the current month
    const endOfWeek = endOfMonth.clone().endOf('week'); // Last day of the week containing the last day of the current month

    const calendar = [];

    let currentDay = startOfWeek.clone();

    // Loop through each day of the current month
    while (currentDay.isSameOrBefore(endOfWeek, 'day')) {
        // Add button for date
        const buttonClassName = classNames('calendar-button', {
            'not-this-month': !currentDay.isSame(today, 'month'),
            'before-today': currentDay.isBefore(today, 'day'),
            'today': currentDay.isSame(today, 'day')
        });

        calendar.push(
            <td key={currentDay.format('YYYY-MM-DD')}>
                <button className={`${buttonClassName} hovered`}>
                    {currentDay.isSameOrAfter(startOfMonth, 'day') && currentDay.isSameOrBefore(endOfMonth, 'day') ? currentDay.date() : ''}
                </button>
            </td>
        );

        // Move to the next day
        currentDay.add(1, 'day');
    }

    // Fill in blank dates for the last week
    while (currentDay.day() !== startOfWeek.day()) {
        calendar.push(
            <td key={currentDay.format('YYYY-MM-DD')}>
                <button className="calendar-button"></button>
            </td>
        );
        currentDay.add(1, 'day');
    }

    return (
        <div className="calendar-container">
            <table>
                <thead>
                    <tr>
                        <th colSpan="7">{startOfMonth.format('MMMM YYYY')}</th> {/* Displaying English month and year using 'MMMM YYYY' format */}
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
                    {/* Convert calendar array into rows */}
                    {calendar.reduce((rows, key, index) => (index % 7 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []).map((row, rowIndex) => (
                        <tr key={rowIndex}>{row}</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default renderCalendar;
