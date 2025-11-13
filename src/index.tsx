import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Initialize Firebase early - import config to trigger initialization
import './config/firebase';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
