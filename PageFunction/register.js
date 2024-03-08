import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // 根据你的实际路径进行调整
import './register.css';

function Settings({ username }) {
  const [name, setUsername] = useState('');
  const [pin, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setPermission] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [owner, setOwner] = useState(false); // 添加 owner 状态

  useEffect(() => {
    let mounted = true; // 设置一个标志来跟踪组件是否已经卸载
    const checkPermission = async () => {
      try {
        // 查询用户的权限
        const { data: login, error } = await supabase
          .from('login')
          .select('name, scope')
          .eq('name', username)
          .single();
  
        if (error) {
          throw error;
        }
  
        if (login && login.scope) {
          // 存储用户的权限信息
          setPermission(login.scope);
  
          if (login.scope !== 'owner') {
            // 如果用户权限不是 owner，则重定向到其他页面或者显示相应的提示信息
            // 这里假设你已经有了相应的逻辑来处理权限不足的情况
            console.log('Permission denied. Redirecting...');
            if (mounted) {
              setOwner(false);
            }
          } else {
            if (mounted) {
              setOwner(true);
            }
            console.log('You are owner!');
          }
        }
      } catch (error) {
        console.error('Error checking permission:', error.message);
      }
    };

    checkPermission(); // 调用函数来检查权限

    return () => {
      // 组件卸载时执行清理逻辑
      mounted = false;
    };
  }, [username]);
  
  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      // 检查用户名和密码是否为空
      if (!name || !pin) {
        throw new Error('Username and password are required.');
      }

      // 在Supabase中插入注册信息到login表
      const { data, error } = await supabase
        .from('login')
        .insert([
          { name, pin, email, scope }
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('Account registered successfully:', data);

      // 清空表单
      setUsername('');
      setPassword('');
      setEmail('');
      setPermission('');
      setErrorMessage('');
    } catch (error) {
      // 处理错误
      console.error('Error registering account:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-popup">
      {owner ? (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={pin}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="permission">Permission:</label>
            <input
              type="text"
              id="permission"
              value={scope}
              onChange={(e) => setPermission(e.target.value)}
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit">Register</button>
          </form>
        </>
      ) : null}
      {!owner && (
        <p style={{ color: 'red', fontSize: '1.5rem', fontWeight: 'bold' }}>You do not have permission to register.</p>
      )}
    </div>
  );
}

export default Settings;
