import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tokens.scss';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from './components/Toast/ToastContext';
import App from './app2.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);
