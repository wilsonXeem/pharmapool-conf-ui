import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './PharmaPoolConference';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function Root() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  if (!isAdmin) return <App />;

  if (!token) return <AdminLogin onLogin={setToken} />;

  return (
    <AdminDashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem('adminToken');
        setToken('');
      }}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
