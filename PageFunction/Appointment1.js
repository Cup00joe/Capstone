import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Appointment1.css';
import { supabase } from '../supabase';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function YourComponent({ selectedDate2, sunrise, sunset, selectedLocation, onTimeChange, parentTime }) {
    const [visibility, setVisibility] = useState(parentTime);
    const [time, setTime] = useState('AM');
    const [searchCrew, setSearchCrew] = useState('');
    const [customerNames, setCustomerNames] = useState([]);
    const [visibilityOpen, setVisibilityOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [allCustomerNames, setAllCustomerNames] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(5);
    const [pressedButtonIndices, setPressedButtonIndices] = useState([]);
    const [selectedCustomerNames, setSelectedCustomerNames] = useState([]);
    const [allEmployeeNames, setAllEmployeeNames] = useState([]);
    const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [riderWeights, setRiderWeights] = useState({});
    const [employeeWeights, setEmployeeWeights] = useState({});
    const [riderNames, setRiderNames] = useState({});
    const [emailBody, setEmailBody] = useState('');
    const sunriseMoment = moment(sunrise, 'HH:mm:ss');
    const sunsetMoment = moment(sunset, 'HH:mm:ss');

useEffect(() => {
    console.log('Sunrise Moment:', sunriseMoment.format());
    console.log('Sunset Moment:', sunsetMoment.format());
}, []);

    const handleEmailBodyChange = (e) => {
        setEmailBody(e.target.value);
    };

    const handleVisibilityChange = (option) => {
        setVisibility(option);
        setVisibilityOpen(false);
    };

    const handleTimeChange = (option) => {
        setTime(option);
        setTimeOpen(false);
        onTimeChange(option);
    };

    const handleSearchCrewChange = (event) => {
        const value = event.target.value;
        setSearchCrew(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: customeData, error: customeError } = await supabase
                    .from('Customer')
                    .select('Display_Name')
                    .eq('PrefersPublic', visibility === 'Public')
                    .eq('PrefersAM', time === 'AM');
    
                if (customeError) {
                    throw customeError;
                }
    
                const customerNames = customeData.map(item => item.Display_Name);
                setAllCustomerNames(customerNames);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        setSelectedCustomerNames([]);
        setPressedButtonIndices([]);
    
        fetchData();
    }, [visibility, time, supabase]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const { data: employeeData, error: employeeError } = await supabase
                    .from('Employee')
                    .select('Name');
    
                if (employeeError) {
                    throw employeeError;
                }

                const employeeNames = employeeData.map(item => item.Name);
                setAllEmployeeNames(employeeNames);
            } catch (error) {
                console.error('Error fetching employee data:', error.message);
            }
        };
    
        fetchEmployeeData();
    }, []);

    useEffect(() => {
        const startIndex = currentPage * perPage;
        const endIndex = Math.min(startIndex + perPage, allCustomerNames.length);
        const visibleCustomerNames = allCustomerNames.slice(startIndex, endIndex);
        setCustomerNames(visibleCustomerNames);
    }, [currentPage, allCustomerNames, perPage]);

    const handleEmployeeButtonPress = (name) => {
        if (selectedEmployeeNames.includes(name)) {
            setSelectedEmployeeNames(selectedEmployeeNames.filter(employeeName => employeeName !== name));
        } else {
            setSelectedEmployeeNames([...selectedEmployeeNames, name]);
        }
    };

    const totalPages = Math.ceil(allCustomerNames.length / perPage);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleButtonPress = (index) => {
        const selectedCustomer = customerNames[index];
        if (pressedButtonIndices.includes(index)) {
            setSelectedCustomerNames(selectedCustomerNames.filter(name => name !== selectedCustomer));
            setPressedButtonIndices(pressedButtonIndices.filter(i => i !== index));
        } else {
            setSelectedCustomerNames([...selectedCustomerNames, selectedCustomer]);
            setPressedButtonIndices([...pressedButtonIndices, index]);
        }
    };

    const fetchRiderNames = useCallback(async () => {
        try {
            const riderNamesData = {};
    
            for (const customerName of selectedCustomerNames) {
                const { data: riderData, error: riderError } = await supabase
                    .from('Rider')
                    .select('Name')
                    .eq('Parent_Display_Name', customerName);
                
                if (riderError) {
                    console.error('Error fetching rider names:', riderError.message);
                } else {
                    const names = riderData.map(rider => rider.Name);
                    riderNamesData[customerName] = names;
                }
            }
    
            setRiderNames(riderNamesData);
        } catch (error) {
            console.error('Error fetching rider names:', error.message);
        }
    }, [selectedCustomerNames, supabase]);

    const calculateTotalWeight = useCallback(async () => {
        let total = 0;
        const riderWeightsData = {};
        const employeeWeightsData = {};
    
        for (const customerName of selectedCustomerNames) {
            const { data: riderData, error: riderError } = await supabase
                .from('Rider')
                .select('Weight')
                .eq('Parent_Display_Name', customerName);
            if (riderError) {
                console.error('Error fetching rider data:', riderError.message);
            } else {
                const weights = riderData.map(rider => rider.Weight);
                const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
                riderWeightsData[customerName] = weights;
                total += totalWeight;
            }
        }
    
        for (const employeeName of selectedEmployeeNames) {
            const { data: employeeData, error: employeeError } = await supabase
                .from('Employee')
                .select('Weight')
                .eq('Name', employeeName);
            if (employeeError) {
                console.error('Error fetching employee weights:', employeeError.message);
            } else {
                if (employeeData.length > 0) {
                    total += employeeData[0].Weight;
                    employeeWeightsData[employeeName] = employeeData[0].Weight;
                }
            }
        }
    
        setTotalWeight(total);
        setRiderWeights(riderWeightsData);
        setEmployeeWeights(employeeWeightsData);
    }, [selectedCustomerNames, selectedEmployeeNames, supabase]);

    useEffect(() => {
        fetchRiderNames();
        calculateTotalWeight();
    }, [fetchRiderNames, calculateTotalWeight]);

    const handleSubmit = async () => {
        try {
            const meetingTime = time === 'AM' ? sunriseMoment : sunsetMoment;
            const isAM = time === 'AM';
            const isPublic = visibility === 'Public';
            const date = selectedDate2.format('YYYY-MM-DD');
            const formattedMeetingTime = meetingTime.format('HH:mm:ss');
    
            const { data: appointmentData, error: appointmentError } = await supabase
                .from('Appointment')
                .insert([{ Date: date, Time: formattedMeetingTime, isAM: isAM, isPublic: isPublic }])
                .select();
    
            if (appointmentError) {
                console.error('Error inserting appointment:', appointmentError.message);
                throw appointmentError;
            }
            if (!appointmentData || appointmentData.length === 0) {
                throw new Error('No data returned after inserting appointment');
            }
            const { data: appointmentID, error: appointmentidError } = await supabase
                .from('Appointment')
                .select('Appointment_id')
                .eq('Date', date)
                .eq('Time', formattedMeetingTime)
                .eq('isAM', isAM)
                .eq('isPublic', isPublic);
    
                const appointmentId = appointmentID[0].Appointment_id;
    
            for (const customerName of selectedCustomerNames) {
                const { error: updateCustomerError } = await supabase
                    .from('Customer')
                    .update({ Appointment_id: appointmentId })
                    .eq('Display_Name', customerName);
                if (updateCustomerError) {
                    throw updateCustomerError;
                }
            }
    
            const employeeIds = [];
            for (const employeeName of selectedEmployeeNames) {
                const { data: employeeData, error: employeeError } = await supabase
                    .from('Employee')
                    .select('Employee_id')
                    .eq('Name', employeeName);
                if (employeeError) {
                    throw employeeError;
                } else {
                    if (employeeData.length > 0) {
                        employeeIds.push(employeeData[0].Employee_id);
                    }
                }
            }
    
            for (const employeeId of employeeIds) {
                const { error: insertEmployeeAppointmentError } = await supabase
                    .from('EmployeeAppointment')
                    .insert([{ Appointment_id: appointmentId, Employee_id: employeeId }]);
                if (insertEmployeeAppointmentError) {
                    throw insertEmployeeAppointmentError;
                }
            }
    
            console.log('Submission successful!');
            toast.success('Submission successful!');
        } catch (error) {
            console.error('Error submitting data:', error.message);
            toast.error(`Error submitting data: ${error.message}`);
        }
    };

    const handleRefreshEmailBody = () => {
        const meetingTime = time === 'AM' ? sunrise : sunset;
        setEmailBody(`Your balloon flight is now scheduled the morning of ${selectedDate2.format('MMMM DD YYYY')} with a meeting time of ${meetingTime}. I will text you between 9 and 10 p.m. the evening before your flight with the meeting location details. The meeting sites are all within a 10-mile radius of ${selectedLocation}. If you don't hear from me by 10 p.m., please call me at (330) 633-3288. I am attaching a list of potential meeting sites. Please let me know that you received this email.\n\nThanks,\nDenny`);
    };
    
    return (
        <div className="your-component-container">
            <div className="menu-bar">
                <div className="menu-item">
                    <div className="menu-toggle" onClick={() => setVisibilityOpen(!visibilityOpen)}>
                        Visibility: {visibility} ▼
                    </div>
                    {visibilityOpen && (
                        <div className="menu-options" onClick={(e) => e.stopPropagation()}>
                            <div onClick={() => handleVisibilityChange('Public')}>Public</div>
                            <div onClick={() => handleVisibilityChange('Private')}>Private</div>
                        </div>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-toggle" onClick={() => setTimeOpen(!timeOpen)}>
                        Time: {time} ▼
                    </div>
                    {timeOpen && (
                        <div className="menu-options" onClick={(e) => e.stopPropagation()}>
                            <div onClick={() => handleTimeChange('AM')}>AM</div>
                            <div onClick={() => handleTimeChange('PM')}>PM</div>
                        </div>
                    )}
                </div>

                <div className="menu-item">
                    <div className="current-date">{selectedDate2.format('MMMM DD YYYY')}</div>
                </div>

                <div className="menu-item">
                    <button onClick={handleRefreshEmailBody}>Refresh Email Body</button>
                </div>
            </div>

            <div className="content-container">
                <div className="customer-container">
                    <h4>Customer Names</h4>
                    <div className="customer-buttons">
                        {customerNames.map((customer, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleButtonPress(index)} 
                                style={{ backgroundColor: pressedButtonIndices.includes(index) ? '#007bff' : '#fff' }} 
                            >
                                {customer}
                            </button>
                        ))}
                    </div>

                    <div className="pagination-container">
                        <button onClick={prevPage} disabled={currentPage === 0}>Previous</button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>Next</button>
                    </div>
                </div>
                <hr />
                <div className="customer-container">
                    <h4>Employee Names</h4>
                    <div className="customer-buttons">
                        {allEmployeeNames.map((employeeName, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleEmployeeButtonPress(employeeName)} 
                                style={{ backgroundColor: selectedEmployeeNames.includes(employeeName) ? '#007bff' : '#fff' }} 
                            >
                                {employeeName}
                            </button>
                        ))}
                    </div>
                </div>
                <hr />
                <div className="summary-container">
                    <h4>Summary</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Count</th>
                                <th>Name</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCustomerNames.map((customerName, customerIndex) => (
                                <React.Fragment key={customerIndex}>
                                    {riderNames[customerName] && Array.isArray(riderNames[customerName]) && (
                                        riderNames[customerName].map((riderName, riderIndex) => {
                                            const riderWeight = riderWeights[customerName] && riderWeights[customerName][riderIndex];
                                            return (
                                                <tr key={`${customerName}-${riderIndex}`}>
                                                    <td>{riderIndex + 1}</td>
                                                    <td>{riderName}</td>
                                                    <td>{riderWeight !== undefined ? riderWeight : '-'}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </React.Fragment>
                            ))}

                            {selectedEmployeeNames.map((employeeName, index) => (
                                <tr key={index + selectedCustomerNames.length}>
                                    <td>{index + 1}</td>
                                    <td>{employeeName}</td>
                                    <td>{employeeWeights[employeeName]}</td>
                                </tr>
                            ))}

                            <tr>
                                <td colSpan="3" style={{ color: totalWeight >= 1100 ? 'red' : 'green', textAlign: 'center' }}>
                                    {totalWeight >= 1100 ? 'OVERLOADED!' : 'SAFE'}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{ color: totalWeight >= 1100 ? 'red' : 'inherit' }}>Total Weight:</td>
                                <td style={{ color: totalWeight >= 1100 ? 'red' : 'inherit' }}>{totalWeight}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr />
                <div className="email-container">
                    <h4>Email</h4>
                    <textarea
                        value={emailBody}
                        onChange={handleEmailBodyChange}
                        rows={10}
                        cols={50}
                    />
                </div>
            </div>
            <div className="submit-button-container">
                <button onClick={handleSubmit}>Submit</button>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
}

export default YourComponent;
