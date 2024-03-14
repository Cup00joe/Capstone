import React, { useState } from 'react';
import './Address.css'; // 导入样式文件

const AddressInput = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // 清除之前的错误消息
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        // 调用父组件的回调函数，将坐标传递给父组件
        onAddressSubmit(`${lat},${lon}`);
      } else {
        setErrorMessage('No results found for the address. Please provide a more detailed address.');
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      setErrorMessage('Error fetching geocoding data. Please try again later.');
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <label className="address-label">
        Address:   
        <input className="address-input" type="text" placeholder="Enter your address" value={address} onChange={handleAddressChange} />
        <span style={{ fontSize: '14px' , color: 'red', }}>**Fuzzy addresses and renamed addresses may return incorrect times**</span>
      </label>
      <button className="submit-button" type="submit">Submit</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
  
};

export default AddressInput;
