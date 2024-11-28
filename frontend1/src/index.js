import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import your base CSS
import App from './App';
import reportWebVitals from './reportWebVitals'; //if you are using performance metrics

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();