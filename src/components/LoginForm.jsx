import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; // Ensure you have this CSS file
import facebook from '../assets/Facebook.png';
import twitter from '../assets/Twitter.png';
import google from '../assets/images.jpg';
import bookora from '../assets/Bokooralogo.png';
import Slogan from '../assets/Slogan.png';
import Wreath from '../assets/modalxmas.png';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = ({ navigateTo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost/bookmanagementim/login.php',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.status === 'success') {
        // Save session or token
        localStorage.setItem('user_id', response.data.user_id); // Use local storage for simplicity
        navigateTo('book'); // Navigate to BookForm
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Failed to login');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="login-container1">
      <img src={Wreath} alt="wreath" className='wreath1' />
        <img src={bookora} alt="Bookora" className="bokoora1" />
        <form onSubmit={handleLogin} className="login-form">
          <FaUser className="user1" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="login-input"
          />
          <FaLock className="input-icon1" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <button onClick={() => navigateTo('register')} className="register-button">
          Register
        </button>
        <p>or Login via</p>
        <div className="social-login1">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" className="social-logo1" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitter} alt="Twitter" className="social-logo1" />
          </a>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer">
            <img src={google} alt="Google" className="social-logo1" />
          </a>
        </div>
        
      </div>
     
        <img src={Slogan} alt="Slogan" className='Slogan1' />
        
      {/* Footer outside login container */}
      <footer className="footer1">
        <div className="footer-content">
          <p>Contact us: support@bookora.com</p>
          <p>Follow us on social media:</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="footer-social-logo1" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt="Twitter" className="footer-social-logo1" />
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer">
              <img src={google} alt="Google" className="footer-social-logo1" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;
