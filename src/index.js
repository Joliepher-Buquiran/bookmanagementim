import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App'; // Your main App component

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <Router> {/* Wrap the entire app with Router */}
    <App />
  </Router>
);
