import React from 'react';
import ReactClient from 'react-dom/client';
import './index.css';
import App from './App';

ReactClient.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
