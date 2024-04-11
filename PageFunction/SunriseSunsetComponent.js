import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import './SunriseSunset&AddressComponent.css';

function SunriseSunsetComponent({ coordinates, selectedDate, selectedLocation, onSunriseSunsetTime}) {
    const [sunriseSunsetInfo, setSunriseSunsetInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!coordinates || !selectedDate) {
                return;
            }

            const [latitude, longitude] = coordinates.split(',');

            const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${selectedDate.format('YYYY-MM-DD')}&formatted=0`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.status === "OK") {
                    const sunrise = moment(data.results.sunrise).tz('America/New_York').format('h:mm A');
                    const sunset = moment(data.results.sunset).tz('America/New_York').format('h:mm A');
                    setSunriseSunsetInfo({ sunrise, sunset });

                    onSunriseSunsetTime(sunrise, sunset);
                } else {
                    throw new Error("Failed to retrieve sunrise and sunset information.");
                }
            } catch (error) {
                console.error("Error:", error);
                setSunriseSunsetInfo(null);
            }
        };
        fetchData();
    }, [coordinates, selectedDate, onSunriseSunsetTime]);

    return (
        <div className="sunrise-sunset-container">
            <div className="sunrise-sunset-wrapper">
            <div className="sunrise-sunset-header">
                {selectedLocation !== "" ? (
                    <p className="ss-location">{selectedLocation}</p>
                ) : (
                    <p className="ss-location">Search City</p>
                )
                }
                <span className="sunrise-sunset-header-divider"></span>
                <p className="ss-date">{selectedDate.format('MM-DD-YYYY')}</p>
            </div>
            {sunriseSunsetInfo ? (
                <div className="sunrise-sunset-main-content">
                    <div className="ss-time">
                        <h2>Sunrise</h2>
                        <p>{sunriseSunsetInfo.sunrise}</p>
                    </div>
                    <div className="ss-time">
                        <h2>Sunset</h2>
                        <p>{sunriseSunsetInfo.sunset}</p>
                    </div>
                </div>
            ) : (
                <div className="loading-message">Fetching sunrise and sunset times...</div>
            )}
            </div>
        </div>
    );
}

export default SunriseSunsetComponent;