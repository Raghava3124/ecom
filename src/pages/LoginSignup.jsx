import React, { useState } from 'react';
import axios from 'axios';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!username || !password || (!isLogin && password !== rePassword)){
      setMessage('Please fill all fields correctly.');
      return;
    }

    try {
      const url = isLogin ? '/api/login' : '/api/signup';
      const data = isLogin ? { username, password } : { username, password };
      const response = await axios.post(url, data);
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required/>
        
        <label>Password:</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
        
        {!isLogin && (
          <>
            <label>Re-enter Password:</label>
            <input type='password' value={rePassword} onChange={(e) => setRePassword(e.target.value)} required/>
          </>
        )}

        <button type='submit'>{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default LoginSignup;
