import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'react-cookies'

const root = ReactDOM.createRoot(document.getElementById('root'));

const uuid = cookie.load('userId') ? cookie.load('userId') : uuidv4();
console.log("'userId', uuidv4(), { path: '/' } " + uuid);
cookie.save('userId', uuid, { path: '/' });
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();