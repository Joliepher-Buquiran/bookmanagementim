import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'; 
import facebookLogo from '../assets/Facebook.png';
import twitterLogo from '../assets/Twitter.png';
import googleLogo from '../assets/images.jpg';
import RegisterLogo from '../assets/Registration.png';
import Slogan from '../assets/Slogan.png';
import { FaUser, FaLock,FaEnvelope } from 'react-icons/fa';
import Wreath from '../assets/modalxmas.png';

const RegisterForm = ({ navigateTo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Adding basic password validation (min 8 characters for example)
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost/bookmanagementim/register.php',
        new URLSearchParams({ username, password, email }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.status === 'success') {
        navigateTo('login'); // Use navigateTo to go back to login form
      } else {
        setError(response.data.message || 'Failed to register');
      }
    } catch (error) {
      setError('An error occurred during registration.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <img src={Wreath} alt="wreath" className='wreath2' />
      <img src={RegisterLogo} alt="Registration" className="regLogo" />
      {error && <div className="register-error">{error}</div>}
      <form onSubmit={handleRegister} className="register-form">
      <FaUser className="user" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="register-input"
        />
         <FaLock className="input-icon" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="register-input"
        />
        <FaEnvelope className="envelope" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="register-input"
        />
        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="register-nav-buttons">
        <button onClick={() => navigateTo('login')} className="register-nav-button">
          Back to Login
        </button>
        <p>or Sign in via</p>
        <div className="social-login">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookLogo} alt="Facebook" className="social-logo" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterLogo} alt="Twitter" className="social-logo" />
          </a>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer">
            <img src={googleLogo} alt="Google" className="social-logo" />
          </a>
        </div>
      </div>
      <img src={Slogan} alt="Slogan" className='Slogan' />
        
    </div>
  );
};

export default RegisterForm;
