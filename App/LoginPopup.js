import React, { useState } from 'react';
import { supabase } from '../supabase.js';

function LoginPopup({ onLogin, setIsLoggedIn, setShowLoginPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // 进行登录验证
      let { data: login, error } = await supabase
        .from('login')
        .select('name, pin')
        .eq('name', username) // 假设 username 是用户名
        .single();

      if (error) {
        throw error;
      }

      // 检查是否找到匹配的用户记录
      if (!login || login.pin !== password) {
        throw new Error('用户名或密码错误');
      }

      // 登录成功
      setLoginErrorMessage('');
      setIsLoggedIn(true); // 设置登录状态为 true

      // 关闭登录窗口
      setShowLoginPage(false);
    } catch (error) {
      setLoginErrorMessage(error.message);
      setIsLoggedIn(false); // 登录失败，设置登录状态为 false
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleLoginFormSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {loginErrorMessage && <div className="error-message">{loginErrorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPopup;
