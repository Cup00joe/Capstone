import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import './SunriseSunsetComponent.css'; // 导入样式文件

function SunriseSunsetComponent({ coordinates, selectedDate }) {
    const [sunriseSunsetInfo, setSunriseSunsetInfo] = useState(null);

    useEffect(() => {
        console.log("Received coordinates:", coordinates);
        console.log("Received selectedDate:", selectedDate);
        const fetchData = async () => {
            if (!coordinates || !selectedDate) {
                // 如果没有收到坐标或者时间，直接返回
                return;
            }

            const [latitude, longitude] = coordinates.split(',');

            const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${selectedDate}&formatted=0`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.status === "OK") {
                    const sunrise = moment(data.results.sunrise).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
                    const sunset = moment(data.results.sunset).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
                    setSunriseSunsetInfo({ sunrise, sunset });
                } else {
                    throw new Error("Failed to retrieve sunrise and sunset information.");
                }
            } catch (error) {
                console.error("Error:", error);
                setSunriseSunsetInfo(null);
            }
        };
        fetchData();
    }, [coordinates, selectedDate]);

    return (
        <div className="sunrise-sunset-container">
            {sunriseSunsetInfo ? (
                <div className="sunrise-sunset-info">
                    <p className="sunrise-time">Sunrise: {sunriseSunsetInfo.sunrise}</p>
                    <p className="sunset-time">Sunset: {sunriseSunsetInfo.sunset}</p>
                </div>
            ) : (
                <div className="loading-message">Waiting for date selection and address entry</div>
            )}
        </div>
    );
}

export default SunriseSunsetComponent;
