import React, { useState } from 'react';
import './UserPage.css';

function UserPage() {
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [customerDisplayName, setCustomerDisplayName] = useState('');
  const [overrideDisplayName, setOverrideDisplayName] = useState(false);
  // 其他状态变量...

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
      fullName,
      title,
      firstName,
      middleName,
      lastName,
      suffix,
      customerDisplayName,
      overrideDisplayName,
      // 其他表单字段...
    });
  };

  return (
    <div className="user-page">
      <h2>User Information</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="title">Title:</label></td>
              <td><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="fullName">Full Name:</label></td>
              <td><input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="firstName">First Name:</label></td>
              <td><input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="middleName">Middle Name:</label></td>
              <td><input type="text" id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="lastName">Last Name:</label></td>
              <td><input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="suffix">Suffix:</label></td>
              <td><input type="text" id="suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="customerDisplayName">Customer Display Name:</label></td>
              <td><input type="text" id="customerDisplayName" value={customerDisplayName} onChange={(e) => setCustomerDisplayName(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="overrideDisplayName">Override Display Name:</label></td>
              <td><input type="checkbox" id="overrideDisplayName" checked={overrideDisplayName} onChange={(e) => setOverrideDisplayName(e.target.checked)} /></td>
            </tr>
            {/* 添加其他表单字段的类似代码 */}
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserPage;
